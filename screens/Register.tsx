
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isConfigured } from '../supabaseClient';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    inviteCode: ''
  });
  const [consent, setConsent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [inviteCodeValid, setInviteCodeValid] = useState<boolean | null>(null);
  const [validatingCode, setValidatingCode] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const checkPasswordStrength = (pass: string) => {
    let strong = 0;
    if (pass.length >= 8) strong++;
    if (/[A-Z]/.test(pass)) strong++;
    if (/[0-9!@#$%^&*]/.test(pass)) strong++;

    if (strong === 3) setPasswordStrength('Forte');
    else if (strong === 2) setPasswordStrength('Média');
    else setPasswordStrength('Fraca');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);

    // Mask (XX) XXXXX-XXXX
    if (val.length > 2) val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    if (val.length > 10) val = `${val.slice(0, 10)}-${val.slice(10)}`;

    setFormData(prev => ({ ...prev, phone: val }));
  };

  const validateInviteCode = async (code: string) => {
    if (!code || code.length < 4) {
      setInviteCodeValid(null);
      return;
    }

    setValidatingCode(true);
    try {
      const { data, error } = await supabase
        .from('invites')
        .select('id, used, email_restriction')
        .eq('code', code.toUpperCase())
        .eq('used', false)
        .single();

      if (error || !data) {
        setInviteCodeValid(false);
      } else {
        // Check email restriction if exists
        if (data.email_restriction && formData.email !== data.email_restriction) {
          setInviteCodeValid(false);
        } else {
          setInviteCodeValid(true);
        }
      }
    } catch (err) {
      setInviteCodeValid(false);
    } finally {
      setValidatingCode(false);
    }
  };

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

    if (passwordStrength !== 'Forte') {
      setError('Sua senha deve atender a todos os requisitos de segurança.');
      return;
    }

    if (!formData.inviteCode || inviteCodeValid !== true) {
      setError('Código de convite inválido ou não verificado.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create User in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            username: formData.username.toLowerCase(),
            phone: formData.phone
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Mark invite code as used
        const { error: inviteError } = await supabase
          .from('invites')
          .update({
            used: true,
            used_by: authData.user.id
          })
          .eq('code', formData.inviteCode.toUpperCase());

        if (inviteError) {
          console.error('Failed to mark invite as used:', inviteError);
        }

        alert('Conta criada com sucesso! Verifique seu email se necessário.');
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
      <div className="w-full max-w-[520px]">
        <div className="flex flex-col items-center mb-8 gap-3 text-center">
          <div className="size-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-4xl font-bold">person_add</span>
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Criar Conta</h1>
          <p className="text-text-secondary text-sm font-medium">Preencha seus dados para acessar o sistema.</p>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Usuário</span>
                  <input
                    className="w-full rounded-2xl bg-black/20 border border-white/10 text-white p-4 outline-none focus:border-primary"
                    placeholder="Ex: marcos_uber"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Telefone (WhatsApp)</span>
                  <input
                    className="w-full rounded-2xl bg-black/20 border border-white/10 text-white p-4 outline-none focus:border-primary"
                    placeholder="(DD) 99999-9999"
                    required
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-white text-xs font-bold uppercase tracking-widest">E-mail</span>
                <input
                  className="w-full rounded-2xl bg-black/20 border border-white/10 text-white p-4 outline-none focus:border-primary"
                  placeholder="seu@email.com"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Invite Code Field */}
              <div className="flex flex-col gap-2">
                <span className="text-white text-xs font-bold uppercase tracking-widest">Código de Convite</span>
                <div className="relative">
                  <input
                    className={`w-full rounded-2xl bg-black/20 border ${inviteCodeValid === true ? 'border-primary' :
                      inviteCodeValid === false ? 'border-red-500' :
                        'border-white/10'
                      } text-white p-4 pr-12 outline-none focus:border-primary uppercase`}
                    placeholder="XXXX-XXXX"
                    required
                    value={formData.inviteCode}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setFormData({ ...formData, inviteCode: val });
                      validateInviteCode(val);
                    }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {validatingCode ? (
                      <span className="material-symbols-outlined text-text-secondary animate-spin">progress_activity</span>
                    ) : inviteCodeValid === true ? (
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                    ) : inviteCodeValid === false ? (
                      <span className="material-symbols-outlined text-red-500">cancel</span>
                    ) : null}
                  </div>
                </div>
                {inviteCodeValid === false && (
                  <span className="text-red-500 text-xs font-medium">Código inválido ou já utilizado</span>
                )}
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 relative group">
                  <span className="text-white text-xs font-bold uppercase tracking-widest flex justify-between">
                    Senha
                    <span className={`text-[10px] ${passwordStrength === 'Forte' ? 'text-green-500' :
                      passwordStrength === 'Média' ? 'text-yellow-500' : 'text-red-500'
                      }`}>{passwordStrength && `(${passwordStrength})`}</span>
                  </span>
                  <input
                    className="w-full rounded-2xl bg-black/20 border border-white/10 text-white p-4 outline-none focus:border-primary"
                    placeholder="••••"
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      checkPasswordStrength(e.target.value);
                    }}
                  />
                  {/* Tooltip for Password Rules */}
                  <div className="absolute bottom-full left-0 mb-2 w-full bg-surface-dark-lighter border border-white/10 p-3 rounded-xl hidden group-focus-within:block shadow-xl z-10">
                    <p className="text-white text-xs font-bold mb-1">Sua senha deve ter:</p>
                    <ul className="text-[10px] text-text-secondary flex flex-col gap-1">
                      <li className={formData.password.length >= 8 ? 'text-green-400' : ''}>• Mínimo 8 caracteres</li>
                      <li className={/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}>• 1 Letra maiúscula</li>
                      <li className={/[0-9!@#$%^&*]/.test(formData.password) ? 'text-green-400' : ''}>• 1 Número ou Símbolo</li>
                    </ul>
                  </div>
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

              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => setConsent(!consent)}>
                <div className={`shrink-0 size-6 rounded-md border-2 flex items-center justify-center transition-all ${consent ? 'bg-primary border-primary text-[#102216]' : 'border-white/20'}`}>
                  {consent && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed select-none">
                  Li e concordo com os Termos e aceito que meus dados sejam armazenados de forma segura conforme a LGPD.
                </p>
              </div>

              <button
                disabled={loading}
                className={`mt-2 w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover'} text-[#102216] font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2`}
              >
                {loading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                <span>{loading ? 'Criando conta...' : 'Finalizar Cadastro'}</span>
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
