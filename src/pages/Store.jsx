// src/pages/Store.jsx - Versão corrigida mantendo o sistema original
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, TrendingUp, Clock, DollarSign, Filter } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';

const CATEGORIES = ['Todos', 'Scripts', 'Systems', 'Interfaces', 'Plugins', 'Templates', 'Assets', 'Tools'];
const SORT_OPTIONS = [
  { value: '-created_date', label: 'Mais Recentes', icon: Clock },
  { value: 'price_brl', label: 'Menor Preço', icon: DollarSign },
  { value: '-price_brl', label: 'Maior Preço', icon: DollarSign },
  { value: '-sales_count', label: 'Mais Vendidos', icon: TrendingUp },
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

  // Carregar produtos do Supabase usando base44 (sistema original)
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = { status: 'active' };
      if (selectedCategory !== 'Todos') query.category = selectedCategory;
      
      let results = await base44.entities.Product.filter(query, sortBy, 100);
      
      // Filtro por busca (se houver)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        results = results.filter(p =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
        );
      }
      
      setProducts(results);
    } catch (e) {
      console.error('Erro ao carregar produtos:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Sincronizar com URL
  useEffect(() => {
    const category = searchParams.get('cat');
    const search = searchParams.get('search');
    
    if (category && category !== selectedCategory) {
      setSelectedCategory(category);
    }
    if (search && search !== searchQuery) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory !== 'Todos') params.cat = selectedCategory;
    setSearchParams(params);
    loadProducts();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todos');
    setSortBy('-created_date');
    setSearchParams({});
    loadProducts();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (category !== 'Todos') params.cat = category;
    setSearchParams(params);
  };

  const currentSort = SORT_OPTIONS.find(s => s.value === sortBy);
  const SortIcon = currentSort?.icon;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10 space-y-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Asset Library</h1>
          <p className="text-sm text-[#666] mt-2">
            Scripts, sistemas e assets prontos para Desenvolvedores. Encontre o que precisa para seu projeto, com qualidade e suporte dedicado.
          </p>
        </div>

        {/* Barra de busca e filtros */}
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
            <input
              type="text"
              placeholder="Buscar assets"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-10 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333] transition-colors"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({ cat: selectedCategory !== 'Todos' ? selectedCategory : undefined });
                  loadProducts();
                }} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          <div className="flex gap-2">
            {/* Sort dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 h-11 px-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-sm text-[#999] hover:border-[#333] transition-all"
              >
                {SortIcon && <SortIcon className="h-3.5 w-3.5" />}
                {currentSort?.label}
                <ChevronDown className={`h-3 w-3 transition-transform ${showSort ? 'rotate-180' : ''}`} />
              </button>
              
              {showSort && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden z-20 shadow-xl">
                    {SORT_OPTIONS.map(opt => {
                      const Icon = opt.icon;
                      return (
                        <button 
                          key={opt.value} 
                          onClick={() => { 
                            setSortBy(opt.value); 
                            setShowSort(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                            sortBy === opt.value 
                              ? 'text-white bg-[#111]' 
                              : 'text-[#666] hover:text-white hover:bg-[#111]'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Mobile filter button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden h-11 w-11 flex items-center justify-center bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-[#999] hover:border-[#333] transition-all"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className={`flex flex-wrap gap-2 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => {
                handleCategoryChange(cat);
                setTimeout(() => loadProducts(), 0);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-lg'
                  : 'bg-[#0A0A0A] border border-[#1A1A1A] text-[#666] hover:text-white hover:border-[#333]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados info */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[#555]">
          {loading ? (
            'Carregando...'
          ) : (
            <>
              {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
              {(selectedCategory !== 'Todos' || searchQuery) && (
                <button 
                  onClick={clearFilters}
                  className="ml-3 text-xs text-[#444] hover:text-white transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </>
          )}
        </p>
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-[#111]" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[#111] rounded w-3/4" />
                <div className="h-3 bg-[#111] rounded w-1/2" />
                <div className="h-8 bg-[#111] rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <div 
              key={product.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in-up"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 space-y-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl">
          <div className="w-16 h-16 bg-[#111] rounded-2xl flex items-center justify-center mx-auto">
            <Search className="h-8 w-8 text-[#333]" />
          </div>
          <div>
            <p className="text-[#555] text-base">Nenhum produto encontrado</p>
            <p className="text-[#444] text-sm mt-1">
              Tente ajustar os filtros ou buscar por outro termo
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={clearFilters} 
            className="border-[#1A1A1A] text-[#666] hover:bg-[#0A0A0A] hover:text-white"
          >
            Limpar todos os filtros
          </Button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}