import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  ChevronDown,
  TrendingUp,
  Clock,
  DollarSign,
  Filter,
  Sparkles,
  Tag,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';

const CATEGORIES = ['Todos', 'Scripts', 'Systems', 'User Interface', 'Plugins', 'Templates', 'Assets', 'Tools'];
const SORT_OPTIONS = [
  { value: '-created_date', label: 'Mais Recentes', icon: Clock },
  { value: 'price_brl', label: 'Menor Preco', icon: DollarSign },
  { value: '-price_brl', label: 'Maior Preco', icon: DollarSign },
  { value: '-sales_count', label: 'Mais Vendidos', icon: TrendingUp },
];

function ProductSkeleton() {
  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-video bg-[#111]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#111] rounded w-3/4" />
        <div className="h-3 bg-[#111] rounded w-1/2" />
        <div className="h-8 bg-[#111] rounded mt-2" />
      </div>
    </div>
  );
}

export default function Store() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'Todos');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-created_date');
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const updateUrlParams = useCallback(
    (next) => {
      const params = {};
      if (next.search) params.search = next.search;
      if (next.category && next.category !== 'Todos') params.cat = next.category;
      if (next.sort && next.sort !== '-created_date') params.sort = next.sort;
      setSearchParams(params);
    },
    [setSearchParams]
  );

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = { status: 'active' };
      if (selectedCategory !== 'Todos') {
        query.category = selectedCategory;
      }

      let results = await base44.entities.Product.filter(query, sortBy, 100);

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        results = results.filter(
          (product) =>
            product.title?.toLowerCase().includes(q) ||
            product.description?.toLowerCase().includes(q) ||
            product.tags?.some((tag) => tag.toLowerCase().includes(q))
        );
      }

      setProducts(results);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('cat') || 'Todos';
    const searchFromUrl = searchParams.get('search') || '';
    const sortFromUrl = searchParams.get('sort') || '-created_date';

    if (categoryFromUrl !== selectedCategory) setSelectedCategory(categoryFromUrl);
    if (searchFromUrl !== searchQuery) setSearchQuery(searchFromUrl);
    if (sortFromUrl !== sortBy) setSortBy(sortFromUrl);
  }, [searchParams]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'Todos') count += 1;
    if (searchQuery.trim()) count += 1;
    if (sortBy !== '-created_date') count += 1;
    return count;
  }, [selectedCategory, searchQuery, sortBy]);

  const currentSort = SORT_OPTIONS.find((item) => item.value === sortBy) || SORT_OPTIONS[0];
  const SortIcon = currentSort.icon;

  const handleSearch = (event) => {
    event.preventDefault();
    updateUrlParams({ search: searchQuery.trim(), category: selectedCategory, sort: sortBy });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    updateUrlParams({ search: searchQuery.trim(), category, sort: sortBy });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setShowSort(false);
    updateUrlParams({ search: searchQuery.trim(), category: selectedCategory, sort: value });
  };

  const clearSearchOnly = () => {
    setSearchQuery('');
    updateUrlParams({ search: '', category: selectedCategory, sort: sortBy });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todos');
    setSortBy('-created_date');
    setShowFilters(false);
    updateUrlParams({ search: '', category: 'Todos', sort: '-created_date' });
  };

  const hasProducts = products.length > 0;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8 md:py-10">
      <div className="mb-8 md:mb-10 space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 border border-[#1A1A1A] bg-[#0A0A0A] rounded-full px-3 py-1 text-[10px] text-[#555] uppercase tracking-wide">
            <Sparkles className="h-3 w-3" />
            Colecao Atualizada
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Asset Library</h1>
            <p className="text-sm text-[#666] mt-2">Sistemas e assets para desenvolvedores.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#444] mb-1">Itens exibidos</p>
              <p className="text-white text-lg font-bold">{loading ? '...' : products.length}</p>
            </div>
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#444] mb-1">Categoria</p>
              <p className="text-white text-sm font-semibold">{selectedCategory}</p>
            </div>
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#444] mb-1">Ordenacao</p>
              <p className="text-white text-sm font-semibold">{currentSort.label}</p>
            </div>
          </div>
        </div>

        <div className="sticky top-3 z-20 bg-black/85 backdrop-blur-sm border border-[#1A1A1A] rounded-2xl p-3 md:p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
              <input
                type="text"
                placeholder="Buscar assets e systems"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full h-11 pl-11 pr-10 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearchOnly}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowSort((value) => !value)}
                  className="flex items-center gap-2 h-11 px-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-sm text-[#999] hover:border-[#333] transition-all"
                >
                  <SortIcon className="h-3.5 w-3.5" />
                  {currentSort.label}
                  <ChevronDown className={`h-3 w-3 transition-transform ${showSort ? 'rotate-180' : ''}`} />
                </button>

                {showSort && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden z-20 shadow-xl">
                      {SORT_OPTIONS.map((option) => {
                        const OptionIcon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                              sortBy === option.value ? 'text-white bg-[#111]' : 'text-[#666] hover:text-white hover:bg-[#111]'
                            }`}
                          >
                            <OptionIcon className="h-3.5 w-3.5" />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowFilters((value) => !value)}
                className="md:hidden h-11 px-3 flex items-center justify-center gap-1.5 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-[#999] hover:border-[#333] transition-all"
              >
                <Filter className="h-4 w-4" />
                {activeFiltersCount > 0 ? activeFiltersCount : null}
              </button>
            </div>
          </div>

          <div className={`flex flex-wrap gap-2 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'bg-[#0A0A0A] border border-[#1A1A1A] text-[#666] hover:text-white hover:border-[#333]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-[11px] text-[#555]">
                <Tag className="h-3.5 w-3.5" />
                {activeFiltersCount} filtro(s) ativo(s)
              </div>
              <button onClick={clearFilters} className="text-xs text-[#444] hover:text-white transition-colors">
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[#555]">
          {loading
            ? 'Carregando produtos...'
            : `${products.length} produto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : hasProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${index * 45}ms` }} className="animate-fade-in-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl">
          <div className="w-16 h-16 bg-[#111] rounded-2xl flex items-center justify-center mx-auto">
            <Search className="h-8 w-8 text-[#333]" />
          </div>
          <div>
            <p className="text-[#555] text-base">Nenhum produto encontrado</p>
            <p className="text-[#444] text-sm mt-1">Tente ajustar os filtros ou buscar por outro termo.</p>
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

      <style>{`
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
