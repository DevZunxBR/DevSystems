// src/pages/admin/ManageProducts.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const all = await base44.entities.Product.list('-created_date', 50);
      setProducts(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (product) => {
    const newStatus = product.status === 'active' ? 'draft' : 'active';
    await base44.entities.Product.update(product.id, { status: newStatus });
    setProducts(products.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
    toast.success(`Product ${newStatus === 'active' ? 'published' : 'hidden'}`);
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await base44.entities.Product.delete(id);
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted');
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
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} products</p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')} className="bg-white text-black hover:bg-white/90 font-semibold gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
            <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
              {product.thumbnail && <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">{product.title}</h3>
              <p className="text-xs text-muted-foreground">{product.category} • ${product.price_usd?.toFixed(2)}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${product.status === 'active' ? 'bg-white text-black' : 'bg-secondary text-muted-foreground'}`}>
              {product.status}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => toggleStatus(product)} className="text-muted-foreground hover:text-foreground">
                {product.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/products/edit/${product.id}`)} className="text-muted-foreground hover:text-foreground">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}