import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "@/lib/api";
import { 
  Trophy, Clock, ArrowLeft, 
  Award, Code
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Contest {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

interface LeaderboardEntry {
  userId: number;
  userName: string;
  problemsSolved: number;
  totalPenalty: number;
  rank: number;
}

export default function ContestArenaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState<Contest | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'problems' | 'leaderboard'>('problems');
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contestData, leaderboardData] = await Promise.all([
          apiGet<Contest>(`/api/contests/${id}`),
          apiGet<LeaderboardEntry[]>(`/api/contests/${id}/leaderboard`)
        ]);
        setContest(contestData);
        setLeaderboard(leaderboardData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const interval = setInterval(() => {
      if (contest) {
        const end = new Date(contest.endTime).getTime();
        const now = new Date().getTime();
        const diff = end - now;
        if (diff <= 0) {
          setTimeLeft("EXPIRED");
        } else {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${h}h ${m}m ${s}s`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [id, contest?.endTime]);

  if (loading || !contest) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
         <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Contest Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/contests")}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">{contest.name}</h1>
            <div className="flex items-center gap-4 text-text-tertiary">
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-accent" />
                Time Remaining: <span className="text-white">{timeLeft}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 p-1.5 bg-white/5 border border-white/5 rounded-[20px] w-fit">
           <button 
             onClick={() => setView('problems')}
             className={`px-8 py-3 rounded-[15px] text-[10px] font-black uppercase tracking-widest transition-all ${
               view === 'problems' ? 'bg-accent text-primary shadow-glow' : 'text-text-tertiary'
             }`}
           >
             Problems
           </button>
           <button 
             onClick={() => setView('leaderboard')}
             className={`px-8 py-3 rounded-[15px] text-[10px] font-black uppercase tracking-widest transition-all ${
               view === 'leaderboard' ? 'bg-accent text-primary shadow-glow' : 'text-text-tertiary'
             }`}
           >
             Leaderboard
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'problems' ? (
          <motion.div
            key="problems"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 gap-6"
          >
            {/* We would fetch the problems for this contest here. 
                For now, we'll show a message or list them if available in the contest object.
                Assuming a standard contest has 3-4 problems. */}
            {[1, 2, 3].map((num) => (
              <div 
                key={num}
                className="glass-card-plus p-10 flex items-center justify-between group cursor-pointer"
                onClick={() => navigate(`/practice/${num}`)} // Link to a real problem
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/40 transition-all">
                    <span className="text-2xl font-black text-text-tertiary group-hover:text-accent transition-colors">{String.fromCharCode(64 + num)}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight mb-2">Architectural Logic Cluster {num}</h3>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-accent uppercase tracking-widest">Score: 100 Points</span>
                       <div className="w-1 h-1 rounded-full bg-white/20" />
                       <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Accuracy Node: 45%</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
                  <Code size={20} />
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card overflow-hidden"
          >
            <div className="px-10 py-8 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <Trophy size={20} className="text-accent" />
                 <h3 className="text-xl font-black uppercase tracking-tight italic">Live Performance Rankings</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Refreshed: Every 60s</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-text-tertiary">
                    <th className="px-10 py-6">Rank</th>
                    <th className="px-10 py-6">Architect</th>
                    <th className="px-10 py-6 text-center">Nodes Solved</th>
                    <th className="px-10 py-6 text-center">Total Penalty</th>
                    <th className="px-10 py-6 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-20 text-center text-text-tertiary italic">
                        No submissions recorded yet in this simulation.
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((entry) => (
                      <tr key={entry.userId} className="group hover:bg-white/[0.01] transition-all">
                        <td className="px-10 py-8 font-black text-2xl tracking-tighter">
                          {entry.rank === 1 ? <Award className="text-accent" size={24} /> : `#${entry.rank}`}
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-black">
                               {entry.userName.charAt(0)}
                             </div>
                             <span className="font-bold text-white group-hover:text-accent transition-colors">{entry.userName}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-center font-black text-lg">{entry.problemsSolved}/3</td>
                        <td className="px-10 py-8 text-center text-text-tertiary font-mono">{entry.totalPenalty}m</td>
                        <td className="px-10 py-8 text-right">
                           <span className="text-xl font-black text-accent">{entry.problemsSolved * 100}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
