export const AI_MODELS = {
    GPT4: 'gpt-4o-2024-08-06',
    QUASAR: 'gpt-4o-2024-08-06',
    GEMINI: 'gpt-4o-2024-08-06',
    FINE_TUNED: 'ft:gpt-4o-2024-08-06:wireframe-to-code-v1' // This will be updated dynamically
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
    {
        id: 'quasar',
        name: 'Quasar',
        model: AI_MODELS.QUASAR,
        icon: '/icons/quasar.svg',
        description: 'Fast and efficient model for wireframe conversion',
        badge: 'New'
    },
    {
        id: 'gemini',
        name: 'Gemini Pro Vision',
        model: AI_MODELS.GEMINI,
        icon: '/icons/gemini.svg',
        description: 'Powerful vision model by Google',
        badge: 'Beta'
    },
    {
        id: 'fine-tuned',
        name: 'Fine-tuned GPT-4',
        model: AI_MODELS.FINE_TUNED,
        icon: '/openai.png',
        description: 'Specialized model trained on our wireframe conversions',
        badge: 'Premium'
    }
];