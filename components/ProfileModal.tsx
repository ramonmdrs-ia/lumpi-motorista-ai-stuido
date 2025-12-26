import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Card } from './DashboardComponents';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUpdate: (updatedUser: any) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
    const [nome, setNome] = useState(user?.nome || '');
    const [telefone, setTelefone] = useState(user?.telefone || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setNome(user.nome || '');
            setTelefone(user.telefone || '');
            setAvatarUrl(user.avatar_url || '');
        }
    }, [user]);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Você deve selecionar uma imagem para upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const updates = {
                id: user.id,
                nome,
                telefone,
                avatar_url: avatarUrl,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('usuarios').upsert(updates);

            if (error) throw error;

            const updatedUser = { ...user, ...updates };
            localStorage.setItem('lumpi_user', JSON.stringify(updatedUser));
            onUpdate(updatedUser);
            onClose();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <Card className="w-full max-w-md bg-surface-dark border-primary/20 p-6 flex flex-col gap-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Editar Perfil</h2>
                    <p className="text-text-secondary text-sm">Mantenha seus dados sempre atualizados.</p>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50 bg-card-dark flex items-center justify-center">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-4xl text-text-secondary">person</span>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-background-dark rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                            <span className="material-symbols-outlined text-sm">{uploading ? 'sync' : 'photo_camera'}</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase px-1">Nome Completo</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-lg">person</span>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Seu nome"
                                className="w-full bg-card-dark border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase px-1">Telefone / WhatsApp</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-lg">call</span>
                            <input
                                type="tel"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                placeholder="(00) 00000-0000"
                                className="w-full bg-card-dark border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || uploading}
                        className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-background-dark font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">sync</span>
                                Salvando...
                            </>
                        ) : 'Salvar Alterações'}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default ProfileModal;
