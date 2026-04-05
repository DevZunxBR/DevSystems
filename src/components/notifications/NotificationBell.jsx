import { useState, useEffect, useRef } from 'react';
import { Bell, Package, Star, CreditCard, Megaphone, Info } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

const typeConfig = {
  payment: { icon: CreditCard, color: 'text-green-400', bg: 'bg-green-400/10' },
  review_request: { icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  new_product: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  update: { icon: Megaphone, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  system: { icon: Info, color: 'text-[#666]', bg: 'bg-[#111]' },
};

export default function NotificationBell({ userEmail }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userEmail) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [userEmail]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loadNotifications = async () => {
    try {
      const items = await base44.entities.Notification.filter({ user_email: userEmail }, '-created_at', 20);
      setNotifications(items);
    } catch {}
  };

  const handleClick = async (notification) => {
    // Marca como lida
    if (!notification.read) {
      await base44.entities.Notification.update(notification.id, { read: true });
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    }
    // Navega para o destino
    if (notification.link) {
      setOpen(false);
      navigate(notification.link);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => base44.entities.Notification.update(n.id, { read: true })));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell className={`h-5 w-5 ${open ? 'text-foreground' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[10px] font-bold rounded-full min-w-[16px] h-4 px-0.5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Notificações</h3>
              {unreadCount > 0 && (
                <span className="bg-white text-black text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-[#555] hover:text-white transition-colors">
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Bell className="h-8 w-8 text-[#333] mx-auto" />
                <p className="text-sm text-[#555]">Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((n) => {
                const config = typeConfig[n.type] || typeConfig.system;
                const Icon = config.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`w-full text-left px-4 py-3 border-b border-[#111] last:border-0 hover:bg-[#111] transition-colors ${!n.read ? 'bg-white/[0.02]' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-semibold truncate ${!n.read ? 'text-white' : 'text-[#888]'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-[#444] flex-shrink-0">{timeAgo(n.created_at)}</span>
                        </div>
                        <p className="text-xs text-[#555] mt-0.5 line-clamp-2">{n.message}</p>
                        {n.link && (
                          <p className="text-[10px] text-[#444] mt-1">Clique para ver →</p>
                        )}
                      </div>

                      {/* Unread dot */}
                      {!n.read && (
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-[#1A1A1A]">
              <button
                onClick={() => { setOpen(false); navigate('/dashboard'); }}
                className="text-xs text-[#555] hover:text-white transition-colors w-full text-center"
              >
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}