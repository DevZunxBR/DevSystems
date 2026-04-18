import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import AppLayout from './components/layout/AppLayout';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminPanel from './pages/admin/AdminPanel';
import MaintenanceGuard from './components/MaintenanceGuard';
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Documentation from './pages/Documentation';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import DashboardHome from './pages/dashboard/DashboardHome';
import MyOrders from './pages/dashboard/MyOrders';
import AccountSettings from './pages/dashboard/AccountSettings';
import Favorites from './pages/dashboard/Favorites';
import PendingOrders from './pages/admin/PendingOrders';
import AllOrders from './pages/admin/AllOrders';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCoupons from './pages/admin/ManageCoupons';
import ProductForm from './pages/admin/ProductForm';
import RefundRequests from './pages/admin/RefundRequests';
import Register from './pages/Register';

// IMPORTAÇÕES DO CRIADOR (SELLER)
import SellerLayout from './components/layout/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerOnboarding from './pages/seller/SellerOnboarding';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerAnalytics from './pages/seller/SellerAnalytics';

// Rota privada - redireciona para /register se não logado
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
      {/* Rotas públicas */}
      <Route path="/register" element={<Register />} />
      <Route path="/docs" element={<Documentation />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/store" element={
          <PrivateRoute>
            <MaintenanceGuard>
              <Store />
            </MaintenanceGuard>
          </PrivateRoute>
        } />
        
        <Route path="/product/:id" element={
          <PrivateRoute>
            <MaintenanceGuard>
              <ProductDetail />
            </MaintenanceGuard>
          </PrivateRoute>
        } />
        
        <Route path="/cart" element={
          <PrivateRoute>
            <MaintenanceGuard>
              <Cart />
            </MaintenanceGuard>
          </PrivateRoute>
        } />
        
        <Route path="/checkout" element={
          <PrivateRoute>
            <MaintenanceGuard>
              <Checkout />
            </MaintenanceGuard>
          </PrivateRoute>
        } />

        {/* Rotas do Dashboard do Cliente */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <DashboardHome />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/dashboard/orders" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <MyOrders />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/dashboard/settings" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <AccountSettings />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/dashboard/favorites" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <Favorites />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
        </Route>

        {/* Rotas do Admin */}
        <Route element={<AdminPanel />}>
          <Route path="/admin/coupons" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <ManageCoupons />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/admin" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <PendingOrders />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/admin/orders" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <AllOrders />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/admin/products" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <ManageProducts />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/admin/products/new" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <ProductForm />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/admin/products/edit/:id" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <ProductForm />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/admin/refunds" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <RefundRequests />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
        </Route>

        {/* Rotas do Criador/Seller */}
        <Route path="/seller/onboarding" element={
          <PrivateRoute>
            <MaintenanceGuard>
              <SellerOnboarding />
            </MaintenanceGuard>
          </PrivateRoute>
        } />

        <Route element={<SellerLayout />}>
          <Route path="/seller/dashboard" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <SellerDashboard />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/seller/products" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <SellerProducts />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/seller/orders" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <SellerOrders />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
          
          <Route path="/seller/analytics" element={
            <PrivateRoute>
              <MaintenanceGuard>
                <SellerAnalytics />
              </MaintenanceGuard>
            </PrivateRoute>
          } />
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

export default App;