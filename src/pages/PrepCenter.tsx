import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Target, Search, FileText, Sparkles, 
  Send, Bot, Zap
} from "lucide-react";
import { apiPost } from "@/lib/api";

type Tab = 'interview' | 'intel' | 'resume';

export default function PrepCenter() {
  const [activeTab, setActiveTab] = useState<Tab>('interview');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("Software Engineer");
  const [company, setCompany] = useState("Google");
  
  // Interview State
  const [interviewStep, setInterviewStep] = useState<'setup' | 'active' | 'feedback'>('setup');
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  // Intel State
  const [intelQuery, setIntelQuery] = useState("");
  const [intelResult, setIntelResult] = useState("");

  // Resume State
  const [resumeText, setResumeText] = useState("");
  const [resumeFeedback, setResumeFeedback] = useState("");

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const data = await apiPost<{ question: string }>("/api/ai/interview/start", { role, company });
      setCurrentQuestion(data.question);
      setInterviewStep('active');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    setLoading(true);
    try {
      const data = await apiPost<{ feedback: string }>("/api/ai/interview/respond", { 
        question: currentQuestion, 
        answer: userAnswer,
        role: role
      });
      setFeedback(data.feedback);
      setInterviewStep('feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleGetIntel = async () => {
    if (!intelQuery) return;
    setLoading(true);
    try {
      const data = await apiPost<{ intel: string }>("/api/ai/company/intel", { company: intelQuery });
      setIntelResult(data.intel);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeText) return;
    setLoading(true);
    try {
      const data = await apiPost<{ analysis: string }>("/api/ai/resume/analyze", { resumeText, role });
      setResumeFeedback(data.analysis);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-[2px] bg-accent" />
          <span className="section-label !mb-0">Strategic Preparation / Elite Selection</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
          Prep <span className="accent-gradient">Center.</span>
        </h1>
        <p className="text-text-secondary text-xl font-medium leading-relaxed max-w-2xl">
          The ultimate neural proving ground. Simulate high-tier interviews, decode company DNA, and calibrate your resume for maximum impact.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-4 p-1.5 bg-white/5 border border-white/5 rounded-[24px] w-fit">
        {[
          { id: 'interview', label: 'Mock Interview', icon: Bot },
          { id: 'intel', label: 'Company Intel', icon: ShieldCheck },
          { id: 'resume', label: 'Resume Analyzer', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`
              flex items-center gap-3 px-8 py-4 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all
              ${activeTab === tab.id 
                ? 'bg-accent text-primary shadow-glow' 
                : 'text-text-tertiary hover:bg-white/5 hover:text-white'}
            `}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'interview' && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Bot size={120} className="text-accent" />
              </div>

              {interviewStep === 'setup' && (
                <div className="max-w-xl space-y-10">
                  <div>
                    <h3 className="text-3xl font-black mb-4">Initialize Simulator</h3>
                    <p className="text-text-secondary font-medium">Configure your session parameters for a high-fidelity interview simulation.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Target Role Architecture</label>
                      <input 
                        type="text" 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-white focus:border-accent/50 outline-none transition-all"
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Target Enterprise Node</label>
                      <input 
                        type="text" 
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-white focus:border-accent/50 outline-none transition-all"
                        placeholder="e.g. Google"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleStartInterview}
                    disabled={loading}
                    className="btn-premium px-12 h-16 w-full md:w-fit uppercase tracking-[0.2em] font-black text-xs"
                  >
                    {loading ? "Calibrating..." : "Initiate Simulation"}
                    <Zap size={18} />
                  </button>
                </div>
              )}

              {interviewStep === 'active' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-accent">
                    <Sparkles size={20} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Interviewer: Neural Nexus</span>
                  </div>
                  <div className="p-8 bg-accent/5 border border-accent/20 rounded-3xl">
                    <p className="text-2xl font-black leading-tight">{currentQuestion}</p>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Your Response</label>
                    <textarea 
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 font-medium text-white focus:border-accent/50 outline-none transition-all resize-none"
                      placeholder="Describe your architectural approach..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleSubmitAnswer}
                      disabled={loading || !userAnswer}
                      className="btn-premium px-12 h-16 uppercase tracking-[0.2em] font-black text-xs"
                    >
                      {loading ? "Analyzing..." : "Transmit Response"}
                      <Send size={18} />
                    </button>
                    <button 
                      onClick={() => setInterviewStep('setup')}
                      className="px-8 h-16 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-text-tertiary hover:text-white"
                    >
                      Abort
                    </button>
                  </div>
                </div>
              )}

              {interviewStep === 'feedback' && (
                <div className="space-y-10">
                  <div className="flex items-center gap-4 text-emerald-400">
                    <ShieldCheck size={24} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Performance Calibration Complete</span>
                  </div>
                  <div className="prose prose-invert max-w-none">
                     <p className="text-xl font-medium leading-relaxed whitespace-pre-wrap">{feedback}</p>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleStartInterview}
                      className="btn-premium px-12 h-16 uppercase tracking-[0.2em] font-black text-xs"
                    >
                      Retry Simulation
                      <Zap size={18} />
                    </button>
                    <button 
                      onClick={() => setInterviewStep('setup')}
                      className="px-8 h-16 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                      End Session
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'intel' && (
            <motion.div
              key="intel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="glass-card p-10 flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Enterprise Intelligence Lookup</label>
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
                    <input 
                      type="text" 
                      value={intelQuery}
                      onChange={(e) => setIntelQuery(e.target.value)}
                      placeholder="Search company (e.g. Meta, Amazon, Netflix...)"
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 font-bold text-lg text-white focus:border-accent/50 outline-none transition-all"
                    />
                  </div>
                </div>
                <button 
                   onClick={handleGetIntel}
                   disabled={loading || !intelQuery}
                   className="btn-premium px-12 h-16 uppercase tracking-[0.2em] font-black text-xs"
                >
                  {loading ? "Searching..." : "Fetch Intel"}
                  <Sparkles size={18} />
                </button>
              </div>

              {intelResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-12 bg-gradient-to-br from-accent/5 to-transparent"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <Target size={24} className="text-accent" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight italic">Intelligence Report: {intelQuery}</h3>
                  </div>
                  <div className="whitespace-pre-wrap text-text-secondary leading-relaxed font-medium text-lg border-l-2 border-accent/20 pl-8">
                    {intelResult}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'resume' && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="glass-card p-10 space-y-8">
                <div>
                  <h3 className="text-2xl font-black mb-2">Resume Architect</h3>
                  <p className="text-text-tertiary text-xs font-black uppercase tracking-widest">Neural ATS Optimization</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Target Role</label>
                    <input 
                      type="text" 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 font-bold text-white focus:border-accent/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Resume Content (Plain Text)</label>
                    <textarea 
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      rows={12}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-medium text-sm text-white focus:border-accent/50 outline-none transition-all resize-none custom-scrollbar"
                      placeholder="Paste your professional history here..."
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAnalyzeResume}
                  disabled={loading || !resumeText}
                  className="btn-premium px-12 h-16 w-full uppercase tracking-[0.2em] font-black text-xs"
                >
                  {loading ? "Analyzing..." : "Optimize Resume"}
                  <FileText size={18} />
                </button>
              </div>

              <div className="glass-card p-10 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ShieldCheck size={160} className="text-accent" />
                </div>
                
                <div className="mb-8">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Neural Analysis Result</h4>
                   <h3 className="text-2xl font-black italic">Refinement Notes</h3>
                </div>

                <div className="flex-1">
                  {!resumeFeedback ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                      <Sparkles size={48} className="mb-6" />
                      <p className="text-xs font-black uppercase tracking-widest max-w-[200px]">Awaiting resume transmission for neural deep-map.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-text-secondary whitespace-pre-wrap leading-relaxed font-medium">
                          {resumeFeedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
