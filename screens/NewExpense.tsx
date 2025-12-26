
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';
import { useNotification } from '../components/NotificationContext';

const NewExpense: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const today = new Date().toISOString().split('T')[0];
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: today,
    title: '',
    category: '',
    amount: '',
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
    if (!isConfigured || !userId) {
      showNotification('Sessão inválida ou banco não configurado.', 'error');
      return;
    }

    setLoading(true);
    try {
      const amountVal = parseFloat(formData.amount.replace(',', '.')) || 0;
      const { error } = await supabase
        .from('despesas')
        .insert([{
          user_id: userId, // Vínculo LGPD
          date: formData.date,
          title: formData.title,
          category: formData.category,
          amount: amountVal,
          notes: formData.notes
        }]);

      if (error) {
        showNotification('Erro ao salvar despesa: ' + error.message, 'error');
        setLoading(false);
        return;
      }

      showNotification('Despesa salva com sucesso!', 'success');
      navigate('/expenses');
    } catch (err: any) {
      showNotification('Erro inesperado: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-background-dark text-white">
      <header className="flex items-center p-6 gap-4 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold">Nova Saída</h1>
      </header>

      <form className="p-6 flex flex-col gap-6 max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-red-400">security</span>
          <p className="text-[11px] text-text-secondary leading-tight">
            <strong>Privacidade Financeira:</strong> Conforme a LGPD, seus gastos são monitorados apenas para seu controle pessoal e não são compartilhados.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Data *</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">O que foi pago? *</label>
          <input
            type="text"
            required
            placeholder="Ex: Combustível, Troca de Óleo"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Categoria *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-red-500"
          >
            <option value="">Selecione...</option>
            <option value="Combustível">Combustível</option>
            <option value="Manutenção">Manutenção</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Seguro">Seguro</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Valor Pago (R$) *</label>
          <input
            type="text"
            required
            placeholder="0,00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-red-500 font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 w-full h-14 ${loading ? 'opacity-50' : 'bg-red-500 hover:bg-red-600'} text-white font-black rounded-2xl transition-all shadow-lg`}
        >
          {loading ? 'Salvando com Segurança...' : 'Salvar Despesa'}
        </button>
      </form>
    </div>
  );
};

export default NewExpense;
