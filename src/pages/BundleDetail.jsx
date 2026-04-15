// src/pages/BundleDetail.jsx - IGUAL ao ProductDetail
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Zap,
  ChevronLeft,
  ChevronRight,
  FileBox,
  Tag,
  Layers,
  Settings,
  Lock,
  Clock,
  Package
} from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import FavoriteButton from '@/components/products/FavoriteButton';
import { base44, supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import ReviewSection from '@/components/products/ReviewSection';

function DiscountCountdown({ expiresAt }) {
  const timeLeft = useCountdown(expiresAt);
  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-900/40 rounded-lg">
      <Clock className="h-4 w-4 text-red-400 flex-shrink-0" />
      <div className="text-xs">
        <span className="text-red-400 font-bold">Oferta por tempo limitado!</span>
        <span className="text-[#666] ml-1">
          {timeLeft.d > 0 && `${timeLeft.d}d `}
          {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
        </span>
      </div>
    </div>
  );
}

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function BundleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadBundle();
  }, [id]);

  const loadBundle = async () => {
    setLoading(true);
    try {
      const bundleData = await base44.entities.Bundle.get(id);
      setBundle(bundleData);
      
      const bundleProducts = await supabase
        .from('bundle_products')
        .select('product_id')
        .eq('bundle_id', id);
      
      const productIds = bundleProducts.data.map(bp => bp.product_id);
      const productsData = await Promise.all(productIds.map(pid => base44.entities.Product.get(pid)));
      setProducts(productsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const images = bundle?.images?.length ? bundle.images : (bundle?.thumbnail ? [bundle.thumbnail] : []);
  const hasDiscount = bundle?.discount_price_brl && bundle?.discount_expires_at && new Date(bundle.discount_expires_at) > new Date();
  const displayPrice = hasDiscount ? bundle.discount_price_brl : bundle?.price_brl;

  const metadata = [
    { icon: FileBox, label: 'Tamanho', value: bundle?.file_size },
    { icon: Layers, label: 'Categoria', value: bundle?.category },
    { icon: Settings, label: 'Versões', value: bundle?.supported_versions },
    { icon: Tag, label: 'Tags', value: bundle?.tags?.join(', ') },
  ].filter(m => m.value);

  const addToCart = async () => {
    setAddingToCart(true);
    try {
      const me = await base44.auth.me();
      
      // Adicionar todos os produtos do bundle ao carrinho
      for (const product of products) {
        const license = product.licenses?.[selectedLicense];
        await base44.entities.CartItem.create({
          user_email: me.email,
          product_id: product.id,
          product_title: product.title,
          license_name: license?.name || 'Standard',
          price_usd: license?.price_usd || product.price_usd,
          price_brl: license?.price_brl || product.price_brl,
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
    await addToCart();
  };

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

  const isClosed = Boolean(bundle.closed);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-[#555] hover:text-white mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
        {/* Coluna da esquerda - Galeria e descrição */}
        <div className="lg:col-span-7 space-y-6">
          {/* Galeria de imagens */}
          <div className="space-y-3">
            <div className="relative aspect-video bg-[#050505] border border-[#1A1A1A] rounded-xl overflow-hidden">
              {images.length > 0 ? (
                <img src={images[selectedImage]} alt={bundle.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#555]">Sem imagem disponível</div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full text-white hover:bg-black/80"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full text-white hover:bg-black/80"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/60 text-[11px] text-white">
                    {selectedImage + 1}/{images.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Descrição</h2>
            <div className="prose prose-sm prose-invert max-w-none text-[#888]">
              <ReactMarkdown>{bundle.long_description || bundle.description || 'Sem descrição disponível.'}</ReactMarkdown>
            </div>
          </div>

          {/* Produtos incluídos */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="h-4 w-4" /> Produtos incluídos ({products.length})
            </h3>
            <div className="space-y-3">
              {products.map((product) => (
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

          {/* Reviews */}
          <div className="border-t border-[#1A1A1A] pt-6">
            <ReviewSection productId={bundle.id} isBundle={true} />
          </div>
        </div>

        {/* Coluna da direita - Card do bundle */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 space-y-5">
              <div>
                <h1 className="text-xl font-bold text-white">{bundle.title}</h1>
                {bundle.description && <p className="text-sm text-[#666] mt-1">{bundle.description}</p>}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {bundle.category && (
                    <span className="text-[10px] px-2 py-1 rounded-full border border-[#1A1A1A] text-[#666]">{bundle.category}</span>
                  )}
                  <span className="text-[10px] px-2 py-1 rounded-full border border-[#1A1A1A] text-[#666]">Bundle</span>
                </div>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">R$ {toNumber(displayPrice).toFixed(2)}</span>
                {hasDiscount && bundle?.price_brl > 0 && (
                  <span className="text-lg text-[#555] line-through mb-0.5">R$ {toNumber(bundle.price_brl).toFixed(2)}</span>
                )}
              </div>

              {hasDiscount && <DiscountCountdown expiresAt={bundle.discount_expires_at} />}

              <div className="space-y-2">
                {isClosed ? (
                  <div className="w-full flex items-center justify-center gap-2 h-11 bg-[#111] border border-[#1A1A1A] rounded-xl text-[#555] text-sm font-semibold">
                    <Lock className="h-4 w-4" /> Bundle indisponível
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={addToCart}
                      disabled={addingToCart || buyingNow}
                      variant="outline"
                      className="w-full border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white gap-2 h-11 rounded-xl"
                    >
                      <ShoppingCart className="h-4 w-4" /> {addingToCart ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                    </Button>

                    <Button
                      onClick={buyNow}
                      disabled={buyingNow || addingToCart}
                      className="w-full bg-white text-black hover:bg-white/90 font-semibold gap-2 h-11 rounded-xl"
                    >
                      <Zap className="h-4 w-4" /> {buyingNow ? 'Processando...' : 'Comprar Agora'}
                    </Button>
                  </>
                )}
              </div>

              {metadata.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#1A1A1A]">
                  {metadata.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <item.icon className="h-4 w-4 text-[#555] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-[#555]">{item.label}</div>
                        <div className="text-sm text-white">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}