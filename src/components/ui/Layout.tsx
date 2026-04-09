import { useState, memo } from "react";
import {
  LogOut, LayoutDashboard, BookOpen, Award, BarChart3,
  Compass, GraduationCap, Building2,
  Menu, X, Target, Zap, User as UserIcon, ShieldCheck
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "./Logo";
import AIAssistant from "./AIAssistant";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const navSections = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "AI Assessment", path: "/assessment", icon: Target },
      { label: "Courses", path: "/courses", icon: BookOpen },
      { label: "My Certificates", path: "/my-certificates", icon: Award },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Career Paths", path: "/paths", icon: Compass },
      { label: "Skill Quizzes", path: "/quizzes", icon: Zap },
      { label: "Interview Prep", path: "/prep", icon: ShieldCheck },
    ],
  },
  {
    label: "Admin",
    role: "ADMIN",
    items: [
      { label: "Analytics", path: "/admin", icon: BarChart3 },
      { label: "Applications", path: "/applications", icon: GraduationCap },
      { label: "Post Jobs", path: "/post-job", icon: Building2 },
    ],
  },
];

// Memoized Sidebar to prevent laggy re-renders
const Sidebar = memo(({ mobileOpen, setMobileOpen, handleLogout, role, location, navigate }: any) => {
  return (
    <aside className={`
      fixed lg:sticky top-0 z-50 h-screen w-[300px]
      bg-primary/80 backdrop-blur-[12px]
      border-r border-glass-border
      flex flex-col gpu
      transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="absolute inset-0 bg-accent/1 blur-[30px] -z-10 rounded-full gpu" />
      
      <div className="p-bento pt-12 pb-10 flex items-center justify-center">
        <Logo size="md" onClick={() => navigate("/")} className="cursor-pointer active:scale-95 transition-transform" />
      </div>

      <nav className="flex-1 px-6 space-y-10 overflow-y-auto custom-scrollbar pt-4">
        {navSections.filter(s => !s.role || s.role === role).map((section) => (
          <div key={section.label}>
            <button 
              onClick={() => section.label === "Intelligence" && navigate("/paths")}
              className={`section-label px-4 translate-x-[-10px] opacity-60 hover:opacity-100 hover:text-accent transition-all flex items-center gap-2 group w-full text-left ${section.label === "Intelligence" ? "cursor-pointer" : "cursor-default"}`}
            >
              {section.label}
              {section.label === "Intelligence" && <Compass size={10} className="group-hover:translate-x-1 transition-transform" />}
            </button>
            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMobileOpen(false); }}
                    className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-black transition-all duration-300 group relative ${
                      isActive
                        ? "text-white bg-accent/10 border border-accent/20 shadow-lg"
                        : "text-text-secondary hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={`shrink-0 transition-all duration-300 ${isActive ? 'text-accent scale-110 drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'group-hover:scale-110'}`} 
                    />
                    <span className={`flex-1 text-left tracking-tight ${isActive ? 'translate-x-1' : ''} transition-transform`}>{item.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeNav" 
                        className="absolute left-0 w-1.5 h-8 bg-accent rounded-r-full shadow-[0_0_20px_rgba(197,160,89,0.5)]" 
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-8 mt-auto border-t border-glass-border bg-white/[0.01]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500/60 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
});

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const currentPageLabel = navSections
    .flatMap(s => s.items)
    .find(item => location.pathname.startsWith(item.path))?.label || "Overview";

  return (
    <div className="min-h-screen flex bg-primary text-text-primary selection:bg-accent/30 overflow-hidden relative transition-colors duration-700">
      {/* Background Decorative Layer - Performance Optimized */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/3 blur-[40px] -z-10 rounded-full gpu" />
      <div className="absolute bottom-0 left-[300px] w-[500px] h-[500px] bg-blue-500/3 blur-[40px] -z-10 rounded-full gpu" />

      <Sidebar 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        handleLogout={handleLogout} 
        role={role} 
        location={location} 
        navigate={navigate} 
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header - Glassmorphism Ultra */}
        <header className="h-28 px-8 lg:px-16 flex items-center justify-between border-b border-glass-border bg-primary/40 backdrop-blur-3xl z-40 shrink-0 transition-colors duration-500">
          <div className="flex items-center gap-8">
            <button
              className="lg:hidden p-3 rounded-xl bg-white/5 border border-glass-border hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-6">
              <Logo size="sm" variant="icon" className="shrink-0" />
              <div className="w-[1px] h-8 bg-glass-border hidden sm:block" />
              <div className="flex flex-col">
                <span className="section-label !mb-1 text-[8px] opacity-40">Command Node / Route</span>
                <h2 className="text-2xl font-black tracking-tight uppercase italic text-text-primary">{currentPageLabel}</h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-glass-border flex items-center justify-center group overflow-hidden cursor-pointer hover:border-accent/50 hover:bg-white/10 transition-all shadow-glow shadow-white/2">
              <UserIcon size={26} className="text-text-secondary group-hover:text-accent group-hover:scale-110 transition-all" />
            </div>
          </div>
        </header>

        {/* Content Area with Fluid Spring Transitions */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-bento lg:p-16 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.03),transparent_40%)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 30, scale: 0.99, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, scale: 1.01, filter: 'blur(10px)' }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 30,
                mass: 1
              }}
              className="w-full max-w-[1440px] mx-auto min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AIAssistant />
    </div>
  );
}
