import React from 'react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#F3FDF9] w-full max-w-sm rounded-[32px] overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black/10 hover:bg-black/20 text-[#102216] rounded-full p-1"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                {/* Hero Image / Header */}
                <div className="bg-[#156C45] p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <span className="material-symbols-outlined text-yellow-400 text-6xl mb-2 relative z-10">workspace_premium</span>
                    <h2 className="text-white text-2xl font-black uppercase tracking-tight relative z-10">Lumpi PRO</h2>
                    <p className="text-green-100 text-sm font-medium relative z-10">Desbloqueie seu potencial máximo</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-[#102216] text-sm font-bold">
                            <span className="material-symbols-outlined text-[#156C45]">check_circle</span>
                            Relatórios avançados e exportação
                        </li>
                        <li className="flex items-center gap-3 text-[#102216] text-sm font-bold">
                            <span className="material-symbols-outlined text-[#156C45]">check_circle</span>
                            Gestão de manutenção preventiva
                        </li>
                        <li className="flex items-center gap-3 text-[#102216] text-sm font-bold">
                            <span className="material-symbols-outlined text-[#156C45]">check_circle</span>
                            Análise de ROI e impostos
                        </li>
                        <li className="flex items-center gap-3 text-[#102216] text-sm font-bold">
                            <span className="material-symbols-outlined text-[#156C45]">check_circle</span>
                            Sem anúncios
                        </li>
                    </ul>

                    <button
                        onClick={onUpgrade}
                        className="w-full bg-[#156C45] hover:bg-[#105536] text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                    >
                        <span>Assinar por R$ 7,90</span>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    <p className="text-center text-[#102216]/60 text-[10px] mt-3 font-medium">Cancele quando quiser.</p>
                </div>
            </div>
        </div>
    );
};
