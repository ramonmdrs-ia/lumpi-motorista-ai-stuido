import React from 'react';

// Colors defined in Design System
const PRO_GREEN = '#156C45';
const PRO_BG = '#F3FDF9';

export const ProBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
    <span className={`
    bg-[#156C45] text-white font-black tracking-widest rounded-md flex items-center justify-center
    ${size === 'sm' ? 'text-[10px] px-1.5 py-0.5 h-5' : 'text-xs px-2 py-1 h-6'}
  `}>
        PRO
    </span>
);

export const ProButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
    <button
        className={`bg-[#156C45] hover:bg-[#105536] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${className}`}
        {...props}
    >
        <span className="material-symbols-outlined text-yellow-400">star</span>
        {children}
    </button>
);

interface ProCardProps {
    children: React.ReactNode;
    title: string;
    icon?: string;
    className?: string;
}

export const ProCard: React.FC<ProCardProps> = ({ children, title, icon, className }) => (
    <div className={`bg-[#F3FDF9] border border-[#156C45]/20 rounded-2xl p-4 relative override-pro-card ${className}`}>
        <div className="flex items-center gap-2 mb-3">
            {icon && <span className="material-symbols-outlined text-[#156C45]">{icon}</span>}
            <h3 className="text-[#102216] font-bold text-sm uppercase tracking-wide flex-1">{title}</h3>
            <ProBadge />
        </div>
        {children}
    </div>
);

// Lock Component to wrap protected features
export const ProLock: React.FC<{ isPro: boolean; children: React.ReactNode; onUnlock: () => void }> = ({ isPro, children, onUnlock }) => {
    if (isPro) return <>{children}</>;

    return (
        <div className="relative group overflow-hidden rounded-2xl">
            <div className="blur-sm opacity-50 pointer-events-none select-none grayscale" aria-hidden="true">
                {children}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/5 p-4 text-center">
                <div className="bg-surface-dark border border-white/10 p-4 rounded-2xl shadow-2xl max-w-[200px]">
                    <span className="material-symbols-outlined text-[#156C45] text-3xl mb-2">lock</span>
                    <p className="text-white text-xs font-bold mb-3">Funcionalidade PRO</p>
                    <button
                        onClick={onUnlock}
                        className="bg-[#156C45] text-white text-xs font-bold px-3 py-2 rounded-lg w-full"
                    >
                        Desbloquear
                    </button>
                </div>
            </div>
        </div>
    );
};
