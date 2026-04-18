import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';

const CATEGORIES = ['Scripts', 'Systems', 'UI Kits', 'Plugins', 'Templates', 'Assets', 'Tools'];

const uploadFile = async (file, folder = 'products') => {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('products')
    .upload(fileName, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
  return urlData.publicUrl;
};

export default function SellerProductForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    long_description: '',
    price_usd: 0,
    price_brl: 0,
    category: 'Scripts',
    tags: [],
    thumbnail: '',
    images: [],
    file_url: '',
    file_size: '',
    supported_versions: '',
    status: 'draft' // draft até ser aprovado
  });

  const handleSave = async () => {
    if (!form.title || !form.price_brl || !form.file_url) {
      toast.error('Preencha título, preço e arquivo');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('products').insert({
        ...form,
        seller_email: user?.email,
        seller_name: user?.full_name,
        status: 'pending_approval', // Aguardando aprovação do admin
        created_at: new Date().toISOString()
      });

      if (error) throw error;
      
      toast.success('Produto enviado para aprovação!');
      navigate('/seller/products');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar produto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/seller/products')} className="text-[#555] hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Novo Produto</h1>
      </div>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título do produto"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white"
          />
          
          <textarea
            placeholder="Descrição curta"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white"
          />
          
          <textarea
            placeholder="Descrição completa (Markdown)"
            value={form.long_description}
            onChange={(e) => setForm({ ...form, long_description: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white font-mono text-sm"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Preço (BRL)"
              value={form.price_brl}
              onChange={(e) => setForm({ ...form, price_brl: parseFloat(e.target.value) || 0 })}
              className="h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white"
            />
            
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white"
            >
              {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Upload do arquivo */}
          <div>
            <label className="text-xs text-[#555] block mb-1">Arquivo (ZIP/RAR)</label>
            <input
              type="file"
              accept=".zip,.rar"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                setUploading({ file: true });
                const url = await uploadFile(file, 'products');
                setForm({ ...form, file_url: url });
                setUploading({});
                toast.success('Arquivo enviado!');
              }}
              className="w-full"
            />
          </div>

          {/* Upload da thumbnail */}
          <div>
            <label className="text-xs text-[#555] block mb-1">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                setUploading({ thumb: true });
                const url = await uploadFile(file, 'thumbnails');
                setForm({ ...form, thumbnail: url });
                setUploading({});
                toast.success('Thumbnail enviada!');
              }}
              className="w-full"
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-xs text-yellow-500">
              ⚠️ Seu produto será enviado para análise. Após aprovação, ele aparecerá na loja.
            </p>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full bg-white text-black hover:bg-white/90"
          >
            {saving ? 'Enviando...' : 'Enviar para Aprovação'}
          </Button>
        </div>
      </div>
    </div>
  );
}