import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export const RequireAdmin: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const check = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setIsAdmin(false);
                setChecking(false);
                return;
            }

            // Check against 'admins' table
            const { data, error } = await supabase
                .from('admins')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (data && !error) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
            setChecking(false);
        };
        check();
    }, []);

    if (checking) {
        return <div className="min-h-screen flex items-center justify-center bg-background-dark text-text-secondary">Verificando permissões...</div>;
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
