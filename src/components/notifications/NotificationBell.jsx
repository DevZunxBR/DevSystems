// src/components/NotificationBell.jsx - Sem bolinhas, sem botão marcar todas, número some ao clicar
import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '@/api/base44Client';

export default function NotificationBell({ userEmail }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);
  const subscriptionRef = useRef(null);

  // Fechar ao clicar fora
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Carregar notificações
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
      setTimeout(() => loadNotifications(), 5000);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [userEmail]);

  // Marcar como lida ao clicar
  const markAsRead = useCallback(async (id) => {
    // Atualiza localmente primeiro
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      loadNotifications();
    }
  }, [loadNotifications]);

  // Configurar subscription em tempo real
  useEffect(() => {
    if (!userEmail) return;

    loadNotifications(true);

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
          setNotifications(prev => [payload.new, ...prev]);
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
          setNotifications(prev => prev.map(n => 
            n.id === payload.new.id ? payload.new : n
          ));
        }
      )
      .subscribe();

    subscriptionRef.current = subscription;

    // Polling fallback
    const interval = setInterval(() => {
      const lastNotification = notifications[0];
      if (!lastNotification || (Date.now() - new Date(lastNotification.created_at).getTime() > 60000)) {
        loadNotifications();
      }
    }, 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [userEmail]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
            <h3 className="text-sm font-bold text-foreground">Notificações</h3>
            {isLoading && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Nenhuma notificação</div>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markAsRead(n.id)}
                  className={`transition-colors ${
                    !n.read 
                      ? 'bg-primary/5 hover:bg-primary/10 cursor-pointer' 
                      : 'hover:bg-secondary/30'
                  }`}
                >
                  <div className="px-4 py-3">
                    <div className="text-sm font-semibold text-foreground">
                      {n.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 break-words">
                      {n.message}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 mt-1.5">
                      {new Date(n.created_at).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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