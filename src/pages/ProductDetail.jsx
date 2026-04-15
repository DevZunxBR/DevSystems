// src/pages/ProductDetail.jsx - Agora suporta produtos E bundles
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Package as PackageIcon,
  ArrowRight
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

const isTypingElement = (element) => {
  if (!element) return false;
  const tag = element.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || element.isContentEditable;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedLicense, setSelectedLicense] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [isBundle, setIsBundle] = useState(false);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [productBundles, setProductBundles] = useState([]);

  useEffect(() => {
    loadItem();
  }, [id]);

  useEffect(() => {
    setSelectedImage(0);
    setSelectedLicense(0);
  }, [item?.id]);

  const loadItem = async () => {
    setLoading(true);
    setLoadError('');

    try {
      // Primeiro tenta carregar como produto
      let loadedItem = null;
      try {
        loadedItem = await base44.entities.Product.get(id);
        setIsBundle(false);
      } catch {
        // Se não for produto, tenta carregar como bundle
        loadedItem = await base44.entities.Bundle.get(id);
        setIsBundle(true);
      }
      
      setItem(loadedItem || null);
      
      // Se for bundle, carregar os produtos do bundle
      if (isBundle && loadedItem) {
        const bundleProductsData = await supabase
          .from('bundle_products')
          .select('product_id')
          .eq('bundle_id', id);
        
        const productIds = bundleProductsData.data.map(bp => bp.product_id);
        const productsData = await Promise.all(productIds.map(pid => base44.entities.Product.get(pid)));
        setBundleProducts(productsData);
      }
      
      // Se for produto, carregar bundles que contêm este produto
      if (!isBundle && loadedItem) {
        const allBundles = await base44.entities.Bundle.filter({ status: 'active' });
        const bundlesWithProduct = [];
        
        for (const bundle of allBundles) {
          const bundleProductsData = await supabase
            .from('bundle_products')
            .select('product_id')
            .eq('bundle_id', bundle.id);
          const productIds = bundleProductsData.data.map(bp => bp.product_id);
          if (productIds.includes(loadedItem.id)) {
            bundlesWithProduct.push(bundle);
          }
        }
        setProductBundles(bundlesWithProduct);
      }
    } catch (error) {
      console.error(error);
      setItem(null);
      setLoadError('Não foi possível carregar o item.');
    } finally {
      setLoading(false);
    }
  };

  const images = useMemo(() => {
    if (item?.images?.length) return item.images;
    if (item?.thumbnail) return [item.thumbnail];
    return [];
  }, [item]);

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

  const hasDiscount = item?.discount_price_brl && item?.discount_expires_at && new Date(item.discount_expires_at) > new Date();
  const currentLicense = item?.licenses?.[selectedLicense];
  const isClosed = Boolean(item?.closed);

const metadata = useMemo(() => {
  if (isBundle) return []; // Bundles não têm metadata
  
  return [
    { icon: FileBox, label: 'Tamanho', value: item?.file_size },
    { icon: Layers, label: 'Categoria', value: item?.category },
    { icon: Settings, label: 'Versões', value: item?.supported_versions },
    { icon: Tag, label: 'Tags', value: item?.tags?.join(', ') },
  ].filter(m => m.value);
}, [item, isBundle]);

  const getCurrentPrice = () => {
    if (isBundle) {
      return {
        brl: hasDiscount ? toNumber(item?.discount_price_brl) : toNumber(item?.price_brl),
        usd: 0,
      };
    }
    
    const license = item?.licenses?.[selectedLicense];
    if (license) {
      return {
        brl: toNumber(license.price_brl),
        usd: toNumber(license.price_usd),
      };
    }

    return {
      brl: hasDiscount ? toNumber(item?.discount_price_brl) : toNumber(item?.price_brl),
      usd: toNumber(item?.price_usd),
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
    if (!item) return;

    setAddingToCart(true);
    try {
      const me = await base44.auth.me();
      
      if (isBundle) {
        // Adicionar todos os produtos do bundle
        for (const product of bundleProducts) {
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
      } else {
        // Adicionar produto normal
        const license = item.licenses?.[selectedLicense];
        await base44.entities.CartItem.create({
          user_email: me.email,
          product_id: item.id,
          product_title: item.title,
          license_name: license?.name || 'Standard',
          price_usd: price.usd || toNumber(item.price_usd),
          price_brl: price.brl || toNumber(item.price_brl),
          thumbnail: item.thumbnail,
          file_url: item.file_url,
        });
      }
      
      toast.success(isBundle ? 'Bundle adicionado ao carrinho!' : 'Adicionado ao carrinho!');
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
    await addToCartAndGoToCart();
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
          <Button variant="outline" onClick={loadItem} className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#555]">Item não encontrado</p>
      </div>
    );
  }

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
                <img src={images[selectedImage]} alt={item.title} className="w-full h-full object-cover" />
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
              <ReactMarkdown>{item.long_description || item.description || 'Sem descrição disponível.'}</ReactMarkdown>
            </div>
          </div>

          {/* Produtos do Bundle (se for bundle) */}
          {isBundle && bundleProducts.length > 0 && (
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PackageIcon className="h-4 w-4" /> Produtos incluídos ({bundleProducts.length})
              </h3>
              <div className="space-y-3">
                {bundleProducts.map((product) => (
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
          )}

          {/* Reviews */}
          <div className="border-t border-[#1A1A1A] pt-6">
            <ReviewSection productId={item.id} isBundle={isBundle} />
          </div>

          {/* Available in Bundles (se for produto) */}
          {!isBundle && productBundles.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#1A1A1A]">
              <h3 className="text-base font-bold text-white mb-4">Available in Bundles</h3>
              <p className="text-sm text-[#555] mb-4">
                This product is included in bundles. Save money by purchasing the bundle instead!
              </p>
              <div className="space-y-3">
                {productBundles.map((bundle) => {
                  const bundlePrice = bundle.discount_price_brl || bundle.price_brl;
                  const hasBundleDiscount = bundle.discount_price_brl && bundle.discount_price_brl < bundle.price_brl;
                  const savings = bundle.price_brl - (bundle.discount_price_brl || bundle.price_brl);
                  
                  return (
                    <div
                      key={bundle.id}
                      onClick={() => navigate(`/product/${bundle.id}`)}
                      className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl hover:border-[#333] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#111] rounded-lg flex items-center justify-center">
                          {bundle.thumbnail ? (
                            <img src={bundle.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <PackageIcon className="h-6 w-6 text-[#555]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{bundle.title}</p>
                          <p className="text-xs text-[#555]">{bundle.total_products || 0} products</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {hasBundleDiscount && (
                          <p className="text-xs text-green-500">Save R$ {savings.toFixed(2)}</p>
                        )}
                        <p className="text-sm font-bold text-white">R$ {bundlePrice?.toFixed(2)}</p>
                        <p className="text-xs text-[#555]">for the bundle</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#555] opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Coluna da direita */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 space-y-5">
              <div>
                <h1 className="text-xl font-bold text-white">{item.title}</h1>
                {item.description && <p className="text-sm text-[#666] mt-1">{item.description}</p>}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {item.category && (
                    <span className="text-[10px] px-2 py-1 rounded-full border border-[#1A1A1A] text-[#666]">{item.category}</span>
                  )}
                  {isBundle && (
                    <span className="text-[10px] px-2 py-1 rounded-full border border-[#1A1A1A] text-[#666]">Bundle</span>
                  )}
                </div>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">R$ {toNumber(displayPrice).toFixed(2)}</span>
                {hasDiscount && !currentLicense && toNumber(item.price_brl) > 0 && (
                  <span className="text-lg text-[#555] line-through mb-0.5">R$ {toNumber(item.price_brl).toFixed(2)}</span>
                )}
              </div>

              {!isBundle && item.licenses?.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#666]">Licença</label>
                  <Select value={String(selectedLicense)} onValueChange={(value) => setSelectedLicense(Number(value))}>
                    <SelectTrigger className="bg-[#050505] border-[#1A1A1A] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0A] border-[#1A1A1A]">
                      {item.licenses.map((license, index) => (
                        <SelectItem key={`${license.name}-${index}`} value={String(index)} className="text-white">
                          {license.name} - R$ {toNumber(license.price_brl).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {hasDiscount && !currentLicense && <DiscountCountdown expiresAt={item.discount_expires_at} />}

              <div className="space-y-2">
                {isClosed ? (
                  <div className="w-full flex items-center justify-center gap-2 h-11 bg-[#111] border border-[#1A1A1A] rounded-xl text-[#555] text-sm font-semibold">
                    <Lock className="h-4 w-4" /> {isBundle ? 'Bundle indisponível' : 'Produto indisponível'}
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

                {!isBundle && <FavoriteButton product={item} className="w-full justify-center h-11 rounded-xl border border-[#1A1A1A] text-xs gap-1.5" />}
              </div>

              {metadata.length > 0 && !isBundle && (
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