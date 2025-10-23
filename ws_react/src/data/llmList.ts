// Define the LLM type
export interface LLM {
    id: string;
    name: string;
    company: string;
    description: string;
    isSelected: boolean;
    logoUrl: string;
}

console.log('[LLMList] Arquivo carregado');

// Predefined list of LLMs organized by company with logo URLs
export const llmList: LLM[] = [
    // OpenAI
    {
        id: 'gpt-3',
        name: 'GPT-3',
        company: 'OpenAI',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/13/ChatGPT-Logo.png'
    },
    {
        id: 'gpt-4',
        name: 'GPT-4',
        company: 'OpenAI',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/13/ChatGPT-Logo.png'
    },
    {
        id: 'gpt-5',
        name: 'GPT-5',
        company: 'OpenAI',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/13/ChatGPT-Logo.png'
    },
    // Google
    {
        id: 'gemma-3-1b-it',
        name: 'Gemma 3 1B IT',
        company: 'Google',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://images.seeklogo.com/logo-png/62/1/google-gemini-icon-logo-png_seeklogo-623016.png'
    },
    {
        id: 'gemini-flash',
        name: 'Gemini 1.5 Flash',
        company: 'Google',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://images.seeklogo.com/logo-png/62/1/google-gemini-icon-logo-png_seeklogo-623016.png'
    },
    {
        id: 'gemini-pro',
        name: 'Gemini 2.5 Pro',
        company: 'Google',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://images.seeklogo.com/logo-png/62/1/google-gemini-icon-logo-png_seeklogo-623016.png'
    },
    // Anthropic
    {
        id: 'claude-4.5-sonnet',
        name: 'Claude 4.5 Sonnet',
        company: 'Anthropic',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://ppc.land/content/images/size/w2000/2025/09/Claude-AI-logo.webp'
    },
    {
        id: 'claude-4.5-haiku',
        name: 'Claude 4.5 Haiku',
        company: 'Anthropic',
        description: 'Ainda indisponível',
        isSelected: false,
        logoUrl: 'https://ppc.land/content/images/size/w2000/2025/09/Claude-AI-logo.webp'
    },
    // xAI
    {
        id: 'grok-2',
        name: 'Grok-2',
        company: 'xAI',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/grok.png'
    },
    {
        id: 'grok-3',
        name: 'Grok-3',
        company: 'xAI',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/grok.png'
    },
    {
        id: 'grok-heavy',
        name: 'Grok Heavy',
        company: 'xAI',
        description: 'Ainda indisponível',
        isSelected: false,
        logoUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/grok.png'
    },
    // DeepSeek AI
    {
        id: 'deepseek-ai',
        name: 'DeepSeek-R1-0528',
        company: 'DeepSeek',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqKHD28rGat3WVaqRkRDgIL-SHgOTHB6MrNg&s'
    },
    {
        id: 'deepseek-v3',
        name: 'DeepSeek-V3-0324',
        company: 'DeepSeek',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqKHD28rGat3WVaqRkRDgIL-SHgOTHB6MrNg&s'
    }
];

console.log('[LLMList] Lista de LLMs carregada:', llmList.length, 'modelos');