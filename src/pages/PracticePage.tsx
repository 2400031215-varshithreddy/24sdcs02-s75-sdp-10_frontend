import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "@/lib/api";
import { Search, Code, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  tags: string;
  description: string;
}

export default function PracticePage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  useEffect(() => {
    apiGet<Problem[]>("/api/problems")
      .then(setProblems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.tags.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-6 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-white/5 border-t-accent rounded-full" 
        />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary">Compiling Challenge Nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-[2px] bg-accent" />
          <span className="section-label !mb-0">Neural Proving Grounds / Coding</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[0.9] text-text-primary">
          Code <span className="accent-gradient">Arena.</span>
        </h1>
        <p className="text-text-secondary text-xl font-medium leading-relaxed max-w-3xl">
          Sharpen your architectural logic. Solve complex algorithmic challenges and receive FAANG-level AI feedback on every submission.
        </p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 flex flex-col md:flex-row gap-6 shadow-glow"
      >
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search problems by title or tags..."
            className="w-full h-16 bg-white/[0.03] border border-glass-border rounded-2xl pl-16 pr-6 text-sm font-bold text-text-primary focus:border-accent/40 focus:bg-accent/5 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          {["All", "Easy", "Medium", "Hard"].map(d => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={`px-6 h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                difficultyFilter === d 
                  ? 'bg-accent text-primary border-accent shadow-glow' 
                  : 'bg-white/5 text-text-tertiary border-white/5 hover:border-white/20'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Problem Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProblems.map((problem, i) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ x: 10, transition: { duration: 0.3 } }}
            onClick={() => navigate(`/practice/${problem.id}`)}
            className="glass-card-plus p-8 cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 ${
                problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                <Code size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-text-primary group-hover:text-accent transition-colors mb-2">
                  {problem.title}
                </h3>
                <div className="flex items-center gap-4">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    problem.difficulty === 'Easy' ? 'text-emerald-400' :
                    problem.difficulty === 'Medium' ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <div className="w-[1px] h-3 bg-white/10" />
                  <div className="flex gap-2">
                    {problem.tags.split(',').map((tag, ti) => (
                      <span key={ti} className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="hidden md:flex flex-col items-end">
                  <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Rewards</span>
                  <span className="text-sm font-black text-white">+50 XP</span>
               </div>
               <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
                 <ArrowRight size={20} />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
