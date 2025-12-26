
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';
import { usePro } from '../hooks/usePro';
import { UpgradeModal } from '../components/UpgradeModal';

interface Entry {
  id: number;
  platform: string;
  date: string;
  amount: number;
  trips: number;
  km: number;
  hours: number;
  notes: string;
}

const Trips: React.FC = () => {
  const navigate = useNavigate();
  const { isPro, loading: proLoading } = usePro();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleExport = (format: 'csv' | 'pdf') => {
    if (!isPro) {
      setShowUpgrade(true);
      return;
    }
    alert(`Exportando relatório em ${format.toUpperCase()}... (Em breve)`);
  };

  useEffect(() => {
    const userStr = localStorage.getItem('lumpi_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (isConfigured && userId) {
      fetchEntries();
    }
  }, [userId]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      // FILTRO LGPD: Somente entradas do usuário logado
      const { data, error } = await supabase
        .from('entradas')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro Supabase:', error.message);
      } else {
        setEntries(data || []);
      }
    } catch (e: any) {
      console.error('Erro inesperado:', e.message || e);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return d.toLocaleDateString('pt-BR', options);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro permanentemente?")) return;

    try {
      const { error } = await supabase
        .from('entradas')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      setEntries(entries.filter(e => e.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir registro.");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  };

  const totalAmount = entries.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalTrips = entries.reduce((acc, curr) => acc + (Number(curr.trips) || 0), 0);
  const totalKm = entries.reduce((acc, curr) => acc + (Number(curr.km) || 0), 0);

  if (!isConfigured) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <div className="size-20 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl">warning</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 text-white">Configuração Necessária</h2>
          <p className="text-text-secondary">O banco de dados não está respondendo. Verifique sua conexão.</p>
        </div>
      </div>
    );
  }

  if (proLoading) return <div className="p-10 text-center text-white text-sm">Validando acesso...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black text-white">Minhas Entradas</h1>
          <p className="text-text-secondary text-xs uppercase font-bold tracking-widest">Registros Seguros</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="bg-white/5 hover:bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 border border-white/5"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Exportar
          </button>
        </div>
      </div>

      <section className="grid grid-cols-3 gap-3">
        <div className="bg-[#1c1c1c] p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
          <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Total</p>
          <p className="text-lg md:text-xl font-bold text-primary">R$ {totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-[#1c1c1c] p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
          <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Viagens</p>
          <p className="text-lg md:text-xl font-bold text-white">{totalTrips}</p>
        </div>
        <div className="bg-[#1c1c1c] p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
          <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Km</p>
          <p className="text-lg md:text-xl font-bold text-white">{totalKm.toFixed(1)}</p>
        </div>
      </section>

      <section className="flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-[#102216]">Histórico Completo</span>
        </div>
        <button onClick={fetchEntries} className="p-2 text-white/70 hover:text-white transition-colors">
          <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>sync</span>
        </button>
      </section>

      <div className="flex flex-col gap-3 pb-24">
        {loading ? (
          <div className="flex justify-center py-20"><span className="animate-spin material-symbols-outlined text-primary text-4xl">sync</span></div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 border border-dashed border-white/10 rounded-3xl">
            <span className="material-symbols-outlined text-4xl text-text-secondary">inventory_2</span>
            <p className="text-text-secondary text-sm">Nenhum registro encontrado no seu perfil.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 transition-colors hover:border-white/10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="bg-[#1c3a2a] text-[#13ec5b] px-3 py-1 rounded-full text-[10px] font-bold uppercase">{entry.platform}</span>
                  <span className="text-xs text-text-secondary capitalize">{formatDate(entry.date)} • {getDayName(entry.date)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-primary font-bold text-lg leading-none">R$ {Number(entry.amount).toFixed(2)}</p>
                  <p className={`text-[10px] font-mono font-bold ${(Number(entry.amount) / Number(entry.km)) > 2 ? 'text-green-400' : 'text-text-secondary/50'}`}>
                    {Number(entry.km) > 0 ? `R$ ${(Number(entry.amount) / Number(entry.km)).toFixed(2)} /km` : '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-text-secondary mt-1 justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">tag</span><span className="text-xs">{entry.trips}</span></div>
                  <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">speed</span><span className="text-xs">{entry.km}</span></div>
                  <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span><span className="text-xs">{entry.hours}h</span></div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/trips/edit/${entry.id}`)}
                    className="p-2 rounded-full hover:bg-white/5 text-text-secondary hover:text-white transition-colors"
                    title="Editar"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 rounded-full hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors"
                    title="Excluir"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button onClick={() => navigate('/trips/new')} className="fixed bottom-24 right-6 size-14 bg-primary text-[#102216] rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-all z-50 hover:scale-110 active:scale-95">
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={() => navigate('/subscription')}
      />
    </div>
  );
};

export default Trips;
