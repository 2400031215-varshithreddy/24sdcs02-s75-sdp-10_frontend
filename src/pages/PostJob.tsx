import { PlusCircle, Briefcase, MapPin, Clock, DollarSign, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function PostJob() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto space-y-16 pb-24"
    >
      {/* Header Activation Protocol */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-accent" />
            <span className="section-label !mb-0">Opportunity Deployment / Career Vectoring</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-[0.95]">
            Deploy <span className="accent-gradient">Future.</span>
          </h1>
          <p className="text-text-secondary text-xl font-medium">Publish new industrial career vectors to our elite neural network nodes.</p>
        </div>
        
        <button className="btn-premium h-16 px-12 text-xs uppercase tracking-[0.3em] font-black group shadow-glow">
           Initialize Broadcast <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
        </button>
      </motion.div>

      {/* Blueprint Configuration Interface */}
      <motion.div variants={itemVariants} className="glass-card p-0 border-white/5 overflow-hidden">
        <div className="p-bento bg-gradient-to-br from-white/[0.02] to-transparent space-y-12">
          
          <div className="grid grid-cols-1 gap-12">
            {/* Field: Job Title */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Briefcase size={14} className="text-accent" />
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Vector Designation (Role Title)</label>
              </div>
              <input 
                type="text" 
                placeholder="e.g. Senior Neural Interface Developer" 
                className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-text-tertiary/50" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Field: Location */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <MapPin size={14} className="text-accent-blue" />
                   <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Geographical Node</label>
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. Remote / Bangalore Hub" 
                  className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-text-tertiary/50" 
                />
              </div>

              {/* Field: Job Type */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <Clock size={14} className="text-purple-400" />
                   <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Engagement Protocol</label>
                </div>
                <select className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all appearance-none cursor-pointer">
                  <option className="bg-[#0B1120]">Full-Time Synchronization</option>
                  <option className="bg-[#0B1120]">Part-Time Node</option>
                  <option className="bg-[#0B1120]">Neural Internship</option>
                  <option className="bg-[#0B1120]">Consultancy Contract</option>
                </select>
              </div>
            </div>

            {/* Field: Salary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <DollarSign size={14} className="text-emerald-400" />
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Yield Range (Compensation)</label>
              </div>
              <input 
                type="text" 
                placeholder="e.g. ₹12L - ₹24L per annum" 
                className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-text-tertiary/50" 
              />
            </div>

            {/* Field: Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Sparkles size={14} className="text-accent" />
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Mission Description (Details)</label>
              </div>
              <textarea 
                rows={6} 
                placeholder="Define the responsibilities, required intellectual capacity, and professional expectations..." 
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all resize-none placeholder:text-text-tertiary/50 leading-relaxed italic" 
              />
            </div>
          </div>

          {/* Action Protocol Footer */}
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div className="flex items-center gap-4 text-text-tertiary">
                <ShieldCheck size={18} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Broadcast Verification Active.</span>
             </div>
             <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary hover:text-white transition-all bg-white/5 border border-white/5 px-8 h-16 rounded-2xl">
                Preview Vector <Zap size={16} />
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
