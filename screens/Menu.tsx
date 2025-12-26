
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('lumpi_user');
    if (userStr) setUser(JSON.parse(userStr));
    else navigate('/login');
  }, [navigate]);

  const exportUserData = async () => {
    if (!user) return;
    try {
      // Coleta dados APENAS do usuário logado (Princípio de Minimização LGPD)
      const [entradas, despesas, metas] = await Promise.all([
        supabase.from('entradas').select('*').eq('user_id', user.id),
        supabase.from('despesas').select('*').eq('user_id', user.id),
        supabase.from('metas').select('*').eq('user_id', user.id)
      ]);

      const fullData = {
        proprietario: user.nome,
        exportado_em: new Date().toISOString(),
        lgpd_status: "Conforme",
        relatorio: {
          entradas: entradas.data,
          despesas: despesas.data,
          metas: metas.data
        }
      };

      const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meus-dados-lumpi-${user.usuario}.json`;
      link.click();
      alert('Relatório de Portabilidade gerado com sucesso!');
    } catch (e) {
      alert('Erro ao exportar dados.');
    }
  };

  const handleDeleteAllData = async () => {
    if (!user) return;
    const confirm = window.confirm("DIREITO AO ESQUECIMENTO: Isso excluirá todos os seus dados pessoais e financeiros permanentemente. Deseja continuar?");
    if (!confirm) return;

    setIsDeleting(true);
    try {
      // Exclusão real baseada no user_id (Direito de Exclusão LGPD)
      await Promise.all([
        supabase.from('entradas').delete().eq('user_id', user.id),
        supabase.from('despesas').delete().eq('user_id', user.id),
        supabase.from('metas').delete().eq('user_id', user.id),
        supabase.from('manutencao').delete().eq('user_id', user.id),
        supabase.from('usuarios').delete().eq('id', user.id)
      ]);

      localStorage.removeItem('lumpi_user');
      alert('Seus dados foram excluídos com sucesso. Lamentamos sua partida.');
      navigate('/login');
    } catch (e) {
      alert('Erro ao processar exclusão. Tente novamente mais tarde.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-full bg-background-dark text-white">
      <main className="flex-1 flex flex-col gap-6 px-5 py-8 w-full max-w-[520px]">
        <section className="flex items-center gap-4 p-5 rounded-3xl bg-surface-dark border border-white/5 shadow-xl">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
            <span className="material-symbols-outlined text-4xl">account_circle</span>
          </div>
          <div className="flex flex-col flex-1">
            <h2 className="text-lg font-bold leading-tight truncate">{user?.nome || 'Motorista'}</h2>
            <p className="text-xs text-text-secondary mt-0.5">Sessão Segura • LGPD Ativa</p>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-[10px] font-bold text-text-secondary mb-1 uppercase tracking-[0.2em] px-2">Privacidade e Dados</h3>
          <div className="bg-surface-dark/50 rounded-3xl border border-white/5 overflow-hidden">
            <button
              onClick={exportUserData}
              className="w-full flex items-center gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined">download</span>
              </div>
              <span className="text-sm font-semibold flex-1">Portabilidade (Exportar Meus Dados)</span>
              <span className="material-symbols-outlined text-white/20">chevron_right</span>
            </button>
            <button
              onClick={handleDeleteAllData}
              disabled={isDeleting}
              className="w-full flex items-center gap-4 p-4 hover:bg-red-500/5 transition-all text-left text-red-400"
            >
              <div className="flex items-center justify-center size-10 rounded-xl bg-red-500/10">
                <span className="material-symbols-outlined">delete_forever</span>
              </div>
              <span className="text-sm font-semibold flex-1">Excluir Minha Conta e Meus Dados</span>
              <span className="material-symbols-outlined text-white/20">chevron_right</span>
            </button>
          </div>
        </section>

        <section className="mt-4 flex flex-col gap-4">
          <button 
            onClick={() => { localStorage.removeItem('lumpi_user'); navigate('/login'); }}
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            Encerrar Sessão
          </button>
        </section>
      </main>
    </div>
  );
};

export default Menu;
