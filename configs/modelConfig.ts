export const AI_MODELS = {
    GEMINI: 'google/gemini-2.5-pro-exp-03-25:free',
    GPT4: 'openai/gpt-4.5-preview',
    QUASAR: 'openrouter/quasar-alpha'
} as const;

export const MODEL_DETAILS = [
    {
        id: 'gemini',
        name: 'Google Gemini Pro',
        model: AI_MODELS.GEMINI,
        icon: '/google.png',
        description: 'Best for complex UI generation',
        badge: 'Recommended'
    },
    {
        id: 'gpt4',
        name: 'GPT-4 Turbo',
        model: AI_MODELS.GPT4,
        icon: '/icons/gpt4.svg',
        description: 'Advanced code generation',
        badge: 'Premium'
    },
    {
        id: 'quasar',
        name: 'Quasar Alpha',
        model: AI_MODELS.QUASAR,
        icon: '/icons/quasar.svg',
        description: 'Experimental model',
        badge: 'Beta'
    }
];