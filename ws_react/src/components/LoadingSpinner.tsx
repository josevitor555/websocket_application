import React from 'react';

export function LoadingSpinner() {
  const loaderStyle: React.CSSProperties = {
    width: '15px',
    aspectRatio: 1,
    borderRadius: '50%',
    animation: 'l5 1s infinite linear alternate'
  };

  const keyframes = `
    @keyframes l5 {
      0%  {box-shadow: 20px 0 #E0E0E0, -20px 0 #E0E0E000; background: #E0E0E0}
      33% {box-shadow: 20px 0 #E0E0E0, -20px 0 #E0E0E000; background: #E0E0E000}
      66% {box-shadow: 20px 0 #E0E0E000, -20px 0 #E0E0E0; background: #E0E0E000}
      100%{box-shadow: 20px 0 #E0E0E000, -20px 0 #E0E0E0; background: #E0E0E0}
    }
  `;

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* HTML: <div class="loader"></div> */}
        <style>{keyframes}</style>
        <div style={loaderStyle}></div>
        <span className="text-[#E0E0E0]">Carregando...</span>
      </div>
    </div>
  );
}