
import React from 'react';
import { Link } from 'react-router-dom';

const Subscription: React.FC = () => {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center gap-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white max-w-2xl">
          Potencialize seus ganhos na estrada
        </h1>
        <p className="text-lg text-text-secondary max-w-xl">
          Invista na sua carreira de motorista. Desbloqueie ferramentas exclusivas para controlar cada centavo e lucrar mais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
        <div className="flex flex-col rounded-2xl border border-[#28392e] bg-[#1c271f] p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Plano Mensal</h3>
            <p className="mt-2 flex items-baseline gap-1 text-white">
              <span className="text-4xl font-black tracking-tight">R$ 19,90</span>
              <span className="text-base font-medium text-text-secondary">/mês</span>
            </p>
            <p className="mt-2 text-sm text-text-secondary">Flexibilidade total. Cancele quando quiser.</p>
          </div>
          <div className="flex-1 flex flex-col gap-3 py-6">
            {['Gestão multi-app integrada', 'Sem anúncios no app', 'Relatórios de ganhos básicos', 'Suporte por email'].map(feat => (
              <div key={feat} className="flex gap-3 text-sm text-gray-200">
                <span className="material-symbols-outlined text-primary text-[20px] fill">check_circle</span>
                {feat}
              </div>
            ))}
          </div>
          <Link to="/success" className="mt-auto w-full rounded-xl bg-[#28392e] px-4 py-3 text-sm font-bold text-white text-center hover:bg-opacity-80 transition-colors">
            Escolher Mensal
          </Link>
        </div>

        <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-[#1c271f] p-6 shadow-lg shadow-primary/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-[#102216]">
            RECOMENDADO
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Plano Anual</h3>
            <p className="mt-2 flex items-baseline gap-1 text-white">
              <span className="text-4xl font-black tracking-tight">R$ 14,90</span>
              <span className="text-base font-medium text-text-secondary">/mês</span>
            </p>
            <p className="mt-2 text-sm text-text-secondary">Cobrado R$ 178,80 anualmente.</p>
          </div>
          <div className="flex-1 flex flex-col gap-3 py-6">
            <div className="flex gap-3 text-sm font-medium text-white">
              <span className="material-symbols-outlined text-primary text-[20px] fill">verified</span>
              Tudo do plano Mensal
            </div>
            {['Exportação para Imposto de Renda', 'Calculadora de Lucro Real', 'Suporte prioritário via WhatsApp'].map(feat => (
              <div key={feat} className="flex gap-3 text-sm text-gray-200">
                <span className="material-symbols-outlined text-primary text-[20px] fill">check_circle</span>
                {feat}
              </div>
            ))}
            <div className="flex gap-3 text-sm text-primary font-bold">
              <span className="material-symbols-outlined text-[20px] fill">savings</span>
              Economia de 25%
            </div>
          </div>
          <Link to="/success" className="mt-auto w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-[#102216] text-center hover:brightness-110 transition-all shadow-[0_0_20px_rgba(19,236,91,0.2)]">
            Escolher Anual
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
