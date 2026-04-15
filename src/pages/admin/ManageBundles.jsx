// src/pages/admin/ManageBundles.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff, Package } from 'lucide-react';

export default function ManageBundles() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    try {
      const all = await base44.entities.Bundle.list('-created_at', 50);
      setBundles(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (bundle) => {
    const newStatus = bundle.status === 'active' ? 'draft' : 'active';
    await base44.entities.Bundle.update(bundle.id, { status: newStatus });
    setBundles(bundles.map(b => b.id === bundle.id ? { ...b, status: newStatus } : b));
    toast.success(`Bundle ${newStatus === 'active' ? 'publicado' : 'ocultado'}`);
  };

  const deleteBundle = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este bundle?')) return;
    await base44.entities.Bundle.delete(id);
    setBundles(bundles.filter(b => b.id !== id));
    toast.success('Bundle excluído');
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Bundles</h1>
          <p className="text-sm text-[#555] mt-1">{bundles.length} pacotes disponíveis</p>
        </div>
        <Button onClick={() => navigate('/admin/bundles/new')} className="bg-white text-black hover:bg-white/90 font-semibold gap-2">
          <Plus className="h-4 w-4" /> Criar Bundle
        </Button>
      </div>

      <div className="space-y-3">
        {bundles.map((bundle) => (
          <div key={bundle.id} className="flex items-center gap-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
            <div className="w-16 h-16 bg-[#111] rounded-lg overflow-hidden flex-shrink-0">
              {bundle.thumbnail ? (
                <img src={bundle.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-[#333]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">{bundle.title}</h3>
              <p className="text-xs text-[#555]">{bundle.total_products} produtos • R$ {bundle.price_brl?.toFixed(2)}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${bundle.status === 'active' ? 'bg-white text-black' : 'bg-[#111] text-[#555]'}`}>
              {bundle.status === 'active' ? 'Ativo' : 'Rascunho'}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => toggleStatus(bundle)} className="text-[#555] hover:text-white">
                {bundle.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/bundles/edit/${bundle.id}`)} className="text-[#555] hover:text-white">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteBundle(bundle.id)} className="text-[#555] hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}