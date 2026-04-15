// src/pages/admin/BundleForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44, supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Upload, Loader2, Package } from 'lucide-react';

const CATEGORIES = ['Scripts', 'Systems', 'UI Kits', 'Plugins', 'Templates', 'Assets', 'Tools'];

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
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', long_description: '',
    price_brl: 0, discount_price_brl: 0, discount_expires_at: '',
    category: 'Scripts', tags: [], thumbnail: '', images: [],
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
      
      const bundleProducts = await supabase
        .from('bundle_products')
        .select('product_id')
        .eq('bundle_id', id);
      
      const productIds = bundleProducts.data.map(bp => bp.product_id);
      setSelectedProducts(productIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  const addProduct = (product) => {
    if (!selectedProducts.includes(product.id)) {
      setSelectedProducts([...selectedProducts, product.id]);
      setProductSearch('');
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
  };

  const handleSave = async () => {
    if (!form.title) { toast.error('Título é obrigatório'); return; }
    if (selectedProducts.length === 0) { toast.error('Selecione pelo menos um produto'); return; }
    
    setSaving(true);
    try {
      const { id: _, created_at, updated_at, ...saveData } = form;
      const bundleData = { ...saveData, total_products: selectedProducts.length };
      
      let bundleId;
      if (isEdit) {
        await base44.entities.Bundle.update(id, bundleData);
        bundleId = id;
        await supabase.from('bundle_products').delete().eq('bundle_id', bundleId);
      } else {
        const created = await base44.entities.Bundle.create(bundleData);
        bundleId = created.id;
      }
      
      for (const productId of selectedProducts) {
        await supabase.from('bundle_products').insert([{ bundle_id: bundleId, product_id: productId }]);
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

  const filteredProducts = allProducts.filter(p =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) &&
    !selectedProducts.includes(p.id)
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin/bundles')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Editar Bundle' : 'Novo Bundle'}</h1>
      </div>

      <div className="space-y-6">
        {/* Basic Info - IGUAL ao ProductForm */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Título *</label>
              <input type="text" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Descrição Curta</label>
              <input type="text" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Descrição Completa (Markdown)</label>
              <textarea value={form.long_description} onChange={(e) => setForm(p => ({ ...p, long_description: e.target.value }))}
                rows={6} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Categoria</label>
              <Select value={form.category} onValueChange={(v) => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-foreground">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
              <Select value={form.status} onValueChange={(v) => setForm(p => ({ ...p, status: v }))}>
                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="active" className="text-foreground">Ativo</SelectItem>
                  <SelectItem value="draft" className="text-foreground">Rascunho</SelectItem>
                  <SelectItem value="archived" className="text-foreground">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Pricing - IGUAL ao ProductForm (só BRL) */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Preços</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Preço (BRL)</label>
              <input type="number" step="0.01" value={form.price_brl} onChange={(e) => setForm(p => ({ ...p, price_brl: parseFloat(e.target.value) || 0 }))}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Preço Promocional (BRL)</label>
              <input type="number" step="0.01" value={form.discount_price_brl} onChange={(e) => setForm(p => ({ ...p, discount_price_brl: parseFloat(e.target.value) || 0 }))}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Promoção Expira em</label>
              <input type="datetime-local" value={form.discount_expires_at ? form.discount_expires_at.slice(0,16) : ''}
                onChange={(e) => setForm(p => ({ ...p, discount_expires_at: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
        </div>

        {/* Produtos do Bundle - NOVO (única diferença) */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-bold text-foreground">Produtos no Bundle</h2>
          </div>
          
          {selectedProducts.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Produtos selecionados ({selectedProducts.length})</label>
              <div className="space-y-2">
                {allProducts.filter(p => selectedProducts.includes(p.id)).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-secondary border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-card rounded overflow-hidden">
                        {product.thumbnail && <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{product.title}</p>
                        <p className="text-xs text-muted-foreground">R$ {product.price_brl?.toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeProduct(product.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Adicionar produtos</label>
            <input
              type="text"
              placeholder="Buscar produto..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {productSearch && filteredProducts.length > 0 && (
              <div className="mt-2 space-y-1 max-h-40 overflow-y-auto border border-border rounded-lg p-1">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-card rounded overflow-hidden">
                      {product.thumbnail && <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{product.title}</p>
                      <p className="text-xs text-muted-foreground">R$ {product.price_brl?.toFixed(2)}</p>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Media - IGUAL ao ProductForm */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Mídia</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Thumbnail</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="hidden" disabled={uploading.thumbnail} />
                  <div className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {uploading.thumbnail ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                    {uploading.thumbnail ? 'Enviando...' : 'Upload'}
                  </div>
                </label>
                {form.thumbnail && <img src={form.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover border border-border" />}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Imagens da Galeria</label>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'images')} className="hidden" disabled={uploading.images} />
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors w-fit">
                  {uploading.images ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  {uploading.images ? 'Enviando...' : 'Adicionar Imagem'}
                </div>
              </label>
              {form.images?.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
                      <button onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-black border border-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-2.5 w-2.5 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metadata - IGUAL ao ProductForm */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Metadados</h2>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags</label>
            <div className="flex gap-2">
              <input type="text" placeholder="Adicionar tag..." value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              <Button type="button" onClick={addTag} variant="outline" className="border-border text-foreground">Add</Button>
            </div>
            {form.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {form.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded text-xs text-foreground">
                    {tag}
                    <button onClick={() => setForm(p => ({ ...p, tags: p.tags.filter((_, j) => j !== i) }))} className="text-muted-foreground hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="rounded border-border" />
            Bundle em Destaque
          </label>
        </div>

        {/* Save - IGUAL ao ProductForm */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving || Object.values(uploading).some(Boolean)} className="bg-white text-black hover:bg-white/90 font-semibold">
            {saving ? 'Salvando...' : (isEdit ? 'Atualizar Bundle' : 'Criar Bundle')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/bundles')} className="border-border text-foreground">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}