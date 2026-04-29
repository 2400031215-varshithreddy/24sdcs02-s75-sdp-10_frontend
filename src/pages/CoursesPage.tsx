import { useState, useEffect, useMemo } from "react";
import { Clock, Award, Search, BookOpen, Filter, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface CourseItem {
  id: number; 
  title: string; 
  description: string; 
  difficulty: string; 
  durationHours: number; 
  topics: string; 
  trending: boolean; 
  careerPathId: number;
}

const ITEMS_PER_PAGE = 9;

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [completedCourses, setCompletedCourses] = useState<number[]>([]);

  useEffect(() => {
    // Load completed courses from localStorage for persistence
    const saved = localStorage.getItem('completedCourses');
    if (saved) {
      setCompletedCourses(JSON.parse(saved));
    }
    
    apiGet<CourseItem[]>("/api/courses")
      .then(setCourses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = courses;
    if (filter === "trending") result = result.filter(c => c.trending);
    else if (filter !== "all") result = result.filter(c => c.difficulty === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.topics && c.topics.toLowerCase().includes(q))
      );
    }
    return result;
  }, [courses, filter, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [filter, search]);

  const generateCertificate = async (courseId: number) => {
    setGeneratingId(courseId);
    try {
      const cert = await apiPost<{ id: number }>("/api/certificates/generate", { courseId });
      navigate(`/certificate/${cert.id}`);
    } catch { 
      // Optimized notification could go here
    } finally { 
      setGeneratingId(null); 
    }
  };

  const toggleCompletion = (courseId: number) => {
    setCompletedCourses(prev => {
      const updated = prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId];
      localStorage.setItem('completedCourses', JSON.stringify(updated));
      return updated;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.05 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-6 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-white/5 border-t-accent rounded-full" 
        />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary">Accessing Knowledge Nodes...</p>
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
      {/* Header Intelligence */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-accent" />
            <span className="section-label !mb-0">Academy / Intelligence Library</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-[0.95] text-text-primary">
            Adaptive <span className="accent-gradient">Pathways.</span>
          </h1>
          <p className="text-text-secondary text-xl font-medium">Curated professional learning modules synchronized with industrial demand.</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-tertiary">
          <Sparkles size={14} className="text-accent" />
          {filtered.length} Modules Available
        </div>
      </motion.div>

      {/* Global Filter Interface */}
      <motion.div variants={itemVariants} className="glass-card p-8 flex flex-col xl:flex-row gap-8 shadow-glow">
        <div className="relative group flex-1">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search intelligence nodes, technologies, or carrier vectors..."
            className="w-full h-16 bg-white/[0.03] border border-glass-border rounded-2xl pl-16 pr-6 text-sm font-bold text-text-primary focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-text-tertiary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 mr-4 text-text-tertiary">
            <Filter size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sort:</span>
          </div>
          {["all", "trending", "Beginner", "Intermediate", "Advanced"].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                filter === f
                  ? 'bg-accent text-primary border-accent shadow-glow'
                  : 'text-text-secondary bg-white/5 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              {f === "all" ? "All Intellectual Assets" : f === "trending" ? "⚡ Trending" : f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Knowledge Grid */}
      <AnimatePresence mode="popLayout">
        {paginated.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card py-32 text-center flex flex-col items-center gap-8 border-dashed border-white/10"
          >
            <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 opacity-30">
              <BookOpen size={48} className="text-text-tertiary" />
            </div>
            <p className="text-text-secondary text-2xl font-bold tracking-tight">Zero matching knowledge nodes found.</p>
            <button onClick={() => { setSearch(""); setFilter("all"); }} className="btn-premium px-12 h-14 uppercase tracking-widest text-xs font-black">Reset Cache</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {paginated.map((c) => (
              <motion.div 
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-8 flex flex-col justify-between min-h-[380px] group relative overflow-hidden"
              >
                {c.trending && <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/20 blur-[20px] rounded-full gpu" />}
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4 mb-8">
                    <h4 className="text-2xl font-black text-text-primary leading-[1.1] tracking-tight group-hover:text-accent transition-colors">
                      {c.title}
                    </h4>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${
                      c.difficulty === 'Beginner' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                      c.difficulty === 'Intermediate' ? 'border-accent-blue/20 text-accent-blue bg-accent-blue/5' : 'border-purple-500/20 text-purple-400 bg-purple-500/5'
                    }`}>
                      {c.difficulty}
                    </div>
                  </div>
                  
                  <p className="text-text-secondary font-medium leading-relaxed line-clamp-3 mb-8 opacity-70 group-hover:opacity-100 transition-opacity">
                    {c.description}
                  </p>

                  {c.topics && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {c.topics.split(',').slice(0, 3).map((t, ti) => (
                        <span key={ti} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-text-tertiary uppercase tracking-widest group-hover:border-white/10 transition-colors">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative z-10 pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                      <Clock size={18} className="text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Duration</span>
                      <span className="text-sm font-black text-text-primary">{c.durationHours} Units</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {!completedCourses.includes(c.id) ? (
                      <button
                        onClick={() => toggleCompletion(c.id)}
                        className="px-6 py-3.5 rounded-xl border border-white/10 text-[9px] uppercase tracking-widest font-black hover:bg-white/5 transition-all"
                      >
                        Complete Module
                      </button>
                    ) : (
                      <button
                        onClick={() => generateCertificate(c.id)}
                        disabled={generatingId === c.id}
                        className="btn-premium px-8 py-3.5 text-[9px] uppercase tracking-[0.2em] font-black disabled:opacity-50 shadow-glow group/btn"
                      >
                        {generatingId === c.id ? (
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        ) : (
                          <span className="flex items-center gap-2">
                             Verify <Award size={14} className="group-hover/btn:scale-110 transition-transform" />
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Pagination Vectors */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 pt-12">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-text-tertiary hover:text-white hover:bg-white/10 transition-all disabled:opacity-0"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button 
                key={p} 
                onClick={() => setPage(p)}
                className={`w-14 h-14 rounded-2xl text-sm font-black transition-all border ${
                  page === p 
                    ? 'bg-accent text-primary border-accent shadow-glow' 
                    : 'bg-white/5 text-text-tertiary border-white/5 hover:border-white/20'
                }`}
              >
                {p < 10 ? `0${p}` : p}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-text-tertiary hover:text-white hover:bg-white/10 transition-all disabled:opacity-0"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
