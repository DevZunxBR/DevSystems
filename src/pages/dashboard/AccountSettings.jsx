// src/pages/dashboard/AccountSettings.jsx
import { useState, useEffect } from 'react';
import { base44, supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Key, Mail, Lock } from 'lucide-react';

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ display_name: '', bio: '' });

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
        <p className="text-sm text-muted-foreground mt-1">Gerencie seu perfil</p>
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
            <p className="text-[10px] text-muted-foreground mt-1">
              Para alterar seu email, entre em contato com o suporte.
            </p>
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

      {/* Security - Ambas bloqueadas */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Key className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">Segurança</h2>
        </div>

        {/* Mudar Email - BLOQUEADO */}
        <div className="opacity-60 cursor-not-allowed">
          <div className="flex items-center justify-between w-full py-2">
            <div>
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" /> Alterar email
              </p>
              <p className="text-xs text-muted-foreground">Altere seu endereço de email (bloqueado)</p>
            </div>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Mudar Senha - BLOQUEADO */}
        <div className="pt-4 border-t border-border opacity-60 cursor-not-allowed">
          <div className="flex items-center justify-between w-full py-2">
            <div>
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" /> Alterar senha
              </p>
              <p className="text-xs text-muted-foreground">Altere sua senha de acesso (bloqueado)</p>
            </div>
            <Key className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Para alterar sua senha, entre em contato com o suporte.
          </p>
        </div>
      </div>
    </div>
  );
}