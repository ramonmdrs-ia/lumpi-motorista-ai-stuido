
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';

interface GoalEntry {
  id: number;
  title: string;
  target: number;
  current: number;
  icon: string;
}

const Goals: React.FC = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<GoalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', icon: 'savings' });

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
    if (isConfigured && userId) fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('metas')
      .select('*')
      .eq('user_id', userId);
    setGoals(data || []);
    setLoading(false);
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase.from('metas').insert([{
      user_id: userId,
      title: newGoal.title,
      target: parseFloat(newGoal.target),
      current: 0,
      icon: newGoal.icon,
      color: 'bg-primary'
    }]);

    if (!error) {
      fetchGoals();
      setShowAdd(false);
      setNewGoal({ title: '', target: '', icon: 'savings' });
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto flex flex-col gap-8">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl text-white">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Metas Pessoais</h2>
          <p className="text-text-secondary text-base">Planos protegidos e acessíveis apenas pelo seu login.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary text-[#102216] font-bold shadow-lg"
        >
          <span className="material-symbols-outlined">{showAdd ? 'close' : 'add'}</span>
          <span>{showAdd ? 'Cancelar' : 'Nova Meta'}</span>
        </button>
      </section>

      {showAdd && (
        <form onSubmit={handleAddGoal} className="bg-surface-dark p-6 rounded-2xl border border-white/10 flex flex-col gap-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              required
              placeholder="Ex: Reserva de Emergência" 
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              className="bg-[#111813] border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-primary"
            />
            <input 
              required
              type="number"
              placeholder="Valor Objetivo (R$)" 
              value={newGoal.target}
              onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
              className="bg-[#111813] border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-primary"
            />
          </div>
          <button type="submit" disabled={loading} className="bg-primary text-black font-bold py-4 rounded-xl">
            {loading ? 'Salvando...' : 'Criar Meta Blindada'}
          </button>
        </form>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-surface-dark p-6 rounded-2xl border border-white/5 flex flex-col gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined">{goal.icon}</span>
              </div>
              <h3 className="font-bold">{goal.title}</h3>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${(goal.current / goal.target) * 100}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-text-secondary">
              <span>R$ {goal.current.toFixed(2)}</span>
              <span className="font-bold text-white">R$ {goal.target.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Goals;
