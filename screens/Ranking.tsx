
import React from 'react';

const Ranking: React.FC = () => {
  const topDrivers = [
    { name: 'Roberto S.', rate: 'R$ 52,40/h', rank: 1, platforms: ['UBER', '99'], img: 'https://picsum.photos/seed/d1/200/200' },
    { name: 'Ana P.', rate: 'R$ 48,20/h', rank: 2, platforms: ['UBER'], img: 'https://picsum.photos/seed/d2/200/200' },
    { name: 'João V.', rate: 'R$ 46,90/h', rank: 3, platforms: ['IFOOD'], img: 'https://picsum.photos/seed/d3/200/200' },
  ];

  return (
    <div className="p-4 md:p-10 max-w-2xl mx-auto flex flex-col gap-6">
      <div className="p-6 pb-2 sticky top-0 z-20 bg-background-dark/95 backdrop-blur-sm border-b border-[#28392e]">
        <h2 className="text-white text-3xl font-black leading-tight tracking-tight">Ranking Semanal</h2>
        <p className="text-text-secondary text-sm mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">info</span>
          Baseado em Lucro Líquido/Hora
        </p>
      </div>

      <div className="flex items-end justify-center gap-4 px-4 py-8 mt-2">
        {/* 2nd Place */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="relative">
            <div 
              className="w-20 h-20 bg-center bg-cover rounded-full border-4 border-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.3)]" 
              style={{backgroundImage: `url(${topDrivers[1].img})`}}
            ></div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-[#102216] text-xs font-bold px-2 py-0.5 rounded-full">#2</div>
          </div>
          <div className="text-center mt-2">
            <p className="text-white font-bold text-sm truncate">{topDrivers[1].name}</p>
            <p className="text-text-secondary text-xs">{topDrivers[1].rate}</p>
          </div>
        </div>
        
        {/* 1st Place */}
        <div className="flex flex-col items-center gap-2 w-1/3 -mt-8 relative z-10">
          <div className="absolute -top-10 text-yellow-400">
            <span className="material-symbols-outlined text-4xl fill">crown</span>
          </div>
          <div className="relative">
            <div 
              className="w-24 h-24 bg-center bg-cover rounded-full border-4 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.5)]" 
              style={{backgroundImage: `url(${topDrivers[0].img})`}}
            ></div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-[#102216] text-sm font-bold px-3 py-0.5 rounded-full">#1</div>
          </div>
          <div className="text-center mt-3">
            <p className="text-white font-bold text-base">{topDrivers[0].name}</p>
            <p className="text-primary text-sm font-bold">{topDrivers[0].rate}</p>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="relative">
            <div 
              className="w-20 h-20 bg-center bg-cover rounded-full border-4 border-orange-700 shadow-[0_0_15px_rgba(194,65,12,0.3)]" 
              style={{backgroundImage: `url(${topDrivers[2].img})`}}
            ></div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">#3</div>
          </div>
          <div className="text-center mt-2">
            <p className="text-white font-bold text-sm truncate">{topDrivers[2].name}</p>
            <p className="text-text-secondary text-xs">{topDrivers[2].rate}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-dark p-4 shadow-lg border border-primary/30 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <div className="flex items-center gap-4 z-10">
          <div className="flex flex-col items-center justify-center w-10">
            <span className="text-primary font-black text-xl">#42</span>
            <span className="material-symbols-outlined text-primary text-xs fill">arrow_drop_up</span>
          </div>
          <div 
            className="w-12 h-12 bg-center bg-cover rounded-full border-2 border-primary" 
            style={{backgroundImage: 'url("https://picsum.photos/seed/me/200/200")'}}
          ></div>
          <div>
            <p className="text-white font-bold text-base">Você</p>
            <p className="text-primary text-xs font-medium">Subiu 3 posições</p>
          </div>
        </div>
        <div className="text-right z-10">
          <p className="text-white font-bold font-mono text-lg">R$ 28,00</p>
          <p className="text-text-secondary text-xs">por hora</p>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
