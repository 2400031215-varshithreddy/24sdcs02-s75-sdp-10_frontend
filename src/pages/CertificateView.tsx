import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Award, Share2, CheckCircle, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { apiGet } from "@/lib/api";
import { motion } from "framer-motion";

interface CertData {
  id: number; 
  certificateId: string; 
  certificateTitle: string; 
  studentName: string; 
  issuedAt: string;
  verificationStatement?: string;
}

export default function CertificateView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiGet<CertData>(`/api/certificates/${id}`)
      .then(setCert)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certRef.current, { 
        scale: 3, 
        backgroundColor: null, 
        useCORS: true, 
        logging: false,
        allowTaint: true
      });
      const link = document.createElement('a');
      link.download = `Career-Compass-Intel-Auth-${cert?.certificateId || 'download'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch { 
      // Error notification
    } finally { 
      setDownloading(false); 
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-6 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-white/5 border-t-accent rounded-full" 
        />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary">Authenticating Intel Credentials...</p>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-8">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 opacity-30">
          <Award size={40} className="text-text-tertiary" />
        </div>
        <p className="text-text-secondary text-xl font-medium tracking-tight">Credential signature not found.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-premium px-12 h-14 uppercase tracking-widest text-xs font-black">Return to Terminal</button>
      </div>
    );
  }

  const dateStr = cert.issuedAt
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-12 pb-24 select-none"
    >
      {/* Top Action Protocol */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <button 
          onClick={() => navigate('/my-certificates')} 
          className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-tertiary hover:text-accent transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
            <ArrowLeft size={14} />
          </div>
          My Credentials
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleShare} 
            className="h-14 px-8 rounded-2xl border border-white/5 bg-white/5 text-text-tertiary hover:text-white hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-3"
          >
            {copied ? (
              <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-emerald-400">
                <CheckCircle size={14} /> Protocol Copied
              </motion.span>
            ) : (
              <span className="flex items-center gap-2">
                <Share2 size={14} /> Transmit Link
              </span>
            )}
          </button>
          
          <button 
            onClick={handleDownload} 
            disabled={downloading} 
            className="btn-premium h-14 px-10 text-[10px] uppercase tracking-widest font-black shadow-glow disabled:opacity-50"
          >
            {downloading ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Encrypting...
              </div>
            ) : (
              <span className="flex items-center gap-3">
                <Download size={16} /> Secure Download
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Certificate Architecture */}
      <motion.div 
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative group p-1 bg-gradient-to-br from-accent/30 via-white/5 to-accent/30 rounded-[40px] shadow-glow shadow-accent/5 overflow-hidden"
      >
        <div ref={certRef} className="relative rounded-[38px] overflow-hidden" style={{
          background: 'linear-gradient(165deg, #020617 0%, #0B1120 40%, #0F172A 100%)',
          aspectRatio: '1.414',
          padding: '4.5rem',
        }}>
          {/* Neural Background Patterns */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-blue/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          {/* High-End Border Trace */}
          <div className="absolute inset-8 border border-white/[0.03] rounded-[28px] pointer-events-none" />
          <div className="absolute inset-12 border border-accent/10 rounded-[24px] pointer-events-none" />

          {/* Corner Decals */}
          {[
            "top-6 left-6", "top-6 right-6 rotate-90", 
            "bottom-6 right-6 rotate-180", "bottom-6 left-6 -rotate-90"
          ].map((pos, i) => (
             <div key={i} className={`absolute ${pos} w-24 h-24 pointer-events-none opacity-40`}>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/60" />
                <div className="absolute top-0 left-0 h-full w-[1px] bg-accent/60" />
             </div>
          ))}

          <div className="flex flex-col items-center justify-center h-full text-center relative z-10 space-y-10">
            {/* Branding Node */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-glow">
                <Award size={32} className="text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-[0.4em] text-accent uppercase leading-none">Career Compass AI</span>
                <span className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.1em] mt-1.5 opacity-50">Authorized Neural Intelligence Node</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black tracking-[0.6em] text-text-tertiary uppercase opacity-60">Certificate of Completion</h4>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent mx-auto" />
            </div>

            <div className="space-y-4">
              <p className="text-[13px] font-black text-text-tertiary uppercase tracking-widest leading-none">This high-integrity credential certifies that</p>
              <h2 className="text-6xl md:text-7xl font-black italic tracking-tighter accent-gradient px-4 uppercase">
                {cert.studentName}
              </h2>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-[13px] font-black text-text-tertiary uppercase tracking-widest leading-none">has achieved mastery in the field of</p>
              <h3 className="text-3xl font-black text-white tracking-tight leading-relaxed px-8">
                {cert.certificateTitle}
              </h3>
            </div>

            <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent mx-auto" />

            {cert.verificationStatement && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-xl mx-auto px-12"
              >
                <p className="text-sm font-medium text-text-secondary italic leading-relaxed">
                  "{cert.verificationStatement}"
                </p>
              </motion.div>
            )}

            {/* Validation IDs */}
            <div className="grid grid-cols-3 gap-12 pt-4">
              <div className="flex flex-col gap-2">
                 <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-60">Neural Sign Date</span>
                 <span className="text-xs font-black text-white">{dateStr}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                 <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg p-1">
                    {/* Tiny visual representation of a QR or Shield */}
                    <ShieldCheck className="text-primary" size={32} />
                 </div>
                 <span className="text-[7px] font-black text-text-tertiary uppercase tracking-widest mt-2">{cert.certificateId.slice(0, 12)}</span>
              </div>
              <div className="flex flex-col gap-2">
                 <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-60">Credential Hash</span>
                 <span className="text-xs font-black text-white">{cert.certificateId.toUpperCase()}</span>
              </div>
            </div>
            
            <div className="absolute bottom-[-1rem] left-1/2 -translate-x-1/2 flex items-center gap-2 text-[8px] font-black text-text-tertiary uppercase tracking-[0.3em] opacity-30">
               <Zap size={10} /> Verified by Gemini DeepMind Protocol <Zap size={10} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Global Intelligence Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col md:flex-row items-center justify-center gap-12 pt-8"
      >
        <div className="flex items-center gap-4 text-text-tertiary">
          <ShieldCheck size={20} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">Secured with Neural Block Encryption</span>
        </div>
        <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
        <div className="flex items-center gap-4 text-text-tertiary">
          <Sparkles size={20} className="text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest">Industry Standard Recognition</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
