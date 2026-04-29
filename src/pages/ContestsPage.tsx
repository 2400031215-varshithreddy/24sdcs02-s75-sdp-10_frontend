import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "@/lib/api";
import { Trophy, Calendar, Clock, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface Contest {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

export default function ContestsPage() {
  const navigate = useNavigate();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Contest[]>("/api/contests/active")
      .then(setContests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
         <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
          <span className="section-label !mb-0">Global Simulations / Contests</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[0.9] text-text-primary">
          Weekly <span className="accent-gradient">Clash.</span>
        </h1>
        <p className="text-text-secondary text-xl font-medium leading-relaxed max-w-3xl">
          Compete against the global community in high-stakes architectural challenges. Real-time leaderboards, verified rankings, and elite rewards.
        </p>
      </motion.div>

      {/* Contests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {contests.length === 0 ? (
          <div className="glass-card p-12 text-center col-span-2 opacity-50">
            <Trophy size={48} className="mx-auto mb-6 text-text-tertiary" />
            <p className="text-xl font-bold">No active contests at this moment.</p>
            <p className="text-sm text-text-tertiary">Check back soon for the next global simulation.</p>
          </div>
        ) : (
          contests.map((contest, i) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/contests/${contest.id}`)}
              className="glass-card-plus p-10 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-accent/5 blur-[30px] rounded-full group-hover:bg-accent/10 transition-all" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/50 transition-all">
                    <Trophy size={32} className="text-accent group-hover:animate-bounce" />
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-[10px] font-black text-accent uppercase tracking-widest">
                    Live Now
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-black tracking-tight text-text-primary group-hover:text-accent transition-colors mb-3">
                    {contest.name}
                  </h3>
                  <div className="flex items-center gap-6 text-text-tertiary">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{formatDate(contest.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">2 Hours</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                     <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest block mb-1">Participants</span>
                     <span className="text-lg font-black text-white">458 Nodes</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                     <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest block mb-1">Prize Pool</span>
                     <span className="text-lg font-black text-white">5000 XP</span>
                  </div>
                </div>

                <button className="btn-premium w-full h-16 uppercase tracking-[0.2em] font-black text-xs group">
                  Enter Simulation
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Contest Rules / Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Fair Play", icon: ShieldCheck, desc: "AI-driven plagiarism detection ensures a level playing field." },
          { label: "Real-time", icon: Zap, desc: "Leaderboards update instantly on every verified submission." },
          { label: "Recognition", icon: Zap, desc: "Top performers earn elite badges and verified certificates." },
        ].map((item, i) => (
          <div key={i} className="glass-card p-8 flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
               <item.icon size={20} className="text-accent" />
            </div>
            <div>
               <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">{item.label}</h4>
               <p className="text-[11px] text-text-tertiary font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
