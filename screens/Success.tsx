
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex justify-center py-8 lg:py-12 px-4">
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        <div className="flex flex-col items-center p-6 bg-surface-dark rounded-xl shadow-sm border border-[#28392e]">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-primary/10 rounded-full p-6 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[64px] font-bold fill">check_circle</span>
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-3">Pagamento Concluído!</h1>
            <p className="text-text-secondary text-base leading-relaxed">
              Bem-vindo ao clube <span className="text-primary font-bold">PRO</span>. Sua conta foi atualizada com sucesso e você já pode aproveitar todos os benefícios exclusivos.
            </p>
          </div>
          <div className="w-full mb-8 relative group overflow-hidden rounded-lg">
            <div 
              className="bg-center bg-no-repeat aspect-[21/9] bg-cover rounded-lg w-full transition-transform duration-500 group-hover:scale-105" 
              style={{ backgroundImage: 'url("https://picsum.photos/seed/success/600/300")' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white text-xs font-medium uppercase tracking-wider opacity-80">Comprovante Digital</p>
              </div>
            </div>
          </div>
          <div className="w-full bg-[#1a2c22] rounded-lg border border-border-dark p-4 flex flex-col gap-3">
             <div className="flex justify-between items-center text-sm">
               <span className="text-text-secondary">Plano</span>
               <span className="text-white font-bold">Lumpi-Motorista PRO</span>
             </div>
             <div className="flex justify-between items-center text-sm">
               <span className="text-text-secondary">Data</span>
               <span className="text-white">24 Out, 2023</span>
             </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full rounded-lg h-12 bg-primary hover:bg-primary-hover text-[#102216] font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            Explorar Recursos PRO
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full rounded-lg h-12 bg-transparent border border-[#28392e] text-white font-semibold transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
