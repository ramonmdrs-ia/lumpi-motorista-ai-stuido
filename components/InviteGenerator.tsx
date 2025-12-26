import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface InviteGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const generateCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous chars
    const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${part1}-${part2}`;
};

export const InviteGenerator: React.FC<InviteGeneratorProps> = ({ isOpen, onClose, onSuccess }) => {
    const [emailRestriction, setEmailRestriction] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');

    if (!isOpen) return null;

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const code = generateCode();
            const userStr = localStorage.getItem('lumpi_user');
            const user = userStr ? JSON.parse(userStr) : null;

            const { error } = await supabase
                .from('invites')
                .insert([{
                    code,
                    email_restriction: emailRestriction || null,
                    created_by: user?.id
                }]);

            if (error) throw error;

            setGeneratedCode(code);
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 2000);
        } catch (err: any) {
            alert('Erro ao gerar convite: ' + err.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleClose = () => {
        setEmailRestriction('');
        setGeneratedCode('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface-dark w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-white font-bold text-lg">Gerar Convite</h2>
                        <p className="text-text-secondary text-xs">Criar novo código de acesso</p>
                    </div>
                    <button onClick={handleClose} className="text-text-secondary hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    {generatedCode ? (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <span className="material-symbols-outlined text-primary text-6xl">check_circle</span>
                            <div className="text-center">
                                <p className="text-text-secondary text-sm mb-2">Código gerado com sucesso!</p>
                                <div className="bg-black/40 border border-primary/30 rounded-xl p-4">
                                    <span className="text-primary text-2xl font-black tracking-widest">{generatedCode}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-3">
                                <span className="text-white text-xs font-bold uppercase tracking-widest px-1">
                                    Restrição de Email (Opcional)
                                </span>
                                <input
                                    type="email"
                                    value={emailRestriction}
                                    onChange={(e) => setEmailRestriction(e.target.value)}
                                    className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary text-sm"
                                    placeholder="usuario@email.com"
                                />
                                <span className="text-text-secondary text-xs">
                                    Se preenchido, apenas este email poderá usar o convite
                                </span>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="w-full bg-primary hover:bg-primary-hover text-[#102216] font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {generating ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        Gerando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">add_circle</span>
                                        Gerar Código
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
