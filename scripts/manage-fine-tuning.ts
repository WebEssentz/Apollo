import OpenAI from 'openai';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { collectTrainingData } from './collect-training-data';
import { createReadStream } from 'fs';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface TrainingMetrics {
    step: number;
    train_loss: number;
    valid_loss: number;
    train_mean_token_accuracy: number;
}

async function manageFinetuning() {
    try {
        // Step 1: Collect and prepare training data
        console.log('Collecting training data...');
        const trainingDataPath = await collectTrainingData();
        
        // Step 2: Upload the file
        console.log('Uploading training file...');
        const file = await openai.files.create({
            file: createReadStream(trainingDataPath),
            purpose: 'fine-tune'
        });

        // Step 3: Create fine-tuning job
        console.log('Creating fine-tuning job...');
        const fineTuningJob = await openai.fineTuning.jobs.create({
            training_file: file.id,
            model: 'gpt-4o-2024-08-06',
            hyperparameters: {
                n_epochs: 3,
                batch_size: 4,
                learning_rate_multiplier: 1.6
            }
        });

        // Step 4: Monitor progress
        console.log(`Fine-tuning job created with ID: ${fineTuningJob.id}`);
        
        let currentJob = await openai.fineTuning.jobs.retrieve(fineTuningJob.id);
        
        while (currentJob.status === 'validating_files' || currentJob.status === 'queued' || currentJob.status === 'running') {
            console.log(`Status: ${currentJob.status}`);
            
            // Get training metrics
            const events = await openai.fineTuning.jobs.listEvents(fineTuningJob.id, {
                limit: 10
            });
            
            events.data.forEach(event => {
                if (event.type === 'metrics') {
                    const metrics = event.data as unknown as TrainingMetrics;
                    console.log(`
                        Step ${metrics.step}:
                        Training Loss: ${metrics.train_loss}
                        Validation Loss: ${metrics.valid_loss}
                        Token Accuracy: ${metrics.train_mean_token_accuracy}
                    `);
                }
            });

            // Wait before checking again
            await new Promise(resolve => setTimeout(resolve, 60000)); // Check every minute
            currentJob = await openai.fineTuning.jobs.retrieve(fineTuningJob.id);
        }

        if (currentJob.status === 'succeeded' && currentJob.fine_tuned_model) {
            console.log(`Fine-tuning completed successfully!`);
            console.log(`Fine-tuned model ID: ${currentJob.fine_tuned_model}`);
            
            // Update the model configuration
            console.log('Updating model configuration...');
            await updateModelConfig(currentJob.fine_tuned_model);
        } else {
            console.error(`Fine-tuning failed with status: ${currentJob.status}`);
        }

    } catch (error) {
        console.error('Error in fine-tuning process:', error);
        throw error;
    }
}

async function updateModelConfig(fineTunedModelId: string) {
    const modelConfig = {
        id: 'fine-tuned-gpt4',
        name: 'Fine-tuned GPT-4',
        model: fineTunedModelId,
        icon: '/openai.png',
        description: 'Specialized in wireframe-to-code conversion',
        badge: 'Custom'
    };

    // Update the model configuration file
    const configPath = join(__dirname, '..', 'configs', 'modelConfig.ts');
    const configContent = `export const AI_MODELS = {
    GPT4: '${fineTunedModelId}',
    QUASAR: '${fineTunedModelId}',
    GEMINI: '${fineTunedModelId}',
} as const;

export const MODEL_DETAILS = [
    ${JSON.stringify(modelConfig, null, 4)}
];`;

    writeFileSync(configPath, configContent);
    console.log('Model configuration updated successfully');
}

// Run the fine-tuning process
manageFinetuning();
