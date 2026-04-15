// src/pages/admin/BundleForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44, supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Upload, Loader2, Package, X } from 'lucide-react';

const uploadFile = async (file, folder = 'bundles') => {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('products')
    .upload(fileName, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
  return urlData.publicUrl;
};

export default function BundleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [uploading, setUploading] = useState({});
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [allProducts, setAllProducts] = useState([]);

  const [form, setForm] = useState({
    title: '', description: '', long_description: '',
    price_brl: 0, discount_price_brl: 0, discount_expires_at: '',
    category: '', tags: [], thumbnail: '', images: [],
    is_featured: false, status: 'active',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadProducts();
    if (id) loadBundle();
  }, [id]);

  const loadProducts = async () => {
    try {
      const all = await base44.entities.Product.filter({ status: 'active' }, 'title', 200);
      setAllProducts(all);
    } catch (error) {
      console.error(error);
    }
  };

  const loadBundle = async () => {
    try {
      const bundle = await base44.entities.Bundle.get(id);
      setForm(bundle);
      
      // Carregar produtos do bundle
      const bundleProducts = await base44.entities.BundleProduct.listByBundle(id);
      setSelectedProducts(bundleProducts.map(bp => bp.product_id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = allProducts.filter(p =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) &&
    !selectedProducts.includes(p.id)
  );

  const addProduct = (product) => {
    setSelectedProducts([...selectedProducts, product.id]);
    setProductSearch('');
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const url = await uploadFile(file, 'bundles');
      if (field === 'images') {
        setForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
      } else {
        setForm(prev => ({ ...prev, [field]: url }));
      }
      toast.success('Upload concluído!');
    } catch (e) {
      console.error(e);
      toast.error('Falha no upload');
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
      e.target.value = '';
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleSave = async () => {
    if (!form.title) { toast.error('Título é obrigatório'); return; }
    if (selectedProducts.length === 0) { toast.error('Selecione pelo menos um produto'); return; }
    
    setSaving(true);
    try {
      const saveData = { ...form, total_products: selectedProducts.length };
      
      let bundleId;
      if (isEdit) {
        await base44.entities.Bundle.update(id, saveData);
        bundleId = id;
      } else {
        const created = await base44.entities.Bundle.create(saveData);
        bundleId = created.id;
      }
      
      // Atualizar produtos do bundle
      const currentProducts = await base44.entities.BundleProduct.listByBundle(bundleId);
      const currentIds = currentProducts.map(bp => bp.product_id);
      
      // Remover produtos que não estão mais selecionados
      for (const cp of currentProducts) {
        if (!selectedProducts.includes(cp.product_id)) {
          await base44.entities.BundleProduct.remove(bundleId, cp.product_id);
        }
      }
      
      // Adicionar novos produtos
      for (const productId of selectedProducts) {
        if (!currentIds.includes(productId)) {
          await base44.entities.BundleProduct.add(bundleId, productId);
        }
      }
      
      toast.success(isEdit ? 'Bundle atualizado!' : 'Bundle criado!');
      navigate('/admin/bundles');
    } catch (error) {
      console.error(error);
      toast.error('Falha ao salvar');
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin/bundles')} className="text-[#555] hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Editar Bundle' : 'Novo Bundle'}</h1>
      </div>

      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Informações do Bundle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-[#555] mb-1 block">Título *</label>
              <input type="text" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white/30" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-[#555] mb-1 block">Descrição Curta</label>
              <input type="text" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white/30" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-[#555] mb-1 block">Descrição Completa</label>
              <textarea value={form.long_description} onChange={(e) => setForm(p => ({ ...p, long_description: e.target.value }))}
                rows={4} className="w-full px-3 py-2 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white/30 resize-none" />
            </div>
          </div>
        </div>

        {/* Preços */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Preços</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#555] mb-1 block">Preço (BRL)</label>
              <input type="number" step="0.01" value={form.price_brl} onChange={(e) => setForm(p => ({ ...p, price_brl: parseFloat(e.target.value) || 0 }))}
                className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#555] mb-1 block">Preço Promocional</label>
              <input type="number" step="0.01" value={form.discount_price_brl} onChange={(e) => setForm(p => ({ ...p, discount_price_brl: parseFloat(e.target.value) || 0 }))}
                className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white/30" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-[#555] mb-1 block">Promoção Expira em</label>
              <input type="datetime-local" value={form.discount_expires_at ? form.discount_expires_at.slice(0,16) : ''}
                onChange={(e) => setForm(p => ({ ...p, discount_expires_at: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white/30" />
            </div>
          </div>
        </div>

        {/* Produtos do Bundle */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Produtos no Bundle</h2>
          <p className="text-xs text-[#555]">Selecione os produtos que farão parte deste bundle</p>
          
          {/* Produtos selecionados */}
          {selectedProducts.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#555]">Produtos selecionados ({selectedProducts.length})</label>
              <div className="space-y-2">
                {allProducts.filter(p => selectedProducts.includes(p.id)).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-[#111] border border-[#1A1A1A] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0A0A0A] rounded overflow-hidden">
                        {product.thumbnail && <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-sm text-white">{product.title}</span>
                    </div>
                    <button onClick={() => removeProduct(product.id)} className="text-[#555] hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Buscar produtos */}
          <div>
            <label className="text-xs font-medium text-[#555] mb-1 block">Adicionar produtos</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Buscar produto..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="flex-1 h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white/30"
              />
            </div>
            {productSearch && filteredProducts.length > 0 && (
              <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-[#111] rounded-lg transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-[#0A0A0A] rounded overflow-hidden">
                      {product.thumbnail && <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-sm text-white">{product.title}</span>
                    <Plus className="h-3 w-3 text-[#555] ml-auto" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mídia */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Imagem</h2>
          <div>
            <label className="text-xs font-medium text-[#555] mb-1 block">Thumbnail</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="hidden" disabled={uploading.thumbnail} />
                <div className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1A1A1A] rounded-lg text-xs text-[#555] hover:text-white transition-colors">
                  {uploading.thumbnail ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  {uploading.thumbnail ? 'Enviando...' : 'Upload'}
                </div>
              </label>
              {form.thumbnail && <img src={form.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover border border-[#1A1A1A]" />}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Status</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="active" checked={form.status === 'active'} onChange={() => setForm(p => ({ ...p, status: 'active' }))} />
              <span className="text-sm text-white">Ativo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="draft" checked={form.status === 'draft'} onChange={() => setForm(p => ({ ...p, status: 'draft' }))} />
              <span className="text-sm text-white">Rascunho</span>
            </label>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm(p => ({ ...p, is_featured: e.target.checked }))} />
            <span className="text-sm text-white">Destacar este bundle</span>
          </label>
        </div>

        {/* Save */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving} className="bg-white text-black hover:bg-white/90 font-semibold">
            {saving ? 'Salvando...' : (isEdit ? 'Atualizar Bundle' : 'Criar Bundle')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/bundles')} className="border-[#1A1A1A] text-[#555] hover:text-white">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}