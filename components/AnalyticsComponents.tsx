import React from 'react';
import { Card } from './DashboardComponents';

// --- Tokens (Visual Simulation) ---
// In a real setup these would be class utility abstractions, but here we enforce via classes
const COLORS = {
    revenue: 'text-white',
    cost: 'text-red-400',
    profit: 'text-primary',
    best: 'text-yellow-400'
};

// --- Components ---

interface AnalyticsSummaryProps {
    tripsCount: number;
    revenue: string;
    distanceKm: number;
    profit: string;
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ tripsCount, revenue, distanceKm, profit }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="flex flex-col gap-1 p-4 bg-surface-dark border-white/5">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Corridas/Mês</span>
                <span className="text-xl font-bold text-white">{tripsCount}</span>
            </Card>
            <Card className="flex flex-col gap-1 p-4 bg-surface-dark border-white/5">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Receita</span>
                <span className="text-xl font-bold text-white">{revenue}</span>
            </Card>
            <Card className="flex flex-col gap-1 p-4 bg-surface-dark border-white/5">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Distância</span>
                <span className="text-xl font-bold text-white">{distanceKm} km</span>
            </Card>
            <Card className="flex flex-col gap-1 p-4 bg-primary/10 border-primary/20">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Lucro</span>
                <span className="text-xl font-bold text-primary">{profit}</span>
            </Card>
        </div>
    );
};

interface HighlightMetricProps {
    label: string;
    entity: string;
    value: string;
    tone?: 'default' | 'best' | 'warning';
}

export const HighlightMetric: React.FC<HighlightMetricProps> = ({ label, entity, value, tone = 'default' }) => {
    const toneColor = tone === 'best' ? 'text-yellow-400' : 'text-primary';

    return (
        <div className="flex flex-col gap-1 p-4 bg-[#1c1c1c] rounded-2xl border border-white/5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${tone === 'best' ? 'text-yellow-500/80' : 'text-text-secondary'}`}>
                {label}
            </span>
            <div className="flex items-end gap-2 mt-1">
                <span className="text-sm font-bold text-white">{entity}</span>
                <div className="h-4 w-px bg-white/10 mx-1"></div>
                <span className={`text-lg font-bold ${toneColor}`}>{value}</span>
            </div>
        </div>
    );
};

interface PlatformSummaryProps {
    name: string;
    tripsCount: number;
    distanceKm: number;
    avgPerKm: string;
}

export const PlatformSummary: React.FC<PlatformSummaryProps> = ({ name, tripsCount, distanceKm, avgPerKm }) => {
    return (
        <Card className="flex flex-col justify-between gap-4 border-l-4 border-l-primary">
            <div>
                <h4 className="text-xl font-black text-white">{name}</h4>
                <p className="text-xs text-text-secondary mt-1">
                    {tripsCount} corridas • {distanceKm.toFixed(1)} km
                </p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white bg-white/10 px-2 py-1 rounded">
                    {avgPerKm} média
                </span>
            </div>
        </Card>
    );
};

interface WeeklyProfitChartProps {
    values: { day: string; value: number; isBest?: boolean }[];
    bestDay: string;
}

export const WeeklyProfitChart: React.FC<WeeklyProfitChartProps> = ({ values, bestDay }) => {
    const maxVal = Math.max(...values.map(v => v.value), 1); // Avoid div by zero

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-2 h-32 px-2">
                {values.map((v) => (
                    <div key={v.day} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                        <div
                            className={`w-full rounded-t-lg transition-all relative group-hover:brightness-110 ${v.isBest ? 'bg-yellow-400' : 'bg-white/10'}`}
                            style={{ height: `${(v.value / maxVal) * 100}%` }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                                R$ {v.value.toFixed(2)}/km
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold ${v.isBest ? 'text-yellow-400' : 'text-text-secondary'}`}>
                            {v.day}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-[#1c1c1c] rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Melhor Dia da Semana</span>
                <span className="text-xl font-black text-white mt-1 uppercase">{bestDay}</span>
            </div>
        </div>
    );
};

interface PerKmBreakdownProps {
    revenuePerKm: string;
    costPerKm: string;
    profitPerKm: string;
    marginPercent: string;
}

export const PerKmBreakdown: React.FC<PerKmBreakdownProps> = ({ revenuePerKm, costPerKm, profitPerKm, marginPercent }) => {
    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-[#1c1c1c] rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-text-secondary uppercase">Receita/km</span>
                <p className="text-lg font-bold text-white mt-1">{revenuePerKm}</p>
            </div>
            <div className="p-4 bg-[#1c1c1c] rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-text-secondary uppercase">Custo/km</span>
                <p className="text-lg font-bold text-red-400 mt-1">{costPerKm}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 col-span-2 flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold text-primary uppercase">Lucro/km</span>
                    <p className="text-2xl font-black text-primary mt-1">{profitPerKm}</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-primary/60 uppercase">Margem</span>
                    <p className="text-lg font-bold text-primary mt-1">{marginPercent}</p>
                </div>
            </div>
        </div>
    );
};
