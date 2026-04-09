import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  ArrowRight, 
  Target, 
  Sparkles,
  Zap,
  Globe,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Logo from "../components/ui/Logo";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-primary text-text-primary scroll-smooth selection:bg-accent selection:text-white no-scrollbar">
      {/* Global Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-24 flex items-center bg-primary/20 backdrop-blur-2xl border-b border-white/[0.03]">
        <div className="max-w-[1440px] mx-auto w-full px-8 md:px-16 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
            <Logo size="md" variant="icon" />
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black tracking-tighter uppercase italic">Career <span className="accent-gradient">Compass.</span></span>
              <span className="text-[8px] font-black text-accent tracking-[0.4em] uppercase opacity-60">Intelligence Agency</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-12">
            <button onClick={() => navigate("/auth")} className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary hover:text-white transition-colors">Neural Access</button>
            <button onClick={() => navigate("/auth")} className="btn-premium px-10 h-12 text-[10px] uppercase tracking-widest font-black shadow-glow">Initiate Protocol</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen w-full snap-start snap-always relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/5 blur-[40px] rounded-full animate-pulse gpu" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-blue/5 blur-[30px] rounded-full animate-pulse gpu" />
        </div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto gpu"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-card border-accent/20 text-accent text-[9px] font-black tracking-[0.4em] uppercase mb-16">
            <Sparkles size={14} className="animate-pulse" />
            Quantum Career Mapping v5.0
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-12 text-white">
            Architect Your <br />
            <span className="accent-gradient">Professional Destiny.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-xl md:text-2xl font-medium text-text-secondary leading-relaxed mb-20">
            The world's most sophisticated neural engine for trajectory optimization. Precision intelligence for the elite workforce.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button onClick={() => navigate("/auth")} className="btn-premium h-20 px-16 text-xs uppercase tracking-[0.3em] font-black group shadow-glow">
              Initiate Assessment
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce opacity-40">
           <span className="text-[8px] font-black uppercase tracking-[0.4em]">Scroll Explore</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* Intelligence Bento Section */}
      <section className="h-screen w-full snap-start snap-always relative flex items-center bg-secondary/30 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 w-full">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-12 mb-12">
              <motion.div variants={itemVariants} className="section-label text-center justify-center">Neural Architecture</motion.div>
              <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-center">
                Precision Engineering.
              </motion.h2>
            </div>

            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Neural Mapping', icon: Target, desc: '99.2% alignment accuracy across 400+ industrial sectors.', color: 'text-accent' },
                { title: 'FAANG Simulation', icon: Zap, desc: 'Real-time mock interviews based on secret company rubrics.', color: 'text-amber-400' },
                { title: 'Verified Intel', icon: ShieldCheck, desc: 'ISO-grade career certifications recognized globally.', color: 'text-emerald-400' },
                { title: 'Enterprise Link', icon: Globe, desc: 'Direct neural interface to top-tier hiring architects.', color: 'text-blue-400' },
              ].map((card, i) => (
                <motion.div key={i} variants={itemVariants} className="glass-card p-8 group hover:bg-white/[0.04] flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-glow">
                    <card.icon size={32} className={`${card.color}`} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight mb-4 uppercase">{card.title}</h4>
                  <p className="text-sm font-medium text-text-secondary leading-relaxed line-clamp-3">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="h-screen w-full snap-start snap-always relative flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.05)_0%,_transparent_70%)]" />
        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          className="relative z-10 text-center px-6 max-w-5xl"
        >
          <motion.h2 variants={itemVariants} className="text-5xl md:text-8xl font-black tracking-tighter italic mb-16 leading-[0.9]">
            "The future is engineered, <br /> not stumbled upon."
          </motion.h2>
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-center gap-12 mb-20">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl glass-card flex items-center justify-center shadow-glow">
                <Cpu size={40} className="text-accent" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black uppercase tracking-widest text-white">Quantum Core Architecture</p>
                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1">Processing global workforce data</p>
              </div>
            </div>
          </motion.div>
          <motion.button onClick={() => navigate("/auth")} variants={itemVariants} className="btn-premium h-20 px-20 text-xs uppercase tracking-[0.4em] font-black shadow-glow">
            Access The Nexus hub
          </motion.button>
        </motion.div>
      </section>

      {/* Footer Section */}
      <section className="h-screen w-full snap-start snap-always relative bg-primary flex flex-col justify-end">
        <div className="px-8 md:px-16 max-w-[1440px] mx-auto w-full pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 py-24 border-t border-white/[0.03]">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <Logo size="md" variant="icon" />
                <span className="text-xl font-black tracking-tighter uppercase">CAREER <span className="accent-gradient">COMPASS.</span></span>
              </div>
              <p className="text-sm font-medium text-text-secondary leading-relaxed opacity-60">
                The global standard for professional intelligence and strategic preparation.
              </p>
            </div>
            
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-10">Protocols</p>
              <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest text-text-tertiary">
                <button className="text-left hover:text-white transition-colors">Assessment mapping</button>
                <button className="text-left hover:text-white transition-colors">Neural Pathfind</button>
                <button className="text-left hover:text-white transition-colors">Selection Prep</button>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-10">Intelligence</p>
              <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest text-text-tertiary">
                <button className="text-left hover:text-white transition-colors">Industrial Data</button>
                <button className="text-left hover:text-white transition-colors">Company DNA</button>
                <button className="text-left hover:text-white transition-colors">Verification Node</button>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-10">Agency</p>
              <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest text-text-tertiary">
                <button className="text-left hover:text-white transition-colors">Privacy tier-4</button>
                <button className="text-left hover:text-white transition-colors">Security Manual</button>
                <button className="text-left hover:text-white transition-colors">Channel Support</button>
              </div>
            </div>
          </div>
          
          <div className="py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/[0.03]">
            <p className="text-[9px] font-black text-text-tertiary tracking-[0.4em] uppercase text-center md:text-left">© 2026 CAREER COMPASS AI. ALL RIGHTS RESERVED. ELITE PROFESSIONAL INTELLIGENCE AGENCY.</p>
            <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-text-tertiary">
              <button className="hover:text-accent transition-colors">Status: Active</button>
              <button className="hover:text-accent transition-colors">Region: Global</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
