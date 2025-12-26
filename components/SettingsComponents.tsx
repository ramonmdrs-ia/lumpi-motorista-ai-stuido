import React from 'react';
import { Card } from './DashboardComponents';
import { Badge } from './DashboardComponents';

// --- Components ---

interface UserHeaderProps {
    avatarUrl?: string; // Placeholder for now
    name: string;
    email: string;
    planLabel: string;
    roleLabel?: string;
    roleDescription?: string;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ name, email, planLabel, roleLabel, roleDescription }) => {
    return (
        <div className="flex items-center gap-4 py-4">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 shrink-0">
                <span className="material-symbols-outlined text-3xl">person</span>
            </div>
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-white leading-tight">{name}</h2>
                <p className="text-xs text-text-secondary">{email}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="success" icon="verified">{planLabel}</Badge>
                    {roleLabel && (
                        <span className="text-[10px] bg-white/10 text-white/60 px-2 py-1 rounded font-medium border border-white/5">
                            {roleLabel}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

interface SettingsSectionTitleProps {
    label: string;
}

export const SettingsSectionTitle: React.FC<SettingsSectionTitleProps> = ({ label }) => {
    return (
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 px-2 mt-6">
            {label}
        </h3>
    );
};

interface SettingsItemProps {
    title: string;
    description?: string;
    iconName?: string;
    onClick?: () => void;
    tone?: 'default' | 'danger';
    rightElement?: React.ReactNode;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({ title, description, iconName, onClick, tone = 'default', rightElement }) => {
    const isDanger = tone === 'danger';

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-all text-left group border-b border-white/5 last:border-0
        ${isDanger ? 'hover:bg-red-500/10' : ''}
      `}
        >
            {iconName && (
                <div className={`flex items-center justify-center size-10 rounded-xl transition-colors
            ${isDanger ? 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20' : 'bg-surface-dark-lighter text-text-secondary group-hover:text-white'}
        `}>
                    <span className="material-symbols-outlined text-[20px]">{iconName}</span>
                </div>
            )}

            <div className="flex flex-col flex-1 gap-0.5">
                <span className={`text-sm font-semibold ${isDanger ? 'text-red-400' : 'text-white'}`}>
                    {title}
                </span>
                {description && (
                    <span className={`text-xs ${isDanger ? 'text-red-400/70' : 'text-text-secondary'}`}>
                        {description}
                    </span>
                )}
            </div>

            {rightElement ? rightElement : (
                <span className={`material-symbols-outlined text-lg ${isDanger ? 'text-red-400/50' : 'text-white/20 group-hover:text-white/60'}`}>
                    chevron_right
                </span>
            )}
        </button>
    );
};

interface DangerZoneProps {
    onLogout: () => void;
    onDeleteAccount: () => void;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onLogout, onDeleteAccount }) => {
    return (
        <div className="flex flex-col mt-8 border-t border-white/10 pt-6 gap-4">
            <button
                onClick={onLogout}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-surface-dark border border-white/10 text-white font-bold hover:bg-white/5 transition-all w-full"
            >
                <span className="material-symbols-outlined">logout</span>
                Sair da conta
            </button>

            <div className="flex flex-col items-center gap-2 mt-4">
                <p className="text-xs text-text-secondary text-center max-w-xs">
                    Precisa excluir seus dados permanentemente?
                </p>
                <button
                    onClick={onDeleteAccount}
                    className="text-xs font-bold text-red-400 hover:text-red-300 hover:underline uppercase tracking-wide"
                >
                    Excluir minha conta
                </button>
            </div>
        </div>
    );
};
