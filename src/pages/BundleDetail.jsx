// src/pages/BundleDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, ChevronLeft, Package, CheckCircle, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function BundleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadBundle();
  }, [id]);

  const loadBundle = async () => {
    setLoading(true);
    try {
      const bundleData = await base44.entities.Bundle.get(id);
      setBundle(bundleData);
      
      // Carregar produtos do bundle
      const bundleProducts = await base44.entities.BundleProduct.listByBundle(id);
      const productIds = bundleProducts.map(bp => bp.product_id);
      const productsData = await Promise.all(productIds.map(pid => base44.entities.Product.get(pid)));
      setProducts(productsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addBundleToCart = async () => {
    setAddingToCart(true);
    try {
      const me = await base44.auth.me();
      
      // Adicionar todos os produtos do bundle ao carrinho
      for (const product of products) {
        await base44.entities.CartItem.create({
          user_email: me.email,
          product_id: product.id,
          product_title: product.title,
          license_name: 'Standard',
          price_usd: product.price_usd,
          price_brl: product.price_brl,
          thumbnail: product.thumbnail,
          file_url: product.file_url,
        });
      }
      
      toast.success('Bundle adicionado ao carrinho!');
      navigate('/cart');
    } catch {
      toast.error('Faça login primeiro');
      navigate('/register');
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    await addBundleToCart();
  };

  const hasDiscount = bundle?.discount_price_brl && bundle?.discount_expires_at && new Date(bundle.discount_expires_at) > new Date();
  const displayPrice = hasDiscount ? bundle.discount_price_brl : bundle?.price_brl;
  const originalPrice = bundle?.price_brl;
  const savings = originalPrice - displayPrice;
  const savingsPercent = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#555]">Bundle não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-[#555] hover:text-white mb-6">
        <ChevronLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          {bundle.thumbnail && (
            <div className="aspect-video bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
              <img src={bundle.thumbnail} alt={bundle.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          {/* Título */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-white" />
              <span className="text-xs text-[#555] uppercase tracking-wider">Bundle</span>
            </div>
            <h1 className="text-3xl font-black text-white">{bundle.title}</h1>
            {bundle.description && <p className="text-sm text-[#666] mt-2">{bundle.description}</p>}
          </div>
          
          {/* Produtos incluídos */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Produtos incluídos ({products.length})</h2>
            <div className="space-y-3">
              {products.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-[#111] rounded-lg">
                  <div className="w-10 h-10 bg-[#0A0A0A] rounded-lg overflow-hidden flex-shrink-0">
                    {product.thumbnail && <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{product.title}</p>
                    <p className="text-xs text-[#555]">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">R$ {product.price_brl?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Descrição */}
          {bundle.long_description && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Descrição do Bundle</h2>
              <div className="prose prose-sm prose-invert max-w-none text-[#888]">
                <ReactMarkdown>{bundle.long_description}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar - Card de compra */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-5">
            <h3 className="text-lg font-bold text-white">Este bundle inclui</h3>
            
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-white" />
                  <span className="text-[#666]">{product.title}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-[#1A1A1A] pt-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">R$ {displayPrice?.toFixed(2)}</span>
                {hasDiscount && originalPrice > 0 && (
                  <span className="text-lg text-[#555] line-through mb-1">R$ {originalPrice?.toFixed(2)}</span>
                )}
              </div>
              {hasDiscount && savings > 0 && (
                <p className="text-xs text-green-500 mt-1">Economize R$ {savings.toFixed(2)} ({savingsPercent}% OFF)</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={addBundleToCart}
                disabled={addingToCart}
                variant="outline"
                className="w-full border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white gap-2 h-11 rounded-xl"
              >
                <ShoppingCart className="h-4 w-4" /> Adicionar ao Carrinho
              </Button>
              <Button
                onClick={buyNow}
                disabled={addingToCart}
                className="w-full bg-white text-black hover:bg-white/90 font-semibold gap-2 h-11 rounded-xl"
              >
                <Zap className="h-4 w-4" /> Comprar Agora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}