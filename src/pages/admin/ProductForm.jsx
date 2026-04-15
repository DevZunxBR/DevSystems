import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44, supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Upload, Loader2 } from 'lucide-react';

const CATEGORIES = ['Scripts', 'Systems', 'UI Kits', 'Plugins', 'Templates', 'Assets', 'Tools'];

const uploadFile = async (file, folder = 'images') => {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('products')
    .upload(fileName, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
  return urlData.publicUrl;
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [uploading, setUploading] = useState({});

  const [form, setForm] = useState({
    title: '', description: '', long_description: '', price_usd: 0, price_brl: 0,
    discount_price_brl: 0, discount_expires_at: '',
    category: 'Scripts', tags: [], thumbnail: '', images: [], file_url: '',
    file_size: '', supported_versions: '', is_featured: false, closed: false, status: 'active',
    licenses: [{ name: 'Standard', price_usd: 0, price_brl: 0, description: '' }],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const p = await base44.entities.Product.get(id);
      if (p) setForm(prev => ({ ...prev, ...p }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const folder = field === 'file_url' ? 'files' : 'images';
      const url = await uploadFile(file, folder);
      if (field === 'images') {
        setForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
      } else {
        setForm(prev => ({ ...prev, [field]: url }));
      }
      toast.success('Upload concluído!');
    } catch (e) {
      console.error(e);
      toast.error('Falha no upload. Verifique se o bucket "products" existe no Supabase Storage.');
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
    setSaving(true);
    try {
      const { id: _, created_at, updated_at, ...saveData } = form;
      if (isEdit) {
        await base44.entities.Product.update(id, saveData);
        toast.success('Produto atualizado!');
      } else {
        const created = await base44.entities.Product.create(saveData);
        // Notifica todos os usuários
        try {
          const users = await base44.entities.User.filter({}, '-created_at', 200);
          await Promise.allSettled(users.map(u => base44.entities.Notification.create({
            user_email: u.email,
            title: '🆕 Novo produto disponível!',
            message: `"${saveData.title}" acabou de chegar na loja. Confira agora!`,
            type: 'new_product',
            read: false,
            link: `/product/${created.id}`,
          })));
        } catch {}
        toast.success('Produto criado!');
      }
      navigate('/admin/products');
    } catch (e) {
      console.error(e);
      toast.error('Falha ao salvar');
    } finally {
      setSaving(false);
    }
  };

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
        <button onClick={() => navigate('/admin/products')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Editar Produto' : 'Novo Produto'}</h1>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
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

        {/* Pricing */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Preços</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Preço (USD)</label>
              <input type="number" step="0.01" value={form.price_usd} onChange={(e) => setForm(p => ({ ...p, price_usd: parseFloat(e.target.value) || 0 }))}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
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
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Promoção Expira em</label>
              <input type="datetime-local" value={form.discount_expires_at ? form.discount_expires_at.slice(0,16) : ''}
                onChange={(e) => setForm(p => ({ ...p, discount_expires_at: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>

          {/* Licenses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Licenças</label>
              <button onClick={() => setForm(p => ({ ...p, licenses: [...(p.licenses || []), { name: '', price_usd: 0, price_brl: 0, description: '' }] }))}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <Plus className="h-3 w-3" /> Adicionar Licença
              </button>
            </div>
            {form.licenses?.map((lic, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-end">
                <input type="text" placeholder="Nome" value={lic.name}
                  onChange={(e) => { const l = [...form.licenses]; l[i] = { ...l[i], name: e.target.value }; setForm(p => ({ ...p, licenses: l })); }}
                  className="h-9 px-3 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none" />
                <input type="number" placeholder="USD" step="0.01" value={lic.price_usd}
                  onChange={(e) => { const l = [...form.licenses]; l[i] = { ...l[i], price_usd: parseFloat(e.target.value) || 0 }; setForm(p => ({ ...p, licenses: l })); }}
                  className="h-9 px-3 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none" />
                <input type="number" placeholder="BRL" step="0.01" value={lic.price_brl}
                  onChange={(e) => { const l = [...form.licenses]; l[i] = { ...l[i], price_brl: parseFloat(e.target.value) || 0 }; setForm(p => ({ ...p, licenses: l })); }}
                  className="h-9 px-3 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none" />
                <button onClick={() => setForm(p => ({ ...p, licenses: p.licenses.filter((_, j) => j !== i) }))}
                  className="h-9 flex items-center justify-center text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Media */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Mídia e Arquivos</h2>
          <p className="text-xs text-muted-foreground">Os arquivos são enviados para o Supabase Storage (bucket "products")</p>
          <div className="space-y-4">
            {/* Thumbnail */}
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

            {/* Gallery */}
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

            {/* File */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Arquivo para Download (ZIP/RAR)</label>
              <label className="cursor-pointer">
                <input type="file" onChange={(e) => handleFileUpload(e, 'file_url')} className="hidden" disabled={uploading.file_url} />
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors w-fit">
                  {uploading.file_url ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  {uploading.file_url ? 'Enviando...' : 'Upload Arquivo'}
                </div>
              </label>
              {form.file_url && <p className="text-xs text-green-500 mt-1">✓ Arquivo enviado</p>}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Metadados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tamanho do Arquivo</label>
              <input type="text" placeholder="ex: 12.5 MB" value={form.file_size} onChange={(e) => setForm(p => ({ ...p, file_size: e.target.value }))}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Versões Suportadas</label>
              <input type="text" placeholder="ex: v1.0+" value={form.supported_versions} onChange={(e) => setForm(p => ({ ...p, supported_versions: e.target.value }))}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
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
            Produto em Destaque
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={form.closed} onChange={(e) => setForm(p => ({ ...p, closed: e.target.checked }))} className="rounded border-border" />
            <span className="text-red-400">Produto Fechado</span> <span className="text-xs text-muted-foreground">(impede compras)</span>
          </label>
        </div>

        {/* Save */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving || Object.values(uploading).some(Boolean)} className="bg-white text-black hover:bg-white/90 font-semibold">
            {saving ? 'Salvando...' : (isEdit ? 'Atualizar Produto' : 'Criar Produto')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/products')} className="border-border text-foreground">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}