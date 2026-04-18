// src/pages/seller/SellerOnboarding.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44, supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Store, Palette, Image as ImageIcon, Loader2 } from 'lucide-react';

const uploadFile = async (file, folder = 'sellers') => {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('products')
    .upload(fileName, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
  return urlData.publicUrl;
};

export default function SellerOnboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({});
  const [form, setForm] = useState({
    store_name: '',
    store_description: '',
    store_logo: '',
    store_banner: '',
    store_color: '#000000',
    social_links: {
      instagram: '',
      twitter: '',
      github: '',
      website: ''
    }
  });

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const url = await uploadFile(file, 'sellers');
      setForm(prev => ({ ...prev, [field]: url }));
      toast.success(`${field === 'store_logo' ? 'Logo' : 'Banner'} enviado!`);
    } catch (error) {
      toast.error('Erro no upload');
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async () => {
    if (!form.store_name.trim()) {
      toast.error('Nome da loja é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const me = await base44.auth.me();
      
      const { error } = await supabase.from('seller_profiles').insert({
        user_email: me.email,
        store_name: form.store_name,
        store_description: form.store_description,
        store_logo: form.store_logo,
        store_banner: form.store_banner,
        store_color: form.store_color,
        social_links: form.social_links,
        onboarding_completed: true,
        status: 'pending'
      });

      if (error) throw error;

      toast.success('Loja criada! Aguarde aprovação da administração.');
      navigate('/seller/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar loja');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8">
        <div className="text-center mb-8">
          <Store className="h-12 w-12 text-white mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Bem-vindo, Criador!</h1>
          <p className="text-sm text-[#555] mt-2">
            Configure sua loja para começar a vender seus produtos
          </p>
        </div>

        <div className="space-y-6">
          {/* Nome da Loja */}
          <div>
            <label className="text-xs font-medium text-[#555] block mb-1">
              Nome da Loja *
            </label>
            <input
              type="text"
              value={form.store_name}
              onChange={(e) => setForm({ ...form, store_name: e.target.value })}
              placeholder="Ex: DevCreative Studio"
              className="w-full h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="text-xs font-medium text-[#555] block mb-1">
              Descrição da Loja
            </label>
            <textarea
              value={form.store_description}
              onChange={(e) => setForm({ ...form, store_description: e.target.value })}
              placeholder="Fale sobre seus produtos, sua especialidade..."
              rows={3}
              className="w-full px-3 py-2 bg-black border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white resize-none"
            />
          </div>

          {/* Cor da Loja */}
          <div>
            <label className="text-xs font-medium text-[#555] block mb-1">
              Cor Principal
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.store_color}
                onChange={(e) => setForm({ ...form, store_color: e.target.value })}
                className="w-12 h-10 rounded border border-[#1A1A1A] cursor-pointer"
              />
              <span className="text-xs text-[#555]">Sua identidade visual</span>
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="text-xs font-medium text-[#555] block mb-1">
              Logo da Loja
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'store_logo')} className="hidden" />
                <div className="flex items-center gap-2 px-3 py-2 bg-black border border-[#1A1A1A] rounded-lg text-xs text-[#555] hover:text-white">
                  {uploading.store_logo ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  {uploading.store_logo ? 'Enviando...' : 'Upload Logo'}
                </div>
              </label>
              {form.store_logo && (
                <img src={form.store_logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
              )}
            </div>
          </div>

          {/* Banner */}
          <div>
            <label className="text-xs font-medium text-[#555] block mb-1">
              Banner da Loja
            </label>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'store_banner')} className="hidden" />
              <div className="flex items-center gap-2 px-3 py-2 bg-black border border-[#1A1A1A] rounded-lg text-xs text-[#555] hover:text-white w-fit">
                {uploading.store_banner ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />}
                {uploading.store_banner ? 'Enviando...' : 'Upload Banner'}
              </div>
            </label>
            {form.store_banner && (
              <div className="mt-2">
                <img src={form.store_banner} alt="Banner" className="w-full h-32 rounded-lg object-cover" />
              </div>
            )}
          </div>

          {/* Redes Sociais */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-[#555] block">Redes Sociais</label>
            <input
              type="text"
              placeholder="Instagram (@usuario)"
              value={form.social_links.instagram}
              onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, instagram: e.target.value } })}
              className="w-full h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white"
            />
            <input
              type="text"
              placeholder="Twitter/X (@usuario)"
              value={form.social_links.twitter}
              onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, twitter: e.target.value } })}
              className="w-full h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white"
            />
            <input
              type="text"
              placeholder="GitHub (username)"
              value={form.social_links.github}
              onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, github: e.target.value } })}
              className="w-full h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !form.store_name}
            className="w-full bg-white text-black hover:bg-white/90 font-semibold h-11"
          >
            {loading ? 'Criando sua loja...' : 'Criar Loja e Começar'}
          </Button>
        </div>
      </div>
    </div>
  );
}