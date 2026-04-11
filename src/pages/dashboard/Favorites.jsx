import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const me = await base44.auth.me();
      const favs = await base44.entities.Favorite.filter({ user_email: me.email }, '-created_date');
      setFavorites(favs || []);
    } catch (error) {
      console.error(error);
      toast.error('Nao foi possivel carregar favoritos.');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favorite) => {
    try {
      await base44.entities.Favorite.delete(favorite.id);
      setFavorites((prev) => prev.filter((item) => item.id !== favorite.id));
      toast.success('Removido dos favoritos');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao remover favorito.');
    }
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
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Favoritos</h1>
        <p className="text-sm text-[#555] mt-1">{favorites.length} produto{favorites.length !== 1 ? 's' : ''} salvos</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
          <Heart className="h-10 w-10 text-[#333] mx-auto mb-3" />
          <p className="text-[#555] text-sm">Nenhum favorito ainda.</p>
          <Link to="/store" className="text-xs text-white underline mt-2 inline-block">
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="group bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden hover:border-[#333] transition-all">
              <Link to={`/product/${favorite.product_id}`}>
                <div className="aspect-video bg-[#111] overflow-hidden">
                  {favorite.product_thumbnail ? (
                    <img
                      src={favorite.product_thumbnail}
                      alt={favorite.product_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#333]">
                      <Heart className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white truncate">{favorite.product_title}</h3>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <button
                  onClick={() => removeFavorite(favorite)}
                  className="flex items-center gap-1.5 text-xs text-[#555] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
