import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';

const CATEGORIES = ['Scripts', 'Systems', 'UI Kits', 'Plugins', 'Templates', 'Assets', 'Tools'];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);

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
      const products = await base44.entities.Product.filter({ id });
      if (products.length > 0) {
        setForm({ ...form, ...products[0] });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (field === 'images') {
        setForm({ ...form, images: [...(form.images || []), file_url] });
      } else {
        setForm({ ...form, [field]: file_url });
      }
      toast.success('File uploaded');
    } catch (e) {
      toast.error('Upload failed');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const data = { ...form };
      if (isEdit) {
        const { id: _, created_date, updated_date, created_by, ...updateData } = data;
        await base44.entities.Product.update(id, updateData);
      } else {
        await base44.entities.Product.create(data);
      }
      toast.success(isEdit ? 'Product updated' : 'Product created');
      // Notify all users about new product
      if (!isEdit) {
        const allUsers = await base44.entities.User.list();
        const notifs = allUsers.map(u => base44.entities.Notification.create({
          user_email: u.email,
          title: '🆕 Novo produto disponível!',
          message: `"${data.title}" acabou de chegar na loja. Confira agora!`,
          type: 'new_product',
          read: false,
          link: `/store`,
        }));
        await Promise.allSettled(notifs);
      }
      navigate('/admin/products');
    } catch (e) {
      toast.error('Failed to save');
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
        <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Edit Product' : 'New Product'}</h1>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Short Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Description (Markdown)</label>
              <textarea value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })}
                rows={6} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-foreground">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="active" className="text-foreground">Active</SelectItem>
                  <SelectItem value="draft" className="text-foreground">Draft</SelectItem>
                  <SelectItem value="archived" className="text-foreground">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Price (USD)</label>
              <input type="number" step="0.01" value={form.price_usd} onChange={(e) => setForm({ ...form, price_usd: parseFloat(e.target.value) || 0 })}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Price (BRL)</label>
              <input type="number" step="0.01" value={form.price_brl} onChange={(e) => setForm({ ...form, price_brl: parseFloat(e.target.value) || 0 })}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Preço Promocional (BRL)</label>
              <input type="number" step="0.01" value={form.discount_price_brl} onChange={(e) => setForm({ ...form, discount_price_brl: parseFloat(e.target.value) || 0 })}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Desconto Expira em</label>
              <input type="datetime-local" value={form.discount_expires_at ? form.discount_expires_at.slice(0,16) : ''} onChange={(e) => setForm({ ...form, discount_expires_at: new Date(e.target.value).toISOString() })}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>

          {/* Licenses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Licenses</label>
              <button onClick={() => setForm({ ...form, licenses: [...(form.licenses || []), { name: '', price_usd: 0, price_brl: 0, description: '' }] })}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add License
              </button>
            </div>
            {form.licenses?.map((lic, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-end">
                <input type="text" placeholder="Name" value={lic.name} onChange={(e) => { const l = [...form.licenses]; l[i].name = e.target.value; setForm({ ...form, licenses: l }); }}
                  className="h-9 px-3 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none" />
                <input type="number" placeholder="USD" step="0.01" value={lic.price_usd} onChange={(e) => { const l = [...form.licenses]; l[i].price_usd = parseFloat(e.target.value) || 0; setForm({ ...form, licenses: l }); }}
                  className="h-9 px-3 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none" />
                <input type="number" placeholder="BRL" step="0.01" value={lic.price_brl} onChange={(e) => { const l = [...form.licenses]; l[i].price_brl = parseFloat(e.target.value) || 0; setForm({ ...form, licenses: l }); }}
                  className="h-9 px-3 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none" />
                <button onClick={() => setForm({ ...form, licenses: form.licenses.filter((_, j) => j !== i) })} className="h-9 flex items-center justify-center text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Media */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Media & Files</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Thumbnail</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="hidden" />
                  <div className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Upload className="h-3 w-3" /> Upload
                  </div>
                </label>
                {form.thumbnail && <img src={form.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Gallery Images</label>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'images')} className="hidden" />
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors w-fit">
                  <Upload className="h-3 w-3" /> Add Image
                </div>
              </label>
              {form.images?.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      <button onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-black border border-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-2.5 w-2.5 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Download File (ZIP/RAR)</label>
              <label className="cursor-pointer">
                <input type="file" onChange={(e) => handleFileUpload(e, 'file_url')} className="hidden" />
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors w-fit">
                  <Upload className="h-3 w-3" /> Upload File
                </div>
              </label>
              {form.file_url && <p className="text-xs text-muted-foreground mt-1 truncate">✓ File uploaded</p>}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">File Size</label>
              <input type="text" placeholder="e.g. 12.5 MB" value={form.file_size} onChange={(e) => setForm({ ...form, file_size: e.target.value })}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Supported Versions</label>
              <input type="text" placeholder="e.g. v1.0+" value={form.supported_versions} onChange={(e) => setForm({ ...form, supported_versions: e.target.value })}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags</label>
            <div className="flex gap-2">
              <input type="text" placeholder="Add tag..." value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              <Button type="button" onClick={addTag} variant="outline" className="border-border text-foreground">Add</Button>
            </div>
            {form.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {form.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded text-xs text-foreground">
                    {tag}
                    <button onClick={() => setForm({ ...form, tags: form.tags.filter((_, j) => j !== i) })} className="text-muted-foreground hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="rounded border-border" />
            Featured Product
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={form.closed} onChange={(e) => setForm({ ...form, closed: e.target.checked })}
              className="rounded border-border" />
            <span className="text-red-400">Produto Fechado</span> <span className="text-xs text-muted-foreground">(impede compras)</span>
          </label>
        </div>

        {/* Save */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving} className="bg-white text-black hover:bg-white/90 font-semibold">
            {saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/products')} className="border-border text-foreground">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}