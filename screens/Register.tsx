
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isConfigured) {
      setError('Banco de dados não configurado.');
      return;
    }

    if (!consent) {
      setError('Você deve aceitar os termos para continuar.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create User in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${formData.username.toLowerCase()}@lumpi.app`, // Fake email for username-based login if needed, or ask user for email. 
        // Wait, the form asks for "Login/Usuário", not Email. Supabase Auth needs Email.
        // I should stick to the current form or append a domain if I want to keep "username" login.
        // Let's assume we change the form to ask for Email or use a fake domain. 
        // The previous code used 'usuario' column. The Register form has 'username'.
        // To properly migrate, I should probably ask for Email.
        // However, to minimise UI changes, I'll construct an email: username@lumpi.app
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            username: formData.username.toLowerCase()
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create Public Profile linked to Auth ID
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert([
            {
              id: authData.user.id, // THE LINK
              nome_completo: formData.name,
              usuario: formData.username.toLowerCase(),
              // We don't store password here anymore!
              // LGPD Columns (if they exist, otherwise this might fail if I add them blindly. 
              // Safer to stick to basics unless confirmed).
              // 'termos_aceitos': consent, 
              // 'data_aceite_termos': new Date().toISOString()
            }
          ]);

        if (profileError) {
          // Rollback? Hard to rollback Auth. Just warn.
          console.error("Profile creation failed", profileError);
          throw new Error("Conta criada, mas erro ao salvar perfil.");
        }

        alert('Conta criada com sucesso!');
        navigate('/login');
      }

    } catch (err: any) {
      const msg = err?.message || String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background-dark min-h-screen flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-[480px]">
        <div className="flex flex-col items-center mb-8 gap-3 text-center">
          <div className="size-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-4xl font-bold">person_add</span>
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Criar Conta</h1>
          <p className="text-text-secondary text-sm font-medium">Cadastre-se para começar a gerenciar seus ganhos.</p>
        </div>

        <div className="bg-surface-dark border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 flex flex-col gap-6">
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl text-sm font-medium flex items-start gap-3">
                  <span className="material-symbols-outlined text-lg">error</span>
                  <span>{String(error)}</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <span className="text-white text-xs font-bold uppercase tracking-widest">Nome Completo</span>
                <input
                  className="w-full rounded-2xl bg-black/20 border border-white/10 text-white p-4 outline-none focus:border-primary"
                  placeholder="Seu nome"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-white text-xs font-bold uppercase tracking-widest">Login / Usuário</span>
                <input
                  className="w-full rounded-2xl bg-black/20 border border-white/10 text-white p-4 outline-none focus:border-primary"
                  placeholder="Ex: marcos_uber"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Senha</span>
                  <input
                    className="w-full rounded-2xl bg-black/20 border border-white/10 text-white p-4 outline-none focus:border-primary"
                    placeholder="••••"
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Repetir</span>
                  <input
                    className="w-full rounded-2xl bg-black/20 border border-white/10 text-white p-4 outline-none focus:border-primary"
                    placeholder="••••"
                    required
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl cursor-pointer" onClick={() => setConsent(!consent)}>
                <div className={`shrink-0 size-6 rounded-md border-2 flex items-center justify-center ${consent ? 'bg-primary border-primary text-[#102216]' : 'border-white/20'}`}>
                  {consent && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Aceito que meus dados sejam armazenados de forma privada para fins de gestão financeira pessoal.
                </p>
              </div>

              <button
                disabled={loading}
                className={`mt-2 w-full ${loading ? 'opacity-50' : 'bg-primary hover:bg-primary-hover'} text-[#102216] font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2`}
              >
                <span>{loading ? 'Cadastrando...' : 'Finalizar Cadastro'}</span>
              </button>
            </form>

            <div className="flex justify-center text-sm border-t border-white/5 pt-6">
              <span className="text-text-secondary mr-2">Já tem conta?</span>
              <Link to="/login" className="text-white font-bold hover:text-primary transition-colors underline">Entrar</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
