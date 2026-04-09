// src/components/MaintenanceGuard.jsx
import { useEffect, useState } from 'react';
import { supabase } from '@/api/base44Client';
import Maintenance from './Maintenance';

export default function MaintenanceGuard({ children }) {
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      // Buscar status da manutenção no banco
      const { data: settings, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'maintenance_mode')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro:', error);
        setIsAllowed(true);
        setLoading(false);
        return;
      }
      
      const isMaintenanceOn = settings?.value === 'true';

      // Se manutenção estiver desativada, libera tudo
      if (!isMaintenanceOn) {
        setIsAllowed(true);
        setLoading(false);
        return;
      }

      // Pega usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      // Se não está logado, bloqueia
      if (!user) {
        setIsAllowed(false);
        setLoading(false);
        return;
      }
      
      // Verifica se é admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('email', user.email)
        .single();
      
      if (profile?.role === 'admin') {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      setIsAllowed(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAllowed) {
    return <Maintenance />;
  }

  return children;
}