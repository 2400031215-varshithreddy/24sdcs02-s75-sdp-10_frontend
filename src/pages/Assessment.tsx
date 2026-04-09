import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "@/lib/api";
import { ArrowLeft, ArrowRight, CheckCircle, Target, AlertCircle, Sparkles, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionDTO {
  id: number;
  text: string;
  category: string;
}

interface ResultResponse {
  id: number;
}

const categoryMeta: Record<string, { label: string; color: string; border: string; glow: string }> = {
  ANALYTICAL: { label: "Analytical Node", color: "text-blue-400", border: "border-blue-500/20", glow: "shadow-blue-500/10" },
  CREATIVE: { label: "Creative Node", color: "text-purple-400", border: "border-purple-500/20", glow: "shadow-purple-500/10" },
  TECHNICAL: { label: "Technical Node", color: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
  SOCIAL: { label: "Social Node", color: "text-amber-400", border: "border-amber-500/20", glow: "shadow-amber-500/10" },
};

export default function Assessment() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuestionDTO[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<QuestionDTO[]>("/api/assessment/questions")
      .then(setQuestions)
      .catch(() => setError("Failed to synchronize neural questions. Check backend connectivity."))
      .finally(() => setLoading(false));
  }, []);

  const scoreLabels = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" },
  ];

  const handleScoreSelect = (score: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: score }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([questionId, score]) => ({
        questionId: Number(questionId),
        score,
      }));
      const result = await apiPost<ResultResponse>("/api/assessment/submit", payload);
      navigate(`/results/${result.id}`);
    } catch {
      setError("Failed to transmit neural data. Reprocessing suggested.");
      setSubmitting(false);
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
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary">Calibrating Assessment Engine...</p>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-8">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
          <AlertCircle size={40} className="text-red-400" />
        </div>
        <p className="text-red-400 text-lg font-bold tracking-tight">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-premium px-10 h-14 uppercase tracking-widest text-xs font-black">Retry Link</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnsweredCurrent = answers[currentQ.id] !== undefined;
  const totalAnswered = Object.keys(answers).length;
  const cat = categoryMeta[currentQ.category] || { label: currentQ.category, color: "text-text-secondary", border: "border-white/10", glow: "" };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Progress Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 border-accent/10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-glow">
              <BrainCircuit size={24} className="text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="section-label !mb-0">Neural Map Calibration</span>
              <h3 className="text-2xl font-black tracking-tighter">
                Question <span className="text-accent">{currentIndex + 1}</span>
                <span className="text-text-tertiary"> / {questions.length}</span>
              </h3>
            </div>
          </div>
          <div className={`px-6 py-2.5 rounded-full ${cat.border} bg-white/5 flex items-center gap-3 transition-all ${cat.glow}`}>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${cat.color}`}>
              {cat.label}
            </span>
            <div className={`w-2 h-2 rounded-full ${cat.color.replace('text', 'bg')} animate-pulse`} />
          </div>
        </div>

        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="h-full bg-accent relative"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </motion.div>
        </div>

        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">
          <span>{totalAnswered} Signals Processed</span>
          <span>{Math.round(progress)}% Sync Rate</span>
        </div>
      </motion.div>

      {/* Question Interaction Area */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="w-full"
          >
            <div className="glass-card p-bento bg-gradient-to-br from-white/[0.02] to-transparent">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-16 leading-[1.1] tracking-tight text-center max-w-2xl mx-auto italic">
                "{currentQ.text}"
              </h3>

              <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
                {scoreLabels.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleScoreSelect(opt.value)}
                    className={`group relative w-full flex items-center p-6 rounded-2xl border transition-all duration-400 overflow-hidden ${
                      answers[currentQ.id] === opt.value
                        ? "border-accent/40 bg-accent/10 shadow-glow"
                        : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    {answers[currentQ.id] === opt.value && (
                      <motion.div layoutId="activeScore" className="absolute left-0 w-1.5 h-10 bg-accent rounded-r-full" />
                    )}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs mr-6 shrink-0 transition-all ${
                      answers[currentQ.id] === opt.value
                        ? "bg-accent text-primary scale-110 shadow-glow"
                        : "bg-white/5 text-text-tertiary group-hover:text-white"
                    }`}>
                      {answers[currentQ.id] === opt.value ? <CheckCircle size={20} /> : opt.value}
                    </div>
                    <span className={`text-base font-bold transition-colors ${
                      answers[currentQ.id] === opt.value ? "text-white" : "text-text-secondary group-hover:text-white"
                    }`}>
                      {opt.label}
                    </span>
                    <ArrowRight className={`ml-auto transition-all duration-500 opacity-0 group-hover:opacity-40 group-hover:translate-x-2 ${
                      answers[currentQ.id] === opt.value ? "text-accent opacity-100" : "text-text-tertiary"
                    }`} size={20} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {error && (
        <div className="p-6 rounded-2xl bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-widest border border-red-500/20 text-center">
          {error}
        </div>
      )}

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-white/5">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-3 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] text-text-tertiary hover:text-white hover:bg-white/5 transition-all disabled:opacity-0"
        >
          <ArrowLeft size={18} /> Previous Node
        </button>

        <div className="flex justify-center gap-2 flex-wrap order-3 sm:order-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i === currentIndex
                  ? "scale-[1.8] bg-accent shadow-glow"
                  : answers[q.id] !== undefined
                    ? "bg-accent/40"
                    : "bg-white/10 hover:bg-white/30"
              }`}
            />
          ))}
        </div>

        {!isLastQuestion ? (
          <button
            onClick={() => setCurrentIndex(prev => prev + 1)}
            disabled={!hasAnsweredCurrent}
            className="btn-premium h-16 px-12 text-xs uppercase tracking-[0.2em] font-black disabled:opacity-30 order-2 sm:order-3"
          >
            Next Vector <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!hasAnsweredCurrent || submitting}
            className="btn-premium h-16 px-12 text-xs uppercase tracking-[0.3em] font-black disabled:opacity-30 order-2 sm:order-3 shadow-glow"
          >
            {submitting ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                Finalize Sync <Sparkles size={18} />
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
