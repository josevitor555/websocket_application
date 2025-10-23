import { useEffect, useRef } from 'react';
import { LLMList } from './LLMList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface LLMMentionModalProps {
  onClose: () => void;
  onSelect: (llmId: string) => void;
  // position: { x: number; y: number }; // Removido pois não está sendo usado
}

export function LLMMentionModal({ onClose, onSelect }: LLMMentionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleLLMSelect = (llmId: string) => {
    onSelect(llmId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 bg-opacity-20 flex items-center justify-center z-50"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <div
        ref={modalRef}
        className="bg-white/[0.05] backdrop-blur-3xl border border-white/[0.3] rounded-lg w-full max-w-xl max-h-[80vh] overflow-hidden llm-modal shadow-2xl"
        style={{
          maxWidth: '620px',
          width: '90%'
        }}
      >
        <div className="flex items-start justify-between p-4 border-b border-[#2A2A2A] bg-transparent">
          <div className='flex flex-col justify-center items-start'>
            <h3 className="text-lg font-semibold text-[#E0E0E0]"> LLM Disponíveis para uso </h3>
            <p className="text- text-[#E0E0E0]/80 mt-2"> Para chamar uma LLM, use o comando @ seguido do nome do modelo desejado. Exemplo: @model_name. </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors mt-1"
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>
        </div>
        <div className="p-0 max-h-[60vh] overflow-y-auto">
          <LLMList onLLMSelect={handleLLMSelect} isInModal={true} />
        </div>
      </div>
    </div>
  );
}