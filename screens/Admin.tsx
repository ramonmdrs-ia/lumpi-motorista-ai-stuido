import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { AdminTabs, StatCard, FilterBar, UserRow, AdminTab, AdminUser } from '../components/AdminComponents'; // Import types directly? or from file? Adjust imports.
import { Badge } from '../components/DashboardComponents'; // Reuse Badge

// Fix imports: AdminTab and AdminUser are exported from AdminComponents
import type { AdminTab as AdminTabType, AdminUser as AdminUserType } from '../components/AdminComponents';

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<AdminTabType>('users');
    const [users, setUsers] = useState<AdminUserType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Stats
    const [stats, setStats] = useState({ total: 0, admin: 0, pro: 0, blocked: 0 });

    useEffect(() => {
        const checkAdmin = () => {
            const userStr = localStorage.getItem('lumpi_user');
            if (!userStr) return navigate('/login');
            // Logic to check if user is admin would go here. 
            // For now we assume access if they reached here via "Admin" menu which we'll conditionally show? 
            // Or we just fetch data and if it fails (Row Level Security), we show error.
            fetchUsers();
        };
        checkAdmin();
    }, [navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Fetch all users. Note: This requires RLS allowing 'select' on 'usuarios' for this user.
            // If it fails with 403, we know RLS is working and blocking non-admins.
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Erro ao buscar usuários:', error);
                // alert('Acesso negado ou erro ao buscar dados.'); 
                // Don't alert immediately, user might just be testing RLS.
            }

            if (data) {
                // Map to AdminUser interface
                const mappedUsers: AdminUserType[] = data.map((u: any) => {
                    // Determine status logic (placeholder logic based on mock data fields if they differ)
                    let status: any = 'free';
                    if (u.role === 'admin') status = 'admin';
                    else if (u.is_pro || (u.plano && u.plano !== 'free')) status = 'pro';

                    return {
                        id: u.id,
                        email: u.email,
                        name: u.nome,
                        status: status,
                        signupDate: u.created_at || new Date().toISOString(),
                        lastAccessRelative: 'Desconhecido', // Need a 'last_sign_in_at' or similar from auth or tracker
                        proUntil: u.pro_until // Assuming column exists or null
                    };
                });

                setUsers(mappedUsers);

                // Calculate Stats
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

    // Filtering
    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

        // Simplify tab filtering: 'users' shows all? 'pro' shows only pro?
        // Design says: Tabs at top "Usuarios · PRO · ...". 
        // If tab is PRO, implies filtering by PRO.
        // Let's make Tabs act as a pre-filter or different view mode.
        // For now, let's say 'PRO' tab acts like statusFilter='pro'.

        const matchesTab = activeTab === 'users' ? true :
            activeTab === 'pro' ? user.status === 'pro' :
                true; // Invites/Logs unimplemented

        return matchesSearch && matchesStatus && matchesTab;
    });

    const handleManageUser = (id: string) => {
        // Placeholder for managing user
        const u = users.find(u => u.id === id);
        if (u) alert(`Gerenciar usuário: ${u.email}\nID: ${u.id}`);
    };

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
                            <UserRow key={user.id} user={user} onManage={handleManageUser} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
