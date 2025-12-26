
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('lumpi_user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed) setUser(parsed);
      } catch (e) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const navItems = [
    { path: '/dashboard', label: 'Início', icon: 'home' },
    { path: '/trips', label: 'Entradas', icon: 'directions_car' },
    { path: '/expenses', label: 'Saídas', icon: 'account_balance_wallet' },
    { path: '/analytics', label: 'Análises', icon: 'bar_chart' },
    { path: '/menu', label: 'Config', icon: 'settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('lumpi_user');
    navigate('/login');
  };

  // Garante que o nome seja exibido como texto puro
  const displayName = typeof user?.nome === 'string' ? user.nome : 'Motorista';

  return (
    <div className="flex h-screen w-full bg-background-dark overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col justify-between border-r border-[#28392e] bg-[#111813] p-6 shrink-0 h-full overflow-y-auto">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 ring-2 ring-primary/20 flex items-center justify-center bg-primary/10 text-primary"
            >
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-tight truncate max-w-[160px]">
                {displayName}
              </h1>
              <p className="text-text-secondary text-xs font-medium">Sessão Protegida</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${isActive(item.path)
                    ? 'bg-primary/10 ring-1 ring-primary/20'
                    : 'hover:bg-[#1c2e24]'
                  }`}
              >
                <span className={`material-symbols-outlined ${isActive(item.path) ? 'text-primary fill' : 'text-text-secondary group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                <p className={`text-sm font-medium ${isActive(item.path) ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>
                  {item.label}
                </p>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 justify-center rounded-xl h-12 px-4 border border-[#2f4236] hover:bg-[#253b30] text-white text-sm font-bold transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <Outlet />
          <div className="h-24 md:hidden"></div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 w-full bg-[#111813] border-t border-[#28392e] flex justify-around py-3 pb-safe z-50 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 group w-16 transition-colors ${isActive(item.path) ? 'text-primary' : 'text-text-secondary'}`}
            >
              <span className={`material-symbols-outlined text-[24px] ${isActive(item.path) ? 'fill' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
