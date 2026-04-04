import { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function StarRating({ value, onChange, size = 'md' }) {
  const [hover, setHover] = useState(0);
  const sz = size === 'lg' ? 'h-7 w-7' : 'h-4 w-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange && onChange(i)}
          onMouseEnter={() => onChange && setHover(i)} onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}>
          <Star className={`${sz} transition-colors ${i <= (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-[#333]'}`} />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ rating, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-[#666] w-2">{rating}</span>
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      <div className="flex-1 h-1.5 bg-[#111] rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[#555] w-4 text-right">{count}</span>
    </div>
  );
}

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadReviews();
    checkCanReview();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const r = await base44.entities.Review.filter({ product_id: productId }, '-created_date');
      setReviews(r);
    } catch {}
    finally { setLoading(false); }
  };

  const checkCanReview = async () => {
    try {
      const me = await base44.auth.me();
      setUserEmail(me.email);
      setUserName(me.full_name || me.email);
      const orders = await base44.entities.Order.filter({ customer_email: me.email, status: 'completed' });
      const hasBought = orders.some(o => o.items?.some(i => i.product_id === productId));
      const existing = await base44.entities.Review.filter({ product_id: productId, user_email: me.email });
      setCanReview(hasBought && existing.length === 0);
    } catch {}
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) { toast.error('Escreva um comentário'); return; }
    setSubmitting(true);
    try {
      const review = await base44.entities.Review.create({
        product_id: productId, user_email: userEmail, user_name: userName,
        rating: form.rating, comment: form.comment,
      });
      setReviews([review, ...reviews]);
      setCanReview(false);
      setShowForm(false);
      toast.success('Avaliação publicada!');
    } catch { toast.error('Falha ao enviar'); }
    finally { setSubmitting(false); }
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ r, count: reviews.filter(rv => rv.rating === r).length }));

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-start gap-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Avaliações</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-5xl font-black text-white">{avgRating.toFixed(1)}</div>
                <StarRating value={Math.round(avgRating)} />
                <div className="text-xs text-[#555] mt-1">{reviews.length} avaliação{reviews.length !== 1 ? 'ões' : ''}</div>
              </div>
              <div className="space-y-1 min-w-[140px]">
                {ratingCounts.map(({ r, count }) => (
                  <RatingBar key={r} rating={r} count={count} total={reviews.length} />
                ))}
              </div>
            </div>
          )}
        </div>
        {canReview && !showForm && (
          <div className="ml-auto">
            <Button onClick={() => setShowForm(true)} className="bg-white text-black hover:bg-white/90 text-sm font-semibold">
              Escrever Avaliação
            </Button>
          </div>
        )}
      </div>

      {/* Submit form */}
      {canReview && showForm && (
        <form onSubmit={submitReview} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Sua avaliação</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-[#555] hover:text-white text-xs">Cancelar</button>
          </div>
          <div>
            <label className="text-xs text-[#555] mb-2 block">Nota</label>
            <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} size="lg" />
          </div>
          <div>
            <label className="text-xs text-[#555] mb-1 block">Comentário</label>
            <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={4} placeholder="Compartilhe sua experiência com este produto..."
              className="w-full px-3 py-2 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-[#333] resize-none placeholder:text-[#444]" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting} className="bg-white text-black hover:bg-white/90 text-sm font-semibold">
              {submitting ? 'Publicando...' : 'Publicar Avaliação'}
            </Button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#333] border-t-white rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
          <Star className="h-8 w-8 text-[#333] mx-auto mb-2" />
          <p className="text-[#555] text-sm">Nenhuma avaliação ainda.</p>
          <p className="text-[#444] text-xs mt-1">Seja o primeiro a avaliar este produto!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#111] border border-[#1A1A1A] rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {r.user_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{r.user_name || 'Usuário Verificado'}</div>
                    <div className="text-xs text-[#555]">{new Date(r.created_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating value={r.rating} />
                  <span className="text-[10px] text-[#555] bg-[#111] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ThumbsUp className="h-2.5 w-2.5" /> Compra verificada
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#888] leading-relaxed pl-12">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}