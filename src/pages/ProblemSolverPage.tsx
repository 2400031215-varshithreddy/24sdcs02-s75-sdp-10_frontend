import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "@/lib/api";
import { 
  ArrowLeft, Play, Send, Sparkles, 
  Terminal, ShieldCheck, Zap, Info, 
  Lightbulb, RefreshCcw, History, Settings,
  Database, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  tags: string;
  description: string;
  constraints: string;
  timeLimit: number;
  memoryLimit: number;
}

interface SubmissionResult {
  id: number;
  status: string;
  xpAwarded: number;
  aiFeedback?: string;
  suggestedOptimization?: string;
}

export default function ProblemSolverPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your solution here\n\nfunction solve() {\n  \n}");

  const languageTemplates: Record<string, string> = {
    javascript: "// Write your solution here\n\nfunction solve() {\n  \n}",
    java: "class Solution {\n    public void solve() {\n        // Write your solution here\n    }\n}",
    python: "def solve():\n    # Write your solution here\n    pass",
    cpp: "#include <iostream>\nusing namespace std;\n\nvoid solve() {\n    // Write your solution here\n}\n\nint main() {\n    solve();\n    return 0;\n}"
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(languageTemplates[newLang]);
  };
  const [customInput] = useState("");
  const [runResult, setRunResult] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  
  const [activeTab, setActiveTab] = useState<'description' | 'submissions' | 'editorial'>('description');

  // AI States
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiHints, setAiHints] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    apiGet<Problem>(`/api/problems/${id}`)
      .then(setProblem)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleRun = async () => {
    setSubmitting(true);
    try {
        // Logic for running code with custom input
        const data = await apiPost<any>(`/api/problems/${id}/run`, { code, language, input: customInput });
        setRunResult(data.output);
    } catch (err) {
        setRunResult("Execution Error: Check your logic.");
    } finally {
        setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const data = await apiPost<any>(`/api/problems/${id}/submit`, { code, language });
      setResult({
        id: data.id,
        status: data.status,
        xpAwarded: data.status === 'ACCEPTED' ? 50 : 0,
      });
      
      // Fetch analysis after submission
      const analysis = await apiGet<any>(`/api/problems/submission/${data.id}/analysis`);
      setResult(prev => prev ? ({
        ...prev,
        aiFeedback: analysis.aiFeedback,
        suggestedOptimization: analysis.suggestedOptimization
      }) : null);

    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAiAction = async (action: 'explain' | 'hints') => {
    setAiLoading(true);
    try {
        if (action === 'explain') {
            const data = await apiPost<{ result: string }>("/api/ai/code/explain", { code, problemId: id });
            setAiExplanation(data.result);
        } else if (action === 'hints') {
            const data = await apiPost<{ result: string }>("/api/ai/code/hints", { problemId: id });
            setAiHints(data.result);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setAiLoading(false);
    }
  };

  if (loading || !problem) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/practice")}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{problem.title}</h1>
            <div className="flex items-center gap-3">
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                  problem.difficulty === 'Easy' ? 'text-emerald-400' :
                  problem.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'
                }`}>{problem.difficulty}</span>
                <div className="w-[1px] h-3 bg-white/10" />
                <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">CPU: {problem.timeLimit}ms</span>
                <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">MEM: {problem.memoryLimit}MB</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={language}
            onChange={handleLanguageChange}
            className="bg-white/5 border border-white/10 rounded-xl px-4 h-12 text-[10px] font-black uppercase tracking-widest outline-none focus:border-accent/40"
          >
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
          <button 
            onClick={handleRun}
            disabled={submitting}
            className="px-6 h-12 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all"
          >
            <Play size={14} /> Run Code
          </button>
          <button 
             onClick={handleSubmit}
             disabled={submitting}
             className="btn-premium px-8 h-12 text-[10px] font-black uppercase tracking-widest shadow-glow"
          >
            {submitting ? "Processing..." : "Submit Solution"}
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Left Panel: Description, Submissions, Editorial */}
        <div className="flex flex-col gap-6 min-h-0">
          <div className="flex gap-2 p-1 bg-white/5 border border-white/5 rounded-xl w-fit">
            {[
              { id: 'description', label: 'Description', icon: Info },
              { id: 'submissions', label: 'Submissions', icon: History },
              { id: 'editorial', label: 'Editorial', icon: BookOpen },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                  activeTab === tab.id ? 'bg-accent text-primary' : 'text-text-tertiary hover:text-white'
                }`}
              >
                <tab.icon size={12} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 glass-card p-8 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div 
                   key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                   className="space-y-8"
                >
                  <div className="prose prose-invert max-w-none">
                    <p className="text-text-secondary font-medium leading-relaxed whitespace-pre-wrap text-lg">
                      {problem.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-text-tertiary">
                        <Database size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Constraint Architecture</span>
                     </div>
                     <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl font-mono text-xs text-text-tertiary leading-relaxed">
                        {problem.constraints}
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {problem.tags.split(',').map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-text-tertiary uppercase tracking-widest">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-white/5">
                     <div className="flex items-center gap-3 mb-6">
                        <Sparkles size={20} className="text-accent" />
                        <h3 className="text-xl font-black uppercase tracking-tight italic">AI Assistant</h3>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleAiAction('hints')}
                          className="p-4 rounded-2xl bg-accent/5 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent/10 transition-all"
                        >
                          <Lightbulb size={16} /> Get Hints
                        </button>
                        <button 
                          onClick={() => handleAiAction('explain')}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                        >
                          <RefreshCcw size={16} /> Explain Code
                        </button>
                     </div>
                     
                     <AnimatePresence>
                        {(aiHints || aiExplanation) && (
                          <motion.div 
                             initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                             className="mt-6 p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4"
                          >
                             {aiLoading ? (
                               <div className="flex items-center gap-3 text-accent animate-pulse">
                                  <Zap size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Processing...</span>
                               </div>
                             ) : (
                               <p className="text-sm font-medium text-text-secondary leading-relaxed">
                                 {aiHints && <><span className="text-accent font-black block mb-2 uppercase text-[9px] tracking-widest">Hints Node:</span> {aiHints}</>}
                                 {aiExplanation && <><span className="text-white font-black block mb-2 mt-4 uppercase text-[9px] tracking-widest">Analysis Result:</span> {aiExplanation}</>}
                               </p>
                             )}
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
                </motion.div>
              )}
              {activeTab === 'submissions' && (
                <motion.div key="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 opacity-30">
                   <History size={48} className="mx-auto mb-6" />
                   <p className="text-sm font-black uppercase tracking-widest">Submissions History Offline</p>
                </motion.div>
              )}
              {activeTab === 'editorial' && (
                <motion.div key="ed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 opacity-30">
                   <ShieldCheck size={48} className="mx-auto mb-6" />
                   <p className="text-sm font-black uppercase tracking-widest">Editorial Access Restricted</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel: Editor & Console */}
        <div className="flex flex-col gap-6 min-h-0">
          <div className="flex-1 glass-card flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-text-tertiary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Logic Terminal / {language}</span>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/5 text-text-tertiary transition-colors">
                <Settings size={14} />
              </button>
            </div>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-transparent p-8 font-mono text-sm text-emerald-400/90 outline-none resize-none selection:bg-accent/20 custom-scrollbar"
              spellCheck={false}
            />
          </div>

          {/* Console / Result Area */}
          <div className="h-1/3 glass-card flex flex-col overflow-hidden">
             <div className="flex gap-4 p-1 bg-white/5 border-b border-white/5">
                <button className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-white border-b-2 border-accent">Console Output</button>
                <button className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-text-tertiary">Custom Input</button>
             </div>
             
             <div className="flex-1 p-6 font-mono text-xs overflow-y-auto custom-scrollbar">
                {submitting ? (
                    <div className="flex items-center gap-3 text-accent">
                        <Zap size={14} className="animate-pulse" />
                        <span>Compiling logic nodes...</span>
                    </div>
                ) : result ? (
                    <div className={`space-y-4 ${result.status === 'ACCEPTED' ? 'text-emerald-400' : 'text-red-400'}`}>
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={18} />
                            <span className="text-lg font-black">{result.status}</span>
                        </div>
                        {result.aiFeedback && (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-text-secondary italic">
                                "{result.aiFeedback}"
                            </div>
                        )}
                        {result.suggestedOptimization && (
                            <div className="text-[10px] text-text-tertiary">
                                <span className="text-white font-black uppercase tracking-widest mr-2">Optimization:</span>
                                {result.suggestedOptimization}
                            </div>
                        )}
                    </div>
                ) : runResult ? (
                    <div className="text-text-secondary whitespace-pre-wrap">{runResult}</div>
                ) : (
                    <div className="text-text-tertiary">Execute or Submit to see output.</div>
                )}
             </div>
             
             {/* Console Action Bar */}
             <div className="p-4 bg-white/[0.01] border-t border-white/5 flex justify-end gap-3">
                <div className="flex items-center gap-6 mr-auto pl-4">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">Time</span>
                      <span className="text-[10px] font-bold text-white">0.0s</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">Mem</span>
                      <span className="text-[10px] font-bold text-white">0MB</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
