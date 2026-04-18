// SellerProductEdit.jsx - versão simplificada
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function SellerProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    setProduct(data);
    setLoading(false);
  };

  const handleUpdate = async () => {
    await supabase.from('products').update(product).eq('id', id);
    toast.success('Produto atualizado!');
    navigate('/seller/products');
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/seller/products')} className="flex items-center gap-2 text-[#555] mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <h1 className="text-2xl font-bold text-white mb-6">Editar Produto</h1>
      
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
        <input
          type="text"
          value={product?.title || ''}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
          className="w-full h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white"
        />
        <textarea
          value={product?.description || ''}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          className="w-full px-3 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white"
          rows={3}
        />
        <input
          type="number"
          value={product?.price_brl || 0}
          onChange={(e) => setProduct({ ...product, price_brl: parseFloat(e.target.value) })}
          className="w-full h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white"
        />
        <Button onClick={handleUpdate} className="w-full bg-white text-black">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}