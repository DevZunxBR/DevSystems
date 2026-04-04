// src/pages/Login.jsx
import { useState } from 'react';
import { supabase } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('Register'); // 'login' | 'signup'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Cria perfil
        await supabase.from('user_profiles').upsert({ email, role: 'user' });
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">DevVault</h1>
          <p className="text-sm text-[#666] mt-1">
            {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 px-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333]"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333]"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm text-[#666]">
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-white hover:underline"
          >
            {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  );
}