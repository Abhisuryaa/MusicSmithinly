import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Player } from '@/components/Player';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-purple-500/30">
      
      {/* Background ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      <Sidebar />
      
      <main className="flex-1 relative flex flex-col min-w-0">
        <Navbar />
        <div className="flex-1 relative z-10 pb-24">
          <Outlet />
        </div>
      </main>

      <Player />
    </div>
  );
}
