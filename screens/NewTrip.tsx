
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';

const NewTrip: React.FC = () => {
  const navigate = useNavigate();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured || !userId) return alert('Conexão perdida.');

    setLoading(true);
    try {
      const { error } = await supabase
        .from('entradas')
        .insert([{
            user_id: userId,
            date: formData.date,
            platform: formData.platform,
            amount: parseFloat(formData.amount.replace(',', '.')),
            trips: parseInt(formData.trips) || 0,
            km: parseFloat(formData.km.replace(',', '.')) || 0,
            hours: parseFloat(formData.hours.replace(',', '.')) || 0,
            notes: formData.notes
        }]);

      if (error) throw error;
      navigate('/trips');
    } catch (err: any) {
      alert('Erro: ' + (err.message || 'Falha ao salvar.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto flex flex-col gap-6">
      <header className="flex items-center gap-4 text-white">
        <button onClick={() => navigate(-1)}><span className="material-symbols-outlined">arrow_back</span></button>
        <h1 className="text-xl font-bold">Nova Entrada</h1>
      </header>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-text-secondary uppercase">Plataforma</label>
          <select 
            required
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl p-4 text-white outline-none"
            value={formData.platform}
            onChange={(e) => setFormData({...formData, platform: e.target.value})}
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
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
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
