import { useState, useEffect } from "react";
import { Compass, ArrowRight, Zap, Target, TrendingUp, DollarSign } from "lucide-react";
import { apiGet } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface PathItem {
  id: number;
  name: string;
  description: string;
  avgSalary: string;
  demandLevel: string;
}

export default function PathsPage() {
  const navigate = useNavigate();
  const [paths, setPaths] = useState<PathItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<PathItem[]>("/api/paths")
      .then(setPaths)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-6 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-white/5 border-t-accent rounded-full" 
        />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary">Synchronizing Career Vectors...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16 pb-24"
    >
      <motion.div variants={itemVariants} className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-[2px] bg-accent" />
          <span className="section-label !mb-0">Intelligence / Career Architectures</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-[0.95]">
          Strategic <span className="accent-gradient">Paths.</span>
        </h1>
        <p className="text-text-secondary text-xl font-medium">High-resolution trajectories designed to maximize professional resonance and industrial impact.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {paths.map((path) => (
            <motion.div 
              key={path.id}
              layout
              variants={itemVariants}
              onClick={() => navigate(`/paths/${path.id}`)}
              className="glass-card p-1 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] rounded-full group-hover:bg-accent/10 transition-all duration-700" />
              
              <div className="relative z-10 p-bento h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow shadow-accent/5">
                      <Compass size={28} className="text-accent" />
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                       {path.demandLevel} Demand
                    </div>
                  </div>
                  
                  <h4 className="text-2xl font-black text-white leading-tight tracking-tight mb-4 italic group-hover:text-accent transition-colors">
                    {path.name}
                  </h4>
                  <p className="text-text-secondary font-medium leading-relaxed italic opacity-70 group-hover:opacity-100 transition-opacity mb-10">
                    "{path.description}"
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                    <span className="flex items-center gap-2"><DollarSign size={14} className="text-accent" /> {path.avgSalary} Avg</span>
                    <span className="flex items-center gap-2"><Target size={14} className="text-accent-blue" /> Focused Vector</span>
                  </div>
                  <div className="flex items-center justify-center h-12 rounded-xl bg-white/5 border border-white/5 group-hover:border-accent/40 group-hover:text-accent transition-all text-[10px] font-black uppercase tracking-widest gap-3">
                     Initiate Trajectory <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {paths.length === 0 && (
         <motion.div variants={itemVariants} className="glass-card py-32 text-center flex flex-col items-center gap-8 border-dashed border-white/10">
           <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 opacity-30">
             <Compass size={48} className="text-text-tertiary" />
           </div>
           <p className="text-text-secondary text-2xl font-bold tracking-tight">Zero career vectors detected in core database.</p>
         </motion.div>
      )}
    </motion.div>
  );
}
