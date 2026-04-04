import { Link } from 'react-router-dom';
import { ShoppingCart, Lock } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import FavoriteButton from './FavoriteButton';

function DiscountBadge({ expiresAt, discountPrice, regularPrice }) {
  const timeLeft = useCountdown(expiresAt);
  if (!timeLeft || !discountPrice) return null;
  const pct = Math.round((1 - discountPrice / regularPrice) * 100);
  const parts = [];
  if (timeLeft.d > 0) parts.push(`${timeLeft.d}d`);
  parts.push(`${timeLeft.h}h ${timeLeft.m}m`);
  return (
    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">-{pct}% OFF</span>
      <span className="bg-black/80 text-red-400 text-[9px] font-mono px-1.5 py-0.5 rounded">{parts.join(' ')}</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const price = product.discount_price_brl && product.discount_expires_at && new Date(product.discount_expires_at) > new Date()
    ? product.discount_price_brl
    : product.price_brl;
  const isDiscounted = price !== product.price_brl && product.price_brl > 0;
  const isClosed = product.closed;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden hover:border-[#333] transition-all duration-300"
    >
      <div className="relative aspect-video bg-[#111] overflow-hidden">
        {product.thumbnail ? (
          <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#333]">
            <ShoppingCart className="h-8 w-8" />
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-white text-black text-[9px] font-black px-2 py-0.5 rounded">DESTAQUE</span>
        )}
        {isClosed && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-black/80 border border-[#333] px-3 py-1.5 rounded-lg">
              <Lock className="h-3.5 w-3.5 text-[#666]" />
              <span className="text-xs text-[#666] font-semibold">Indisponível</span>
            </div>
          </div>
        )}
        <DiscountBadge expiresAt={product.discount_expires_at} discountPrice={product.discount_price_brl} regularPrice={product.price_brl} />
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
          {!product.is_featured && <FavoriteButton product={product} />}
        </div>
        {product.is_featured && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
            <FavoriteButton product={product} />
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-white transition-colors">{product.title}</h3>
        {product.description && (
          <p className="text-xs text-[#555] line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[#555] bg-[#111] px-2 py-0.5 rounded">{product.category}</span>
          <div className="flex items-center gap-1.5">
            {isDiscounted && (
              <span className="text-xs text-[#555] line-through">R${product.price_brl?.toFixed(2)}</span>
            )}
            <span className={`text-sm font-bold ${isDiscounted ? 'text-red-400' : 'text-white'}`}>
              R${price?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}