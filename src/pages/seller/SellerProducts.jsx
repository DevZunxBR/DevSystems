// src/pages/seller/SellerProducts.jsx
import { useState, useEffect } from 'react';
import { supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SellerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_email', user?.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (product) => {
    const newStatus = product.status === 'active' ? 'draft' : 'active';
    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', product.id);

    if (error) {
      toast.error('Erro ao alterar status');
      return;
    }

    setProducts(products.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
    toast.success(`Produto ${newStatus === 'active' ? 'publicado' : 'ocultado'}`);
  };

  const deleteProduct = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.')) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao deletar produto');
      return;
    }
    
    setProducts(products.filter(p => p.id !== id));
    toast.success('Produto deletado');
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Meus Produtos</h1>
          <p className="text-sm text-[#555] mt-1">{products.length} produto(s) cadastrado(s)</p>
        </div>
        <Link to="/seller/products/new"> {/* ← MUDANÇA AQUI */}
          <Button className="bg-white text-black hover:bg-white/90 gap-2">
            <Plus className="h-4 w-4" /> Novo Produto
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
          <p className="text-[#555] mb-4">Você ainda não tem produtos</p>
          <Link to="/seller/products/new"> {/* ← MUDANÇA AQUI TAMBÉM */}
            <Button variant="outline" className="border-[#1A1A1A] text-white">
              Criar primeiro produto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4 hover:bg-[#111] transition-colors">
              {/* Thumbnail */}
              <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                {product.thumbnail ? (
                  <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#555] text-xs">
                    Sem img
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{product.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-[#555]">R$ {product.price_brl?.toFixed(2)}</p>
                  <p className="text-xs text-[#555]">{product.category}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${product.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {product.status === 'active' ? 'Ativo' : 'Rascunho'}
                  </span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleStatus(product)}
                  className="p-2 text-[#555] hover:text-white transition-colors"
                  title={product.status === 'active' ? 'Ocultar' : 'Publicar'}
                >
                  {product.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <Link to={`/seller/products/edit/${product.id}`}> {/* ← MUDANÇA AQUI TAMBÉM */}
                  <button className="p-2 text-[#555] hover:text-white transition-colors" title="Editar">
                    <Pencil className="h-4 w-4" />
                  </button>
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-2 text-[#555] hover:text-red-500 transition-colors"
                  title="Deletar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}