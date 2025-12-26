
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

    setLoading(true);

    try {
      // 1. Supabase Auth Login
      // Constructing email from username since we updated Register to do so
      const email = `${username.toLowerCase()}@lumpi.app`;

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) throw new Error('Credenciais inválidas.');

      if (authData.user) {
        // 2. Fetch Profile for "Bridge" Compatibility (local storage info used by screens)
        const { data: profile, error: profileError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profile) {
          // Bridge: Save to localStorage so existing screens work without refactor
          localStorage.setItem('lumpi_user', JSON.stringify({
            id: authData.user.id,
            nome: profile.nome_completo || 'Motorista',
            usuario: profile.usuario,
            email: authData.user.email // Add email to storage
          }));
          navigate('/dashboard');
        } else {
          // Profile missing? Should not happen if registered correctly.
          // Fallback
          localStorage.setItem('lumpi_user', JSON.stringify({
            id: authData.user.id,
            nome: 'Motorista',
            usuario: username,
          }));
          navigate('/dashboard');
        }
      }

    } catch (err: any) {
      setError(err.message || 'Falha na autenticação.');
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
