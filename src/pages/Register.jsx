import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, RotateCcw } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 7) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (pasted.length === 8) { setOtp(pasted.split('')); inputRefs.current[7]?.focus(); }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) { toast.error('Preencha email e senha'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password });
      if (error) throw error;
      toast.success('Bem-vindo de volta!');
      window.location.href = '/';
    } catch { toast.error('Email ou senha incorretos'); }
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) { toast.error('Preencha todos os campos'); return; }
    if (formData.password !== formData.confirm) { toast.error('As senhas não coincidem'); return; }
    if (formData.password.length < 6) { toast.error('Mínimo 6 caracteres'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email, password: formData.password,
        options: { data: { full_name: formData.name } }
      });
      if (error) throw error;
      if (data.user) await supabase.from('user_profiles').upsert({ email: data.user.email, full_name: formData.name, role: 'user' });
      toast.success('Código enviado para seu email!');
      setStep('otp');
      setResendTimer(60);
    } catch (err) { toast.error(err.message || 'Erro ao criar conta'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 8) { toast.error('Digite o código completo'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ email: formData.email, token: code, type: 'signup' });
      if (error) throw error;
      toast.success('Conta criada! Bem-vindo!');
      window.location.href = '/';
    } catch { toast.error('Código inválido ou expirado'); setOtp(['', '', '', '', '', '', '', '']); inputRefs.current[0]?.focus(); }
    finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: formData.email });
      if (error) throw error;
      toast.success('Novo código enviado!');
      setOtp(['', '', '', '', '', '', '', '']);
      setResendTimer(60);
      inputRefs.current[0]?.focus();
    } catch { toast.error('Erro ao reenviar código'); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full h-12 px-4 bg-[#0A0A0A] border border-[#222] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#444] transition-colors";

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-sm">D</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">DevVault</span>
        </div>

        {/* OTP Step */}
        {step === 'otp' ? (
          <div className="max-w-sm space-y-8">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h1 className="text-2xl font-black text-white">Verifique seu email</h1>
              <p className="text-sm text-[#666]">
                Enviamos um código de 8 dígitos para{' '}
                <span className="text-white font-medium">{formData.email}</span>
              </p>
            </div>

            {/* OTP inputs */}
            <div className="flex gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className={`flex-1 h-12 text-center text-lg font-bold bg-[#0A0A0A] border rounded-xl text-white focus:outline-none transition-all ${digit ? 'border-white' : 'border-[#222] focus:border-[#444]'}`}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.join('').length !== 8}
              className="w-full h-12 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Verificar código <ArrowRight className="h-4 w-4" /></>
              )}
            </button>

            <div className="flex items-center justify-between">
              <button
                onClick={() => { setStep('form'); setOtp(['', '', '', '', '', '', '', '']); }}
                className="text-xs text-[#555] hover:text-white transition-colors"
              >
                ← Voltar
              </button>
              <button
                onClick={handleResendOtp}
                disabled={loading || resendTimer > 0}
                className="flex items-center gap-1.5 text-xs text-[#555] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RotateCcw className="h-3 w-3" />
                {resendTimer > 0 ? `Reenviar em ${resendTimer}s` : 'Reenviar código'}
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <div className="max-w-sm space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white">
                {mode === 'login' ? 'Entrar na conta' : 'Criar conta'}
              </h1>
              <p className="text-sm text-[#555]">
                {mode === 'login' ? 'Bem-vindo de volta ao DevVault.' : 'Junte-se a milhares de devs.'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-1">
              <button
                onClick={() => { setMode('login'); setFormData({ name: '', email: '', password: '', confirm: '' }); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${mode === 'login' ? 'bg-white text-black' : 'text-[#555] hover:text-white'}`}
              >
                Entrar
              </button>
              <button
                onClick={() => { setMode('register'); setFormData({ name: '', email: '', password: '', confirm: '' }); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${mode === 'register' ? 'bg-white text-black' : 'text-[#555] hover:text-white'}`}
              >
                Criar conta
              </button>
            </div>

            <div className="space-y-3">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#666]">Nome completo</label>
                  <input name="name" type="text" placeholder="Seu nome" value={formData.name} onChange={handleChange} className={inputClass} />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#666]">E-mail</label>
                <input name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} className={inputClass} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#666]">Senha</label>
                <div className="relative">
                  <input name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={handleChange} className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#666]">Confirmar senha</label>
                  <div className="relative">
                    <input name="confirm" type={showConfirm ? 'text' : 'password'} placeholder="••••••••" value={formData.confirm} onChange={handleChange} className={`${inputClass} pr-12`}
                      onKeyDown={e => e.key === 'Enter' && handleRegister()} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-white transition-colors">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={mode === 'login' ? handleLogin : handleRegister}
                disabled={loading}
                className="w-full h-12 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>{mode === 'login' ? 'Entrar' : 'Criar conta'} <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>

            {mode === 'login' && (
              <p className="text-xs text-[#444] text-center">
                Ao entrar você concorda com nossos termos de uso.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#050505]">
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Stats */}
          <div className="flex gap-6">
            {[['1000+', 'Assets'], ['50+', 'Devs'], ['4.9★', 'Avaliação']].map(([val, label]) => (
              <div key={label} className="space-y-1">
                <p className="text-2xl font-black text-white">{val}</p>
                <p className="text-xs text-[#555]">{label}</p>
              </div>
            ))}
          </div>

          {/* Center content */}
          <div className="space-y-6">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">⚡</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-white leading-tight">
                Assets premium<br />para devs sérios.
              </h2>
              <p className="text-sm text-[#555] leading-relaxed max-w-xs">
                Scripts, sistemas e UI Kits prontos para produção. Economize horas de desenvolvimento.
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
            <p className="text-sm text-white leading-relaxed">
              "Os assets do DevVault economizaram semanas do meu projeto. Qualidade impecável."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">DC</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Dev Community</p>
                <p className="text-[11px] text-[#555]">Cliente verificado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}