import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Award, ArrowRight, Download, Calendar, ShieldCheck, Sparkles, Zap, Search } from "lucide-react";
import { apiGet } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface CertItem {
  id: number; certificateId: string; certificateTitle: string; studentName: string; issuedAt: string;
}

export default function MyCertificates() {
  const navigate = useNavigate();
  const [certs, setCerts] = useState<CertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<CertItem[]>("/api/certificates")
      .then(setCerts)
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
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary">Recalling Neural Achievements...</p>
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
      {/* Header Profile Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-accent" />
            <span className="section-label !mb-0">Personal Achievements / Credentials</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-[0.95]">
            Neural <span className="accent-gradient">Archive.</span>
          </h1>
          <p className="text-text-secondary text-xl font-medium">Your verified professional profile, backed by industry-standard authentication protocols.</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-tertiary">
          <ShieldCheck size={14} className="text-accent" />
          {certs.length} Active Credentials
        </div>
      </motion.div>

      {certs.length === 0 ? (
        <motion.div 
          variants={itemVariants} 
          className="glass-card py-32 text-center flex flex-col items-center gap-8 border-dashed border-white/10"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 opacity-30">
            <Award size={48} className="text-text-tertiary" />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black tracking-tight italic">Archive Empty.</h3>
            <p className="text-text-secondary text-lg font-medium max-w-sm mx-auto">
              Engage with intelligence modules to populate your professional neural record.
            </p>
          </div>
          <button onClick={() => navigate('/courses')} className="btn-premium px-12 h-16 uppercase tracking-widest text-xs font-black">
            Sync Knowledge Nodes <ArrowRight size={16} className="ml-2" />
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {certs.map((cert) => (
              <motion.div 
                key={cert.id}
                layout
                variants={itemVariants}
                onClick={() => navigate(`/certificate/${cert.id}`)}
                className="glass-card p-1 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] rounded-full group-hover:bg-accent/10 transition-all duration-700" />
                
                <div className="relative z-10 p-bento h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-10">
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow shadow-accent/5">
                        <Award size={28} className="text-accent" />
                      </div>
                      <div className="flex gap-2">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                            <Download size={18} className="text-text-tertiary group-hover:text-white" />
                         </div>
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-black text-white leading-tight tracking-tight mb-4 italic group-hover:text-accent transition-colors">
                      {cert.certificateTitle}
                    </h4>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-loose mb-10">
                       Mastery Verified for <span className="text-white">{cert.studentName}</span>
                    </p>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                      <span className="flex items-center gap-2"><Calendar size={14} className="text-accent" /> {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : 'N/A'}</span>
                      <span className="text-white/40">ID: {cert.certificateId.slice(0, 10)}...</span>
                    </div>
                    <div className="flex items-center justify-center h-12 rounded-xl bg-white/5 border border-white/5 group-hover:border-accent/40 group-hover:text-accent transition-all text-[10px] font-black uppercase tracking-widest gap-3">
                       Validate Credential <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Global Intelligence Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
         {[
           { l: 'Verification Speed', v: '0.4s', i: Zap, c: 'text-accent' },
           { l: 'Encryption Level', v: 'AES-256', i: ShieldCheck, c: 'text-emerald-400' },
           { l: 'Industry Reach', v: 'GLOBAL', i: Sparkles, c: 'text-accent-blue' }
         ].map((stat, idx) => (
           <div key={idx} className="flex items-center gap-6 p-8 glass-card border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                 <stat.i size={20} className={stat.c} />
              </div>
              <div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">{stat.l}</span>
                 <p className="text-lg font-black text-white">{stat.v}</p>
              </div>
           </div>
         ))}
      </motion.div>
    </motion.div>
  );
}
