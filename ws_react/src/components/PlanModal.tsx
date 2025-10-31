import React from 'react';
import { motion } from 'framer-motion';
import SubscribeToTheProButtonPlan from './ui/SubscribetotheProButtonPlan';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Animation variants for fade-in effect only on the modal itself
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gray-160/20 backdrop-blur-sm flex justify-center items-center z-50 p-4"
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
        <button
          className="absolute top-5 right-5 bg-[#121212] border-none text-[#E0E0E0] text-3xl w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-[#EF4444] hover:text-white"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="text-center py-10 px-5">
          <h2 className="text-3xl text-[#E0E0E0] mb-2 font-bold">
            Escolha seu Plano
          </h2>
          <p className="text-[#A0A0A0]">
            Desbloqueie todos os recursos e potencialize sua experiência
          </p>
        </div>

        <div className="flex gap-8 px-10 pb-10 md:flex-row flex-col">
          {/* Plano Free */}
          <div className="flex-1 bg-transparent rounded-xl p-6 border border-[#2A2A2A]">
            <div className="text-start pb-5 mb-5 border-b border-[#2A2A2A]">
              <h3 className="text-2xl text-[#E0E0E0] mb-1 font-semibold">Free</h3>
              <p className="text-[#A0A0A0] font-bold">Com rate limiter</p>
            </div>

            <div className="mb-6">
              <h4 className="text-[#E0E0E0] text-lg mb-3 font-semibold">Modelos Disponíveis</h4>

              <div className="mb-4">
                <h5 className="text-[#A0A0A0] font-semibold mb-2">Google</h5>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    gemma-3-1b-it
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    gemini-1.5-flash
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    gemini-2.5-flash
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-[#A0A0A0] font-semibold mb-2">Open AI</h5>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    GPT-5
                  </button>
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
            </div>

            <div className="bg-[#121212] rounded-lg p-4 mb-6 border border-[#2A2A2A]">
              <p className="text-[#A0A0A0] text-center">
                <span className="font-bold text-[#E0E0E0]">Créditos iniciais:</span> 100 request/Mes<br />
                <span className="text-sm">(Somente no primeiro mês)</span>
              </p>
            </div>

            <div className="bg-[#121212] rounded-lg p-4 mb-6 border border-[#2A2A2A]">
              <p className="text-[#A0A0A0] text-center">
                <span className="font-bold text-[#E0E0E0]">Limite de usuários por chat:</span> 2 usuários<br />
                <span className="text-sm">(interagindo com as LLMs)</span>
              </p>
            </div>

            <div>
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
            </div>
          </div>

          {/* Plano PRO */}
          <div className="flex-1 bg-transparent rounded-xl p-6 border-2 border-[#2A2A2A] relative shadow-md">
            <div className="absolute -top-3 right-5 bg-[#121212] text-[#E0E0E0] text-xs font-bold px-4 py-1 rounded-full border border-[#2A2A2A]">
              Recomendado
            </div>

            <div className="text-start pb-5 mb-5 border-b border-[#2A2A2A]">
              <h3 className="text-2xl text-[#E0E0E0] mb-1 font-semibold">PRO</h3>
              <p className="text-[#A0A0A0] font-bold text-lg">R$ 69,90/mês</p>
            </div>

            <div className="mb-6">
              <h4 className="text-[#E0E0E0] text-lg mb-3 font-semibold">Modelos Disponíveis</h4>

              <div className="mb-4">
                <h5 className="text-[#A0A0A0] font-semibold mb-2">Google</h5>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    gemini-1.5-flash
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    gemini-2.5-flash
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    gemini-2.5-flash Image (Nano Banana)
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    gemini-2.5-pro
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    gemma-3-1b-it
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    Google Veo 3.1
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-[#A0A0A0] font-semibold mb-2">Open AI</h5>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    GPT-4.1
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    GPT 4o
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    GPT-5
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    GPT o4 mini
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    GPT 5 Nano
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    GPT 5 Pro
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    Sora 2
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-[#A0A0A0] font-semibold mb-2">XAI</h5>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    Grok 4 Fast Reasoning
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    Grok 4 Fast Non Reasoning
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    Grok Code Fast 1
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    Grok-4
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    Grok-3
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    Grok 3 Mini
                  </button>
                  <button className="px-3 py-1 bg-[#121212] text-[#A0A0A0] text-sm rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors">
                    Grok 2 Image 1212
                  </button>
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
            </div>

            <div className="bg-[#121212] rounded-lg p-4 mb-6 border border-[#2A2A2A]">
              <p className="text-[#A0A0A0] text-center">
                <span className="font-bold text-[#E0E0E0]">Créditos iniciais:</span> 2.000 request/mês<br />
                <span className="text-sm">(com renovação semanal de 500 créditos)</span>
              </p>
            </div>

            <div className="bg-[#121212] rounded-lg p-4 mb-6 border border-[#2A2A2A]">
              <p className="text-[#A0A0A0] text-center">
                <span className="font-bold text-[#E0E0E0]">Limite de usuários por chat:</span> 4 - 6 Usuários por Chat<br />
                <span className="text-sm">(interagindo com as LLMs)</span>
              </p>
            </div>

            <div>
              <SubscribeToTheProButtonPlan />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlanModal;