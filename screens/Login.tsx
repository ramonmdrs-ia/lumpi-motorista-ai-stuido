
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isConfigured) {
      setError('Verifique sua conexão com o banco.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: fetchError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', username.toLowerCase())
        .single();

      if (fetchError) {
        setError('Usuário não encontrado ou erro de acesso.');
        setLoading(false);
        return;
      }

      if (data && data.senha === password) {
        localStorage.setItem('lumpi_user', JSON.stringify({
          id: data.id,
          nome: String(data.nome_completo || 'Motorista'),
          usuario: String(data.usuario)
        }));
        navigate('/dashboard');
      } else {
        setError('Senha incorreta.');
      }
    } catch (err: any) {
      setError('Falha na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background-dark min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-10">
          <h1 className="text-white text-4xl font-black tracking-tighter">Lumpi</h1>
          <p className="text-text-secondary text-sm mt-2 font-medium">Gestão inteligente para motoristas.</p>
        </div>

        <div className="bg-surface-dark border border-white/5 rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-2xl text-xs font-bold text-center">
                {String(error)}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-white text-xs font-bold uppercase tracking-widest">Usuário</span>
              <input 
                className="w-full rounded-2xl bg-black/20 border border-white/10 text-white p-4 outline-none focus:border-primary" 
                placeholder="Seu login" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-white text-xs font-bold uppercase tracking-widest">Senha</span>
              <input 
                className="w-full rounded-2xl bg-black/20 border border-white/10 text-white p-4 outline-none focus:border-primary" 
                placeholder="••••" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              disabled={loading}
              className="mt-4 w-full bg-primary hover:bg-primary-hover text-[#102216] font-black py-4 rounded-2xl transition-all shadow-lg"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-text-secondary mr-2">Não tem conta?</span>
            <Link to="/register" className="text-white font-bold underline">Cadastre-se</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
