import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Sparkles, Target, Zap, ShieldCheck, Download, Share2, Brain } from "lucide-react";
import { apiGet } from "@/lib/api";
import { motion } from "framer-motion";
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip as ChartTooltip, 
  Legend 
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

interface ResultResponse {
  id: number;
  analyticalScore: number;
  creativeScore: number;
  technicalScore: number;
  socialScore: number;
  totalScore: number;
  aiRecommendation: string;
  date: string;
}

const scoreConfig = [
  { key: "analyticalScore", label: "Analytical", color: "#60A5FA", glow: "rgba(96, 165, 250, 0.4)" },
  { key: "creativeScore", label: "Creative", color: "#C084FC", glow: "rgba(192, 132, 252, 0.4)" },
  { key: "technicalScore", label: "Technical", color: "#34D399", glow: "rgba(52, 211, 153, 0.4)" },
  { key: "socialScore", label: "Social", color: "#FBBF24", glow: "rgba(251, 191, 36, 0.4)" },
] as const;

// Streaming Text Component for AI feel
const TypewriterText = ({ text, delay = 0.03 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return (
    <p className="text-text-secondary font-medium leading-relaxed italic relative">
       {displayedText}
       {currentIndex < text.length && (
         <motion.span 
           animate={{ opacity: [0, 1, 0] }}
           transition={{ duration: 0.8, repeat: Infinity }}
           className="inline-block w-1.5 h-4 bg-accent ml-1 -mb-0.5"
         />
       )}
    </p>
  );
};

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<ResultResponse>(`/api/assessment/results/${id}`)
      .then(setResult)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const radarData = useMemo(() => {
    if (!result) return null;
    return {
      labels: ['Analytical', 'Creative', 'Technical', 'Social'],
      datasets: [{
        label: 'Neural Profile',
        data: [result.analyticalScore, result.creativeScore, result.technicalScore, result.socialScore],
        backgroundColor: 'rgba(197, 160, 89, 0.1)',
        borderColor: '#C5A059',
        borderWidth: 2,
        pointBackgroundColor: '#C5A059',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#C5A059',
      }]
    };
  }, [result]);

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        pointLabels: { color: '#64748B', font: { size: 10, weight: 'bold' as const } },
        ticks: { display: false, stepSize: 20 },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: false
  };

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
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 bg-accent/20 rounded-3xl flex items-center justify-center border border-accent/30 shadow-glow"
        >
          <Sparkles className="text-accent" />
        </motion.div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-accent/60">Calibrating Neural Sync...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-8">
        <p className="text-text-secondary text-xl font-medium">Neural record signature not found.</p>
        <button onClick={() => navigate("/dashboard")} className="btn-premium px-12 h-14 uppercase tracking-widest text-xs font-black">Return to Terminal</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto space-y-16 pb-24"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary hover:text-accent transition-all group">
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all border border-white/5">
            <ArrowLeft size={16} />
          </div>
          Return to Dashboard
        </button>
        <div className="flex gap-4">
           <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-text-tertiary hover:text-accent transition-all hover:bg-white/10 group">
              <Download size={18} className="group-hover:scale-110 transition-transform" />
           </button>
           <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-text-tertiary hover:text-accent transition-all hover:bg-white/10 group">
              <Share2 size={18} className="group-hover:scale-110 transition-transform" />
           </button>
        </div>
      </div>

      {/* Header Profile Section */}
      <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] mb-10 shadow-glow shadow-emerald-500/5">
          <ShieldCheck size={14} />
          Neural Integrity Verified — {id}
        </div>
        <h2 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 italic leading-none">Neural <span className="accent-gradient">Spectrum.</span></h2>
        <p className="text-text-secondary text-xl font-medium opacity-80">High-Precision Career Resonance Mapping Analysis.</p>
      </motion.div>

      {/* Advanced Visual Mapping Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deep Field Radar Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card-plus p-bento bg-gradient-to-br from-white/[0.02] to-transparent min-h-[500px] flex flex-col">
           <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">Neural Architecture</h3>
                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Aggregate Score Multi-Vector Displacement</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                <Brain size={24} className="text-accent/60" />
              </div>
           </div>
           <div className="flex-1 relative">
             {radarData && < Radar data={radarData} options={radarOptions} />}
           </div>
        </motion.div>

        {/* Tactical Breakdown List */}
        <motion.div variants={itemVariants} className="glass-card-plus p-bento grid grid-cols-1 gap-6">
          <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic mb-4">Tactical Nodes</h3>
          {scoreConfig.map(sc => {
            const score = (result as any)[sc.key];
            return (
              <div key={sc.key} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-accent/30 transition-all magnetic-pulse">
                <div className="flex items-center justify-between mb-4">
                   <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{sc.label} Efficiency</span>
                   <span className="text-xl font-black text-white" style={{ color: sc.color }}>{score}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                    className="h-full rounded-full" 
                    style={{ background: sc.color, boxShadow: `0 0 12px ${sc.glow}` }}
                   />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Detailed Strategic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommendation - Typewriter Mode */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card-plus p-bento border-accent/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full" />
          
          <div className="flex items-center gap-6 mb-12 pb-10 border-b border-white/5">
            <div className="w-16 h-16 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-glow">
              <Sparkles size={32} className="text-accent animate-pulse" />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight uppercase italic">Strategic Trajectories</h3>
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Neural Intelligence Analysis v4.2</p>
            </div>
          </div>

          <div className="space-y-8">
            {result.aiRecommendation.split('\n\n').map((paragraph, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + (idx * 0.2) }}
                className="flex items-start gap-8 p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-accent/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-all border border-white/5 text-text-tertiary group-hover:text-accent shadow-glow shadow-transparent group-hover:shadow-accent/5">
                  <Briefcase size={20} />
                </div>
                <div className="flex-1">
                   <TypewriterText text={paragraph.startsWith('-') ? paragraph : paragraph} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Execution Plan Container */}
        <motion.div variants={itemVariants} className="glass-card-plus p-bento bg-accent/5 border-accent/10 flex flex-col">
          <h3 className="text-2xl font-black mb-10 tracking-tight uppercase italic">Execution Protocol</h3>
          <div className="space-y-5 flex-1">
             {[
               { l: 'Explore Adaptive Pathways', i: Target, p: '/paths' },
               { l: 'Initiate Field Simulations', i: Zap, p: '/quizzes' },
               { l: 'Neural Archive: Certificates', i: ShieldCheck, p: '/my-certificates' }
             ].map((step, idx) => (
               <button
                key={idx}
                onClick={() => navigate(step.p)}
                className="w-full flex items-center justify-between p-6 rounded-[24px] bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/[0.08] transition-all group text-left shadow-glow shadow-transparent hover:shadow-accent/5"
               >
                 <div className="flex items-center gap-5">
                   <step.i size={20} className="text-accent group-hover:scale-110 transition-transform" />
                   <span className="text-sm font-black text-white uppercase tracking-widest group-hover:text-accent transition-colors">{step.l}</span>
                 </div>
                 <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" size={18} />
               </button>
             ))}
          </div>
          <div className="mt-auto pt-12 border-t border-white/5 text-center">
             <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-loose">
                Profile synchronized: {new Date(result.date).toLocaleString()}
             </p>
          </div>
        </motion.div>
      </div>

      {/* Global Final Action */}
      <motion.div variants={itemVariants} className="flex flex-col items-center gap-10 pt-12">
          <div className="text-center space-y-2">
             <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.4em]">Final Engagement Objective</p>
             <h4 className="text-4xl font-black italic tracking-tighter uppercase">Commence <span className="accent-gradient">Integration.</span></h4>
          </div>
          <button 
             onClick={() => navigate("/paths")} 
             className="btn-premium px-20 h-20 text-xs uppercase tracking-[0.4em] font-black shadow-[0_0_50px_rgba(197,160,89,0.4)]"
          >
             Commit to Pathway <Zap className="ml-2" size={20} />
          </button>
      </motion.div>
    </motion.div>
  );
}
