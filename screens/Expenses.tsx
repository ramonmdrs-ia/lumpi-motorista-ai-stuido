
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';

interface ExpenseEntry {
  id: number;
  title: string;
  category: string;
  amount: number;
  date: string;
}

const Expenses: React.FC = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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
      fetchExpenses();
    }
  }, [userId]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // FILTRO LGPD: Somente despesas do usuário logado
      const { data, error } = await supabase
        .from('despesas')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) console.error(error);
      else setExpenses(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  if (!isConfigured) {
    return (
      <div className="p-10 text-center flex flex-col items-center gap-4 text-white">
        <span className="material-symbols-outlined text-yellow-500 text-5xl">warning</span>
        <h2 className="text-xl font-bold">Segurança Exigida</h2>
        <p className="text-text-secondary">Conecte o banco de dados para ver suas despesas protegidas.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">Saídas</h1>
          <p className="text-text-secondary text-sm md:text-base font-medium">
            Total Pessoal: <span className="text-white font-bold">R$ {totalAmount.toFixed(2)}</span>
          </p>
        </div>
        <button 
          onClick={() => navigate('/expenses/new')}
          className="flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-[#111813] text-sm font-bold rounded-lg shadow-lg transition-all"
        >
          <span className="material-symbols-outlined text-lg font-bold">add</span>
          <span>Registrar Gasto</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 pb-24">
        {loading ? (
          <div className="flex justify-center py-20"><span className="animate-spin material-symbols-outlined text-primary text-4xl">sync</span></div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 border border-dashed border-white/10 rounded-3xl">
            <span className="material-symbols-outlined text-4xl text-text-secondary">payments</span>
            <p className="text-text-secondary text-sm">Nenhum gasto registrado ainda.</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    {expense.category === 'Combustível' ? 'local_gas_station' : 
                     expense.category === 'Manutenção' ? 'build' : 'receipt_long'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{expense.title}</h4>
                  <p className="text-xs text-text-secondary">{new Date(expense.date).toLocaleDateString('pt-BR')} • {expense.category}</p>
                </div>
              </div>
              <p className="text-red-400 font-bold font-mono">- R$ {Number(expense.amount).toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Expenses;
