import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, ChevronLeft, ChevronRight, FileBox, Tag, Layers, Settings, Lock, Clock } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import FavoriteButton from '@/components/products/FavoriteButton';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import ReviewSection from '@/components/products/ReviewSection';
import { useCurrency } from '@/hooks/useCurrency';

function DiscountCountdown({ expiresAt, originalPrice }) {
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
  const [currency] = useCurrency();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const products = await base44.entities.Product.filter({ id });
      if (products.length > 0) {
        setProduct(products[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    setAddingToCart(true);
    try {
      const me = await base44.auth.me();
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
      toast.success('Added to cart');
    } catch (e) {
      toast.error('Please login first');
      base44.auth.redirectToLogin(window.location.pathname);
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    await addToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const images = product.images?.length ? product.images : (product.thumbnail ? [product.thumbnail] : []);
  const currentLicense = product.licenses?.[selectedLicense];

  const hasDiscount = product.discount_price_brl && product.discount_expires_at && new Date(product.discount_expires_at) > new Date();
  const displayPrice = hasDiscount ? product.discount_price_brl : (product.price_brl || product.price_usd || 0);
  const symbol = 'R$';
  const isClosed = product.closed;

  const metadata = [
    { icon: FileBox, label: 'File Size', value: product.file_size },
    { icon: Layers, label: 'Category', value: product.category },
    { icon: Settings, label: 'Versions', value: product.supported_versions },
    { icon: Tag, label: 'Tags', value: product.tags?.join(', ') },
  ].filter(m => m.value);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left: Images + Description (70%) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Image Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-video bg-card border border-border rounded-xl overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
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
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-white' : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Descrição</h2>
            <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
              <ReactMarkdown>{product.long_description || product.description || 'Sem descrição disponível.'}</ReactMarkdown>
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t border-border pt-6">
            <ReviewSection productId={product.id} />
          </div>
        </div>

        {/* Right: Sidebar (30%) */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div className="bg-card border border-border rounded-xl p-6 space-y-5">
              <div>
                <h1 className="text-xl font-bold text-foreground">{product.title}</h1>
                {product.description && (
                  <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-foreground">{symbol}{displayPrice?.toFixed(2)}</span>
                {hasDiscount && product.price_brl > 0 && (
                  <span className="text-lg text-[#555] line-through mb-0.5">{symbol}{product.price_brl?.toFixed(2)}</span>
                )}
              </div>

              {/* License Selector */}
              {product.licenses?.length > 1 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">License</label>
                  <Select
                    value={String(selectedLicense)}
                    onValueChange={(v) => setSelectedLicense(Number(v))}
                  >
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {product.licenses.map((lic, i) => (
                        <SelectItem key={i} value={String(i)} className="text-foreground">
                          {lic.name} — {symbol}{(currency === 'BRL' ? lic.price_brl : lic.price_usd)?.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Discount countdown */}
              {hasDiscount && <DiscountCountdown expiresAt={product.discount_expires_at} originalPrice={product.price_brl} />}

              {/* Actions */}
              <div className="space-y-2">
                {isClosed ? (
                  <div className="w-full flex items-center justify-center gap-2 h-10 bg-[#111] border border-[#1A1A1A] rounded-lg text-[#555] text-sm font-semibold">
                    <Lock className="h-4 w-4" /> Produto Indisponível
                  </div>
                ) : (
                  <>
                    <Button onClick={addToCart} disabled={addingToCart} variant="outline"
                      className="w-full border-border text-foreground hover:bg-secondary gap-2">
                      <ShoppingCart className="h-4 w-4" /> Adicionar ao Carrinho
                    </Button>
                    <Button onClick={buyNow} className="w-full bg-white text-black hover:bg-white/90 font-semibold gap-2">
                      <Zap className="h-4 w-4" /> Comprar Agora
                    </Button>
                  </>
                )}
                <FavoriteButton product={product} className="w-full justify-center h-9 rounded-lg border border-[#1A1A1A] text-xs gap-1.5" />
              </div>

              {/* Metadata */}
              {metadata.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  {metadata.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="text-sm text-foreground">{item.value}</div>
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