import { useState, useEffect } from 'react';

export interface ProStatus {
    isPro: boolean;
    plan: 'free' | 'pro' | 'admin';
    proUntil: string | null;
    loading: boolean;
}

export const usePro = (): ProStatus => {
    const [status, setStatus] = useState<ProStatus>({
        isPro: false,
        plan: 'free',
        proUntil: null,
        loading: true
    });

    useEffect(() => {
        const checkStatus = () => {
            const userStr = localStorage.getItem('lumpi_user');
            if (!userStr) {
                setStatus(prev => ({ ...prev, loading: false }));
                return;
            }

            try {
                const user = JSON.parse(userStr);
                const plan = String(user.plano || 'free').toLowerCase();
                const proUntil = user.pro_until;

                // Admin always has PRO access
                if (plan === 'admin') {
                    setStatus({ isPro: true, plan: 'admin', proUntil: null, loading: false });
                    return;
                }

                if (plan === 'pro') {
                    // If there's an expiration date, check it
                    if (proUntil) {
                        const expiration = new Date(proUntil);
                        const now = new Date();
                        if (expiration > now) {
                            setStatus({ isPro: true, plan: 'pro', proUntil, loading: false });
                            return;
                        }
                    } else {
                        // If no expiration date but plan is 'pro', assume active
                        setStatus({ isPro: true, plan: 'pro', proUntil: null, loading: false });
                        return;
                    }
                }

                setStatus({ isPro: false, plan: 'free', proUntil: proUntil || null, loading: false });
            } catch (e) {
                console.error('Error parsing user status:', e);
                setStatus(prev => ({ ...prev, loading: false }));
            }
        };

        checkStatus();
        // Listen for storage changes (in case of plan update)
        window.addEventListener('storage', checkStatus);
        return () => window.removeEventListener('storage', checkStatus);
    }, []);

    return status;
};
