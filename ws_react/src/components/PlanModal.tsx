import React from 'react';
import { motion } from 'framer-motion';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Animation variants for fade-in effect
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.3
      }
    }
  };

  const planVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.2 + index * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-[#0f0f10] rounded-2xl border border-[#2A2A2A] w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.button
          className="absolute top-5 right-5 bg-[#121212] border-none text-[#E0E0E0] text-3xl w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-[#EF4444] hover:text-white"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          &times;
        </motion.button>

        <motion.div 
          className="text-center py-10 px-5"
          variants={contentVariants}
        >
          <motion.h2 
            className="text-3xl text-[#E0E0E0] mb-2 font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Escolha seu Plano
          </motion.h2>
          <motion.p 
            className="text-[#A0A0A0]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Desbloqueie todos os recursos e potencialize sua experiência
          </motion.p>
        </motion.div>

        <motion.div 
          className="flex gap-8 px-10 pb-10 md:flex-row flex-col"
          variants={contentVariants}
        >
          {/* Plano Free */}
          <motion.div 
            className="flex-1 bg-transparent rounded-xl p-6 border border-[#2A2A2A]"
            variants={planVariants}
            custom={0}
          >
            <motion.div 
              className="text-start pb-5 mb-5 border-b border-[#2A2A2A]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-2xl text-[#E0E0E0] mb-1 font-semibold">Free</h3>
              <p className="text-[#A0A0A0] font-bold">Com rate limiter</p>
            </motion.div>

            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="text-[#E0E0E0] text-lg mb-3 font-semibold">Modelos Disponíveis</h4>

              <div className="mb-4">
                <h5 className="text-[#A0A0A0] font-semibold mb-2">Google</h5>
                <div className="flex flex-wrap gap-2">
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    gemma-3-1b-it
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    gemini-1.5-flash
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    gemini-2.5-flash
                  </motion.button>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-[#A0A0A0] font-semibold mb-2">Open AI</h5>
                <div className="flex flex-wrap gap-2">
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    GPT-5
                  </motion.button>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
                <span className="text-[#A0A0A0]">Modo Arena</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#121212] text-[#E0E0E0] font-semibold">Limitado</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-[#A0A0A0]">Modo Criativo</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#121212] text-[#E0E0E0] font-semibold">Limitado</span>
              </div>
            </motion.div>

            <motion.div 
              className="bg-[#121212] rounded-lg p-4 mb-6 border border-[#2A2A2A]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-[#A0A0A0] text-center">
                <span className="font-bold text-[#E0E0E0]">Créditos iniciais:</span> 100 Credits/Mês
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h4 className="text-[#E0E0E0] text-lg mb-2 font-semibold">Modo Arena</h4>
              <p className="text-[#A0A0A0] text-sm mb-4 leading-relaxed">
                Os usuários podem selecionar os melhores modelos para debater sobre um tema específico.
                Os argumentos gerados pelas LLMs serão avaliados com base em: Persuasão, Criatividade nos argumentos
                e Defesa do ponto de vista do usuário.
              </p>

              <h4 className="text-[#E0E0E0] text-lg mb-2 font-semibold">Modo Criativo</h4>
              <p className="text-[#A0A0A0] text-sm leading-relaxed">
                Os usuários podem convidar amigos para interagir juntos. Geração multimodal de conteúdo colaborativa.
                Recursos limitados devido ao status Free.
              </p>
            </motion.div>
          </motion.div>

          {/* Plano PRO */}
          <motion.div 
            className="flex-1 bg-transparent rounded-xl p-6 border-2 border-[#2A2A2A] relative shadow-md"
            variants={planVariants}
            custom={1}
          >
            <div className="absolute -top-3 right-5 bg-[#121212] text-[#E0E0E0] text-xs font-bold px-4 py-1 rounded-full border border-[#2A2A2A]">
              Recomendado
            </div>

            <motion.div 
              className="text-start pb-5 mb-5 border-b border-[#2A2A2A]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-2xl text-[#E0E0E0] mb-1 font-semibold">PRO</h3>
              <p className="text-[#A0A0A0] font-bold text-lg">R$ 29,90/mês</p>
            </motion.div>

            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="text-[#E0E0E0] text-lg mb-3 font-semibold">Modelos Disponíveis</h4>

              <div className="mb-4">
                <h5 className="text-[#A0A0A0] font-semibold mb-2">Google</h5>
                <div className="flex flex-wrap gap-2">
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    gemini-1.5-flash
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    gemini-2.5-flash
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    gemini-2.5-flash Image (Nano Banana)
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    gemini-2.5-pro
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    gemma-3-1b-it
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Google Veo 3.1
                  </motion.button>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-[#A0A0A0] font-semibold mb-2">Open AI</h5>
                <div className="flex flex-wrap gap-2">
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    GPT-4.1
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    GPT 4o
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    GPT-5
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    GPT o4 mini
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    GPT 5 Nano
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    GPT 5 Pro
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sora 2 & Sora 2 Pro
                  </motion.button>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-[#A0A0A0] font-semibold mb-2">XAI</h5>
                <div className="flex flex-wrap gap-2">
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Grok 4 Fast Reasoning
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Grok 4 Fast Non Reasoning
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Grok Code Fast 1
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Grok-4
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Grok-3
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Grok 3 Mini
                  </motion.button>
                  <motion.button 
                    className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Grok 2 Image 1212
                  </motion.button>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
                <span className="text-[#A0A0A0]">Modo Arena</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#121212] text-[#E0E0E0] font-semibold">Ilimitado</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-[#A0A0A0]">Modo Criativo</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#121212] text-[#E0E0E0] font-semibold">Ilimitado</span>
              </div>
            </motion.div>

            <motion.div 
              className="bg-[#121212] rounded-lg p-4 mb-6 border border-[#2A2A2A]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-[#A0A0A0] text-center">
                <span className="font-bold text-[#E0E0E0]">Créditos iniciais:</span> 2.000 request/mês<br />
                <span className="text-sm">(com renovação semanal)</span>
              </p>
            </motion.div>

            <motion.button
              className="w-full py-4 bg-[#121212] text-[#E0E0E0] rounded-full text-lg font-bold transition-all hover:bg-[#EF4444] hover:text-white border border-[#2A2A2A] hover:border-[#EF4444]"
              onClick={() => console.log('Assinar Plano PRO')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Assinar Plano PRO
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PlanModal;