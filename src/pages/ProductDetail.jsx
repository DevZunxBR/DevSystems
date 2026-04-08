// src/pages/ProductDetail.jsx - Versão melhorada
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, ChevronLeft, ChevronRight, FileBox, Tag, Layers, Settings, Lock, Clock, Heart, Share2, Check, AlertCircle, Star } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import FavoriteButton from '@/components/products/FavoriteButton';
import { base44 } from '@/api/base44Client';
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
          {timeLeft.d > 0 && `${timeLeft.d}d `}{timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
        </span>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedLicense, setSelectedLicense] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const p = await base44.entities.Product.get(id);
      setProduct(p);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPrice = () => {
    const license = product?.licenses?.[selectedLicense];
    if (license) return { brl: license.price_brl, usd: license.price_usd };
    const hasDiscount = product?.discount_price_brl && product?.discount_expires_at && new Date(product.discount_expires_at) > new Date();
    return { brl: hasDiscount ? product.discount_price_brl : product?.price_brl, usd: product?.price_usd };
  };

  const addToCart = async () => {
    setAddingToCart(true);
    try {
      const me = await base44.auth.me();
      const license = product.licenses?.[selectedLicense];
      const price = getCurrentPrice();

      await base44.entities.CartItem.create({
        user_email: me.email,
        product_id: product.id,
        product_title: product.title,
        license_name: license?.name || 'Standard',
        price_usd: price.usd || product.price_usd,
        price_brl: price.brl || product.price_brl,
        thumbnail: product.thumbnail,
        file_url: product.file_url,
      });
      toast.success('Adicionado ao carrinho!');
    } catch (e) {
      toast.error('Faça login primeiro');
      navigate('/register');
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    await addToCart();
    navigate('/cart');
  };

  const shareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Link copiado!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[#1A1A1A]" />
          <div className="absolute inset-0 rounded-full border-2 border-t-white animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-[#333] mx-auto" />
          <p className="text-[#555]">Produto não encontrado</p>
          <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90">
            Voltar para loja
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : (product.thumbnail ? [product.thumbnail] : []);
  const hasDiscount = product.discount_price_brl && product.discount_expires_at && new Date(product.discount_expires_at) > new Date();
  const currentLicense = product.licenses?.[selectedLicense];
  const price = getCurrentPrice();
  const displayPrice = price.brl || price.usd || 0;
  const isClosed = product.closed;
  const averageRating = product.average_rating || 0;
  const totalReviews = product.total_reviews || 0;

  const metadata = [
    { icon: FileBox, label: 'Tamanho', value: product.file_size },
    { icon: Layers, label: 'Categoria', value: product.category },
    { icon: Settings, label: 'Versões', value: product.supported_versions },
    { icon: Tag, label: 'Tags', value: product.tags?.slice(0, 3).join(', ') },
  ].filter(m => m.value);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      {/* Navegação melhorada */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-sm text-[#555] hover:text-white transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> 
          Voltar
        </button>
        
        <button 
          onClick={shareProduct}
          className="flex items-center gap-1.5 text-sm text-[#555] hover:text-white transition-colors"
        >
          {copiedLink ? (
            <><Check className="h-4 w-4" /> Link copiado!</>
          ) : (
            <><Share2 className="h-4 w-4" /> Compartilhar</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left - Galeria e Descrição */}
        <div className="lg:col-span-7 space-y-6">
          {/* Image Carousel melhorado */}
          <div className="space-y-3">
            <div className="relative aspect-video bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
              {images.length > 0 ? (
                <img 
                  src={images[selectedImage]} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#555]">
                  Sem imagem disponível
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      i === selectedImage 
                        ? 'border-white shadow-lg' 
                        : 'border-[#1A1A1A] hover:border-[#333]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description melhorada */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Descrição detalhada</h2>
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
              <div className="prose prose-sm prose-invert max-w-none text-[#888] leading-relaxed">
                <ReactMarkdown>{product.long_description || product.description || 'Sem descrição disponível.'}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t border-[#1A1A1A] pt-6">
            <ReviewSection productId={product.id} />
          </div>
        </div>

        {/* Right Sidebar - Card de compra melhorado */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
              
              {/* Header do produto */}
              <div className="p-6 border-b border-[#1A1A1A]">
                <h1 className="text-xl font-bold text-white leading-tight">{product.title}</h1>
                {product.description && (
                  <p className="text-sm text-[#666] mt-2">{product.description}</p>
                )}
                
                {/* Rating */}
                {averageRating > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(averageRating) ? 'fill-yellow-500 text-yellow-500' : 'text-[#333]'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-[#555]">
                      {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'})
                    </span>
                  </div>
                )}
              </div>

              {/* Preço */}
              <div className="p-6 border-b border-[#1A1A1A]">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white">R$ {displayPrice?.toFixed(2)}</span>
                  {hasDiscount && !currentLicense && product.price_brl > 0 && (
                    <span className="text-base text-[#555] line-through mb-1">R$ {product.price_brl?.toFixed(2)}</span>
                  )}
                </div>
                {!hasDiscount && !currentLicense && product.price_brl > 0 && (
                  <p className="text-xs text-[#555] mt-1">À vista no PIX</p>
                )}
              </div>

              {/* Licenças */}
              {product.licenses?.length > 0 && (
                <div className="p-6 border-b border-[#1A1A1A] space-y-3">
                  <label className="text-xs font-semibold text-[#555] uppercase tracking-wider">Tipo de licença</label>
                  <Select value={String(selectedLicense)} onValueChange={(v) => setSelectedLicense(Number(v))}>
                    <SelectTrigger className="bg-[#050505] border-[#1A1A1A] text-white focus:border-[#333]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0A] border-[#1A1A1A]">
                      {product.licenses.map((lic, i) => (
                        <SelectItem key={i} value={String(i)} className="text-white focus:bg-[#1A1A1A]">
                          <div className="flex justify-between w-full">
                            <span>{lic.name}</span>
                            <span className="text-[#555] ml-4">R$ {lic.price_brl?.toFixed(2)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Desconto timer */}
              {hasDiscount && !currentLicense && (
                <div className="p-6 border-b border-[#1A1A1A]">
                  <DiscountCountdown expiresAt={product.discount_expires_at} />
                </div>
              )}

              {/* Botões de ação */}
              <div className="p-6 space-y-3">
                {isClosed ? (
                  <div className="w-full flex items-center justify-center gap-2 h-12 bg-[#111] border border-[#1A1A1A] rounded-xl text-[#555] text-sm font-semibold">
                    <Lock className="h-4 w-4" /> Produto Indisponível
                  </div>
                ) : (
                  <>
                    <Button 
                      onClick={buyNow} 
                      disabled={addingToCart} 
                      className="w-full bg-white text-black hover:bg-white/90 font-bold gap-2 h-12 rounded-xl"
                    >
                      <Zap className="h-4 w-4" /> Comprar Agora
                    </Button>
                    <Button 
                      onClick={addToCart} 
                      disabled={addingToCart} 
                      variant="outline"
                      className="w-full border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white gap-2 h-12 rounded-xl"
                    >
                      <ShoppingCart className="h-4 w-4" /> Adicionar ao Carrinho
                    </Button>
                  </>
                )}
                
                <FavoriteButton product={product} className="w-full justify-center h-10 rounded-xl border border-[#1A1A1A] text-xs gap-1.5" />
              </div>

              {/* Metadados */}
              {metadata.length > 0 && (
                <div className="p-6 border-t border-[#1A1A1A] space-y-4 bg-[#050505]">
                  {metadata.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <item.icon className="h-4 w-4 text-[#555] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-[#555] uppercase tracking-wider">{item.label}</div>
                        <div className="text-sm text-white mt-0.5">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Badge de segurança */}
              <div className="p-4 bg-[#050505] border-t border-[#1A1A1A] flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-[#444]" />
                  <span className="text-[9px] text-[#444]">Compra segura</span>
                </div>
                <div className="w-px h-3 bg-[#1A1A1A]" />
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-[#444]" />
                  <span className="text-[9px] text-[#444]">Entrega instantânea</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}