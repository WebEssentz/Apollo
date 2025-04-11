import { checkFineTuningStatus } from './manage-fine-tuned-model';

// Check the status of all fine-tuning jobs
async function main() {
    try {
        await checkFineTuningStatus();
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
