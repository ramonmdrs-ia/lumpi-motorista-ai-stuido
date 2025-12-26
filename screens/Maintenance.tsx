
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';

const Maintenance: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'Troca de Óleo',
    amount: '',
    date: new Date().toISOString().split('T')[0]
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

  const handleSaveMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured || !userId) return alert("Sessão expirada ou erro de configuração.");
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('manutencao')
        .insert([{
          user_id: userId,
          type: formData.type,
          cost: parseFloat(formData.amount.replace(',', '.')),
          date: formData.date,
          odometer: 0 
        }]);

      if (error) throw error;
      alert("Manutenção registrada com segurança!");
      setFormData({ ...formData, amount: '' });
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2 text-white">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold leading-tight">Saúde do Veículo</h2>
          <p className="text-text-secondary text-sm">Dados privados vinculados ao seu perfil.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#1c2e24] p-6 rounded-xl border border-[#28392e] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <span className="material-symbols-outlined">add_task</span>
            </div>
            <h3 className="text-lg font-bold text-white">Registro Rápido</h3>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSaveMaintenance}>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1 uppercase">Serviço</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-[#111813] border border-[#3b5443] rounded-lg px-3 py-3 text-white text-sm outline-none"
              >
                <option>Troca de Óleo</option>
                <option>Abastecimento</option>
                <option>Pneus</option>
                <option>Freios</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1 uppercase">Custo (R$)</label>
                <input 
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-[#111813] border border-[#3b5443] rounded-lg px-3 py-3 text-white text-sm outline-none" 
                  placeholder="0,00" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1 uppercase">Data</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-[#111813] border border-[#3b5443] rounded-lg px-3 py-3 text-white text-sm outline-none" 
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-primary hover:bg-primary-hover text-[#102216] font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">save</span>
              {loading ? 'Sincronizando...' : 'Salvar no Perfil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
