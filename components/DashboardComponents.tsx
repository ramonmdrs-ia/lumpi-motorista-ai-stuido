import React from 'react';

// --- Base Components ---

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'primary';
}

export const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
    const baseStyles = 'p-6 rounded-3xl border transition-all';
    const variants = {
        default: 'bg-surface-dark border-white/5',
        primary: 'bg-primary shadow-xl border-transparent',
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
    icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', icon }) => {
    const baseStyles = 'flex items-center gap-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest w-fit';
    const variants = {
        default: 'bg-white/10 text-text-secondary',
        success: 'bg-primary/10 text-primary',
        warning: 'bg-yellow-500/10 text-yellow-500',
        danger: 'bg-red-500/10 text-red-500',
        info: 'bg-blue-500/10 text-blue-500',
    };

    return (
        <div className={`${baseStyles} ${variants[variant]}`}>
            {icon && <span className="material-symbols-outlined text-sm font-bold">{icon}</span>}
            {children}
        </div>
    );
};

// --- Dashboard Specific ---

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    variant?: 'default' | 'primary';
    textColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, variant = 'default', textColor = 'text-white' }) => {
    return (
        <Card variant={variant} className="flex flex-col justify-between h-full">
            <p className={`text-xs font-bold uppercase tracking-wider ${variant === 'primary' ? 'text-[#102216]/60' : 'text-text-secondary'}`}>
                {title}
            </p>
            <div>
                <p className={`text-3xl font-bold tracking-tight mt-1 ${variant === 'primary' ? 'text-[#102216]' : textColor}`}>
                    {value}
                </p>
                {subtitle && (
                    <p className={`text-xs mt-1 ${variant === 'primary' ? 'text-[#102216]/80' : 'text-text-secondary'}`}>
                        {subtitle}
                    </p>
                )}
            </div>
        </Card>
    );
};

interface TripListItemProps {
    platform: string;
    date: string;
    amount: string;
    km: string;
    trips: string;
}

export const TripListItem: React.FC<TripListItemProps> = ({ platform, date, amount, km, trips }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-[#1c1c1c] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-surface-dark flex items-center justify-center text-white border border-white/10">
                    <span className="material-symbols-outlined">
                        {platform === 'Uber' ? 'local_taxi' : platform === 'iFood' ? 'delivery_dining' : 'directions_car'}
                    </span>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{platform}</h4>
                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-text-secondary">{trips} corridas</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{date} • {km} km</p>
                </div>
            </div>
            <p className="font-bold text-primary font-mono">{amount}</p>
        </div>
    );
};
