// src/pages/seller/SellerOrders.jsx
import { useState, useEffect } from 'react';
import { supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';

export default function SellerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // Buscar todos os pedidos
      const { data: allOrders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filtrar pedidos que contêm produtos do seller
      const sellerOrders = allOrders?.filter(order => 
        order.items?.some(item => item.seller_email === user?.email)
      ) || [];

      // Adicionar os itens do seller em cada pedido
      const ordersWithSellerItems = sellerOrders.map(order => ({
        ...order,
        seller_items: order.items?.filter(item => item.seller_email === user?.email) || []
      }));

      setOrders(ordersWithSellerItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pedidos</h1>
        <p className="text-sm text-[#555] mt-1">Pedidos que incluem seus produtos</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
          <Package className="h-12 w-12 text-[#555] mx-auto mb-4" />
          <p className="text-[#555]">Nenhum pedido ainda</p>
          <p className="text-xs text-[#555] mt-1">Quando clientes comprarem seus produtos, aparecerão aqui</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
              {/* Cabeçalho do pedido */}
              <div 
                className="p-4 cursor-pointer hover:bg-[#111] transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${order.status === 'completed' ? 'bg-green-500' : order.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-sm font-medium text-white">
                        Pedido #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-[#555]">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-sm font-bold text-white">
                      R$ {order.seller_items.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}
                    </span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-4 w-4 text-[#555]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#555]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Detalhes expandidos */}
              {expandedOrder === order.id && (
                <div className="border-t border-[#1A1A1A] p-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[#555]">Cliente</p>
                    <p className="text-sm text-white">{order.customer_name || order.customer_email}</p>
                    <p className="text-xs text-[#555]">{order.customer_email}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[#555]">Produtos Vendidos</p>
                    <div className="space-y-2">
                      {order.seller_items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-black rounded-lg p-2">
                          {item.thumbnail && (
                            <img src={item.thumbnail} alt="" className="w-10 h-10 rounded object-cover" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-white">{item.product_title}</p>
                            <p className="text-xs text-[#555]">Licença: {item.license_name}</p>
                          </div>
                          <p className="text-sm font-bold text-white">R$ {item.price?.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1A1A1A]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#555]">Subtotal</span>
                      <span className="text-white">R$ {order.seller_items.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-[#555]">Método de Pagamento</span>
                      <span className="text-white uppercase">{order.payment_method}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}