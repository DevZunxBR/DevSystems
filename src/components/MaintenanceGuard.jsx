// src/components/MaintenanceGuard.jsx
import { useEffect, useState } from 'react';
import { supabase } from '@/api/base44Client';
import { maintenanceConfig } from '@/config/maintenance';
import Maintenance from './Maintenance';

export default function MaintenanceGuard({ children }) {
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      // Se manutenção estiver desativada, libera tudo
      if (!maintenanceConfig.enabled) {
        setIsAllowed(true);
        setLoading(false);
        return;
      }

      // Pega usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      // Verifica se o email está na whitelist
      if (user?.email && maintenanceConfig.whitelistEmails.includes(user.email)) {
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