import React from 'react';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1a1a] rounded-2xl border w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-5 right-5 bg-transparent border-none text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-white hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        
        <div className="text-center py-10 px-5">
          <h2 className="text-3xl text-white mb-2 font-bold">Escolha seu Plano</h2>
          <p className="text-gray-300">Desbloqueie todos os recursos e potencialize sua experiência</p>
        </div>
        
        <div className="flex gap-8 px-10 pb-10 md:flex-row flex-col">
          {/* Plano Freemium */}
          <div className="flex-1 bg-[#252525] rounded-xl p-6 border">
            <div className="text-start pb-5 mb-5 border-b border-gray-600">
              <h3 className="text-2xl text-white mb-1 font-semibold">Freemium</h3>
              <p className="text-gray-300 font-bold">7 dias grátis</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-600">
                <span className="text-white/60">Acesso aos melhores modelos LLM</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white text-black font-semibold">Limitado</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-600">
                <span className="text-white/60">Geração multimodal de conteúdo</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white text-black font-semibold">Com limitações</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-600">
                <span className="text-white/60">Modo Arena</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white text-black font-semibold">Disponível</span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-white/60">Modo Criativo</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white text-black font-semibold">Limitado</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-white text-lg mb-2 font-semibold">Modo Arena</h4>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Os usuários podem selecionar os melhores modelos para debater sobre um tema específico. 
                Os argumentos gerados pelas LLMs serão avaliados com base em: Persuasão, Criatividade nos argumentos 
                e Defesa do ponto de vista do usuário.
              </p>
              
              <h4 className="text-white text-lg mb-2 font-semibold">Modo Criativo</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Os usuários podem convidar amigos para interagir juntos. Geração multimodal de conteúdo colaborativa. 
                Recursos limitados devido ao status Freemium.
              </p>
            </div>
          </div>
          
          {/* Plano PRO */}
          <div className="flex-1 bg-[#1f1f1f] rounded-xl p-6 border-2 border-gray-500 relative shadow-md">
            <div className="absolute -top-3 right-5 bg-gray-200 text-gray-900 text-xs font-bold px-4 py-1 rounded-full">
              Recomendado
            </div>
            
            <div className="text-satrt pb-5 mb-5 border-b border-gray-600">
              <h3 className="text-2xl text-white mb-1 font-semibold">PRO</h3>
              <p className="text-gray-300 font-bold text-lg">R$ 29,90/mês</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-600">
                <span className="text-white/60">Acesso aos melhores modelos LLM</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white text-black font-semibold">Ilimitado</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-600">
                <span className="text-white/60">Geração multimodal de conteúdo</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white text-black font-semibold">Ilimitado</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-600">
                <span className="text-white/60">Modo Arena</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white text-black font-semibold">Ilimitado</span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-white/60">Modo Criativo</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white text-black font-semibold">Ilimitado</span>
              </div>
            </div>
            
            <button 
              className="w-full py-4 bg-white text-gray-900 rounded-full text-lg font-bold transition-all hover:bg-gray-200 hover:-translate-y-0.5"
              onClick={() => console.log('Assinar Plano PRO')}
            >
              Assinar Plano PRO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;