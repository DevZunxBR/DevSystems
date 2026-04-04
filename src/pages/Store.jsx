import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';

const CATEGORIES = ['Todos', 'Scripts', 'Systems', 'UI Kits', 'Plugins', 'Templates', 'Assets', 'Tools'];
const SORT_OPTIONS = [
  { value: '-created_date', label: 'Mais Recentes' },
  { value: 'price_brl', label: 'Menor Preço' },
  { value: '-price_brl', label: 'Maior Preço' },
  { value: '-sales_count', label: 'Mais Vendidos' },
];

export default function Store() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'Todos');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('-created_date');
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    const s = searchParams.get('search');
    const c = searchParams.get('cat');
    if (s) { setSearchQuery(s); }
    if (c) { setSelectedCategory(c); }
  }, [searchParams]);

  const loadProducts = async (search) => {
    setLoading(true);
    try {
      const query = { status: 'active' };
      if (selectedCategory !== 'Todos') query.category = selectedCategory;
      let results = await base44.entities.Product.filter(query, sortBy, 60);
      const q = (search !== undefined ? search : searchQuery).toLowerCase();
      if (q) {
        results = results.filter(p =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
        );
      }
      setProducts(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
    loadProducts(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    loadProducts('');
  };

  const currentSort = SORT_OPTIONS.find(s => s.value === sortBy);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10 space-y-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Asset Library</h1>
          <p className="text-sm text-[#666] mt-2">Scripts, sistemas e assets premium prontos para produção</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
            <input
              type="text"
              placeholder="Buscar assets, scripts, sistemas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-10 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333]"
            />
            {searchQuery && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          <div className="flex gap-2">
            <div className="relative">
              <button onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 h-11 px-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-sm text-[#999] hover:border-[#333] transition-colors whitespace-nowrap">
                <SlidersHorizontal className="h-4 w-4" />
                {currentSort?.label}
                <ChevronDown className="h-3 w-3" />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden z-20 shadow-xl">
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === opt.value ? 'text-white bg-[#111]' : 'text-[#666] hover:text-white hover:bg-[#111]'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setShowFilters(!showFilters)}
              className="md:hidden h-11 w-11 flex items-center justify-center bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-[#999]">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className={`flex flex-wrap gap-2 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#0A0A0A] border border-[#1A1A1A] text-[#666] hover:text-white hover:border-[#333]'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[#555]">
          {loading ? 'Carregando...' : `${products.length} produto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-[#111]" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-[#111] rounded w-3/4" />
                <div className="h-3 bg-[#111] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="text-center py-24 space-y-4">
          <div className="w-16 h-16 bg-[#0A0A0A] rounded-2xl flex items-center justify-center mx-auto">
            <Search className="h-8 w-8 text-[#333]" />
          </div>
          <p className="text-[#555] text-sm">Nenhum produto encontrado</p>
          <Button variant="outline" onClick={clearSearch} className="border-[#1A1A1A] text-[#666] hover:bg-[#0A0A0A] hover:text-white text-xs">
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}