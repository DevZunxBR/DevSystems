// src/components/NotificationBell.jsx - Corrigido para não cortar conteúdo
import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function NotificationBell({ userEmail }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef(null);

  // Detectar mobile para ajustar o dropdown
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [userEmail]);

  useEffect(() => {
    const handler = (e) => { 
      if (ref.current && !ref.current.contains(e.target)) setOpen(false); 
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loadNotifications = async () => {
    try {
      const items = await base44.entities.Notification.filter({ user_email: userEmail }, '-created_at', 20);
      setNotifications(items);
    } catch {}
  };

  const markRead = async (id) => {
    await base44.entities.Notification.update(id, { read: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => base44.entities.Notification.update(n.id, { read: true })));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

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
        <div className={`
          absolute top-full mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden
          ${isMobile 
            ? 'left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[360px]' 
            : 'right-0 w-80'
          }
        `}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Notificações</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-muted-foreground hover:text-foreground">
                Marcar todas
              </button>
            )}
          </div>
          {/* Removido o max-h-80 para não cortar conteúdo */}
          <div className="overflow-y-auto" style={{ maxHeight: 'min(400px, 70vh)' }}>
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Nenhuma notificação</div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${!n.read ? 'bg-secondary/20' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0" />}
                    <div className={`flex-1 min-w-0 ${!n.read ? '' : 'pl-3.5'}`}>
                      <div className="text-xs font-semibold text-foreground break-words">{n.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 break-words leading-relaxed">{n.message}</div>
                      <div className="text-[10px] text-muted-foreground/60 mt-1">
                        {new Date(n.created_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}