import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Bell, 
  Menu, X, Settings, HelpCircle, LogOut, ChevronRight
} from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get the currently logged-in user from local storage
  const currentUser = JSON.parse(localStorage.getItem('crm_user') || '{}');
  const initials = currentUser.name ? `${currentUser.name[0]}${currentUser.name.split(' ').length > 1 ? currentUser.name.split(' ')[1][0] : ''}`.toUpperCase() : 'UA';

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('crm_user'); // Clear the session
    navigate('/login'); // Force redirect to login page
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads Pipeline', path: '/leads', icon: Users },
  ];

  const bottomNavItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help Center', path: '/help', icon: HelpCircle },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/60 bg-slate-900/50">
        <div className="bg-primary-500/20 p-2 rounded-lg text-primary-400">
          <Briefcase className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-wide text-white">CRM Pro</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-none">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
            </Link>
          );
        })}

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-8 px-2">
          Support
        </div>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Interactive Logout Widget */}
      <div 
        onClick={handleLogout}
        className="p-4 m-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-red-900/50 transition-colors cursor-pointer group"
        title="Click to logout"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-inner flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{currentUser.name || 'User'}</p>
            <p className="text-xs text-primary-300 font-medium truncate">{currentUser.role || 'Sales Rep'}</p>
          </div>
          <LogOut className="h-5 w-5 text-slate-500 group-hover:text-red-400 transition-colors" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-slate-800">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/notifications" 
              className={`relative p-2 rounded-full transition-colors ${
                location.pathname === '/notifications' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}