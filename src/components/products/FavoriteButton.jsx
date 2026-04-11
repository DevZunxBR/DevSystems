// src/components/products/FavoriteButton.jsx - Versão melhorada
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FavoriteButton({ product, className = '' }) {
  const [favoriteId, setFavoriteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [product?.id]);

  const checkFavorite = async () => {
    try {
      const me = await base44.auth.me();
      const favs = await base44.entities.Favorite.filter({ user_email: me.email, product_id: product.id });
      setFavoriteId(favs.length > 0 ? favs[0].id : null);
    } catch {
      setFavoriteId(null);
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const me = await base44.auth.me();
      if (favoriteId) {
        await base44.entities.Favorite.delete(favoriteId);
        setFavoriteId(null);
        toast.success('Removido dos favoritos');
      } else {
        const fav = await base44.entities.Favorite.create({
          user_email: me.email,
          product_id: product.id,
          product_title: product.title,
          product_thumbnail: product.thumbnail,
        });
        setFavoriteId(fav.id);
        toast.success('Adicionado aos favoritos');
      }
    } catch {
      base44.auth.redirectToLogin(window.location.pathname);
    } finally {
      setLoading(false);
    }
  };

  const isFav = !!favoriteId;

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex items-center justify-center gap-1.5 p-2 rounded-lg transition-all duration-200 ${
        isFav 
          ? 'text-red-500 bg-red-500/10 hover:bg-red-500/15' 
          : 'text-[#555] hover:text-red-400 bg-black/40 hover:bg-red-500/10'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      disabled={loading}
    >
      <Heart 
        className={`h-4 w-4 transition-all duration-200 ${
          isFav 
            ? 'fill-red-500' 
            : isHovered 
              ? 'fill-red-500/20' 
              : ''
        } ${loading ? 'animate-pulse' : ''}`} 
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}