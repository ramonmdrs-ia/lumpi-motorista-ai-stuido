import React from 'react';
import { Card } from './DashboardComponents';
import { Badge } from './DashboardComponents';

// --- Types ---

export type AdminTab = 'users' | 'pro' | 'invites' | 'logs';

export type UserAdminStatus = 'free' | 'pro' | 'admin' | 'blocked';

export type AdminUser = {
    id: string;
    email: string;
    name?: string;
    status: UserAdminStatus;
    signupDate: string;
    lastAccessRelative: string;
    proUntil?: string;
};

// --- Components ---

interface AdminTabsProps {
    active: AdminTab;
    onChange: (tab: AdminTab) => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ active, onChange }) => {
    const tabs: { id: AdminTab; label: string }[] = [
        { id: 'users', label: 'Usuários' },
        { id: 'pro', label: 'PRO' },
        { id: 'invites', label: 'Convites' },
        { id: 'logs', label: 'Logs' },
    ];

    return (
        <div className="flex items-center gap-1 bg-surface-dark p-1 rounded-xl border border-white/5 w-fit">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${active === tab.id
                        ? 'bg-primary text-[#102216] shadow-sm'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

interface StatCardProps {
    label: string;
    value: number;
    tone?: 'default' | 'success' | 'warning' | 'danger';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, tone = 'default' }) => {
    const toneColors = {
        default: 'text-white',
        success: 'text-primary',
        warning: 'text-yellow-400',
        danger: 'text-red-400',
    };

    return (
        <Card className="flex flex-col gap-1 !p-4">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{label}</span>
            <span className={`text-2xl font-black ${toneColors[tone]}`}>{value}</span>
        </Card>
    );
};

interface AdminFilterBarProps {
    onRefresh: () => void;
    searchTerm: string;
    onSearchChange: (val: string) => void;
    statusFilter: string;
    onStatusFilterChange: (val: string) => void;
}

export const FilterBar: React.FC<AdminFilterBarProps> = ({ onRefresh, searchTerm, onSearchChange, statusFilter, onStatusFilterChange }) => {
    return (
        <div className="flex flex-col md:flex-row gap-3">
            <button
                onClick={onRefresh}
                className="size-12 rounded-xl border border-white/10 flex items-center justify-center text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            >
                <span className="material-symbols-outlined">refresh</span>
            </button>

            <div className="flex-1 bg-surface-dark border border-white/10 rounded-xl flex items-center px-4 gap-2">
                <span className="material-symbols-outlined text-text-secondary">search</span>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Filtrar por nome ou e-mail..."
                    className="bg-transparent border-none outline-none text-white text-sm w-full py-3 placeholder:text-text-secondary/50"
                />
            </div>

            <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="bg-surface-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none cursor-pointer hover:bg-white/5"
            >
                <option value="all">Todos os Status</option>
                <option value="pro">Apenas PRO</option>
                <option value="admin">Apenas Admins</option>
            </select>
        </div>
    );
};

interface UserRowProps {
    user: AdminUser;
    onManage: (userId: string) => void;
}

export const UserRow: React.FC<UserRowProps> = ({ user, onManage }) => {
    const statusMap: Record<UserAdminStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
        free: { label: 'Gratuito', variant: 'default' },
        pro: { label: 'PRO', variant: 'success' },
        admin: { label: 'Admin', variant: 'warning' },
        blocked: { label: 'Bloqueado', variant: 'danger' }
    };

    const displayStatus = statusMap[user.status] || statusMap.free;

    return (
        <div className="flex items-center justify-between p-4 bg-[#1c1c1c] border-b border-white/5 last:border-none hover:bg-white/5 transition-colors group">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{user.name || 'Sem nome'}</span>
                    <Badge variant={displayStatus.variant}>{displayStatus.label}</Badge>
                </div>
                <p className="text-xs text-text-secondary font-mono">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-text-secondary/60">Cadastro: {new Date(user.signupDate).toLocaleDateString('pt-BR')}</span>
                    {user.proUntil && (
                        <span className="text-[10px] text-primary/60">• PRO até {new Date(user.proUntil).toLocaleDateString('pt-BR')}</span>
                    )}
                </div>
            </div>

            <button
                onClick={() => onManage(user.id)}
                className="size-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-white/10 hover:text-white transition-colors"
            >
                <span className="material-symbols-outlined">more_vert</span>
            </button>
        </div>
    );
};

interface ManageUserModalProps {
    user: AdminUser | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (userId: string, updates: { plano: UserAdminStatus, pro_until?: string | null }) => Promise<void>;
}

export const ManageUserModal: React.FC<ManageUserModalProps> = ({ user, isOpen, onClose, onUpdate }) => {
    const [daysToAdd, setDaysToAdd] = React.useState('30');
    const [isUpdating, setIsUpdating] = React.useState(false);

    if (!isOpen || !user) return null;

    const handleAddPro = async () => {
        setIsUpdating(true);
        try {
            const now = new Date();
            const currentUntil = user.proUntil ? new Date(user.proUntil) : now;
            const startDate = currentUntil > now ? currentUntil : now;

            const newUntil = new Date(startDate);
            newUntil.setDate(newUntil.getDate() + parseInt(daysToAdd));

            await onUpdate(user.id, {
                plano: 'pro',
                pro_until: newUntil.toISOString()
            });
            onClose();
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRevokePro = async () => {
        if (!window.confirm(`Remover plano PRO de ${user.name || user.email}?`)) return;
        setIsUpdating(true);
        try {
            await onUpdate(user.id, {
                plano: 'free',
                pro_until: null
            });
            onClose();
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-dark w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-white font-bold text-lg">Gerenciar Usuário</h2>
                        <p className="text-text-secondary text-xs">{user.email}</p>
                    </div>
                    <button onClick={onClose} className="text-text-secondary hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    {/* Status Atual */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                        <span className="text-text-secondary text-sm font-medium">Plano Atual</span>
                        <Badge variant={user.status === 'pro' ? 'success' : user.status === 'admin' ? 'warning' : 'default'}>
                            {user.status.toUpperCase()}
                        </Badge>
                    </div>

                    {/* Adicionar Dias */}
                    <div className="flex flex-col gap-3">
                        <span className="text-white text-xs font-bold uppercase tracking-widest px-1">Conceder Acesso PRO</span>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={daysToAdd}
                                onChange={(e) => setDaysToAdd(e.target.value)}
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                                placeholder="Dias"
                            />
                            <button
                                onClick={handleAddPro}
                                disabled={isUpdating}
                                className="bg-primary hover:bg-primary-hover text-[#102216] font-bold px-6 rounded-xl transition-all disabled:opacity-50"
                            >
                                {isUpdating ? '...' : 'Adicionar'}
                            </button>
                        </div>
                    </div>

                    {/* Ações Rápidas */}
                    {user.status === 'pro' && (
                        <button
                            onClick={handleRevokePro}
                            disabled={isUpdating}
                            className="w-full border border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">no_accounts</span>
                            Revogar Plano PRO
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
