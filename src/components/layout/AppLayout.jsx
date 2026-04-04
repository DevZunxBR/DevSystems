import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background font-inter flex flex-col">
      <Header />
      <main className="pt-16 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}