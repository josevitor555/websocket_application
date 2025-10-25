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
    // Google - Free Plan Models
    {
        id: 'gemma-3-1b-it',
        name: 'Gemma 3 1B IT',
        company: 'Google',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://images.seeklogo.com/logo-png/62/1/google-gemini-icon-logo-png_seeklogo-623016.png'
    },
    {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        company: 'Google',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://images.seeklogo.com/logo-png/62/1/google-gemini-icon-logo-png_seeklogo-623016.png'
    },
    {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        company: 'Google',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://images.seeklogo.com/logo-png/62/1/google-gemini-icon-logo-png_seeklogo-623016.png'
    },
    
    // Google - PRO Plan Models (Marked as unavailable for Free plan)
    {
        id: 'gemini-2.5-flash-image',
        name: 'Gemini 2.5 Flash Image (Nano Banana)',
        company: 'Google',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://images.seeklogo.com/logo-png/62/1/google-gemini-icon-logo-png_seeklogo-623016.png'
    },
    {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        company: 'Google',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://images.seeklogo.com/logo-png/62/1/google-gemini-icon-logo-png_seeklogo-623016.png'
    },
    {
        id: 'google-veo-3.1',
        name: 'Google Veo 3.1',
        company: 'Google',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://images.seeklogo.com/logo-png/62/1/google-gemini-icon-logo-png_seeklogo-623016.png'
    },

    // OpenAI - Free Plan Models
    {
        id: 'gpt-5',
        name: 'GPT-5',
        company: 'OpenAI',
        description: 'Disponível para uso',
        isSelected: false,
        logoUrl: 'https://static.vecteezy.com/system/resources/previews/024/558/807/non_2x/openai-chatgpt-logo-icon-free-png.png'
    },
    
    // OpenAI - PRO Plan Models (Marked as unavailable for Free plan)
    {
        id: 'gpt-4.1',
        name: 'GPT-4.1',
        company: 'OpenAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://static.vecteezy.com/system/resources/previews/024/558/807/non_2x/openai-chatgpt-logo-icon-free-png.png'
    },
    {
        id: 'gpt-4o',
        name: 'GPT 4o',
        company: 'OpenAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://static.vecteezy.com/system/resources/previews/024/558/807/non_2x/openai-chatgpt-logo-icon-free-png.png'
    },
    {
        id: 'gpt-o4-mini',
        name: 'GPT o4 mini',
        company: 'OpenAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://static.vecteezy.com/system/resources/previews/024/558/807/non_2x/openai-chatgpt-logo-icon-free-png.png'
    },
    {
        id: 'gpt-5-nano',
        name: 'GPT 5 Nano',
        company: 'OpenAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://static.vecteezy.com/system/resources/previews/024/558/807/non_2x/openai-chatgpt-logo-icon-free-png.png'
    },
    {
        id: 'gpt-5-pro',
        name: 'GPT 5 Pro',
        company: 'OpenAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://static.vecteezy.com/system/resources/previews/024/558/807/non_2x/openai-chatgpt-logo-icon-free-png.png'
    },
    {
        id: 'sora-2',
        name: 'Sora 2',
        company: 'OpenAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://static.vecteezy.com/system/resources/previews/024/558/807/non_2x/openai-chatgpt-logo-icon-free-png.png'
    },

    // XAI - All models marked as unavailable for Free plan
    {
        id: 'grok-4-fast-reasoning',
        name: 'Grok 4 Fast Reasoning',
        company: 'xAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOv3K6RevHQCscoWPa2BvxKTq-9ygcQ4mhRA&s'
    },
    {
        id: 'grok-4-fast-non-reasoning',
        name: 'Grok 4 Fast Non Reasoning',
        company: 'xAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOv3K6RevHQCscoWPa2BvxKTq-9ygcQ4mhRA&s'
    },
    {
        id: 'grok-code-fast-1',
        name: 'Grok Code Fast 1',
        company: 'xAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOv3K6RevHQCscoWPa2BvxKTq-9ygcQ4mhRA&s'
    },
    {
        id: 'grok-4',
        name: 'Grok-4',
        company: 'xAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOv3K6RevHQCscoWPa2BvxKTq-9ygcQ4mhRA&s'
    },
    {
        id: 'grok-3',
        name: 'Grok-3',
        company: 'xAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOv3K6RevHQCscoWPa2BvxKTq-9ygcQ4mhRA&s'
    },
    {
        id: 'grok-3-mini',
        name: 'Grok 3 Mini',
        company: 'xAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOv3K6RevHQCscoWPa2BvxKTq-9ygcQ4mhRA&s'
    },
    {
        id: 'grok-2-image',
        name: 'Grok 2 Image 1212',
        company: 'xAI',
        description: 'Indisponível para uso - Apenas no plano PRO',
        isSelected: false,
        logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOv3K6RevHQCscoWPa2BvxKTq-9ygcQ4mhRA&s'
    }
];

console.log('[LLMList] Lista de LLMs carregada:', llmList.length, 'modelos');