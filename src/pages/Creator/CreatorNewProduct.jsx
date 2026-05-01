// src/pages/creator/CreatorNewProduct.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Loader2, AlertCircle } from 'lucide-react';

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

export default function CreatorNewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({});
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    long_description: '',
    price_brl: 0,
    category: 'Scripts',
    tags: [],
    thumbnail: '',
    images: [],
    file_url: '',
    file_size: '',
    supported_versions: ''
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadCreatorProfile();
  }, [id]);

  const loadCreatorProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/register');
        return;
      }

      const { data: profileData } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (!profileData) {
        toast.error('Perfil de criador não encontrado');
        navigate('/');
        return;
      }

      // Verificar se é o dono do perfil
      if (profileData.user_id !== user.id) {
        toast.error('Você não tem permissão para publicar assets nesta loja');
        navigate(`/creator/${id}`);
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar perfil');
      navigate('/');
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const url = await uploadFile(file, field === 'file_url' ? 'files' : 'thumbnails');
      if (field === 'images') {
        setForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
      } else {
        setForm(prev => ({ ...prev, [field]: url }));
      }
      toast.success('Upload concluído!');
    } catch (error) {
      toast.error('Erro no upload');
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price_brl || !form.file_url) {
      toast.error('Preencha título, preço e arquivo');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('products').insert({
        ...form,
        creator_id: profile.id,
        creator_name: profile.display_name,
        creator_avatar: profile.avatar_url,
        approval_status: 'pending',
        status: 'draft',
        submitted_at: new Date().toISOString()
      });

      if (error) throw error;
      toast.success('Asset enviado para aprovação!');
      navigate(`/creator/${profile.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#555] hover:text-white mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Publicar Novo Asset</h1>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-500">Seu asset será enviado para análise</span>
          </div>
          <p className="text-xs text-yellow-500/70 mt-1">
            Após aprovação, ele aparecerá na loja. Você receberá 87% de comissão.
          </p>
        </div>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Título do Asset *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
          />

          <textarea
            rows={3}
            placeholder="Descrição Curta"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white resize-none"
          />

          <textarea
            rows={6}
            placeholder="Descrição Completa (Markdown)"
            value={form.long_description}
            onChange={(e) => setForm({ ...form, long_description: e.target.value })}
            className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white font-mono text-sm resize-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#555] block mb-1">Preço (BRL) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={form.price_brl}
                  onChange={(e) => setForm({ ...form, price_brl: parseFloat(e.target.value) || 0 })}
                  className="w-full h-11 pl-8 pr-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#555] block mb-1">Categoria</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
              >
                {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="text-xs text-[#555] block mb-1">Thumbnail</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="hidden" />
                <div className="flex items-center gap-2 px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-sm text-[#555] hover:text-white">
                  {uploading.thumbnail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Upload
                </div>
              </label>
              {form.thumbnail && <img src={form.thumbnail} alt="Thumb" className="w-12 h-12 rounded-lg object-cover" />}
            </div>
          </div>

          {/* Arquivo */}
          <div>
            <label className="text-xs text-[#555] block mb-1">Arquivo (ZIP/RAR) *</label>
            <label className="cursor-pointer">
              <input type="file" accept=".zip,.rar" onChange={(e) => handleFileUpload(e, 'file_url')} className="hidden" />
              <div className="flex items-center gap-2 px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-sm text-[#555] hover:text-white w-fit">
                {uploading.file_url ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload Arquivo
              </div>
            </label>
            {form.file_url && <p className="text-xs text-green-500 mt-1">✓ Arquivo enviado</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs text-[#555] block mb-1">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white"
              />
              <Button type="button" onClick={addTag} variant="outline">Add</Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-[#1A1A1A] rounded-lg text-xs text-white">
                    {tag}
                    <button onClick={() => setForm({ ...form, tags: form.tags.filter((_, j) => j !== i) })} className="ml-1 text-[#555] hover:text-white">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-white/90 font-semibold h-12 mt-4"
          >
            {loading ? 'Enviando...' : 'Enviar para Aprovação'}
          </Button>
        </div>
      </div>
    </div>
  );
}