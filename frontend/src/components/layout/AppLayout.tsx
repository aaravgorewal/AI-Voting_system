import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-white selection:bg-primary-500 selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
