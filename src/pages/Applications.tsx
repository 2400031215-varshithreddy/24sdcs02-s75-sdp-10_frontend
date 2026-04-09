import { GraduationCap, Eye, UserPlus, UserMinus, CheckCircle2, Search, Filter, ShieldCheck, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const applications = [
    { id: 1, name: "Rahul Sharma", role: "Full Stack Developer", date: "2026-03-15", status: "Pending", initials: "RS" },
    { id: 2, name: "Priya Patel", role: "Data Analyst", date: "2026-03-16", status: "Shortlisted", initials: "PP" },
    { id: 3, name: "Arjun Mehta", role: "ML Engineer", date: "2026-03-17", status: "Rejected", initials: "AM" },
    { id: 4, name: "Sneha Reddy", role: "DevOps Engineer", date: "2026-03-18", status: "Pending", initials: "SR" },
    { id: 5, name: "Karthik Nair", role: "Cloud Architect", date: "2026-03-19", status: "Shortlisted", initials: "KN" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16 pb-24"
    >
      {/* Header Command Protocol */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-accent" />
            <span className="section-label !mb-0">Talent Acquisition / Vector Processing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-[0.95]">
            Neural <span className="accent-gradient">Recruitment.</span>
          </h1>
          <p className="text-text-secondary text-xl font-medium">Coordinate and synchronize incoming candidate intelligence vectors.</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-tertiary">
          <Activity size={14} className="text-accent animate-pulse" />
          {applications.length} Active Nodes
        </div>
      </motion.div>

      {/* Filter and Control Interface */}
      <motion.div variants={itemVariants} className="glass-card p-8 flex flex-col xl:flex-row gap-8 shadow-glow">
        <div className="relative group flex-1">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search candidate nodes or applied career vectors..."
            className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4 text-text-tertiary">
            <Filter size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Filter:</span>
          </div>
          {['Active', 'Verified', 'Rejected'].map(f => (
             <button key={f} className="px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/5 hover:border-white/20 text-text-secondary hover:text-white transition-all">
                {f}
             </button>
          ))}
        </div>
      </motion.div>

      {/* Main Vector List */}
      <motion.div variants={itemVariants} className="glass-card overflow-hidden border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">Candidate Node</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">Career Vector</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">Sync Date</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">Integrity Status</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary text-right">Overrides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {applications.map((app) => (
                <motion.tr 
                  key={app.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.015)' }}
                  className="group transition-all duration-300"
                >
                  <td className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-accent text-primary flex items-center justify-center font-black text-xs shadow-glow shadow-accent/20 group-hover:scale-110 transition-transform">
                        {app.initials}
                      </div>
                      <div>
                         <span className="text-base font-black text-white block group-hover:text-accent transition-colors">{app.name}</span>
                         <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-60">Verified Identity</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                     <span className="text-sm font-bold text-text-secondary italic">"{app.role}"</span>
                  </td>
                  <td className="p-8">
                     <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{app.date}</span>
                  </td>
                  <td className="p-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                      app.status === 'Pending' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                      app.status === 'Shortlisted' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                      'bg-red-500/5 border-red-500/20 text-red-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                         app.status === 'Pending' ? 'bg-amber-500' :
                         app.status === 'Shortlisted' ? 'bg-emerald-500' : 'bg-red-500'
                      } animate-pulse`} />
                      {app.status}
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      {[
                        { i: Eye, c: 'text-accent-blue', l: 'View' },
                        { i: UserPlus, c: 'text-emerald-400', l: 'Shortlist' },
                        { i: UserMinus, c: 'text-red-400', l: 'Reject' },
                        { i: CheckCircle2, c: 'text-accent', l: 'Finalize' }
                      ].map((act, idx) => (
                        <button 
                          key={idx}
                          className={`w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center ${act.c} hover:scale-110 transition-all hover:bg-white/10`}
                          title={act.l}
                        >
                          <act.i size={18} />
                        </button>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Footer System Integrity */}
      <motion.div variants={itemVariants} className="flex justify-center pt-8">
         <div className="flex items-center gap-6 px-12 py-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <ShieldCheck size={24} className="text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary">All Vector Synchronizations Encrypted and Verified</span>
         </div>
      </motion.div>
    </motion.div>
  );
}
