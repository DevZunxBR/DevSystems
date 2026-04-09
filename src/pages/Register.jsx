import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

// Importe suas imagens aqui
import devRegisterBg1 from '@/assets/images/DevRegister.png';
import devRegisterBg2 from '@/assets/images/DevRegister2.png';
import devRegisterBg3 from '@/assets/images/DevRegister3.png';
import devRegisterBg4 from '@/assets/images/DevRegister4.png';

export default function Register() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
  const inputRefs = useRef([]);
  
  // States para mostrar/esconder senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Slideshow state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Lista de imagens (4 imagens)
  const images = [devRegisterBg1, devRegisterBg2, devRegisterBg3, devRegisterBg4];
  
  // Frases diferentes para cada imagem
  const quotes = [
    { text: "A plataforma com os melhores assets e sistemas do mercado. Qualidade impecável.", author: "— Dev Community" },
    { text: "Encontre tudo que você precisa para seus projetos em um só lugar.", author: "— Dev Systems" },
    { text: "Mais de 500 desenvolvedores já confiam na nossa plataforma.", author: "— Comunidade Dev" },
    { text: "Scripts profissionais e sistemas completos para produção imediata.", author: "— Dev Team" },
  ];

  // Trocar imagem a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

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
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (pasted.length === 8) {
      setOtp(pasted.split(''));
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
      toast.success('Conta verificada! Bem-vindo!');
      window.location.href = '/';
    } catch (err) {
      toast.error('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  // Verificar se email já existe
  const checkEmailExists = async (email) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar email:', error);
      }
      
      return !!data;
    } catch (err) {
      console.error('Erro ao verificar email:', err);
      return false;
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
    const emailExists = await checkEmailExists(formData.email);
    
    if (emailExists) {
      toast.error('Este email já está cadastrado. Faça login ou use outro email.');
      setLoading(false);
      return;
    }
    
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
      if (err.message?.includes('already registered')) {
        toast.error('Este email já está cadastrado. Faça login.');
      } else {
        toast.error(err.message || 'Erro ao criar conta');
      }
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

  const goToImage = (index) => {
    if (index === currentImageIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background com slideshow (agora em todas as telas) */}
      <div className="fixed inset-0 z-0">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentImageIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        ))}
      </div>

      {/* Indicadores de slide */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImageIndex === index 
                ? 'bg-white w-6' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Conteúdo do formulário - centralizado */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-sm">M</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Marketplace</span>
            </div>
          </div>

          {step === 'otp' ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight">Verifique seu email</h1>
                <p className="text-sm text-[#999] mt-2">
                  Enviamos um código de 8 dígitos para <span className="text-white font-medium">{formData.email}</span>
                </p>
              </div>

              <div className="bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#1A1A1A] rounded-2xl p-6 space-y-6">
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
                      className="w-10 h-12 text-center text-lg font-bold bg-[#111] border border-[#1A1A1A] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
                    />
                  ))}
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join('').length !== 8}
                  className="w-full bg-white text-black hover:bg-white/90 font-bold h-11 rounded-xl"
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

                <button
                  onClick={() => { setStep('form'); setOtp(['', '', '', '', '', '', '', '']); }}
                  className="w-full text-xs text-[#555] hover:text-white transition-colors"
                >
                  ← Voltar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight">
                  {mode === 'login' ? 'Entrar na sua conta' : 'Criar sua conta'}
                </h1>
                <p className="text-sm text-[#999] mt-2">
                  {mode === 'login' ? 'Bem-vindo de volta!' : 'Junte-se a milhares de desenvolvedores.'}
                </p>
              </div>

              <div className="bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#1A1A1A] rounded-2xl p-6 space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="text-xs font-medium text-[#555] mb-1 block">Nome Completo</label>
                    <input name="name" type="text" placeholder="Seu nome" value={formData.name} onChange={handleChange}
                      className="w-full h-11 px-4 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-white" />
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-medium text-[#555] mb-1 block">E-mail</label>
                  <input name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange}
                    className="w-full h-11 px-4 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-white" />
                </div>
                
                <div>
                  <label className="text-xs font-medium text-[#555] mb-1 block">Senha</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full h-11 px-4 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                {mode === 'register' && (
                  <div>
                    <label className="text-xs font-medium text-[#555] mb-1 block">Confirmar Senha</label>
                    <div className="relative">
                      <input
                        name="confirm"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.confirm}
                        onChange={handleChange}
                        className="w-full h-11 px-4 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formData.confirm.length > 0 && formData.password !== formData.confirm && (
                      <p className="text-[10px] text-red-500 mt-1">As senhas não coincidem</p>
                    )}
                  </div>
                )}

                <Button
                  onClick={mode === 'login' ? handleLogin : handleRegister}
                  disabled={loading}
                  className="w-full bg-white text-black hover:bg-white/90 font-bold h-11 rounded-xl mt-4"
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

              {/* Frase motivacional */}
              <div className="mt-6 text-center">
                <p className="text-sm text-[#555] italic">
                  "{quotes[currentImageIndex].text}"
                </p>
                <p className="text-xs text-[#444] mt-1">{quotes[currentImageIndex].author}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}