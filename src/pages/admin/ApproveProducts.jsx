// src/pages/admin/ApproveProducts.jsx
import { useState, useEffect } from 'react';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { Check, X, Eye, Clock } from 'lucide-react';

export default function ApproveProducts() {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadPendingProducts();
  }, []);

  const loadPendingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('approval_status', 'pending')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setPendingProducts(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const updateApproval = async (product, status) => {
    try {
      const updates = {
        approval_status: status,
        approved_at: status === 'approved' ? new Date().toISOString() : null,
        status: status === 'approved' ? 'active' : 'draft'
      };

      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', product.id);

      if (error) throw error;

      toast.success(`Produto ${status === 'approved' ? 'aprovado' : 'recusado'}`);
      loadPendingProducts();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar status');
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
        <h1 className="text-2xl font-bold text-white">Aprovar Assets</h1>
        <p className="text-sm text-[#555] mt-1">{pendingProducts.length} asset(s) aguardando aprovação</p>
      </div>

      {pendingProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
          <Clock className="h-12 w-12 text-[#555] mx-auto mb-3" />
          <p className="text-[#555]">Nenhum asset aguardando aprovação.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingProducts.map((product) => (
            <div key={product.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
              <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <img src={product.thumbnail} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                        <p className="text-sm text-[#555]">Criador: {product.creator_name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#1A1A1A] text-white rounded-lg"
                    >
                      <Eye className="h-3 w-3" /> Detalhes
                    </button>
                    <button
                      onClick={() => updateApproval(product, 'approved')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Check className="h-3 w-3" /> Aprovar
                    </button>
                    <button
                      onClick={() => updateApproval(product, 'rejected')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <X className="h-3 w-3" /> Recusar
                    </button>
                  </div>
                </div>

                {expandedId === product.id && (
                  <div className="mt-4 pt-4 border-t border-[#1A1A1A]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#555]">Descrição</p>
                        <p className="text-sm text-white">{product.description || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#555]">Preço</p>
                        <p className="text-sm text-white">R$ {product.price_brl?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#555]">Categoria</p>
                        <p className="text-sm text-white">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#555]">Tags</p>
                        <p className="text-sm text-white">{product.tags?.join(', ') || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-[#555]">Descrição Completa</p>
                        <p className="text-sm text-white max-h-32 overflow-y-auto">{product.long_description || '-'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}