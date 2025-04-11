export const AI_MODELS = {
    GPT4: 'gpt-4o-2024-08-06',
    QUASAR: 'gpt-4o-2024-08-06',
    GEMINI: 'gpt-4o-2024-08-06',
} as const;

export const MODEL_DETAILS = [
    {
        id: 'gpt4',
        name: 'GPT-4 Vision',
        model: AI_MODELS.GPT4,
        icon: '/openai.png',
        description: 'Most advanced model for code generation and UI analysis',
        badge: 'Recommended'
    },
];