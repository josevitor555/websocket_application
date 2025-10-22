import { Bot } from 'lucide-react';
import { motion, easeOut } from 'framer-motion';

// Tipo para seções de chat
export interface ChatSection {
  id: string;
  title: string;
  icon: string; // Podemos usar emojis ou URLs de ícones
  date?: Date; // Opcional, para seções organizadas por data
}

interface SectionListProps {
  onSectionSelect?: (sectionId: string) => void;
  isInModal?: boolean; // Nova prop para indicar se está no modal
  sections: ChatSection[]; // Dados para seções de chat
}

export function SectionList({ onSectionSelect, isInModal = false, sections }: SectionListProps) {
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

  // Agrupar seções por data
  const groupedSections = sections.reduce((acc, section) => {
    const dateKey = section.date 
      ? section.date.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        })
      : 'Sem data';
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(section);
    return acc;
  }, {} as Record<string, ChatSection[]>);

  return (
    <div 
      className={`${isInModal ? '' : 'bg-transparent rounded-2xl border border-[#2A2A2A]'} h-full max-h-[100vh] flex flex-col overflow-hidden`}
    >
      {!isInModal && (
        <div className="flex items-center gap-3 p-6 pb-0">
          <Bot className="w-5 h-5 text-background mb-4" />
          <h2 className="text-lg font-semibold text-[#E0E0E0] mb-4">
            Seções de Chat
          </h2>
        </div>
      )}

      <div className={`${isInModal ? 'p-4' : 'p-6 pt-6'} flex-1 overflow-y-auto overflow-x-hidden`}>
        <div className="space-y-6 min-w-full">
          {Object.entries(groupedSections).map(([date, dateSections], dateIndex) => (
            <motion.div 
              key={date}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-3">
                {date}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {dateSections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    onClick={() => onSectionSelect?.(section.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      index === 0 && dateIndex === 0
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
                        <span className="text-lg">{section.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#E0E0E0] font-medium text-base truncate">
                        {section.title}
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