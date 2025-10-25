import { useState } from 'react';
import { motion, easeOut } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faLaptopCode,
  faUsers,
  faCalendarAlt,
  faCode,
  faComment,
  faChartBar,
  faNetworkWired,
  faPaintBrush,
  // faStar
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import UpdatePlanPro from './ui/updatePlanPro';
import PlanModal from './PlanModal';

// Tipo para seções de chat
export interface ChatSection {
  id: string;
  title: string;
  icon: string; // Nome do ícone do Font Awesome
  date?: Date;
}

// Mapa de ícones para facilitar a renderização
const iconMap: Record<string, IconDefinition> = {
  'fa-robot': faRobot,
  'fa-laptop-code': faLaptopCode,
  'fa-users': faUsers,
  'fa-calendar-alt': faCalendarAlt,
  'fa-code': faCode,
  'fa-comment': faComment,
  'fa-chart-bar': faChartBar,
  'fa-network-wired': faNetworkWired,
  'fa-paint-brush': faPaintBrush
};

interface SectionListProps {
  onSectionSelect?: (sectionId: string) => void;
  isInModal?: boolean; // Nova prop para indicar se está no modal
  sections: ChatSection[]; // Dados para seções de chat
}

export function SectionList({ onSectionSelect, isInModal = false, sections }: SectionListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
          <FontAwesomeIcon icon={faRobot} className="w-5 h-5 text-[#fafafa] mb-4" />
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
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${index === 0 && dateIndex === 0
                      ? 'bg-white/[0.05] backdrop-blur-3xl border border-accent-foreground'
                      : 'bg-white/[0.05] backdrop-blur-3xl border'
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
                        <FontAwesomeIcon icon={iconMap[section.icon] || faRobot} className="text-lg" />
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

      {/* Botão de atualização para plano Pro */}
      <div className="p-6">
        <UpdatePlanPro
          text="Atualize para o plano PRO"
          onClick={handleOpenModal}
        />
      </div>

      {/* Modal de Planos */}
      <PlanModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}