import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Wallet } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import NotificationBell from '@/components/notifications/NotificationBell';
import logoImage from '@/assets/images/Logo.png';

export default function Header() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    loadCartCount();
  }, []);

  const loadUser = async () => {
    try {
      const me = await base44.auth.me();
      setUser(me);
      const wallets = await base44.entities.Wallet.filter({ user_email: me.email });
      if (wallets.length > 0) setWalletBalance(wallets[0].balance_usd || 0);
      else setWalletBalance(0);
    } catch {
      setUser(null);
    }
  };

  const loadCartCount = async () => {
    try {
      const me = await base44.auth.me();
      const items = await base44.entities.CartItem.filter({ user_email: me.email });
      setCartCount(items.length);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const interval = setInterval(loadCartCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => base44.auth.logout('/');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#000]/95 backdrop-blur-md border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            {!logoLoadError ? (
              <img
                src={logoImage}
                alt="Logo"
                className="w-full h-full object-cover"
                onError={() => setLogoLoadError(true)}
              />
            ) : (
              <span className="text-black font-black text-sm">M</span>
            )}
          </div>
          <span className="text-white font-bold text-lg hidden sm:block tracking-tight">Marketplace</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#444]" />
            <input
              type="text"
              placeholder="Buscar assets"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333]"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/store" className="hidden sm:block text-xs text-[#666] hover:text-white transition-colors px-2">
            Asset Library
          </Link>

          {user && walletBalance !== null && (
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden sm:flex items-center gap-1.5 px-3 h-8 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-xs text-white hover:border-[#333] transition-colors"
            >
              <Wallet className="h-3.5 w-3.5 text-[#555]" />
              <span className="font-semibold">R${walletBalance.toFixed(2)}</span>
            </button>
          )}

          {user && <NotificationBell userEmail={user.email} />}

          <Link to="/cart" className="relative p-2 text-[#666] hover:text-white transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                  <div className="w-8 h-8 bg-[#111] border border-[#1A1A1A] rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {user.full_name?.[0] || user.email?.[0] || 'U'}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0A0A0A] border-[#1A1A1A] w-48">
                <DropdownMenuItem onClick={() => navigate('/dashboard')} className="text-white text-xs hover:bg-[#111]">Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/orders')} className="text-white text-xs hover:bg-[#111]">Meus Pedidos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')} className="text-white text-xs hover:bg-[#111]">Configurações</DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="text-white text-xs hover:bg-[#111]">Admin Panel</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 text-xs hover:bg-[#111]">Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
<Button onClick={() => navigate('/register')} variant="outline" size="sm" className="border-[#1A1A1A] text-white hover:bg-[#0A0A0A] text-xs h-8">
  Login
</Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 text-[#666] hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1A1A1A] bg-[#000] p-4 space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#444]" />
              <input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none" />
            </div>
          </form>
          <Link to="/store" className="block text-sm text-[#666] hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Asset Library</Link>
          {user && walletBalance !== null && (
            <div className="flex items-center gap-2 text-sm text-white py-2">
              <Wallet className="h-4 w-4 text-[#555]" /> Saldo: R${walletBalance.toFixed(2)}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
