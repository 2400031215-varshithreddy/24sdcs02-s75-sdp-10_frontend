import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
  TrendingUp, Users, BookOpen, Award, 
  ArrowRight, Sparkles, Target, BarChart3, 
  Compass, Zap, Briefcase, ShieldCheck 
} from "lucide-react";
import { motion } from "framer-motion";

interface AdminStats {
  totalUsers: number;
  averageScores: {
    Analytical: number | null;
    Creative: number | null;
    Technical: number | null;
    Social: number | null;
  };
}

interface CareerPath {
  id: number;
  name: string;
  description: string;
  icon: string;
  avgSalary: string;
  demandLevel: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, pathsData] = await Promise.all([
          role === 'ADMIN' ? apiGet<AdminStats>("/api/admin/stats").catch(() => null) : Promise.resolve(null),
          apiGet<CareerPath[]>("/api/paths").catch(() => []),
        ]);
        setStats(statsData);
        setPaths(pathsData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 25,
        mass: 1
      } as any 
    }
  };

  const studentCards = useMemo(() => [
    {
      label: "Career Vectors",
      value: paths.length,
      icon: Target,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      label: "Intelligence Library",
      value: "120+",
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      label: "Global Simulations",
      value: "45+",
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      label: "Path Reliability",
      value: "99.2%",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
  ], [paths.length]);

  const adminCards = useMemo(() => [
    {
      label: "Total Students",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      label: "Active Architectures",
      value: paths.length,
      icon: Target,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      label: "Analytical Avg",
      value: `${Math.round(stats?.averageScores?.Analytical ?? 0)}%`,
      icon: BarChart3,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      label: "Technical Prof.",
      value: `${Math.round(stats?.averageScores?.Technical ?? 0)}%`,
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
  ], [stats, paths.length]);

  const displayCards = role === 'ADMIN' ? adminCards : studentCards;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-6 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-white/5 border-t-accent rounded-full" 
        />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary">Synchronizing Intelligence...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16 pb-20"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="max-w-4xl px-4 md:px-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-[2px] bg-accent" />
          <span className="section-label !mb-0">{role === 'ADMIN' ? 'Control Interface / Overview' : 'Intelligence Terminal / User'}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[0.9] text-text-primary">
          Welcome to the <br />
          <span className="accent-gradient">{role === 'ADMIN' ? 'Inner Circle.' : 'Nexus Hub.'}</span>
        </h1>
        <p className="text-text-secondary text-xl font-medium leading-relaxed max-w-3xl">
          {role === 'ADMIN' 
            ? "The next generation of career architecture. Monitor global student progress, manage elite learning paths, and leverage neural-mapped insights."
            : "Your portal to career architectural excellence. Deep-map your trajectory, acquire verified credentials, and simulate high-tier industrial scenarios."}
        </p>
      </motion.div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-0">
        {displayCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.4, ease: "circOut" } }}
              className="glass-card-plus p-8 flex flex-col justify-between min-h-[220px] group transform-gpu"
            >
              <div className={`absolute -right-4 -top-4 w-32 h-32 ${stat.bg} blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity gpu`} />
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
                        {stat.label}
                      </span>
                      <div className="w-8 h-1 bg-accent/20 rounded-full group-hover:w-12 group-hover:bg-accent transition-all duration-500" />
                   </div>
                   <div className={`w-14 h-14 rounded-2xl ${stat.bg} border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-accent/40 group-hover:shadow-glow`}>
                    <Icon size={26} className={stat.color} />
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black tracking-tighter text-text-primary">
                    {stat.value}
                  </p>
                  {String(stat.value).includes('%') && (
                    <span className="text-[9px] font-black text-accent uppercase tracking-widest opacity-60">Aggregate</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bento Grid Actions */}
      <div className="bento-grid">
        {/* Main CTA - Span 2 */}
        <motion.div variants={itemVariants} className="bento-span-2 glass-card p-bento bg-gradient-to-br from-accent/5 to-transparent relative group overflow-hidden transform-gpu">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[40px] rounded-full pointer-events-none gpu" />
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-10 group-hover:shadow-glow transition-all duration-500">
                <Sparkles size={32} className="text-accent" />
              </div>
              <h3 className="text-4xl font-black mb-6 tracking-tight text-text-primary">AI Strengths Analysis</h3>
              <p className="text-text-secondary text-xl font-medium leading-relaxed max-w-sm mb-12">
                Initiate a deep-mapping assessment to discover hidden career trajectories and proficiency nodes.
              </p>
            </div>
            <button 
              onClick={() => navigate("/assessment")}
              className="btn-premium w-full md:w-fit px-12 h-16 uppercase tracking-[0.2em] font-black text-xs group"
            >
              Start New Analysis
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Secondary Actions */}
        {[
          { label: "Intelligence Library", desc: "Curate global professional learning", icon: BookOpen, path: "/courses", color: "text-blue-400" },
          { label: "Verified Credentials", desc: "Manage academic achievements", icon: Award, path: "/my-certificates", color: "text-amber-400" },
          { label: "Elite Quizzes", desc: "Simulate top-tier interviews", icon: Zap, path: "/quizzes", color: "text-purple-400" },
          { label: "Elite Prep Center", desc: "Simulations & Company Intel", icon: ShieldCheck, path: "/prep", color: "text-orange-400" },
          { label: "Network Access", desc: "Connect with enterprise nodes", icon: Briefcase, path: "/applications", color: "text-emerald-400" },
        ].map((action, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            onClick={() => navigate(action.path)}
            className="glass-card p-bento cursor-pointer group hover:bg-white/[0.04]"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-105 group-hover:border-accent/40 transition-all duration-500">
              <action.icon size={26} className={`${action.color} group-hover:text-accent transition-colors`} />
            </div>
            <h4 className="text-2xl font-black mb-3 tracking-tight group-hover:text-accent transition-colors">{action.label}</h4>
            <p className="text-text-secondary font-medium leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity">
              {action.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Path Architectures Section */}
      {paths.length > 0 && (
        <motion.section variants={itemVariants} className="space-y-12 pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="section-label">Architectures</span>
              <h3 className="text-4xl font-black tracking-tighter italic">Optimized Pathways</h3>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-tertiary">
              <ShieldCheck size={14} className="text-accent" />
              {paths.length} Verified Solutions
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {paths.map((path) => (
              <div
                key={path.id}
                onClick={() => navigate(`/paths/${path.id}`)}
                className="glass-card p-8 group cursor-pointer flex flex-col justify-between min-h-[360px]"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-primary border border-white/10 flex items-center justify-center mb-8 group-hover:border-accent/50 transition-all duration-500">
                    <Compass size={24} className="text-text-tertiary group-hover:text-accent transition-colors animate-float" />
                  </div>
                  <h4 className="text-2xl font-black mb-4 tracking-tight group-hover:text-accent transition-colors leading-tight">
                    {path.name}
                  </h4>
                  <p className="text-text-secondary font-medium leading-relaxed line-clamp-3 mb-10 opacity-70 group-hover:opacity-100 transition-opacity">
                    {path.description}
                  </p>
                </div>
                
                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">EST. YIELD</span>
                      <span className="text-lg font-black text-white">{path.avgSalary}</span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-[9px] font-black text-accent uppercase tracking-widest">
                       {path.demandLevel} Demand
                    </div>
                  </div>
                  <div className="w-full py-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-center group-hover:bg-accent group-hover:text-primary transition-all flex items-center justify-center gap-2">
                     Deep Dive <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
