
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';
import { Badge, MetricCard, TripListItem } from '../components/DashboardComponents';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>('Motorista');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('lumpi_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user) {
          const rawName = user.nome || 'Motorista';
          setUserName(typeof rawName === 'string' ? rawName.split(' ')[0] : 'Motorista');
          setUserId(user.id ? String(user.id) : null);
        }
      } catch (e) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (isConfigured && userId) {
      fetchStats();
    }
  }, [userId]);

  const fetchStats = async () => {
    try {
      // Fetch Entradas
      const { data: entriesData, error: entriesError } = await supabase
        .from('entradas')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (entriesError) {
        console.error('Erro Entradas:', entriesError.message);
      } else if (entriesData) {
        const rev = entriesData.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);
        const km = entriesData.reduce((acc: number, curr: any) => acc + (Number(curr.km) || 0), 0);

        setTotalRevenue(rev);
        setTotalKm(km);
        setRecentEntries(entriesData.slice(0, 5));
      }

      // Fetch Despesas
      const { data: expensesData, error: expensesError } = await supabase
        .from('despesas')
        .select('*')
        .eq('user_id', userId);

      if (expensesError) {
        console.error('Erro Despesas:', expensesError.message);
      } else if (expensesData) {
        const totalExp = expensesData.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);
        setTotalExpenses(totalExp);
      }

    } catch (e: any) {
      console.error("Falha de conexão");
    }
  };

  const safeText = (val: any) => (typeof val === 'object' ? '' : String(val));
  const formatMoney = (val: number) => `R$ ${val.toFixed(2)}`;

  if (!isConfigured) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 text-white">
        <span className="material-symbols-outlined text-5xl text-yellow-500">warning</span>
        <h2 className="text-2xl font-bold">Banco não conectado</h2>
        <p className="text-text-secondary">Verifique as chaves do Supabase em supabaseClient.ts</p>
      </div>
    );
  }

  const profit = totalRevenue - totalExpenses;

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto flex flex-col gap-8 pb-32">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <Badge variant="success" icon="lock">
            Acesso Seguro
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1 text-white">
            Olá, {safeText(userName)} 👋
          </h1>
          <p className="text-text-secondary text-sm md:text-base">Bem-vindo ao seu painel financeiro.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/expenses/new')}
            className="h-12 px-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">remove</span>
            Despesa
          </button>
          <button
            onClick={() => navigate('/trips/new')}
            className="h-12 px-6 rounded-xl bg-primary text-[#102216] font-black hover:bg-primary-hover shadow-lg transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Nova Corrida
          </button>
        </div>
      </section>

      {/* Panorama do Mês Grid */}
      <section>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">ssid_chart</span>
          Panorama do Mês
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Receita Total"
            value={formatMoney(totalRevenue)}
          />
          <MetricCard
            title="Gastos Totais"
            value={formatMoney(totalExpenses)}
            textColor="text-red-400"
          />
          <MetricCard
            title="Lucro Líquido"
            value={formatMoney(profit)}
            variant="primary"
          />
          <MetricCard
            title="Distância Total"
            value={`${totalKm} km`}
            subtitle="Rodados no mês"
          />
        </div>
      </section>

      {/* Entradas Recentes */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Entradas Recentes</h3>
          <button onClick={() => navigate('/trips')} className="text-xs font-bold text-primary uppercase hover:underline">Ver Todas</button>
        </div>

        <div className="flex flex-col gap-3">
          {recentEntries.length === 0 ? (
            <div className="p-12 text-center text-text-secondary border border-dashed border-white/10 rounded-3xl">
              Nenhum registro encontrado. Comece registrando uma corrida!
            </div>
          ) : (
            recentEntries.map((item) => (
              <TripListItem
                key={item.id}
                platform={safeText(item.platform)}
                date={new Date(item.date).toLocaleDateString('pt-BR')}
                amount={formatMoney(Number(item.amount))}
                km={String(item.km)}
                trips={String(item.trips)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
