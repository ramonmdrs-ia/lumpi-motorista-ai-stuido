
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>('Motorista');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('lumpi_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user) {
          // Garante que userName nunca seja um objeto
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
      const { data, error } = await supabase
        .from('entradas')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro:', error.message);
      } else if (data) {
        const total = data.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);
        setTotalRevenue(total);
        setRecentEntries(data.slice(0, 5));
      }
    } catch (e: any) {
      console.error("Falha de conexão");
    }
  };

  // Helper para renderizar texto com segurança contra [object Object]
  const safeText = (val: any) => (typeof val === 'object' ? '' : String(val));

  if (!isConfigured) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 text-white">
        <span className="material-symbols-outlined text-5xl text-yellow-500">warning</span>
        <h2 className="text-2xl font-bold">Banco não conectado</h2>
        <p className="text-text-secondary">Verifique as chaves do Supabase em supabaseClient.ts</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto flex flex-col gap-8">
      <section className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest bg-primary/10 w-fit px-2 py-1 rounded">
            <span className="material-symbols-outlined text-sm font-bold">lock</span>
            Acesso Seguro
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1 text-white">
            Olá, {safeText(userName)} 👋
          </h1>
          <p className="text-text-secondary text-sm md:text-base">Bem-vindo ao seu painel financeiro.</p>
        </div>
        <button 
          onClick={() => navigate('/trips/new')}
          className="flex items-center justify-center gap-2 rounded-2xl h-14 px-8 bg-primary text-[#102216] text-sm font-black shadow-lg transition-all"
        >
          <span className="material-symbols-outlined font-bold">add</span>
          <span>Registrar Ganho</span>
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-dark p-6 rounded-3xl border border-white/5">
          <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Ganhos</p>
          <p className="text-white text-3xl font-bold tracking-tight mt-1">R$ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-surface-dark p-6 rounded-3xl border border-white/5">
          <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Gastos</p>
          <p className="text-white text-3xl font-bold tracking-tight mt-1">R$ 0,00</p>
        </div>
        <div className="bg-primary p-6 rounded-3xl shadow-xl">
          <p className="text-[#102216]/60 text-xs font-bold uppercase tracking-wider">Saldo Total</p>
          <p className="text-[#102216] text-3xl font-black tracking-tighter mt-1">R$ {totalRevenue.toFixed(2)}</p>
        </div>
      </section>

      <div className="flex flex-col rounded-3xl bg-surface-dark border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">Atividade Recente</h3>
          <button onClick={() => navigate('/trips')} className="text-xs font-bold text-primary uppercase">Ver Tudo</button>
        </div>
        <div className="flex flex-col divide-y divide-white/5">
          {recentEntries.length === 0 ? (
            <div className="p-12 text-center text-text-secondary">Nenhum registro encontrado.</div>
          ) : (
            recentEntries.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-black/40 flex items-center justify-center text-white border border-white/10">
                    <span className="material-symbols-outlined text-sm">directions_car</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{safeText(item.platform)}</p>
                    <p className="text-xs text-text-secondary">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <span className="text-sm font-black text-primary">R$ {Number(item.amount).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
