// src/pages/ProductDetail.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
  Store,
} from 'lucide-react';
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

const isTypingElement = (element) => {
  if (!element) return false;
  const tag = element.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || element.isContentEditable;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedLicense, setSelectedLicense] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    setSelectedImage(0);
    setSelectedLicense(0);
  }, [product?.id]);

  const loadProduct = async () => {
    setLoading(true);
    setLoadError('');

    try {
      const loadedProduct = await base44.entities.Product.get(id);
      setProduct(loadedProduct || null);
    } catch (error) {
      console.error(error);
      setProduct(null);
      setLoadError('Não foi possível carregar o produto.');
    } finally {
      setLoading(false);
    }
  };

  const images = useMemo(() => {
    if (product?.images?.length) return product.images;
    if (product?.thumbnail) return [product.thumbnail];
    return [];
  }, [product]);

  useEffect(() => {
    if (images.length <= 1) return;

    const onKeyDown = (event) => {
      if (isTypingElement(document.activeElement)) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSelectedImage((current) => (current === 0 ? images.length - 1 : current - 1));
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSelectedImage((current) => (current === images.length - 1 ? 0 : current + 1));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [images.length]);

  const hasDiscount =
    product?.discount_price_brl &&
    product?.discount_expires_at &&
    new Date(product.discount_expires_at) > new Date();

  const currentLicense = product?.licenses?.[selectedLicense];

  const metadata = useMemo(
    () =>
      [
        { icon: FileBox, label: 'Tamanho', value: product?.file_size },
        { icon: Layers, label: 'Categoria', value: product?.category },
        { icon: Settings, label: 'Versões', value: product?.supported_versions },
        { icon: Tag, label: 'Tags', value: product?.tags?.join(', ') },
      ].filter((item) => item.value),
    [product]
  );

  const getCurrentPrice = () => {
    const license = product?.licenses?.[selectedLicense];
    if (license) {
      return {
        brl: toNumber(license.price_brl),
        usd: toNumber(license.price_usd),
      };
    }

    return {
      brl: hasDiscount ? toNumber(product?.discount_price_brl) : toNumber(product?.price_brl),
      usd: toNumber(product?.price_usd),
    };
  };

  const price = getCurrentPrice();
  const displayPrice = price.brl || price.usd || 0;

  const changeImage = (direction) => {
    if (images.length <= 1) return;

    setSelectedImage((current) => {
      if (direction === 'prev') {
        return current === 0 ? images.length - 1 : current - 1;
      }
      return current === images.length - 1 ? 0 : current + 1;
    });
  };

  const addToCartAndGoToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      const me = await base44.auth.me();
      const license = product.licenses?.[selectedLicense];

      await base44.entities.CartItem.create({
        user_email: me.email,
        product_id: product.id,
        product_title: product.title,
        license_name: license?.name || 'Standard',
        price_usd: price.usd || toNumber(product.price_usd),
        price_brl: price.brl || toNumber(product.price_brl),
        thumbnail: product.thumbnail,
        file_url: product.file_url,
      });

      toast.success('Adicionado ao carrinho!');
      navigate('/cart');
    } catch (error) {
      console.error(error);
      toast.error('Faça login primeiro');
      navigate('/register');
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    if (!product) return;

    setBuyingNow(true);
    try {
      await base44.auth.me();
      const license = product.licenses?.[selectedLicense];

      const directProduct = {
        product_id: product.id,
        product_title: product.title,
        license_name: license?.name || 'Standard',
        price_usd: price.usd || toNumber(product.price_usd),
        price_brl: price.brl || toNumber(product.price_brl),
        thumbnail: product.thumbnail,
        file_url: product.file_url,
        is_direct_purchase: true,
      };

      sessionStorage.setItem('direct_purchase', JSON.stringify(directProduct));
      navigate('/checkout?direct=true');
    } catch (error) {
      console.error(error);
      toast.error('Faça login primeiro');
      navigate('/register');
    } finally {
      setBuyingNow(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <p className="text-[#555]">{loadError}</p>
          <Button variant="outline" onClick={loadProduct} className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A1A] hover:text-white">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#555]">Produto não encontrado</p>
      </div>
    );
  }

  const isClosed = Boolean(product.closed);

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
                <img src={images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#555]">Sem imagem disponível</div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => changeImage('prev')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full text-white hover:bg-black/80"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => changeImage('next')}
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

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={img + index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImage ? 'border-white' : 'border-[#1A1A1A] hover:border-[#333]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Descrição</h2>
            <div className="prose prose-sm prose-invert max-w-none text-[#888]">
              <ReactMarkdown>{product.long_description || product.description || 'Sem descrição disponível.'}</ReactMarkdown>
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t border-[#1A1A1A] pt-6">
            <ReviewSection productId={product.id} />
          </div>
        </div>

        {/* Coluna da direita - Card da sidebar */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 space-y-5">
              <div>
                <h1 className="text-xl font-bold text-white">{product.title}</h1>
                {product.description && <p className="text-sm text-[#666] mt-1">{product.description}</p>}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {product.category && (
                    <span className="text-[10px] px-2 py-1 rounded-full border border-[#1A1A1A] text-[#666]">{product.category}</span>
                  )}
                  {product.file_size && (
                    <span className="text-[10px] px-2 py-1 rounded-full border border-[#1A1A1A] text-[#666]">{product.file_size}</span>
                  )}
                </div>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">R$ {toNumber(displayPrice).toFixed(2)}</span>
                {hasDiscount && !currentLicense && toNumber(product.price_brl) > 0 && (
                  <span className="text-lg text-[#555] line-through mb-0.5">R$ {toNumber(product.price_brl).toFixed(2)}</span>
                )}
              </div>

              {product.licenses?.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#666]">Licença</label>
                  <Select value={String(selectedLicense)} onValueChange={(value) => setSelectedLicense(Number(value))}>
                    <SelectTrigger className="bg-[#050505] border-[#1A1A1A] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0A] border-[#1A1A1A]">
                      {product.licenses.map((license, index) => (
                        <SelectItem key={`${license.name}-${index}`} value={String(index)} className="text-white">
                          {license.name} - R$ {toNumber(license.price_brl).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {hasDiscount && !currentLicense && <DiscountCountdown expiresAt={product.discount_expires_at} />}

              {/* Link para a loja do criador */}
              {product.creator_id && product.creator_name && (
                <div className="pt-2">
                  <div className="flex items-center gap-3 p-3 bg-[#1A1A1A]/30 rounded-xl">
                    <Link to={`/creator/${product.creator_id}`}>
                      <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
                        {product.creator_avatar ? (
                          <img src={product.creator_avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {product.creator_name?.[0]?.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <p className="text-xs text-[#555]">Criado por</p>
                      <Link to={`/creator/${product.creator_id}`} className="text-sm font-medium text-white hover:underline">
                        {product.creator_name}
                      </Link>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/creator/${product.creator_id}`)}
                      className="border-[#1A1A1A] text-xs gap-1"
                    >
                      <Store className="h-3 w-3" /> Ver Loja
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {isClosed ? (
                  <div className="w-full flex items-center justify-center gap-2 h-11 bg-[#111] border border-[#1A1A1A] rounded-xl text-[#555] text-sm font-semibold">
                    <Lock className="h-4 w-4" /> Produto indisponível
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={addToCartAndGoToCart}
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

                <FavoriteButton product={product} className="w-full justify-center h-11 rounded-xl border border-[#1A1A1A] text-xs gap-1.5" />
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