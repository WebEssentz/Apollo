import { NextRequest } from "next/server";
import OpenAI from "openai";
import { AI_MODELS } from "@/configs/modelConfig";
import { GenerationConfig } from "@/types/ai";

const openrouterClient = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_AI_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_URL,
        "X-Title": "Apollo Wireframe-to-Code",
        "X-Organization": "Apollo Labs"
    }
});

// Model-specific configurations for optimal performance
const MODEL_CONFIGS: Record<string, GenerationConfig> = {
    [AI_MODELS.GEMINI]: {
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.95,
        presence_penalty: 0.5,
        frequency_penalty: 0.5
    },
    [AI_MODELS.GPT4]: {
        temperature: 0.8,
        max_tokens: 4000,
        top_p: 0.9,
        presence_penalty: 0.3,
        frequency_penalty: 0.3
    },
    [AI_MODELS.QUASAR]: {
        temperature: 0.75,
        max_tokens: 4000,
        top_p: 0.92,
        presence_penalty: 0.4,
        frequency_penalty: 0.4
    }
};

// System prompts for consistent, high-quality output
const SYSTEM_PROMPTS = {
    BASE: `As an expert full-stack developer, analyze wireframes and generate production-ready code following:
- Modern React/Next.js practices
- Semantic HTML5 structure
- Responsive Tailwind CSS
- Accessibility standards
- TypeScript type safety`,
    
    CODE_GENERATION: `Focus on:
1. Component hierarchy
2. State management
3. Responsive design
4. Interactive elements
5. Clean code architecture`
};

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    const { model, description, imageUrl } = await req.json();
    
    try {
        // Get the selected model or fallback to default
        const selectedModel = model || AI_MODELS.GEMINI;
        const modelConfig = MODEL_CONFIGS[selectedModel];
        
        if (!modelConfig) {
            throw new Error('Invalid model configuration');
        }

        const response = await openrouterClient.chat.completions.create({
            model: selectedModel,
            stream: true,
            messages: [
                {
                    role: "system",
                    content: `${SYSTEM_PROMPTS.BASE}\n${SYSTEM_PROMPTS.CODE_GENERATION}`
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: description
                        },
                        {
                            type: "image_url",
                            image_url: { url: imageUrl }
                        }
                    ]
                }
            ],
            ...modelConfig
        });

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        const text = chunk.choices?.[0]?.delta?.content || "";
                        controller.enqueue(new TextEncoder().encode(text));
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                "X-Content-Type-Options": "nosniff"
            }
        });

    } catch (error) {
        console.error('AI Model Error:', error);
        return new Response(
            JSON.stringify({ 
                error: 'Failed to process request',
                details: process.env.NODE_ENV === 'development' ? error : undefined
            }), 
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store'
                }
            }
        );
    }
}