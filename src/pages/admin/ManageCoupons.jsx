import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Tag, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check } from 'lucide-react';

const emptyForm = {
  code: '',
  discount_percent: '',
  discount_fixed_usd: '',
  max_uses: '',
  expires_at: '',
  active: true,
};

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.Coupon.filter({}, '-created_at', 100);
      setCoupons(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code || '',
      discount_percent: coupon.discount_percent || '',
      discount_fixed_usd: coupon.discount_fixed_usd || '',
      max_uses: coupon.max_uses || '',
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 10) : '',
      active: coupon.active,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) { toast.error('Código do cupom é obrigatório'); return; }
    if (!form.discount_percent && !form.discount_fixed_usd) {
      toast.error('Informe o desconto (% ou valor fixo)'); return;
    }
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount_percent: form.discount_percent ? Number(form.discount_percent) : null,
        discount_fixed_usd: form.discount_fixed_usd ? Number(form.discount_fixed_usd) : null,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
        active: form.active,
      };

      if (editingId) {
        const updated = await base44.entities.Coupon.update(editingId, payload);
        setCoupons(prev => prev.map(c => c.id === editingId ? { ...c, ...updated } : c));
        toast.success('Cupom atualizado!');
      } else {
        const created = await base44.entities.Coupon.create({ ...payload, uses_count: 0 });
        setCoupons(prev => [created, ...prev]);
        toast.success('Cupom criado!');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (e) {
      toast.error('Erro ao salvar cupom');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (coupon) => {
    try {
      await base44.entities.Coupon.update(coupon.id, { active: !coupon.active });
      setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, active: !c.active } : c));
      toast.success(coupon.active ? 'Cupom desativado' : 'Cupom ativado');
    } catch {
      toast.error('Erro ao alterar status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return;
    try {
      await base44.entities.Coupon.delete(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
      toast.success('Cupom excluído');
    } catch {
      toast.error('Erro ao excluir cupom');
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Cupons de Desconto</h1>
          <p className="text-sm text-[#555] mt-1">{coupons.length} cupons cadastrados</p>
        </div>
        <Button onClick={handleNew} className="bg-white text-black hover:bg-white/90 font-semibold gap-2 text-sm">
          <Plus className="h-4 w-4" /> Novo Cupom
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{editingId ? 'Editar Cupom' : 'Novo Cupom'}</h2>
            <button onClick={() => setShowForm(false)} className="text-[#555] hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#555] mb-1 block">Código *</label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="DESCONTO10"
                className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[#333]"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] mb-1 block">Desconto % (ou deixe vazio)</label>
              <input
                type="number"
                value={form.discount_percent}
                onChange={e => setForm({ ...form, discount_percent: e.target.value, discount_fixed_usd: '' })}
                placeholder="10"
                min="1" max="100"
                className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-[#333]"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] mb-1 block">Desconto fixo em R$ (ou deixe vazio)</label>
              <input
                type="number"
                value={form.discount_fixed_usd}
                onChange={e => setForm({ ...form, discount_fixed_usd: e.target.value, discount_percent: '' })}
                placeholder="20.00"
                min="0" step="0.01"
                className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-[#333]"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] mb-1 block">Máx. de usos (vazio = ilimitado)</label>
              <input
                type="number"
                value={form.max_uses}
                onChange={e => setForm({ ...form, max_uses: e.target.value })}
                placeholder="100"
                min="1"
                className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-[#333]"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] mb-1 block">Data de expiração (vazio = sem limite)</label>
              <input
                type="date"
                value={form.expires_at}
                onChange={e => setForm({ ...form, expires_at: e.target.value })}
                className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-[#333]"
              />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <label className="text-xs text-[#555]">Ativo</label>
              <button onClick={() => setForm({ ...form, active: !form.active })}>
                {form.active
                  ? <ToggleRight className="h-6 w-6 text-white" />
                  : <ToggleLeft className="h-6 w-6 text-[#444]" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving} className="bg-white text-black hover:bg-white/90 font-semibold gap-2 text-sm">
              <Check className="h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button onClick={() => setShowForm(false)} variant="outline" className="border-[#1A1A1A] text-[#666] hover:bg-[#111] text-sm">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {coupons.length === 0 ? (
        <div className="text-center py-20 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
          <Tag className="h-12 w-12 text-[#333] mx-auto mb-3" />
          <p className="text-[#555] text-sm">Nenhum cupom cadastrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map(coupon => (
            <div key={coupon.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white text-sm">{coupon.code}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${coupon.active ? 'bg-white/10 text-white' : 'bg-[#111] text-[#444]'}`}>
                    {coupon.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="text-xs text-[#555] flex flex-wrap gap-3">
                  {coupon.discount_percent && <span>Desconto: {coupon.discount_percent}%</span>}
                  {coupon.discount_fixed_usd && <span>Desconto: R${coupon.discount_fixed_usd?.toFixed(2)}</span>}
                  <span>Usos: {coupon.uses_count || 0}{coupon.max_uses ? `/${coupon.max_uses}` : ''}</span>
                  {coupon.expires_at && <span>Expira: {new Date(coupon.expires_at).toLocaleDateString('pt-BR')}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(coupon)} className="p-2 text-[#555] hover:text-white transition-colors" title={coupon.active ? 'Desativar' : 'Ativar'}>
                  {coupon.active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                </button>
                <button onClick={() => handleEdit(coupon)} className="p-2 text-[#555] hover:text-white transition-colors" title="Editar">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(coupon.id)} className="p-2 text-[#555] hover:text-red-500 transition-colors" title="Excluir">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}