export interface GenerationConfig {
    temperature: number;
    max_completion_tokens: number;
    top_p: number;
    presence_penalty: number;
    frequency_penalty: number;
    stop_sequences?: string[];
    repetition_penalty?: number;
    best_of?: number;
}

export interface AIResponse {
    code: string;
    metadata: {
        model: string;
        generationTime: number;
        tokens: number;
    };
}

export interface ModelResponse {
    success: boolean;
    error?: string;
    data?: AIResponse;
}

export type ModelType = 'gemini' | 'gpt4' | 'quasar';

export interface PromptConfig {
    systemPrompt: string;
    userPrompt: string;
    temperature: number;
    maxTokens: number;
}
