import ProductCard from './ProductCard';

export default function ProductGrid({ products, currency = 'USD', title, subtitle }) {
  if (!products?.length) return null;

  return (
    <section className="space-y-6">
      {title && (
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} currency={currency} />
        ))}
      </div>
    </section>
  );
}