import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const all = await base44.entities.Order.list('-created_date', 50);
      setOrders(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending: { icon: Clock, label: 'Pending', className: 'text-muted-foreground' },
    completed: { icon: CheckCircle, label: 'Completed', className: 'text-foreground' },
    cancelled: { icon: XCircle, label: 'Cancelled', className: 'text-destructive' },
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">All Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Products</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-foreground font-medium">{order.customer_name || '—'}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {order.items?.map(i => i.product_title).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 font-bold text-foreground">${order.total_amount?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 ${status.className}`}>
                        <StatusIcon className="h-3 w-3" /> {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(order.created_date).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}