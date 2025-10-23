import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faPlug, faRotate } from '@fortawesome/free-solid-svg-icons';

interface ConnectionStatusProps {
    isConnected: boolean;
    reconnectAttempt: number;
    onReconnect: () => void;
}

export function ConnectionStatus({ isConnected, reconnectAttempt, onReconnect }: ConnectionStatusProps) {
    if (isConnected) {
        return (
            <div className="flex items-center gap-2 text-[#22C55E] text-sm">
                <FontAwesomeIcon icon={faWifi} className="w-4 h-4" />
                <span>Conectado</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[#EF4444] text-sm">
                <FontAwesomeIcon icon={faPlug} className="w-4 h-4" />
                <span>
                    {reconnectAttempt > 0 ? `Reconectando... (${reconnectAttempt})` : 'Desconectado'}
                </span>
            </div>
            <button
                onClick={onReconnect}
                className="text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors p-1 rounded"
                title="Reconectar"
                aria-label="Reconectar"
            >
                <FontAwesomeIcon icon={faRotate} className="w-4 h-4" />
            </button>
        </div>
    );
}
