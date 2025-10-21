import { Bot, Circle } from 'lucide-react';
import { motion, easeOut } from 'framer-motion';

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
  isInModal?: boolean; // Nova prop para indicar se está no modal
}

export function LLMList({ onLLMSelect, isInModal = false }: LLMListProps) {
  // Predefined list of LLMs organized by company with logo URLs
  const llms: LLM[] = [
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

  // Group LLMs by company
  const groupedLLMs = llms.reduce((acc, llm) => {
    if (!acc[llm.company]) {
      acc[llm.company] = [];
    }
    acc[llm.company].push(llm);
    return acc;
  }, {} as Record<string, LLM[]>);

  // Animation variants for slide-in from left effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  };

  return (
    <div 
      className={`${isInModal ? '' : 'bg-transparent rounded-2xl border border-[#2A2A2A]'} h-full max-h-[100vh] flex flex-col overflow-hidden`}
    >
      {!isInModal && (
        <div className="flex items-center gap-3 p-6 pb-0">
          <Bot className="w-5 h-5 text-background mb-4" />
          <h2 className="text-lg font-semibold text-[#E0E0E0] mb-4">
            Modelos LLM disponível
          </h2>
        </div>
      )}

      <div className={`${isInModal ? 'p-4' : 'p-6 pt-6'} flex-1 overflow-y-auto overflow-x-hidden`}>
        <div className="space-y-6 min-w-full">
          {Object.entries(groupedLLMs).map(([company, companyLLMs], companyIndex) => (
            <motion.div 
              key={company}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-3">
                {company}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {companyLLMs.map((llm, index) => (
                  <motion.div
                    key={llm.id}
                    onClick={() => onLLMSelect?.(llm.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      llm.isSelected
                        ? 'bg-white/10 border border-[#2A2A2A]'
                        : 'bg-transparent border border-[#2A2A2A] hover:bg-white/5'
                    }`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.5,
                      ease: easeOut
                    }}
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
                      <p className="text-[#E0E0E0] font-medium text-base truncate">
                        {llm.name}
                      </p>
                      <p className={`text-sm truncate ${llm.description.includes('indisponível') ? 'text-red-400' : 'text-[#A0A0A0]'}`}>
                        {llm.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}