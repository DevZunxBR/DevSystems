// src/pages/Register.jsx - Versão melhorada
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, CheckCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Auto focus no primeiro input OTP
  useEffect(() => {
    if (step === 'otp' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && otp.join('').length === 8) {
      handleVerifyOtp();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (pasted.length === 8) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[7]?.focus();
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Preencha email e senha');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      toast.success('Bem-vindo de volta!');
      navigate('/');
    } catch (err) {
      toast.error('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (formData.password !== formData.confirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.name } }
      });
      if (error) throw error;
      if (data.user) {
        await supabase.from('user_profiles').upsert({
          email: data.user.email,
          full_name: formData.name,
          role: 'user',
        });
      }
      toast.success('Código enviado para seu email!');
      setStep('otp');
    } catch (err) {
      toast.error(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 8) {
      toast.error('Digite o código completo de 8 dígitos');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: code,
        type: 'signup',
      });
      if (error) throw error;
      toast.success('Conta verificada! Bem-vindo!');
      navigate('/');
    } catch (err) {
      toast.error('Código inválido ou expirado');
      setOtp(['', '', '', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });
      if (error) throw error;
      toast.success('Novo código enviado!');
      setOtp(['', '', '', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error('Erro ao reenviar código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-sm">M</span>
            </div>
            <span className="text-white font-bold text-lg">Marketplace</span>
          </div>
        </div>

        {step === 'otp' ? (
          // OTP Step
          <>
            <div className="mb-8">
              <button
                onClick={() => { setStep('form'); setOtp(['', '', '', '', '', '', '', '']); }}
                className="flex items-center gap-1 text-sm text-[#555] hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Verifique seu email</h1>
              <p className="text-sm text-[#666] mt-2">
                Enviamos um código de 8 dígitos para <span className="text-white font-medium">{formData.email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-2 justify-center">
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
                    className="w-10 h-12 text-center text-lg font-bold bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white transition-all"
                  />
                ))}
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={loading || otp.join('').length !== 8}
                className="w-full bg-white text-black hover:bg-white/90 font-bold h-11 rounded-lg"
              >
                {loading ? 'Verificando...' : 'Verificar Código'}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-xs text-[#555]">Não recebeu o código?</p>
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-sm text-white hover:underline font-medium disabled:opacity-50"
                >
                  Reenviar código
                </button>
              </div>
            </div>
          </>
        ) : (
          // Form Step
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {mode === 'login' ? 'Entrar na sua conta' : 'Criar sua conta'}
              </h1>
              <p className="text-sm text-[#666] mt-2">
                {mode === 'login' ? 'Bem-vindo de volta!' : 'Junte-se a milhares de desenvolvedores.'}
              </p>
            </div>

            <div className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="text-xs font-medium text-[#555] mb-1 block">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#444]" />
                    <input
                      name="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-11 pl-10 pr-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-[#555] mb-1 block">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#444]" />
                  <input
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] mb-1 block">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#444]" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-10 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="text-xs font-medium text-[#555] mb-1 block">Confirmar Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#444]" />
                    <input
                      name="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirm}
                      onChange={handleChange}
                      className="w-full h-11 pl-10 pr-10 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-white transition-colors"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <Button
                onClick={mode === 'login' ? handleLogin : handleRegister}
                disabled={loading}
                className="w-full bg-white text-black hover:bg-white/90 font-bold h-11 rounded-lg mt-2"
              >
                {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
              </Button>

              <p className="text-xs text-[#555] text-center">
                {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setFormData({ name: '', email: '', password: '', confirm: '' }); }}
                  className="text-white hover:underline font-medium"
                >
                  {mode === 'login' ? 'Criar conta' : 'Entrar'}
                </button>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Right - Image melhorada */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80"
          alt="Tech background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-xs text-white/60">+500 desenvolvedores</span>
            </div>
            <p className="text-xl font-semibold text-white leading-relaxed">
              "A plataforma com os melhores assets e sistemas do mercado. Qualidade impecável e suporte rápido."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Dev Community</p>
                <p className="text-xs text-white/50">Desenvolvedores parceiros</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}