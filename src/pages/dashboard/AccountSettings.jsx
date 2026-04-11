// src/pages/dashboard/AccountSettings.jsx
import { useState, useEffect } from 'react';
import { base44, supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Key, Mail, Eye, EyeOff } from 'lucide-react';

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ display_name: '', bio: '' });
  
  // States para mudança de email
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [emailData, setEmailData] = useState({ new_email: '', code: '' });
  const [emailStep, setEmailStep] = useState('form');
  const [sendingCode, setSendingCode] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  
  // States para mudança de senha
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ new_password: '', confirm_password: '', code: '' });
  const [passwordStep, setPasswordStep] = useState('form');
  const [sendingPasswordCode, setSendingPasswordCode] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Debounce para evitar 429
  const [lastSentTime, setLastSentTime] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const me = await base44.auth.me();
      setUser(me);
      setFormData({
        display_name: me.display_name || me.full_name || '',
        bio: me.bio || '',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await base44.auth.updateMe({
        display_name: formData.display_name,
        bio: formData.bio,
      });
      toast.success('Perfil atualizado com sucesso!');
    } catch (e) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  // ==================== MUDANÇA DE EMAIL ====================
  const sendEmailCode = async () => {
    const now = Date.now();
    if (now - lastSentTime < 60000) {
      const remaining = Math.ceil((60000 - (now - lastSentTime)) / 1000);
      toast.error(`Aguarde ${remaining} segundos antes de enviar outro código`);
      return;
    }

    if (!emailData.new_email) {
      toast.error('Digite o novo email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.new_email)) {
      toast.error('Email inválido');
      return;
    }
    if (emailData.new_email === user?.email) {
      toast.error('O novo email é igual ao atual');
      return;
    }

    setSendingCode(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailData.new_email,
        options: {
          shouldCreateUser: false,
        },
      });
      
      if (error) {
        if (error.status === 422) {
          toast.error('Email inválido ou já cadastrado. Tente outro email.');
        } else {
          toast.error(error.message);
        }
        return;
      }
      
      setLastSentTime(Date.now());
      setEmailStep('code');
      toast.success('Código de verificação enviado para o novo email!');
    } catch (error) {
      if (error.status === 429) {
        toast.error('Muitas tentativas. Aguarde alguns minutos.');
      } else if (error.status === 422) {
        toast.error('Email inválido ou já cadastrado.');
      } else {
        toast.error('Erro ao enviar código. Tente novamente.');
      }
    } finally {
      setSendingCode(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!emailData.code) {
      toast.error('Digite o código de verificação');
      return;
    }

    setChangingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: emailData.new_email,
      });
      
      if (error) {
        if (error.status === 422) {
          toast.error('Este email já está em uso ou é inválido. Tente outro email.');
        } else {
          toast.error(error.message);
        }
        return;
      }
      
      toast.success('Email alterado com sucesso!');
      setShowChangeEmail(false);
      setEmailData({ new_email: '', code: '' });
      setEmailStep('form');
      loadUser();
    } catch (error) {
      toast.error(error.message || 'Erro ao alterar email');
    } finally {
      setChangingEmail(false);
    }
  };

  // ==================== MUDANÇA DE SENHA ====================
  const sendPasswordCode = async () => {
    const now = Date.now();
    if (now - lastSentTime < 60000) {
      const remaining = Math.ceil((60000 - (now - lastSentTime)) / 1000);
      toast.error(`Aguarde ${remaining} segundos antes de enviar outro código`);
      return;
    }

    if (!passwordData.new_password) {
      toast.error('Digite a nova senha');
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setSendingPasswordCode(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email);
      
      if (error) throw error;
      
      setLastSentTime(Date.now());
      setPasswordStep('code');
      toast.success('Código de verificação enviado para seu email!');
    } catch (error) {
      if (error.status === 429) {
        toast.error('Muitas tentativas. Aguarde alguns minutos.');
      } else {
        toast.error('Erro ao enviar código. Tente novamente.');
      }
    } finally {
      setSendingPasswordCode(false);
    }
  };

  const verifyPasswordCode = async () => {
    if (!passwordData.code) {
      toast.error('Digite o código de verificação');
      return;
    }

    setChangingPassword(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: user?.email,
        token: passwordData.code,
        type: 'email',
      });
      
      if (verifyError) throw verifyError;
      
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      });
      
      if (error) throw error;
      
      toast.success('Senha alterada com sucesso!');
      setShowChangePassword(false);
      setPasswordData({ new_password: '', confirm_password: '', code: '' });
      setPasswordStep('form');
      
      setTimeout(() => {
        base44.auth.logout('/');
      }, 2000);
    } catch (error) {
      toast.error('Código inválido ou expirado');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie seu perfil e segurança</p>
      </div>

      {/* Profile */}
      <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <User className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">Perfil</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome de exibição</label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
        </div>

        <Button type="submit" disabled={saving} className="bg-white text-black hover:bg-white/90 font-semibold">
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>

      {/* Security */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Key className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">Segurança</h2>
        </div>

        {/* Mudar Email */}
        <div>
          <button
            onClick={() => setShowChangeEmail(!showChangeEmail)}
            className="flex items-center justify-between w-full py-2 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">Alterar email</p>
              <p className="text-xs text-muted-foreground">Altere seu endereço de email</p>
            </div>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </button>

          {showChangeEmail && (
            <div className="mt-4 p-4 bg-secondary/30 border border-border rounded-lg">
              {emailStep === 'form' ? (
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Novo email"
                    value={emailData.new_email}
                    onChange={(e) => setEmailData({ ...emailData, new_email: e.target.value })}
                    className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground"
                  />
                  <div className="flex gap-2">
                    <Button onClick={sendEmailCode} disabled={sendingCode} className="bg-white text-black">
                      {sendingCode ? 'Enviando...' : 'Enviar código'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowChangeEmail(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Enviamos um código para <strong>{emailData.new_email}</strong>
                  </p>
                  <input
                    type="text"
                    placeholder="Código de verificação"
                    value={emailData.code}
                    onChange={(e) => setEmailData({ ...emailData, code: e.target.value })}
                    className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground text-center tracking-widest font-mono"
                  />
                  <div className="flex gap-2">
                    <Button onClick={verifyEmailCode} disabled={changingEmail} className="bg-white text-black">
                      {changingEmail ? 'Verificando...' : 'Confirmar'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setEmailStep('form');
                      setShowChangeEmail(false);
                      setEmailData({ new_email: '', code: '' });
                    }}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mudar Senha */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="flex items-center justify-between w-full py-2 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">Alterar senha</p>
              <p className="text-xs text-muted-foreground">Altere sua senha de acesso</p>
            </div>
            <Key className="h-4 w-4 text-muted-foreground" />
          </button>

          {showChangePassword && (
            <div className="mt-4 p-4 bg-secondary/30 border border-border rounded-lg">
              {passwordStep === 'form' ? (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Nova senha"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirmar nova senha"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={sendPasswordCode} disabled={sendingPasswordCode} className="bg-white text-black">
                      {sendingPasswordCode ? 'Enviando...' : 'Enviar código'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowChangePassword(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Enviamos um código para <strong>{user?.email}</strong>
                  </p>
                  <input
                    type="text"
                    placeholder="Código de verificação"
                    value={passwordData.code}
                    onChange={(e) => setPasswordData({ ...passwordData, code: e.target.value })}
                    className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground text-center tracking-widest font-mono"
                  />
                  <div className="flex gap-2">
                    <Button onClick={verifyPasswordCode} disabled={changingPassword} className="bg-white text-black">
                      {changingPassword ? 'Alterando...' : 'Confirmar'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setPasswordStep('form');
                      setShowChangePassword(false);
                      setPasswordData({ new_password: '', confirm_password: '', code: '' });
                    }}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}