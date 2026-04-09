import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, Brain, Code, Network, BarChart3, ShieldCheck, Activity, Globe, Database, ArrowRight, Zap, Radio } from "lucide-react";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  RadialLinearScale,
  ArcElement
} from 'chart.js';
import { Bar, PolarArea } from 'react-chartjs-2';
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, ArcElement);

interface AdminStats {
  totalUsers: number;
  averageScores: { 
    Analytical: number | null; 
    Creative: number | null; 
    Technical: number | null; 
    Social: number | null 
  };
}

// Simulated Live Feed Component for AX
const LiveActivityFeed = () => {
  const [logs, setLogs] = useState<{ id: number, text: string, time: string, type: string }[]>([]);

  useEffect(() => {
    const messages = [
      { text: "Neural Map Generated for Node #8272", type: "assess" },
      { text: "Career Vector Alignment: Full Stack", type: "alignment" },
      { text: "Intelligence Sync @ 12ms Latency", type: "system" },
      { text: "New Terminal Session Authorized", type: "auth" },
      { text: "Field Simulation Completed: Google FE", type: "quiz" }
    ];

    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setLogs(prev => [{ id: Date.now(), ...msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {logs.map(log => (
        <motion.div 
          key={log.id} 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${log.type === 'system' ? 'bg-emerald-500' : 'bg-accent'}`} />
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{log.text}</span>
          </div>
          <span className="text-[9px] font-black text-text-tertiary">{log.time}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default function Admin() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({ 
    totalUsers: 0, 
    averageScores: { Analytical: 0, Creative: 0, Technical: 0, Social: 0 } 
  });

  useEffect(() => {
    if (role !== "ADMIN") { 
      navigate("/"); 
      return; 
    }
    apiGet<AdminStats>("/api/admin/stats")
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate, role]);

  const chartData = {
    labels: ['Analytical', 'Creative', 'Technical', 'Social'],
    datasets: [{
      label: 'Average Score (%)',
      data: [
        stats.averageScores.Analytical ?? 0,
        stats.averageScores.Creative ?? 0,
        stats.averageScores.Technical ?? 0,
        stats.averageScores.Social ?? 0,
      ],
      backgroundColor: [
        'rgba(96, 165, 250, 0.6)',
        'rgba(192, 132, 252, 0.6)',
        'rgba(52, 211, 153, 0.6)',
        'rgba(251, 191, 36, 0.6)',
      ],
      borderColor: [
        'rgba(96, 165, 250, 1)',
        'rgba(192, 132, 252, 1)',
        'rgba(52, 211, 153, 1)',
        'rgba(251, 191, 36, 1)',
      ],
      borderWidth: 2,
      borderRadius: 16,
      hoverBackgroundColor: 'rgba(234, 179, 8, 0.8)',
    }],
  };

  const polarData = useMemo(() => ({
    labels: ['Analytical', 'Creative', 'Technical', 'Social'],
    datasets: [{
      data: [
        stats.averageScores.Analytical ?? 0,
        stats.averageScores.Creative ?? 0,
        stats.averageScores.Technical ?? 0,
        stats.averageScores.Social ?? 0,
      ],
      backgroundColor: [
        'rgba(96, 165, 250, 0.2)',
        'rgba(192, 132, 252, 0.2)',
        'rgba(52, 211, 153, 0.2)',
        'rgba(251, 191, 36, 0.2)',
      ],
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
    }]
  }), [stats.averageScores]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        padding: 16,
        cornerRadius: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.03)', drawTicks: false },
        ticks: { color: '#64748B', font: { size: 11, weight: 'bold' as const } },
        max: 100,
        beginAtZero: true
      },
      x: {
        grid: { display: false },
        ticks: { color: '#F1F5F9', font: { size: 12, weight: 'bold' as const } },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-6 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-white/5 border-t-accent rounded-full shadow-glow" 
        />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-accent/60">Accessing Command Terminals...</p>
      </div>
    );
  }

  const statCards = [
    { title: "Active Nodes", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Analytical Index", value: `${Math.round(stats.averageScores.Analytical ?? 0)}%`, icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Creative Synergy", value: `${Math.round(stats.averageScores.Creative ?? 0)}%`, icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { title: "Technical Core", value: `${Math.round(stats.averageScores.Technical ?? 0)}%`, icon: Code, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Social Resonance", value: `${Math.round(stats.averageScores.Social ?? 0)}%`, icon: Network, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      className="space-y-16 pb-24"
    >
      {/* Header Command Protocol */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-glow">
              <ShieldCheck size={32} className="text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="section-label !mb-0 text-[8px] opacity-40">Security Clearance: Tier 0</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">Authority <span className="accent-gradient">Node.</span></h2>
            </div>
          </div>
          <p className="text-text-secondary text-xl font-medium max-w-xl opacity-80">Global intelligence oversight and student trajectory management.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-8 py-4 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-5 magnetic-pulse">
              <Activity size={20} className="text-emerald-400 animate-pulse" />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Grid Health</span>
                 <span className="text-sm font-black text-white">OPTIMIZED</span>
              </div>
           </div>
           <div className="px-8 py-4 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-5">
              <Database size={20} className="text-accent-blue" />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Sync Latency</span>
                 <span className="text-sm font-black text-white">4ms</span>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Grid Connectivity Units */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div 
              key={i} 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className={`glass-card-plus p-10 flex flex-col items-center text-center group hover:bg-white/[0.04] transition-all duration-500 ${s.border} magnetic-pulse`}
            >
              <div className={`w-16 h-16 rounded-[28px] ${s.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-glow shadow-white/5`}>
                <Icon size={28} className={s.color} />
              </div>
              <p className="text-4xl font-black text-white tracking-tighter mb-2 italic">{s.value}</p>
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] leading-tight">{s.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Advanced Visual Data Mapping */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-2 glass-card-plus p-bento relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="absolute top-0 right-0 p-12">
             <BarChart3 className="text-white/[0.03]" size={160} />
          </div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">Neural Distribution</h3>
                  <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Global Aggregate Skill Calibration</p>
               </div>
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent">Active Sync</span>
               </div>
            </div>
            <div className="h-[450px] mt-auto">
              <Bar options={chartOptions} data={chartData} />
            </div>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-card-plus p-bento border-white/5 flex flex-col justify-between">
           <div>
              <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic mb-2">Neural Balance</h3>
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-10">Cross-Category Synergy View</p>
              <div className="h-[300px] relative">
                <PolarArea 
                  data={polarData} 
                  options={{ 
                    scales: { 
                      r: { 
                        grid: { color: 'rgba(255,255,255,0.05)' }, 
                        angleLines: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { display: false } 
                      } 
                    }, 
                    plugins: { legend: { display: false } } 
                  }} 
                />
              </div>
           </div>
           
           <div className="pt-10">
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center shadow-glow shadow-accent/5">
                  <Radio size={24} className="text-accent mx-auto mb-4 animate-pulse" />
                  <p className="text-[9px] font-black text-accent uppercase tracking-[0.3em] mb-2">Broadcast Frequency</p>
                  <p className="text-sm font-black text-white italic">142.08 MHz / SECURE</p>
              </div>
           </div>
        </motion.div>
      </div>

      {/* Live Intelligence Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-2 glass-card-plus p-bento border-white/5">
          <div className="flex items-center gap-4 mb-10">
             <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
               <Zap size={20} className="text-accent" />
             </div>
             <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">Live Intelligence Stream</h3>
          </div>
          <LiveActivityFeed />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-card-plus p-bento flex flex-col justify-center gap-6">
           {[
             { l: 'Optimize User Nodes', i: Users },
             { l: 'Verify Data Integrity', i: ShieldCheck },
             { l: 'Initiate System Audit', i: Globe }
           ].map((act, idx) => (
             <button key={idx} className="btn-premium px-8 h-18 text-[11px] font-black uppercase tracking-widest shadow-glow">
                <act.i size={18} />
                {act.l}
                <ArrowRight size={14} className="ml-auto" />
             </button>
           ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
