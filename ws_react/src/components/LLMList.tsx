import { motion, easeOut } from 'framer-motion';
import { llmList } from '../data/llmList';
import type { LLM } from '../data/llmList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faCircle } from '@fortawesome/free-solid-svg-icons';

interface LLMListProps {
  onLLMSelect?: (llmId: string) => void;
  isInModal?: boolean; // Nova prop para indicar se está no modal
}

export function LLMList({ onLLMSelect, isInModal = false }: LLMListProps) {
  // Predefined list of LLMs organized by company with logo URLs
  const llms: LLM[] = llmList;

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
          <FontAwesomeIcon icon={faRobot} className="w-5 h-5 text-background mb-4" />
          <h2 className="text-lg font-semibold text-[#E0E0E0] mb-4">
            Modelos LLM disponível
          </h2>
        </div>
      )}

      <div className={`${isInModal ? 'p-4' : 'p-6 pt-6'} flex-1 overflow-y-auto overflow-x-hidden`}>
        <div className="space-y-6 min-w-full">
          {Object.entries(groupedLLMs).map(([company, companyLLMs]) => (
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
                          onError={(e) => {
                            // Em caso de erro no carregamento da imagem, definir um fallback
                            const target = e.target as HTMLImageElement;
                            // Criar um SVG fallback com as iniciais do nome do modelo
                            const initials = llm.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
                            target.outerHTML = `
                              <div class="w-6 h-6 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                                <span class="text-[#E0E0E0] text-xs font-bold">${initials}</span>
                              </div>
                            `;
                          }}
                          loading="lazy"
                        />
                      </div>
                      {llm.isSelected && (
                        <FontAwesomeIcon icon={faCircle} className="w-3 h-3 text-[#22C55E] absolute bottom-0 right-0" />
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