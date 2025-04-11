import { NextRequest } from "next/server";
import OpenAI from "openai";
import { AI_MODELS } from "@/configs/modelConfig";
import { getFineTunedModel } from "@/scripts/manage-fine-tuned-model";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 3,
});

let fineTunedModelId: string | null = null;

// Initialize the fine-tuned model ID
getFineTunedModel().then(modelId => {
    if (modelId) {
        fineTunedModelId = modelId;
        Object.defineProperty(AI_MODELS, 'FINE_TUNED', {
            value: modelId,
            writable: true
        });
    }
});

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const { description, imageUrl, selectedModel } = await req.json();

        // Use the fine-tuned model if selected and available
        const modelToUse = selectedModel === AI_MODELS.FINE_TUNED && fineTunedModelId 
            ? fineTunedModelId 
            : selectedModel || AI_MODELS.GPT4;

        const response = await openai.chat.completions.create({
            model: modelToUse,
            messages: [
                {
                    role: "system",
                    content: "You are an expert UI/UX developer specializing in converting wireframes to production-ready code. Analyze the image deeply and provide the optimal implementation."
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
                            image_url: {
                                url: imageUrl,
                                detail: "high"
                            }
                        }
                    ]
                }
            ],
            temperature: 0.2,
            max_tokens: 4000,
            top_p: 0.95,
            frequency_penalty: 0.1,
            presence_penalty: 0.1,
            stream: true,
        });

        // Create a TransformStream for streaming the response
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        controller.enqueue(new TextEncoder().encode(content));
                    }
                }
                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });

    } catch (error) {
        console.error('AI Model Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process request' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}