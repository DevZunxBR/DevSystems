// src/components/products/ReviewSection.jsx - Versão melhorada
import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Flag, User, Calendar, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function StarRating({ value, onChange, size = 'md' }) {
  const [hover, setHover] = useState(0);
  const sz = size === 'lg' ? 'h-7 w-7' : 'h-4 w-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button 
          key={i} 
          type="button" 
          onClick={() => onChange && onChange(i)}
          onMouseEnter={() => onChange && setHover(i)} 
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
        >
          <Star className={`${sz} transition-all duration-150 ${i <= (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-[#333]'}`} />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ rating, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs group">
      <span className="text-[#666] w-2">{rating}</span>
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      <div className="flex-1 h-1.5 bg-[#111] rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full transition-all duration-500 group-hover:opacity-80" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[#555] w-8 text-right transition-all group-hover:text-white">{count}</span>
    </div>
  );
}

function ReviewCard({ review, isExpanded, onToggle }) {
  const truncatedText = review.comment.length > 200 ? review.comment.slice(0, 200) + '...' : review.comment;
  const hasMore = review.comment.length > 200;

  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 space-y-3 hover:border-[#2a2a2a] transition-all duration-200">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#1A1A1A] rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {review.user_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{review.user_name || 'Usuário Verificado'}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`h-2.5 w-2.5 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-[#333]'}`} />
                ))}
              </div>
              <span className="text-[10px] text-[#555]">•</span>
              <div className="flex items-center gap-1 text-[10px] text-[#555]">
                <Calendar className="h-2.5 w-2.5" />
                {new Date(review.created_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#555] bg-[#111] px-2 py-0.5 rounded-full flex items-center gap-1">
            <ThumbsUp className="h-2.5 w-2.5" /> Compra verificada
          </span>
        </div>
      </div>
      
      <p className="text-sm text-[#888] leading-relaxed pl-0">
        {isExpanded ? review.comment : truncatedText}
        {hasMore && (
          <button 
            onClick={onToggle}
            className="ml-2 text-[#555] hover:text-white transition-colors text-xs inline-flex items-center gap-0.5"
          >
            {isExpanded ? 'Ver menos' : 'Ver mais'}
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}
      </p>
      
      <div className="flex items-center gap-3 pt-1">
        <button className="text-[10px] text-[#555] hover:text-white transition-colors flex items-center gap-1">
          <ThumbsUp className="h-3 w-3" /> Útil
        </button>
        <button className="text-[10px] text-[#555] hover:text-red-500 transition-colors flex items-center gap-1">
          <Flag className="h-3 w-3" /> Denunciar
        </button>
      </div>
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
  const [expandedReviews, setExpandedReviews] = useState({});
  const [sortBy, setSortBy] = useState('newest'); // newest, highest, lowest

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
      setForm({ rating: 5, comment: '' });
      toast.success('Avaliação publicada!');
    } catch { toast.error('Falha ao enviar'); }
    finally { setSubmitting(false); }
  };

  const toggleExpand = (reviewId) => {
    setExpandedReviews(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  const getSortedReviews = () => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'newest':
      default:
        return sorted;
    }
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ r, count: reviews.filter(rv => rv.rating === r).length }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-white">Avaliações</h2>
        {reviews.length > 0 && (
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-3 py-1.5 text-[#555] focus:outline-none focus:border-white/30"
          >
            <option value="newest">Mais recentes</option>
            <option value="highest">Melhores avaliações</option>
            <option value="lowest">Piores avaliações</option>
          </select>
        )}
      </div>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-5xl font-black text-white">{avgRating.toFixed(1)}</div>
              <StarRating value={Math.round(avgRating)} />
              <div className="text-xs text-[#555] mt-1">{reviews.length} avaliação{reviews.length !== 1 ? 'ões' : ''}</div>
            </div>
            <div className="flex-1 space-y-1">
              {ratingCounts.map(({ r, count }) => (
                <RatingBar key={r} rating={r} count={count} total={reviews.length} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write review button */}
      {canReview && !showForm && (
        <div className="flex justify-end">
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-white text-black hover:bg-white/90 text-sm font-semibold gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Escrever Avaliação
          </Button>
        </div>
      )}

      {/* Submit form */}
      {canReview && showForm && (
        <form onSubmit={submitReview} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Sua avaliação</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-[#555] hover:text-white text-xs transition-colors">
              Cancelar
            </button>
          </div>
          <div>
            <label className="text-xs text-[#555] mb-2 block">Nota</label>
            <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} size="lg" />
          </div>
          <div>
            <label className="text-xs text-[#555] mb-1 block">Comentário</label>
            <textarea 
              value={form.comment} 
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={4} 
              placeholder="Compartilhe sua experiência com este produto..."
              className="w-full px-3 py-2 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-white/50 resize-none placeholder:text-[#444] transition-colors" 
            />
            <div className="flex justify-end mt-1">
              <span className="text-[10px] text-[#444]">{form.comment.length}/500 caracteres</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting} className="bg-white text-black hover:bg-white/90 text-sm font-semibold">
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Publicando...
                </div>
              ) : (
                'Publicar Avaliação'
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
          <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-[#333]" />
          </div>
          <p className="text-[#555] text-sm">Nenhuma avaliação ainda.</p>
          <p className="text-[#444] text-xs mt-1">Seja o primeiro a avaliar este produto!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {getSortedReviews().map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              isExpanded={expandedReviews[review.id]}
              onToggle={() => toggleExpand(review.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}