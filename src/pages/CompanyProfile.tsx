import { Building2, Globe, MapPin, Users, Mail, Phone, ShieldCheck, Activity, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function CompanyProfile() {
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
      {/* Header Command Protocol */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-accent" />
            <span className="section-label !mb-0">Entity Profile / Organizational Node</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-[0.95]">
            Corporate <span className="accent-gradient">Identity.</span>
          </h1>
          <p className="text-text-secondary text-xl font-medium">Manage your organizational parameters and public-facing visual signatures.</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
          <ShieldCheck size={14} />
          Profile Verified
        </div>
      </motion.div>

      {/* Main Configuration Interface */}
      <motion.div variants={itemVariants} className="glass-card p-0 overflow-hidden border-accent/10 shadow-glow shadow-accent/5">
        <div className="p-bento bg-gradient-to-br from-white/[0.02] to-transparent">
          {/* Entity Branding Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-16 pb-16 border-b border-white/5">
            <div className="w-24 h-24 rounded-3xl bg-accent text-primary flex items-center justify-center font-black text-3xl shadow-glow shadow-accent/20 shrink-0 group-hover:scale-105 transition-transform duration-500 italic">
              CC
            </div>
            <div className="text-center md:text-left space-y-3">
              <h3 className="text-3xl font-black text-white tracking-tight">Career Compass AI</h3>
              <p className="text-text-secondary font-medium text-lg leading-relaxed italic opacity-80">"Building the foundation of neural career steering."</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                 <span className="px-4 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">Active Node</span>
                 <span className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/5 text-text-tertiary text-[9px] font-black uppercase tracking-widest">V2.4 Protocol</span>
              </div>
            </div>
          </div>

          {/* Configuration Data Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Field: Name */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Building2 size={14} className="text-accent" />
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Entity Signature</label>
              </div>
              <input 
                type="text" 
                defaultValue="Career Compass AI" 
                className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-text-tertiary/50" 
              />
            </div>

            {/* Field: Website */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Globe size={14} className="text-accent-blue" />
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Digital Domain</label>
              </div>
              <input 
                type="url" 
                defaultValue="https://careercompass.ai" 
                className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-text-tertiary/50" 
              />
            </div>

            {/* Field: Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <MapPin size={14} className="text-red-400" />
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Physical Hub</label>
              </div>
              <input 
                type="text" 
                defaultValue="Bangalore, India" 
                className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-text-tertiary/50" 
              />
            </div>

            {/* Field: Team Size */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Users size={14} className="text-purple-400" />
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Node Capacity</label>
              </div>
              <select className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all appearance-none cursor-pointer">
                <option className="bg-[#0B1120]">1-10 Members</option>
                <option className="bg-[#0B1120]">11-50 Members</option>
                <option className="bg-[#0B1120]" selected>51-200 Members</option>
                <option className="bg-[#0B1120]">201-1000 Members</option>
                <option className="bg-[#0B1120]">1000+ Members</option>
              </select>
            </div>

            {/* Field: Email */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Mail size={14} className="text-text-secondary" />
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Protocol Email</label>
              </div>
              <input 
                type="email" 
                defaultValue="admin@careercompass.com" 
                className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-text-tertiary/50" 
              />
            </div>

            {/* Field: Phone */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Phone size={14} className="text-text-secondary" />
                 <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Encrypted Voice Line</label>
              </div>
              <input 
                type="tel" 
                defaultValue="+91 98765 43210" 
                className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-text-tertiary/50" 
              />
            </div>
          </div>

          {/* Action Protocol Footer */}
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div className="flex items-center gap-4 text-text-tertiary">
                <Activity size={18} className="text-accent animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Autosync and security backups active.</span>
             </div>
             <button className="btn-premium h-16 px-16 text-xs uppercase tracking-[0.3em] font-black shadow-glow flex items-center gap-3">
                Update Identity <Save size={18} />
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
