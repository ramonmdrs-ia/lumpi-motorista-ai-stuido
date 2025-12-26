
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';
import { useNotification } from '../components/NotificationContext';

const NewTrip: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    platform: '',
    amount: '',
    trips: '',
    km: '',
    hours: '',
    notes: ''
  });

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
    if (id && userId) {
      fetchTripDetails();
    }
  }, [id, userId]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('entradas')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single(); // Garante que só pegue um e que seja do usuário

      if (error) throw error;
      if (data) {
        setFormData({
          date: data.date,
          platform: data.platform,
          amount: String(data.amount).replace('.', ','),
          trips: String(data.trips),
          km: String(data.km).replace('.', ','),
          hours: String(data.hours).replace('.', ','),
          notes: data.notes || ''
        });
      }
    } catch (error) {
      console.error(error);
      showNotification('Erro ao carregar dados da viagem.', 'error');
      navigate('/trips');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured || !userId) {
      showNotification('Conexão perdida.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: userId,
        date: formData.date,
        platform: formData.platform,
        amount: parseFloat(formData.amount.replace('.', '').replace(',', '.')),
        trips: parseInt(formData.trips) || 0,
        km: parseFloat(formData.km.replace('.', '').replace(',', '.')) || 0,
        hours: parseFloat(formData.hours.replace('.', '').replace(',', '.')) || 0,
        notes: formData.notes
      };

      let error;

      if (id) {
        // UPDATE
        const { error: updateError } = await supabase
          .from('entradas')
          .update(payload)
          .eq('id', id)
          .eq('user_id', userId);
        error = updateError;
      } else {
        // INSERT
        const { error: insertError } = await supabase
          .from('entradas')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;
      showNotification(id ? 'Entrada atualizada!' : 'Entrada registrada!', 'success');
      navigate('/trips');
    } catch (err: any) {
      showNotification('Erro: ' + (err.message || 'Falha ao salvar.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const gainPerKm = React.useMemo(() => {
    const amountVal = parseFloat(formData.amount.replace('.', '').replace(',', '.')) || 0;
    const kmVal = parseFloat(formData.km.replace('.', '').replace(',', '.')) || 0;
    if (kmVal === 0) return 0;
    return amountVal / kmVal;
  }, [formData.amount, formData.km]);

  return (
    <div className="p-6 max-w-xl mx-auto flex flex-col gap-6">
      <header className="flex items-center gap-4 text-white">
        <button onClick={() => navigate(-1)}><span className="material-symbols-outlined">arrow_back</span></button>
        <h1 className="text-xl font-bold">{id ? 'Editar Entrada' : 'Nova Entrada'}</h1>
      </header>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-text-secondary uppercase">Plataforma</label>
          <select
            required
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl p-4 text-white outline-none"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="Uber">Uber</option>
            <option value="99">99</option>
            <option value="iFood">iFood</option>
            <option value="Indriver">Indriver</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-text-secondary uppercase">Valor (R$)</label>
          <input
            type="text" required placeholder="0,00"
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl p-4 text-white font-mono text-xl"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-secondary uppercase">Qtd Corridas</label>
            <input
              type="number" placeholder="0"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl p-4 text-white font-mono text-lg"
              value={formData.trips}
              onChange={(e) => setFormData({ ...formData, trips: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-secondary uppercase">Horas trab.</label>
            <input
              type="text" placeholder="0"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl p-4 text-white font-mono text-lg"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-text-secondary uppercase">KM Rodado</label>
          <input
            type="text" placeholder="0,0"
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl p-4 text-white font-mono text-lg"
            value={formData.km}
            onChange={(e) => setFormData({ ...formData, km: e.target.value })}
          />
        </div>

        {/* Ganho por KM Display */}
        <div className="bg-surface-dark p-4 rounded-xl border border-white/10 flex items-center justify-between">
          <span className="text-xs font-bold text-text-secondary uppercase">Ganho por KM</span>
          <span className={`font-mono font-bold text-xl ${gainPerKm > 2 ? 'text-green-400' : 'text-white'}`}>
            R$ {gainPerKm.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / km
          </span>
        </div>

        <button
          disabled={loading}
          className="mt-4 w-full h-14 bg-primary text-[#102216] font-black rounded-2xl shadow-lg"
        >
          {loading ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </form>
    </div>
  );
};

export default NewTrip;
