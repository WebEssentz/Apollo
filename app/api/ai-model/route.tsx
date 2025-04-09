import { NextRequest } from "next/server";
import OpenAI from "openai";
import { AI_MODELS } from "@/configs/modelConfig";

const openrouterClient = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_AI_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_URL,
        "X-Title": "Apollo Wireframe-to-Code" 
    }
});

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    const { model, description, imageUrl } = await req.json();

    try {
        const response = await openrouterClient.chat.completions.create({
            model: AI_MODELS.GEMINI, // primary model
            stream: true,
            messages: [
                {
                    role: "system",
                    content: "You are an expert full-stack developer specializing in converting wireframes to production-ready code."
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
                                url: imageUrl
                            }
                        }
                    ]
                }
            ],
            temperature: 0.7,
            max_tokens: 4000,
        });

        // Create a readable stream
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    const text = chunk.choices?.[0]?.delta?.content || "";
                    controller.enqueue(new TextEncoder().encode(text));
                }
                controller.close();
            },
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