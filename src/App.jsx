import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import AppLayout from './components/layout/AppLayout';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminPanel from './pages/admin/AdminPanel';
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import DashboardHome from './pages/dashboard/DashboardHome';
import MyOrders from './pages/dashboard/MyOrders';
import AccountSettings from './pages/dashboard/AccountSettings';
import Favorites from './pages/dashboard/Favorites';
import PendingOrders from './pages/admin/PendingOrders';
import AllOrders from './pages/admin/AllOrders';
import ManageProducts from './pages/admin/ManageProducts';
import ProductForm from './pages/admin/ProductForm';
import RefundRequests from './pages/admin/RefundRequests';
import Register from './pages/Register';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, isAuthenticated } = useAuth();

  // Spinner enquanto carrega
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rota pública - Register/Login */}
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas */}
      <Route element={
        isAuthenticated ? <AppLayout /> : <Navigate to="/register" replace />
      }>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/orders" element={<MyOrders />} />
          <Route path="/dashboard/settings" element={<AccountSettings />} />
          <Route path="/dashboard/favorites" element={<Favorites />} />
        </Route>
        <Route element={<AdminPanel />}>
          <Route path="/admin" element={<PendingOrders />} />
          <Route path="/admin/orders" element={<AllOrders />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/edit/:id" element={<ProductForm />} />
          <Route path="/admin/refunds" element={<RefundRequests />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App