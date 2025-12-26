import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
}

interface ConfirmOptions {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    tone?: 'default' | 'danger';
}

interface NotificationContextType {
    showNotification: (message: string, type?: NotificationType, duration?: number) => void;
    showConfirm: (options: ConfirmOptions) => void;
    removeNotification: (id: string) => void;
    notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const showNotification = useCallback((message: string, type: NotificationType = 'info', duration = 4000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications((prev) => [...prev, { id, message, type, duration }]);

        if (duration !== Infinity) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, [removeNotification]);

    const showConfirm = useCallback((options: ConfirmOptions) => {
        setConfirmOptions(options);
    }, []);

    const handleConfirm = () => {
        if (confirmOptions) {
            confirmOptions.onConfirm();
            setConfirmOptions(null);
        }
    };

    const handleCancel = () => {
        if (confirmOptions) {
            confirmOptions.onCancel?.();
            setConfirmOptions(null);
        }
    };

    return (
        <NotificationContext.Provider value={{ showNotification, showConfirm, removeNotification, notifications }}>
            {children}
            <NotificationContainer />
            {confirmOptions && (
                <ConfirmModal
                    {...confirmOptions}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </NotificationContext.Provider>
    );
};

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed bottom-24 left-0 w-full flex flex-col items-center gap-2 z-[9999] pointer-events-none px-4">
            {notifications.map((n) => (
                <Toast key={n.id} notification={n} onDismiss={() => removeNotification(n.id)} />
            ))}
        </div>
    );
};

const ConfirmModal: React.FC<ConfirmOptions & { onConfirm: () => void; onCancel: () => void }> = ({
    title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar', tone = 'default'
}) => {
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1c2e24] w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <h3 className="text-white text-lg font-bold mb-2">{title}</h3>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${tone === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary hover:bg-primary-hover text-[#102216]'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Toast: React.FC<{ notification: Notification; onDismiss: () => void }> = ({ notification, onDismiss }) => {
    const Icon = () => {
        switch (notification.type) {
            case 'success': return <span className="material-symbols-outlined text-primary">check_circle</span>;
            case 'error': return <span className="material-symbols-outlined text-red-500">error</span>;
            case 'warning': return <span className="material-symbols-outlined text-yellow-500">warning</span>;
            default: return <span className="material-symbols-outlined text-blue-400">info</span>;
        }
    };

    return (
        <div
            className="pointer-events-auto flex items-center gap-3 bg-[#1c2e24]/90 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300 min-w-[280px] max-w-[90vw]"
            onClick={onDismiss}
        >
            <div className="shrink-0 flex items-center justify-center">
                <Icon />
            </div>
            <p className="text-white text-xs font-bold flex-1 leading-tight">{notification.message}</p>
            <button className="text-white/40 hover:text-white transition-colors ml-2">
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </div>
    );
};
