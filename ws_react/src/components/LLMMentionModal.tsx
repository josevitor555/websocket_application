import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { LLMList } from './LLMList';

interface LLMMentionModalProps {
  onClose: () => void;
  onSelect: (llmId: string) => void;
  position: { x: number; y: number };
}

export function LLMMentionModal({ onClose, onSelect, position }: LLMMentionModalProps) {
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
        className="bg-[#1e1e20] rounded-lg border border-[#2A2A2A] w-full max-w-xl max-h-[80vh] overflow-hidden llm-modal shadow-2xl"
        style={{
          maxWidth: '620px',
          width: '90%'
        }}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A] bg-transparent">
          <h3 className="text-lg font-semibold text-[#E0E0E0]"> Selecionar Modelo LLM </h3>
          <button 
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-0 max-h-[60vh] overflow-y-auto">
          <LLMList onLLMSelect={handleLLMSelect} isInModal={true} />
        </div>
      </div>
    </div>
  );
}