import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Briefcase, Clock, ArrowRight, Award, TrendingUp, DollarSign, Sparkles, Target, Zap } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface PathData {
  path: { id: number; name: string; description: string; avgSalary: string; demandLevel: string };
  courses: { id: number; title: string; description: string; difficulty: string; durationHours: number; topics: string; trending: boolean }[];
  quizzes: { id: number; title: string; companyName: string; difficulty: string; questionCount: number }[];
}

export default function PathwayView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<PathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<number | null>(null);

  useEffect(() => {
    apiGet<PathData>(`/api/paths/${id}`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const generateCert = async (courseId: number) => {
    setGeneratingId(courseId);
    try {
      const cert = await apiPost<{ id: number }>("/api/certificates/generate", { courseId });
      navigate(`/certificate/${cert.id}`);
    } catch { 
      // Error handling
    } finally { 
      setGeneratingId(null); 
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-6 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-white/5 border-t-accent rounded-full" 
        />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary">Assembling Architecture Nodes...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-8">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 opacity-30">
          <BookOpen size={40} className="text-text-tertiary" />
        </div>
        <p className="text-text-secondary text-xl font-medium tracking-tight">Career architecture signature not found.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-premium px-12 h-14 uppercase tracking-widest text-xs font-black">Return to Terminal</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto space-y-16 pb-24"
    >
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-tertiary hover:text-accent transition-all group">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
          <ArrowLeft size={14} />
        </div>
        Dashboard
      </button>

      {/* Header Architecture Card */}
      <motion.div variants={itemVariants} className="glass-card p-bento relative overflow-hidden border-accent/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-accent" />
            <span className="section-label !mb-0">Selected Career Vector</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[0.95]">{data.path.name}</h2>
          <p className="text-text-secondary text-xl font-medium max-w-3xl leading-relaxed mb-10 italic">"{data.path.description}"</p>
          
          <div className="flex flex-wrap gap-4 pt-10 border-t border-white/5">
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <DollarSign size={18} className="text-accent" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Est. Yield</span>
                <span className="text-sm font-black text-white">{data.path.avgSalary}</span>
              </div>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <TrendingUp size={18} className="text-accent-blue" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Market Depth</span>
                <span className="text-sm font-black text-white">{data.path.demandLevel}</span>
              </div>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <BookOpen size={18} className="text-purple-400" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Intel Nodes</span>
                <span className="text-sm font-black text-white">{data.courses.length} Modules</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Adaptive Roadmap */}
      <section className="space-y-10">
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-glow">
            <Target size={24} className="text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="section-label !mb-0">Strategic Sequencing</span>
            <h3 className="text-3xl font-black tracking-tighter italic">Architectural Roadmap</h3>
          </div>
        </motion.div>

        <div className="relative space-y-6">
          <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-accent/50 via-white/5 to-transparent hidden md:block" />
          
          {data.courses.map((c, i) => (
            <motion.div 
              key={c.id} 
              variants={itemVariants}
              className="glass-card p-8 ml-0 md:ml-20 relative group hover:border-accent/30 transition-all duration-500"
            >
              <div className="absolute left-[-56px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-primary border border-accent/40 flex items-center justify-center font-black text-sm text-accent shadow-glow hidden md:flex z-10">
                 0{i + 1}
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <h4 className="text-2xl font-black text-white tracking-tight group-hover:text-accent transition-colors leading-tight">
                      {c.title}
                    </h4>
                    <div className="flex gap-2">
                       <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          c.difficulty === 'Beginner' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                          c.difficulty === 'Intermediate' ? 'border-accent-blue/20 text-accent-blue bg-accent-blue/5' : 'border-purple-500/20 text-purple-400 bg-purple-500/5'
                       }`}>{c.difficulty}</span>
                       {c.trending && <span className="px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-black uppercase tracking-widest">⚡ Trending</span>}
                    </div>
                  </div>
                  
                  <p className="text-text-secondary text-base font-medium leading-relaxed mb-8 opacity-70 group-hover:opacity-100 transition-opacity">
                    {c.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5"><Clock size={14} className="text-accent" /> {c.durationHours} Units</span>
                    {c.topics && (
                      <div className="flex flex-wrap gap-2">
                        {c.topics.split(',').slice(0, 3).map((t, ti) => (
                          <span key={ti} className="text-accent/60"># {t.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-end">
                   <button
                    onClick={() => generateCert(c.id)}
                    disabled={generatingId === c.id}
                    className="btn-premium h-14 px-10 text-[10px] uppercase tracking-[0.2em] font-black shadow-glow group/btn"
                  >
                    {generatingId === c.id ? (
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center gap-3">
                         Acquire Mastery <Award size={18} className="group-hover/btn:scale-110 transition-transform" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Field Simulations */}
      {data.quizzes.length > 0 && (
        <section className="space-y-10 pt-10">
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-glow shadow-purple-500/10">
              <Zap size={24} className="text-purple-400" />
            </div>
            <div className="flex flex-col">
              <span className="section-label !mb-0 text-purple-400">Tactical Readiness</span>
              <h3 className="text-3xl font-black tracking-tighter italic text-white flex items-center gap-3">
                 Field Simulations <Sparkles size={20} className="text-accent" />
              </h3>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.quizzes.map((q) => (
              <motion.div 
                key={q.id}
                variants={itemVariants}
                onClick={() => navigate(`/quiz/${q.id}`)}
                className="glass-card p-10 group cursor-pointer hover:bg-white/[0.04] flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <h4 className="text-2xl font-black text-white tracking-tight group-hover:text-accent transition-colors leading-tight">
                      {q.title}
                    </h4>
                    <div className="flex gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[9px] font-black uppercase tracking-widest">{q.companyName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Briefcase size={14} className="text-purple-400" /> {q.questionCount} Vectors</span>
                    <span className={`px-3 py-1 rounded-lg border ${
                       q.difficulty === 'Easy' ? 'border-emerald-500/20 text-emerald-400' :
                       q.difficulty === 'Medium' ? 'border-accent-blue/20 text-accent-blue' : 'border-red-500/20 text-red-400'
                    }`}>{q.difficulty} Tier</span>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-center h-12 rounded-xl bg-white/5 border border-white/5 group-hover:border-accent/40 group-hover:text-accent transition-all text-[10px] font-black uppercase tracking-widest gap-3">
                   Initiate Simulation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
