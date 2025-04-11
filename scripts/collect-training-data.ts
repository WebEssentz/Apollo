import { db } from '../configs/db';
import { and, eq, gte } from 'drizzle-orm';
import { conversionsTable } from '../configs/collections';
import fs from 'fs';
import path from 'path';

interface SuccessfulConversion {
    imageUrl: string;
    description: string;
    generatedCode: string;
    metadata: {
        model: string;
        generationTime: number;
        tokens: number;
    };
}

async function collectTrainingData() {
    const trainingExamples = [];
    
    try {        // Query your database for successful conversions
        const successfulConversions = await db
            .select()
            .from(conversionsTable)
            .where(and(
                eq(conversionsTable.status, 'success'),
                gte(conversionsTable.quality_score, 0.8)
            ))
            .limit(100);        for (const conversion of successfulConversions) {
            
            // Format each conversion as a training example
            const example = {
                messages: [
                    {
                        role: "system",
                        content: "You are an expert UI/UX developer specializing in converting wireframes to production-ready code. Analyze the image deeply and provide the optimal implementation using React and Tailwind CSS."
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: conversion.description
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: conversion.image_url,
                                    detail: "high"
                                }
                            }
                        ]
                    },
                    {
                        role: "assistant",
                        content: conversion.generatedCode
                    }
                ]
            };

            trainingExamples.push(example);
        }

        // Save examples to a JSONL file
        const outputPath = path.join(__dirname, '..', 'data', 'collected-training-data.jsonl');
        const jsonlData = trainingExamples.map(example => JSON.stringify(example)).join('\n');
        fs.writeFileSync(outputPath, jsonlData);

        console.log(`Successfully collected ${trainingExamples.length} training examples`);
        return outputPath;
    } catch (error) {
        console.error('Error collecting training data:', error);
        throw error;
    }
}

export { collectTrainingData };
