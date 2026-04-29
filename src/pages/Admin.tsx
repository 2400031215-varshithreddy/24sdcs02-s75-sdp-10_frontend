import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, Brain, Code, Network, BarChart3, ShieldCheck, Globe, ArrowRight, Zap, Radio, Plus, Edit2, Trash2, BookOpen } from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
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
import { motion, AnimatePresence } from "framer-motion";

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
  const [stats, setStats] = useState<AdminStats>({ 
    totalUsers: 0, 
    averageScores: { Analytical: 0, Creative: 0, Technical: 0, Social: 0 } 
  });
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'problems' | 'courses'>('dashboard');
  
  // Management States
  const [problems, setProblems] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    try {
      const [statsRes, problemsRes, coursesRes] = await Promise.all([
        apiGet<AdminStats>("/api/admin/stats"),
        apiGet<any[]>("/api/admin/problems"),
        apiGet<any[]>("/api/admin/courses")
      ]);
      setStats(statsRes);
      setProblems(problemsRes);
      setCourses(coursesRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== "ADMIN") { 
      navigate("/"); 
      return; 
    }
    fetchData();
  }, [navigate, role]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeView === 'problems') {
        if (editingItem) {
          await apiPut(`/api/admin/problems/${editingItem.id}`, formData);
        } else {
          await apiPost("/api/admin/problems", formData);
        }
      } else if (activeView === 'courses') {
        if (editingItem) {
          await apiPut(`/api/admin/courses/${editingItem.id}`, formData);
        } else {
          await apiPost("/api/admin/courses", formData);
        }
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Action failed: " + err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirm permanent deletion?")) return;
    try {
      if (activeView === 'problems') await apiDelete(`/api/admin/problems/${id}`);
      else await apiDelete(`/api/admin/courses/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed: " + err);
    }
  };

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
           <button 
             onClick={() => setActiveView('dashboard')}
             className={`px-8 py-4 rounded-3xl border transition-all flex items-center gap-4 ${activeView === 'dashboard' ? 'bg-accent text-primary border-accent shadow-glow' : 'bg-white/5 border-white/10 text-text-tertiary hover:text-white'}`}
           >
              <BarChart3 size={18} /> Dashboard
           </button>
           <button 
             onClick={() => setActiveView('problems')}
             className={`px-8 py-4 rounded-3xl border transition-all flex items-center gap-4 ${activeView === 'problems' ? 'bg-accent text-primary border-accent shadow-glow' : 'bg-white/5 border-white/10 text-text-tertiary hover:text-white'}`}
           >
              <Code size={18} /> Problems
           </button>
           <button 
             onClick={() => setActiveView('courses')}
             className={`px-8 py-4 rounded-3xl border transition-all flex items-center gap-4 ${activeView === 'courses' ? 'bg-accent text-primary border-accent shadow-glow' : 'bg-white/5 border-white/10 text-text-tertiary hover:text-white'}`}
           >
              <BookOpen size={18} /> Courses
           </button>
        </div>
      </motion.div>

      {activeView === 'dashboard' ? (
        <>

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
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">
                {activeView === 'problems' ? 'Logic Repository' : 'Knowledge Modules'}
              </h3>
              <button 
                onClick={() => { setEditingItem(null); setFormData({}); setShowModal(true); }}
                className="btn-premium px-10 h-14 uppercase tracking-widest text-xs"
              >
                <Plus size={16} /> New Entry
              </button>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {(activeView === 'problems' ? problems : courses).map((item: any) => (
                <div key={item.id} className="glass-card-plus p-8 flex items-center justify-between group">
                   <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/40 transition-colors">
                         {activeView === 'problems' ? <Code className="text-accent" /> : <BookOpen className="text-accent-blue" />}
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-white">{item.title}</h4>
                         <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-1">
                           {activeView === 'problems' ? `${item.difficulty} / ${item.tags}` : `${item.difficulty} / ${item.durationHours} Units`}
                         </p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button 
                        onClick={() => { setEditingItem(item); setFormData(item); setShowModal(true); }}
                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-tertiary hover:text-white hover:bg-white/10 transition-all"
                      >
                         <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </motion.div>
      )}

      {/* Management Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-primary/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl glass-card-plus p-12 border-accent/20"
            >
              <h2 className="text-3xl font-black uppercase italic mb-8">
                {editingItem ? 'Update' : 'Initialize'} {activeView === 'problems' ? 'Problem' : 'Course'}
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Title</label>
                       <input 
                         required
                         className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold outline-none focus:border-accent/40"
                         value={formData.title || ''}
                         onChange={e => setFormData({...formData, title: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Difficulty</label>
                       <select 
                         className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold outline-none focus:border-accent/40"
                         value={formData.difficulty || 'Beginner'}
                         onChange={e => setFormData({...formData, difficulty: e.target.value})}
                       >
                          <option value="Beginner">Beginner / Easy</option>
                          <option value="Intermediate">Intermediate / Medium</option>
                          <option value="Advanced">Advanced / Hard</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Description</label>
                    <textarea 
                      required
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium outline-none focus:border-accent/40 resize-none"
                      value={formData.description || ''}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                 </div>
                 {activeView === 'problems' && (
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Tags (comma-separated)</label>
                         <input 
                           className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold outline-none focus:border-accent/40"
                           value={formData.tags || ''}
                           onChange={e => setFormData({...formData, tags: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Constraints</label>
                         <input 
                           className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold outline-none focus:border-accent/40"
                           value={formData.constraints || ''}
                           onChange={e => setFormData({...formData, constraints: e.target.value})}
                         />
                      </div>
                   </div>
                 )}
                 <div className="flex gap-4 pt-8">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-16 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Abort</button>
                    <button type="submit" className="flex-[2] h-16 btn-premium text-[10px] font-black uppercase tracking-widest shadow-glow">Finalize Change</button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
