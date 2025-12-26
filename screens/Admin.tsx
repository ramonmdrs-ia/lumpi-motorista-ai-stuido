import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { AdminTabs, StatCard, FilterBar, UserRow, AdminTab, AdminUser, ManageUserModal, InviteRow, AdminInvite } from '../components/AdminComponents';
import { Badge } from '../components/DashboardComponents'; // Reuse Badge

// Fix imports: AdminTab and AdminUser are exported from AdminComponents
import type { AdminTab as AdminTabType, AdminUser as AdminUserType, UserAdminStatus, AdminInvite as AdminInviteType } from '../components/AdminComponents';
import { InviteGenerator } from '../components/InviteGenerator';
import { useNotification } from '../components/NotificationContext';

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const { showNotification, showConfirm } = useNotification();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<AdminTabType>('users');
    const [users, setUsers] = useState<AdminUserType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Stats
    const [stats, setStats] = useState({ total: 0, admin: 0, pro: 0, blocked: 0 });

    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUserType | null>(null);

    // Invites
    const [invites, setInvites] = useState<AdminInviteType[]>([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    useEffect(() => {
        const checkAdmin = () => {
            const userStr = localStorage.getItem('lumpi_user');
            if (!userStr) return navigate('/login');
            fetchUsers();
        };
        checkAdmin();
        if (activeTab === 'invites') fetchInvites();
    }, [navigate, activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('id, email, nome_completo, usuario, created_at, plano, pro_until')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Erro ao buscar usuários:', error);
            }

            if (data) {
                const mappedUsers: AdminUserType[] = data.map((u: any) => {
                    let status: any = u.plano || 'free';

                    return {
                        id: u.id,
                        email: u.email,
                        name: u.nome_completo,
                        status: status,
                        signupDate: u.created_at || new Date().toISOString(),
                        lastAccessRelative: 'Desconhecido',
                        proUntil: u.pro_until
                    };
                });

                setUsers(mappedUsers);

                setStats({
                    total: mappedUsers.length,
                    admin: mappedUsers.filter(u => u.status === 'admin').length,
                    pro: mappedUsers.filter(u => u.status === 'pro').length,
                    blocked: mappedUsers.filter(u => u.status === 'blocked').length
                });
            }

        } catch (e) {
            console.error('Exception fetching users:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePlan = async (userId: string, updates: { plano: UserAdminStatus, pro_until?: string | null }) => {
        try {
            const { error } = await supabase
                .from('usuarios')
                .update(updates)
                .eq('id', userId);

            if (error) throw error;

            // Refresh list
            await fetchUsers();
            showNotification('Usuário atualizado com sucesso!', 'success');
        } catch (err: any) {
            showNotification('Erro ao atualizar usuário: ' + err.message, 'error');
        }
    };

    const handleManageUser = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsManageModalOpen(true);
        }
    };

    const fetchInvites = async () => {
        try {
            const { data, error } = await supabase
                .from('invites')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setInvites(data);
        } catch (err) {
            console.error('Error fetching invites:', err);
        }
    };

    const handleRevokeInvite = async (id: string) => {
        showConfirm({
            title: 'Revogar Convite',
            message: 'Deseja revogar este convite permanentemente?',
            confirmText: 'Revogar',
            tone: 'danger',
            onConfirm: async () => {
                try {
                    const { error } = await supabase
                        .from('invites')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;
                    await fetchInvites();
                    showNotification('Convite revogado com sucesso.', 'success');
                } catch (err: any) {
                    showNotification('Erro ao revogar convite: ' + err.message, 'error');
                }
            }
        });
    };

    // Filtering logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

        const matchesTab = activeTab === 'users' ? true :
            activeTab === 'pro' ? user.status === 'pro' :
                true;

        return matchesSearch && matchesStatus && matchesTab;
    });

    return (
        <div className="p-4 md:p-10 max-w-6xl mx-auto flex flex-col gap-8 pb-32">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-black text-white">Administração</h1>
                <AdminTabs active={activeTab} onChange={setActiveTab} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total" value={stats.total} />
                <StatCard label="Admins" value={stats.admin} tone="warning" />
                <StatCard label="PRO" value={stats.pro} tone="success" />
                <StatCard label="Bloqueados" value={stats.blocked} tone="danger" />
            </div>

            {/* Filters & List */}
            {activeTab === 'invites' ? (
                <div className="flex flex-col gap-4 bg-[#111813] rounded-3xl p-1 border border-white/5">
                    <div className="p-4 flex justify-between items-center">
                        <h2 className="text-white font-bold">Códigos de Convite</h2>
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="bg-primary hover:bg-primary-hover text-[#102216] font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Gerar Convite
                        </button>
                    </div>

                    <div className="flex flex-col">
                        {invites.length === 0 ? (
                            <div className="p-8 text-center text-text-secondary">Nenhum convite criado ainda.</div>
                        ) : (
                            invites.map(invite => (
                                <InviteRow key={invite.id} invite={invite} onRevoke={handleRevokeInvite} />
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4 bg-[#111813] rounded-3xl p-1 border border-white/5">
                    <div className="p-4">
                        <FilterBar
                            onRefresh={fetchUsers}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                        />
                    </div>

                    <div className="flex flex-col">
                        {loading ? (
                            <div className="p-8 text-center text-text-secondary">Carregando usuários...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-8 text-center text-text-secondary">Nenhum usuário encontrado.</div>
                        ) : (
                            filteredUsers.map(user => (
                                <UserRow key={user.id} user={user} onManage={() => handleManageUser(user.id)} />
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Management Modal */}
            <ManageUserModal
                isOpen={isManageModalOpen}
                user={selectedUser}
                onClose={() => setIsManageModalOpen(false)}
                onUpdate={handleUpdatePlan}
            />

            {/* Invite Generator Modal */}
            <InviteGenerator
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={fetchInvites}
            />
        </div>
    );
};

export default Admin;
