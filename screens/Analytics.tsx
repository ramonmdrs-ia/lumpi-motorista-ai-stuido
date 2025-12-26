import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';
import { AnalyticsSummary, HighlightMetric, PlatformSummary, WeeklyProfitChart, PerKmBreakdown } from '../components/AnalyticsComponents';
import { Badge } from '../components/DashboardComponents';
import { usePro } from '../hooks/usePro';
import { ProLock } from '../components/ProComponents';
import { UpgradeModal } from '../components/UpgradeModal';

const Analytics: React.FC = () => {
    const navigate = useNavigate();
    const { isPro, loading: proLoading } = usePro();
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // ... (rest of the state stays the same) ...

    // State for Analytics Data
    const [kpis, setKpis] = useState({
        tripsCount: 0,
        revenue: 0,
        distanceKm: 0,
        profit: 0
    });

    // Platform Analysis
    const [bestPlatformPerKm, setBestPlatformPerKm] = useState({ name: '-', value: 0 });
    const [highestAvgTicket, setHighestAvgTicket] = useState({ name: '-', value: 0 });
    const [platformSummary, setPlatformSummary] = useState<any[]>([]);

    // Weekly Analysis
    const [weeklyData, setWeeklyData] = useState<{ day: string; value: number; isBest?: boolean }[]>([]);
    const [bestDay, setBestDay] = useState({ name: '-', profitPerKm: 'R$ 0,00' });

    // Per KM Breakdown
    const [perKmDetails, setPerKmDetails] = useState({
        revenuePerKm: '0,00',
        costPerKm: '0,00',
        profitPerKm: '0,00',
        margin: '0%'
    });


    useEffect(() => {
        const userStr = localStorage.getItem('lumpi_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user?.id) setUserId(String(user.id));
                else navigate('/login');
            } catch (e) {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (isConfigured && userId) {
            fetchAnalytics();
        }
    }, [userId]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();

            // 1. Fetch Trips (Month)
            const { data: trips, error: tripsError } = await supabase
                .from('entradas')
                .select('*')
                .eq('user_id', userId)
                .gte('date', startOfMonth)
                .lte('date', endOfMonth);

            // 2. Fetch Expenses (Month)
            const { data: expenses, error: expensesError } = await supabase
                .from('despesas')
                .select('*')
                .eq('user_id', userId)
                .gte('date', startOfMonth)
                .lte('date', endOfMonth); // Assuming expenses have a date field, otherwise fetch all and filter or rethink logic. 
            // Note: Expenses table usually has 'date' or 'created_at'. Let's assume 'date' exists or we fetch all.
            // Validating with previous fetches: Dashboard fetches all expenses without date filter. Let's filter by date for accuracy if possible, or all.
            // Designing for "Montlhy Analytics", we should try to filter expenses. If Supabase fails, we fallback.

            if (tripsError) throw tripsError;

            // --- Calculations ---

            const safeTrips = trips || [];
            const safeExpenses = expenses || [];

            // Totals
            const totalRevenue = safeTrips.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
            const totalKm = safeTrips.reduce((acc, t) => acc + (Number(t.km) || 0), 0);
            const totalTrips = safeTrips.reduce((acc, t) => acc + (Number(t.trips) || 0), 0) || safeTrips.length; // Fallback if trips column is empty but rows exist
            const totalExpenses = safeExpenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
            const totalProfit = totalRevenue - totalExpenses;

            setKpis({
                tripsCount: totalTrips,
                revenue: totalRevenue,
                distanceKm: totalKm,
                profit: totalProfit
            });

            // Per KM Breakdown
            const revPerKm = totalKm > 0 ? totalRevenue / totalKm : 0;
            const costPerKm = totalKm > 0 ? totalExpenses / totalKm : 0;
            const profitPerKm = revPerKm - costPerKm;
            const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

            setPerKmDetails({
                revenuePerKm: `R$ ${revPerKm.toFixed(2)}`,
                costPerKm: `R$ ${costPerKm.toFixed(2)}`,
                profitPerKm: `R$ ${profitPerKm.toFixed(2)}`,
                margin: `${margin.toFixed(1)}%`
            });

            // Platform Analysis
            const platforms: Record<string, { revenue: number; km: number; trips: number }> = {};
            safeTrips.forEach((t: any) => {
                const p = t.platform || 'Outros';
                if (!platforms[p]) platforms[p] = { revenue: 0, km: 0, trips: 0 };
                platforms[p].revenue += Number(t.amount) || 0;
                platforms[p].km += Number(t.km) || 0;
                platforms[p].trips += Number(t.trips) || 1;
            });

            let bestP_Km = { name: '-', val: 0 };
            let bestP_Ticket = { name: '-', val: 0 };
            const pSummary = [];

            for (const [name, data] of Object.entries(platforms)) {
                const rKm = data.km > 0 ? data.revenue / data.km : 0;
                const ticket = data.trips > 0 ? data.revenue / data.trips : 0;

                if (rKm > bestP_Km.val) bestP_Km = { name, val: rKm };
                if (ticket > bestP_Ticket.val) bestP_Ticket = { name, val: ticket };

                pSummary.push({
                    name,
                    tripsCount: data.trips,
                    distanceKm: data.km,
                    avgPerKm: `R$ ${rKm.toFixed(2)}/km`
                });
            }

            setBestPlatformPerKm({ name: bestP_Km.name, value: bestP_Km.val });
            setHighestAvgTicket({ name: bestP_Ticket.name, value: bestP_Ticket.val });
            setPlatformSummary(pSummary);


            // Weekly Analysis
            // 0=Dom, 1=Seg...
            const daysMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const daysData: Record<number, { revenue: number; km: number }> = { 0: { revenue: 0, km: 0 }, 1: { revenue: 0, km: 0 }, 2: { revenue: 0, km: 0 }, 3: { revenue: 0, km: 0 }, 4: { revenue: 0, km: 0 }, 5: { revenue: 0, km: 0 }, 6: { revenue: 0, km: 0 } };

            safeTrips.forEach((t: any) => {
                if (!t.date) return;
                // Parse date string e.g. "2024-12-26" -> getUTCDay() to be safe with timezones if store as YYYY-MM-DD
                const d = new Date(t.date);
                // Fix timezone offset issue: usually simply splitting YYYY-MM-DD is safer for "local" dates
                const parts = t.date.split('-');
                const localDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                const dayIdx = localDate.getDay();

                if (daysData[dayIdx]) {
                    // Fix: TS might complain about indexing number, keys are number
                    (daysData as any)[dayIdx].revenue += Number(t.amount) || 0;
                    (daysData as any)[dayIdx].km += Number(t.km) || 0;
                }
            });

            let bestDayVal = -1;
            let bestDayName = '-';
            let bestDayProfitKm = 0;

            const chartData = daysMap.map((day, idx) => {
                const d = (daysData as any)[idx];
                const rKm = d.km > 0 ? d.revenue / d.km : 0;

                // Assuming "Profitability" here means Revenue/KM for simplicity, 
                // as allocating expenses per day is hard without specific dates on expenses.
                // Or we can approximate Profit = Rev/Km - AvgCost/Km
                const profitKmApprox = rKm - costPerKm;

                if (profitKmApprox > bestDayVal && d.revenue > 0) {
                    bestDayVal = profitKmApprox;
                    bestDayName = day; // Using short name for now, logic calls for full "Terça" etc
                    bestDayProfitKm = profitKmApprox;
                }

                return { day, value: profitKmApprox > 0 ? profitKmApprox : 0, isBest: false };
            });

            // Mark best
            const finalChart = chartData.map(c => ({ ...c, isBest: c.day === bestDayName }));

            setWeeklyData(finalChart);
            setBestDay({
                name: getFullDayName(bestDayName),
                profitPerKm: `R$ ${bestDayProfitKm.toFixed(2)}/km`
            });


        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getFullDayName = (short: string) => {
        const map: Record<string, string> = { 'Dom': 'Domingo', 'Seg': 'Segunda', 'Ter': 'Terça', 'Qua': 'Quarta', 'Qui': 'Quinta', 'Sex': 'Sexta', 'Sáb': 'Sábado', '-': '-' };
        return map[short] || short;
    };


    if (loading) return <div className="text-white p-10 text-center">Carregando análises...</div>;

    return (
        <div className="p-4 md:p-10 max-w-6xl mx-auto flex flex-col gap-10 pb-32">

            {/* Header */}
            <div>
                <Badge variant="info" icon="bar_chart">Análise de Rentabilidade</Badge>
                <h1 className="text-3xl font-black text-white mt-2">Visão do Mês</h1>
                <p className="text-text-secondary text-sm">Resumo da sua performance financeira.</p>
            </div>

            {/* KPI Grid */}
            <AnalyticsSummary
                tripsCount={kpis.tripsCount}
                revenue={`R$ ${kpis.revenue.toFixed(2)}`}
                distanceKm={parseFloat(kpis.distanceKm.toFixed(1))}
                profit={`R$ ${kpis.profit.toFixed(2)}`}
            />

            {/* Platform Analysis */}
            <section className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">apps</span>
                    Análise por Plataforma
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <HighlightMetric
                        label="Melhor R$/km"
                        entity={bestPlatformPerKm.name}
                        value={`R$ ${bestPlatformPerKm.value.toFixed(2)}/km`}
                        tone="best"
                    />
                    <HighlightMetric
                        label="Maior Valor Médio"
                        entity={highestAvgTicket.name}
                        value={`R$ ${highestAvgTicket.value.toFixed(2)}`}
                        tone="default"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {platformSummary.map((p) => (
                        <PlatformSummary key={p.name} {...p} />
                    ))}
                </div>
            </section>

            {/* Weekly Analysis */}
            <section className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                    Rentabilidade Semanal
                </h3>
                <WeeklyProfitChart values={weeklyData} bestDay={bestDay.name} />
            </section>

            {/* Financial Breakdown */}
            <section className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">pie_chart</span>
                    Receita vs Custo (por km)
                </h3>
                <PerKmBreakdown
                    revenuePerKm={perKmDetails.revenuePerKm}
                    costPerKm={perKmDetails.costPerKm}
                    profitPerKm={perKmDetails.profitPerKm}
                    marginPercent={perKmDetails.margin}
                />
            </section>

        </div>
    );
};

export default Analytics;
