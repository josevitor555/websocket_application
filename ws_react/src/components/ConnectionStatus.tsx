import { llmMessageService } from '../services/llmMessageService';

interface ConnectionStatusProps {
  isConnected: boolean;
  reconnectAttempt: number;
  onReconnect: () => void;
}

export function ConnectionStatus({ isConnected, reconnectAttempt, onReconnect }: ConnectionStatusProps) {
  const handleClearLLMErrors = () => {
    llmMessageService.clearLLMErrorMessagesFromLocalStorage();
    // Forçar um reload da página para atualizar a UI
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-[#A0A0A0]">
          {isConnected ? 'Conectado' : 'Desconectado'}
        </span>
      </div>
      
      {!isConnected && reconnectAttempt > 0 && (
        <span className="text-sm text-[#A0A0A0]">
          Tentativa {reconnectAttempt}/10
        </span>
      )}
      
      {!isConnected && (
        <button
          onClick={onReconnect}
          className="px-2 py-1 bg-[#121212] hover:bg-[#2A2A2A] text-[#E0E0E0] text-xs rounded transition-colors border border-[#2A2A2A]"
        >
          Reconectar
        </button>
      )}
      
      {/* Botão para limpar mensagens de erro LLM */}
      <button
        onClick={handleClearLLMErrors}
        className="px-2 py-1 bg-[#121212] hover:bg-[#2A2A2A] text-[#E0E0E0] text-xs rounded transition-colors border border-[#2A2A2A]"
        title="Limpar mensagens de erro LLM"
      >
        Limpar Erros LLM
      </button>
    </div>
  );
}