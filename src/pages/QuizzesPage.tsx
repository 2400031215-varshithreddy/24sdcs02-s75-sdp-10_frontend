import { useState, useEffect } from "react";
import { Zap, ArrowRight, Target } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface QuizItem {
  id: number;
  title: string;
  companyName: string;
  difficulty: string;
  questionCount: number;
}

interface CareerPath {
  id: number;
  name: string;
}

export default function QuizzesPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qData, pData] = await Promise.all([
        apiGet<QuizItem[]>("/api/quizzes"),
        apiGet<CareerPath[]>("/api/paths")
      ]);
      setQuizzes(qData);
      setPaths(pData);
    } catch (err) {
      console.error("Failed to fetch simulation data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateAIQuiz = async () => {
    if (!selectedPath) return;
    setGenerating(true);
    try {
      await apiPost<{ id: number }>("/api/quizzes/generate", { careerPathId: parseInt(selectedPath) });
      await fetchData(); // Refresh list
      setSelectedPath("");
    } catch (err) {
      console.error("AI Generation Error", err);
    } finally {
      setGenerating(false);
    }
  };

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
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary">Calibrating Simulation Matrices...</p>
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
          <span className="section-label !mb-0 text-purple-400">Intelligence / Skill Simulations</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-[0.95]">
          Field <span className="text-purple-400">Simulations.</span>
        </h1>
        <p className="text-text-secondary text-xl font-medium">Proprietary interview models and high-resolution technical assessments designed with industry elite.</p>
        
        {/* AI Generation Control */}
        <motion.div variants={itemVariants} className="mt-12 p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Target className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Neural Generator</p>
              <p className="text-sm font-bold text-white">Synthesize Custom Mastery Simulation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={selectedPath}
              onChange={(e) => setSelectedPath(e.target.value)}
              className="h-12 px-6 rounded-xl bg-primary border border-white/10 text-xs font-bold text-white outline-none focus:border-accent/40 transition-all flex-1 md:w-64"
            >
              <option value="">Select Carrier Vector...</option>
              {paths.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button 
              onClick={handleGenerateAIQuiz}
              disabled={generating || !selectedPath}
              className="btn-premium h-12 px-8 text-[10px] uppercase tracking-widest font-black disabled:opacity-50 flex items-center gap-3 whitespace-nowrap"
            >
              {generating ? (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <>Generate AI Quiz <Zap size={14} /></>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {quizzes.map((quiz) => (
            <motion.div 
              key={quiz.id}
              variants={itemVariants}
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="glass-card p-1 group cursor-pointer relative overflow-hidden group/card hover:bg-white/[0.03] transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[20px] rounded-full group-hover/card:bg-purple-500/10 transition-all duration-700 gpu" />
              
              <div className="relative z-10 p-bento h-full flex flex-col justify-between min-h-[320px]">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow shadow-purple-500/5">
                      <Zap size={28} className="text-purple-400" />
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-black uppercase tracking-widest">
                       {quiz.companyName}
                    </div>
                  </div>
                  
                  <h4 className="text-3xl font-black text-white leading-tight tracking-tight mb-4 group-hover:text-purple-400 transition-colors">
                    {quiz.title}
                  </h4>
                  <div className="flex items-center gap-6 mt-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                      <Target size={14} className="text-accent" /> {quiz.questionCount} Vectors
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      quiz.difficulty === 'Easy' ? 'border-emerald-500/20 text-emerald-400' :
                      quiz.difficulty === 'Medium' ? 'border-accent-blue/20 text-accent-blue' : 'border-red-500/20 text-red-400'
                    }`}>
                      {quiz.difficulty} Tier
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-center h-12 rounded-xl bg-white/5 border border-white/5 group-hover:border-purple-400/40 group-hover:text-purple-400 transition-all text-[10px] font-black uppercase tracking-widest gap-3">
                     Initiate Simulation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {quizzes.length === 0 && (
         <motion.div variants={itemVariants} className="glass-card py-32 text-center flex flex-col items-center gap-8 border-dashed border-white/10">
           <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 opacity-30">
             <Zap size={48} className="text-text-tertiary" />
           </div>
           <p className="text-text-secondary text-2xl font-bold tracking-tight">Zero simulation nodes detected in system.</p>
         </motion.div>
      )}
    </motion.div>
  );
}
