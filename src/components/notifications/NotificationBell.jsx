// src/components/NotificationBell.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';

export default function NotificationBell({ userEmail }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const ref = useRef(null);
  const subscriptionRef = useRef(null);

  // Carregar notificações com cache e debounce
  const loadNotifications = useCallback(async (showLoading = false) => {
    if (!userEmail) return;
    if (showLoading) setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      // Fallback: tenta novamente em 5 segundos
      setTimeout(() => loadNotifications(), 5000);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [userEmail]);

  // Marcar como lida com otimização local
  const markAsRead = useCallback(async (id) => {
    // Atualização otimista
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      // Mostrar toast de sucesso apenas para primeira leitura
      const wasUnread = notifications.find(n => n.id === id)?.read === false;
      if (wasUnread) {
        toast.success('Notificação marcada como lida');
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      // Reverte atualização otimista em caso de erro
      loadNotifications();
      toast.error('Erro ao marcar notificação');
    }
  }, [notifications, loadNotifications]);

  // Marcar todas como lidas com progresso
  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) {
      toast.info('Nenhuma notificação não lida');
      return;
    }

    // Atualização otimista
    setNotifications(prev => prev.map(n => 
      unreadIds.includes(n.id) ? { ...n, read: true, read_at: new Date().toISOString() } : n
    ));

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .in('id', unreadIds);

      if (error) throw error;
      
      toast.success(`${unreadIds.length} notificações marcadas como lidas`);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      loadNotifications();
      toast.error('Erro ao marcar notificações');
    }
  }, [notifications, loadNotifications]);

  // Remover notificação (nova funcionalidade)
  const removeNotification = useCallback(async (id, e) => {
    e.stopPropagation();
    
    // Atualização otimista
    const removed = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Notificação removida');
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
      // Reverte
      if (removed) setNotifications(prev => [removed, ...prev]);
      toast.error('Erro ao remover notificação');
    }
  }, [notifications]);

  // Configurar subscription em tempo real
  useEffect(() => {
    if (!userEmail) return;

    // Carrega notificações iniciais
    loadNotifications(true);

    // Inscreve para novas notificações em tempo real
    const subscription = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_email=eq.${userEmail}`
        },
        (payload) => {
          const newNotification = payload.new;
          
          // Adiciona ao estado
          setNotifications(prev => [newNotification, ...prev]);
          
          // Mostra toast de nova notificação
          toast.info(`🔔 ${newNotification.title}`, {
            description: newNotification.message,
            duration: 5000,
            action: {
              label: 'Ver',
              onClick: () => setOpen(true)
            }
          });

          // Tenta notificação push se suportado
          if (pushSupported && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico',
              silent: false
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_email=eq.${userEmail}`
        },
        (payload) => {
          // Atualiza notificação existente
          setNotifications(prev => prev.map(n => 
            n.id === payload.new.id ? payload.new : n
          ));
        }
      )
      .subscribe();

    subscriptionRef.current = subscription;

    // Verifica suporte a push notifications
    if ('Notification' in window) {
      setPushSupported(true);
    }

    // Polling fallback (caso WebSocket falhe)
    const interval = setInterval(() => {
      // Só faz polling se não tiver recebido notificações recentemente
      const lastNotification = notifications[0];
      if (!lastNotification || (Date.now() - new Date(lastNotification.created_at).getTime() > 60000)) {
        loadNotifications();
      }
    }, 30000); // A cada 30 segundos

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [userEmail, pushSupported]);

  // Solicitar permissão para notificações push
  const requestPushPermission = useCallback(async () => {
    if (!pushSupported) {
      toast.error('Seu navegador não suporta notificações push');
      return;
    }

    if (Notification.permission === 'granted') {
      toast.success('Notificações já estão ativadas');
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('🔔 Notificações ativadas! Você receberá alertas em tempo real');
      } else {
        toast.error('Você não permitiu notificações');
      }
    } else {
      toast.error('As notificações estão bloqueadas. Por favor, ajuste nas configurações do navegador');
    }
  }, [pushSupported]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
        title={`${unreadCount} notificações não lidas`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden mobile-notification-dropdown">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Notificações</h3>
              {isLoading && (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {pushSupported && Notification.permission !== 'granted' && (
                <button
                  onClick={requestPushPermission}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                  title="Ativar notificações push"
                >
                  🔔 Ativar
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CheckCheck className="w-3 h-3" />
                  Marcar todas
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Nenhuma notificação</div>
                <div className="text-xs text-muted-foreground/60 mt-1">
                  Você receberá alertas de pedidos e novidades aqui
                </div>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markAsRead(n.id)}
                  className={`relative group transition-all duration-200 ${
                    !n.read 
                      ? 'bg-primary/5 hover:bg-primary/10 cursor-pointer' 
                      : 'hover:bg-secondary/30'
                  }`}
                >
                  <div className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      {!n.read && (
                        <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0 animate-pulse" />
                      )}
                      <div className={`flex-1 min-w-0 ${!n.read ? '' : 'pl-3.5'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-sm text-foreground">
                            {n.title}
                          </div>
                          <button
                            onClick={(e) => removeNotification(n.id, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            title="Remover notificação"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 break-words">
                          {n.message}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="text-[10px] text-muted-foreground/60">
                            {new Date(n.created_at).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {n.read && n.read_at && (
                            <div className="text-[10px] text-primary/60">
                              Lida em {new Date(n.read_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-border px-4 py-2 bg-secondary/20">
              <button
                onClick={() => loadNotifications(true)}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Atualizar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}