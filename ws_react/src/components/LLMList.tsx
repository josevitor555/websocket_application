import { Bot, Circle } from 'lucide-react';

// Define the LLM type
interface LLM {
  id: string;
  name: string;
  company: string;
  description: string;
  isSelected: boolean;
  logoUrl: string;
}

interface LLMListProps {
  onLLMSelect?: (llmId: string) => void;
}

export function LLMList({ onLLMSelect }: LLMListProps) {
  // Predefined list of LLMs organized by company with logo URLs
  const llms: LLM[] = [
    // OpenAI
    {
      id: 'gpt-3',
      name: 'GPT-3',
      company: 'OpenAI',
      description: 'Modelo de linguagem predecessor do GPT-4',
      isSelected: false,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/13/ChatGPT-Logo.png' // Placeholder for OpenAI logo
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      company: 'OpenAI',
      description: 'Modelo de linguagem avançado da OpenAI',
      isSelected: true,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/13/ChatGPT-Logo.png' // Placeholder for OpenAI logo
    },
    {
      id: 'gpt-5',
      name: 'GPT-5',
      company: 'OpenAI',
      description: 'Mais recente modelo de linguagem da OpenAI',
      isSelected: false,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/13/ChatGPT-Logo.png' // Placeholder for OpenAI logo
    },
    // Google
    {
      id: 'gemini-flash',
      name: 'Gemini 1.5 Flash',
      company: 'Google',
      description: 'Versão rápida e eficiente do Gemini',
      isSelected: false,
      logoUrl: 'https://images.seeklogo.com/logo-png/62/1/google-gemini-icon-logo-png_seeklogo-623016.png' // Placeholder for Google logo
    },
    {
      id: 'gemini-pro',
      name: 'Gemini 2.5 Pro',
      company: 'Google',
      description: 'Modelo de linguagem multimodal do Google',
      isSelected: false,
      logoUrl: 'https://images.seeklogo.com/logo-png/62/1/google-gemini-icon-logo-png_seeklogo-623016.png' // Placeholder for Google logo
    },
    // Anthropic
    {
      id: 'claude',
      name: 'Claude 4.5 sonnet',
      company: 'Anthropic',
      description: 'Assistente de IA com foco em segurança e utilidade',
      isSelected: false,
      logoUrl: 'https://ppc.land/content/images/size/w2000/2025/09/Claude-AI-logo.webp' // Placeholder for Anthropic logo
    },
    {
      id: 'claude',
      name: 'Claude 4.5 haiku',
      company: 'Anthropic',
      description: 'Assistente de IA com foco em segurança e utilidade',
      isSelected: false,
      logoUrl: 'https://ppc.land/content/images/size/w2000/2025/09/Claude-AI-logo.webp' // Placeholder for Anthropic logo
    },
    // xAI
    {
      id: 'grok-2',
      name: 'Grok-2',
      company: 'xAI',
      description: 'Versão aprimorada do modelo Grok',
      isSelected: false,
      logoUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/grok.png' // Placeholder for xAI logo
    },
    {
      id: 'grok-3',
      name: 'Grok-3',
      company: 'xAI',
      description: 'Modelo de linguagem mais recente do xAI',
      isSelected: false,
      logoUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/grok.png' // Placeholder for xAI logo
    },
    {
      id: 'grok-heavy',
      name: 'Grok Heavy',
      company: 'xAI',
      description: 'Versão mais poderosa do Grok para tarefas complexas',
      isSelected: false,
      logoUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/grok.png' // Placeholder for xAI logo
    },
    // DeepSeek AI
    {
      id: 'deepseek-ai',
      name: 'DeepSeek-R1-0528',
      company: 'DeepSeek',
      description: 'Um modelo de raciocínio mais refinado',
      isSelected: false,
      logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqKHD28rGat3WVaqRkRDgIL-SHgOTHB6MrNg&s' // Placeholder for Mistral AI logo
    },
    {
      id: 'deepseek-v3',
      name: 'DeepSeek-V3-0324',
      company: 'DeepSeek',
      description: 'Modelo especializado em raciocínio e matemática',
      isSelected: false,
      logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqKHD28rGat3WVaqRkRDgIL-SHgOTHB6MrNg&s' // Placeholder for Mistral AI logo
    }
  ];

  // Group LLMs by company
  const groupedLLMs = llms.reduce((acc, llm) => {
    if (!acc[llm.company]) {
      acc[llm.company] = [];
    }
    acc[llm.company].push(llm);
    return acc;
  }, {} as Record<string, LLM[]>);

  return (
    <div className="bg-transparent rounded-2xl border border-[#2A2A2A] h-full max-h-[100vh] flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 p-6 pb-0">
        <Bot className="w-5 h-5 text-background mb-4" />
        <h2 className="text-lg font-semibold text-[#E0E0E0] mb-4">
          Modelos LLM disponível
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-6">
        <div className="space-y-6 min-w-full">
          {Object.entries(groupedLLMs).map(([company, companyLLMs]) => (
            <div key={company}>
              <h3 className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-3">
                {company}
              </h3>
              <div className="space-y-2">
                {companyLLMs.map((llm) => (
                  <div
                    key={llm.id}
                    onClick={() => onLLMSelect?.(llm.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${llm.isSelected
                        ? 'bg-white/10 border border-[#2A2A2A]'
                        : 'bg-[#121212] border border-[#2A2A2A] hover:bg-[#1A1A1A]'
                      }`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center overflow-hidden">
                        <img
                          src={llm.logoUrl}
                          alt={`${llm.name} logo`}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      {llm.isSelected && (
                        <Circle className="w-3 h-3 text-[#22C55E] fill-[#22C55E] absolute bottom-0 right-0" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#E0E0E0] font-medium text-sm truncate">
                        {llm.name}
                      </p>
                      <p className="text-[#A0A0A0] text-xs truncate">
                        {llm.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}