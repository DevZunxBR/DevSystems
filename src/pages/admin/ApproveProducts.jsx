// src/pages/admin/ApproveProducts.jsx
import { useState, useEffect } from 'react';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { Eye, Clock, FileArchive, Image, Tag, DollarSign, User, Calendar, ChevronDown, ChevronUp, Download, CheckCircle } from 'lucide-react';

export default function ApproveProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Buscar TODOS os produtos dos criadores (apenas para visualização)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .not('creator_id', 'is', null) // apenas produtos de criadores
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Assets dos Criadores</h1>
          <p className="text-sm text-[#555] mt-1">{products.length} asset(s) publicados por criadores</p>
        </div>
        <div className="px-3 py-1.5 bg-green-500/20 text-green-500 text-xs rounded-full flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Publicação direta (sem aprovação)
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
          <Clock className="h-12 w-12 text-[#555] mx-auto mb-3" />
          <p className="text-[#555]">Nenhum asset publicado por criadores ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
              {/* Cabeçalho do card */}
              <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-6 w-6 text-[#555]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                        <p className="text-sm text-[#555] flex items-center gap-2">
                          <User className="h-3 w-3" />
                          Criador: {product.creator_name || product.creator_email || 'Desconhecido'}
                        </p>
                        <p className="text-xs text-[#555] flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          Publicado em: {new Date(product.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2A2A2A]"
                    >
                      {expandedId === product.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      {expandedId === product.id ? 'Ocultar' : 'Ver Detalhes'}
                    </button>
                  </div>
                </div>

                {/* Detalhes expandidos - Tudo que o criador enviou */}
                {expandedId === product.id && (
                  <div className="mt-4 pt-4 border-t border-[#1A1A1A] space-y-5">
                    
                    {/* Informações Básicas */}
                    <div>
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Tag className="h-3 w-3" /> Informações do Asset
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-[#555] block text-xs">Categoria</span>
                          <p className="text-white">{product.category || '-'}</p>
                        </div>
                        <div>
                          <span className="text-[#555] block text-xs">Preço</span>
                          <p className="text-white font-semibold">R$ {product.price_brl?.toFixed(2) || '0,00'}</p>
                        </div>
                        <div>
                          <span className="text-[#555] block text-xs">Status</span>
                          <p className="text-green-400">Publicado</p>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {product.tags?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {product.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#1A1A1A] rounded text-xs text-[#555]">{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Descrições */}
                    <div>
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Descrição Curta</h4>
                      <p className="text-sm text-[#888] bg-black p-3 rounded-lg">{product.description || 'Nenhuma descrição fornecida'}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Descrição Completa</h4>
                      <div className="bg-black p-3 rounded-lg max-h-64 overflow-y-auto">
                        <pre className="text-sm text-[#888] whitespace-pre-wrap font-mono">{product.long_description || 'Nenhuma descrição fornecida'}</pre>
                      </div>
                    </div>

                    {/* Imagens */}
                    <div>
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Image className="h-3 w-3" /> Imagens
                      </h4>
                      
                      {product.thumbnail && (
                        <div className="mb-3">
                          <p className="text-xs text-[#555] mb-1">Thumbnail (principal)</p>
                          <img src={product.thumbnail} alt="Thumbnail" className="w-32 h-32 rounded-lg object-cover border border-[#1A1A1A]" />
                        </div>
                      )}

                      {product.images?.length > 0 && (
                        <div>
                          <p className="text-xs text-[#555] mb-2">Galeria de imagens ({product.images.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {product.images.map((img, idx) => (
                              <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="block">
                                <img src={img} alt={`Imagem ${idx + 1}`} className="w-24 h-24 rounded-lg object-cover border border-[#1A1A1A] hover:border-white transition-colors" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Arquivo para Download */}
                    <div>
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FileArchive className="h-3 w-3" /> Arquivo para Download
                      </h4>
                      {product.file_url ? (
                        <div className="bg-black p-3 rounded-lg">
                          <a href={product.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                            <Download className="h-4 w-4" />
                            Baixar arquivo ({product.file_size || 'tamanho não informado'})
                          </a>
                          <p className="text-xs text-[#555] mt-2 break-all">URL: {product.file_url}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-red-400">❌ Nenhum arquivo enviado!</p>
                      )}
                    </div>

                    {/* Metadados adicionais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.file_size && (
                        <div>
                          <span className="text-[#555] block text-xs">Tamanho do arquivo</span>
                          <p className="text-white">{product.file_size}</p>
                        </div>
                      )}
                      {product.supported_versions && (
                        <div>
                          <span className="text-[#555] block text-xs">Versões suportadas</span>
                          <p className="text-white">{product.supported_versions}</p>
                        </div>
                      )}
                    </div>

                    {/* Licenças */}
                    {product.licenses?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Licenças disponíveis</h4>
                        <div className="space-y-2">
                          {product.licenses.map((license, idx) => (
                            <div key={idx} className="bg-black p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-white">{license.name}</span>
                                <span className="text-white font-semibold">R$ {license.price_brl?.toFixed(2) || '0,00'}</span>
                              </div>
                              {license.description && <p className="text-xs text-[#555] mt-1">{license.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Informação de aprovação automática */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-400">Este asset foi publicado automaticamente, sem necessidade de aprovação.</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}