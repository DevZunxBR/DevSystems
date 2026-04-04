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

// Rota que só deixa entrar se estiver logado
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return null;
  return isAuthenticated ? children : <Navigate to="/register" replace />;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rota pública - Login/Cadastro */}
      <Route path="/register" element={<Register />} />

      {/* Rotas públicas - qualquer um pode ver */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Rotas privadas - só logados */}
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<PrivateRoute><DashboardHome /></PrivateRoute>} />
          <Route path="/dashboard/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
          <Route path="/dashboard/settings" element={<PrivateRoute><AccountSettings /></PrivateRoute>} />
          <Route path="/dashboard/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
        </Route>

        <Route element={<AdminPanel />}>
          <Route path="/admin" element={<PrivateRoute><PendingOrders /></PrivateRoute>} />
          <Route path="/admin/orders" element={<PrivateRoute><AllOrders /></PrivateRoute>} />
          <Route path="/admin/products" element={<PrivateRoute><ManageProducts /></PrivateRoute>} />
          <Route path="/admin/products/new" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/admin/products/edit/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/admin/refunds" element={<PrivateRoute><RefundRequests /></PrivateRoute>} />
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