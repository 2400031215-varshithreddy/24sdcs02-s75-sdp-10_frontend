import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw, Zap, Sparkles, BrainCircuit, ShieldCheck } from "lucide-react";
import { apiGet } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
  id: number; 
  questionText: string; 
  optionA: string; 
  optionB: string; 
  optionC: string; 
  optionD: string; 
  correctOption: string; 
  explanation: string;
}

interface QuizData {
  id: number; 
  title: string; 
  companyName: string; 
  difficulty: string; 
  questions: QuizQuestion[];
}

export default function QuizRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<QuizData>(`/api/quizzes/${id}`)
      .then(setQuiz)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary">Synchronizing Challenge Nodes...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-8">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 opacity-30">
          <Trophy size={40} className="text-text-tertiary" />
        </div>
        <p className="text-text-secondary text-xl font-medium tracking-tight">Challenge signature not found.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-premium px-12 h-14 uppercase tracking-widest text-xs font-black">Return to Terminal</button>
      </div>
    );
  }

  const q = quiz.questions[currentIdx];
  const options = [
    { key: 'A', text: q?.optionA },
    { key: 'B', text: q?.optionB },
    { key: 'C', text: q?.optionC },
    { key: 'D', text: q?.optionD },
  ];

  const handleSelect = (key: string) => {
    if (showAnswer) return;
    setSelected(key);
    setShowAnswer(true);
    if (key === q.correctOption) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    const isPassing = pct >= 70;
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl mx-auto space-y-12 pb-24 text-center select-none"
      >
        <motion.div variants={itemVariants} className="glass-card p-bento border-accent/20 bg-gradient-to-br from-accent/5 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full" />
          
          <div className={`w-24 h-24 rounded-[32px] mx-auto mb-10 flex items-center justify-center border transition-all duration-700 ${
            isPassing ? 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/20 shadow-glow' : 'bg-red-500/10 border-red-500/20 shadow-red-500/20 shadow-glow'
          }`}>
            <Trophy size={44} className={isPassing ? 'text-emerald-400' : 'text-red-400'} />
          </div>

          <h2 className="text-5xl font-black text-white tracking-tighter mb-4 italic">Analysis <span className={isPassing ? 'text-emerald-400' : 'text-red-400'}>Complete.</span></h2>
          <p className="section-label !mb-12">{quiz.title} — {quiz.companyName} Sector</p>
          
          <div className="flex flex-col items-center gap-4 mb-16 px-10">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.5 }}
              className={`text-8xl font-black tracking-tighter leading-none ${isPassing ? 'accent-gradient' : 'text-red-400'}`}
            >
              {pct}%
            </motion.div>
            <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-tertiary">
               <ShieldCheck size={14} className={isPassing ? 'text-emerald-400' : 'text-red-400'} />
               Verification: {score} / {quiz.questions.length} Nodes Mastered
            </div>
          </div>

          <p className="text-text-secondary text-lg font-medium max-w-sm mx-auto mb-12 italic">
            {isPassing 
              ? "Exceptional synchronization detected. Professional resonance within target parameters confirmed." 
              : "Sub-optimal synchronization. Neural reprocessing recommended before field deployment."}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => { setCurrentIdx(0); setScore(0); setSelected(null); setShowAnswer(false); setFinished(false); }}
              className="px-10 h-16 rounded-2xl border border-white/10 bg-white/5 text-text-secondary hover:text-white hover:bg-white/10 transition-all font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3"
            >
              <RotateCcw size={16} /> Re-Initialize
            </button>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="btn-premium px-12 h-16 text-[10px] uppercase tracking-[0.2em] font-black shadow-glow"
            >
              Control Center <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto space-y-12 pb-24"
    >
      <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-tertiary hover:text-accent transition-all group">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
          <ArrowLeft size={14} />
        </div>
        Withdraw Reference
      </button>

      {/* Header Info */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-glow shadow-purple-500/10">
            <Zap size={28} className="text-purple-400 animate-pulse" />
          </div>
          <div>
            <span className="section-label !mb-0 text-purple-400">Tactical Challenge / {quiz.companyName}</span>
            <h3 className="text-3xl font-black tracking-tighter text-white">{quiz.title}</h3>
          </div>
        </div>
        <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">
           Vector <span className="text-accent">{currentIdx + 1}</span> / {quiz.questions.length}
        </div>
      </motion.div>

      {/* Synchronized Progress */}
      <motion.div variants={itemVariants} className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className="h-full bg-purple-500 shadow-glow shadow-purple-500/30" 
        />
      </motion.div>

      {/* Central Logic Processing */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <div className="glass-card p-bento bg-gradient-to-br from-white/[0.02] to-transparent relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
              
              <h3 className="text-2xl md:text-3xl font-black text-white mb-16 leading-relaxed tracking-tight text-center max-w-3xl mx-auto italic">
                "{q.questionText}"
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {options.map(opt => {
                  let statusColor = "border-white/5 bg-white/[0.02]";
                  let textColor = "text-text-secondary";
                  let icon = <span className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 font-black text-[10px] group-hover/opt:border-purple-500/40">{opt.key}</span>;

                  if (showAnswer) {
                    if (opt.key === q.correctOption) {
                      statusColor = "border-emerald-500/40 bg-emerald-500/10 shadow-glow shadow-emerald-500/10";
                      textColor = "text-emerald-400";
                      icon = <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-primary"><CheckCircle size={20} /></div>;
                    } else if (opt.key === selected) {
                      statusColor = "border-red-500/40 bg-red-500/10 shadow-glow shadow-red-500/10";
                      textColor = "text-red-400";
                      icon = <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-primary"><XCircle size={20} /></div>;
                    } else {
                      statusColor = "opacity-40 border-white/5 bg-transparent";
                    }
                  } else if (opt.key === selected) {
                    statusColor = "border-purple-500/40 bg-purple-500/10 shadow-glow shadow-purple-500/10";
                    textColor = "text-purple-400";
                  }

                  return (
                    <button 
                      key={opt.key} 
                      onClick={() => handleSelect(opt.key)}
                      className={`group/opt relative flex items-center p-6 rounded-2xl border transition-all duration-500 ${statusColor} ${textColor} text-left`}
                    >
                      <div className="mr-6 shrink-0 transition-all duration-500 group-hover/opt:scale-110">
                        {icon}
                      </div>
                      <span className="text-sm font-bold leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Protocol */}
              <AnimatePresence>
                {showAnswer && q.explanation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-16 p-8 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex items-start gap-6 max-w-3xl mx-auto backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                       <BrainCircuit size={22} className="text-purple-400" />
                    </div>
                    <div className="space-y-2">
                       <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest leading-none">Logic Trace Protocol</span>
                       <p className="text-text-secondary text-sm font-medium leading-relaxed italic">"{q.explanation}"</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Control Bar */}
      <div className="flex items-center justify-between gap-8 pt-8">
         <div className="hidden sm:flex gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-tertiary">
               <ShieldCheck size={18} />
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-tertiary">
               <Sparkles size={18} />
            </div>
         </div>

         <AnimatePresence>
           {showAnswer && (
             <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleNext} 
              className="btn-premium h-16 px-16 text-xs uppercase tracking-[0.3em] font-black group shadow-glow shadow-purple-500/20"
             >
                {currentIdx < quiz.questions.length - 1 ? (
                  <span className="flex items-center gap-3">
                    Next Vector <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    Finalize Results <CheckCircle size={18} />
                  </span>
                )}
             </motion.button>
           )}
         </AnimatePresence>
      </div>
    </motion.div>
  );
}
