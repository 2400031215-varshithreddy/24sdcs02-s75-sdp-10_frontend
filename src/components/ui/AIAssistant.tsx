import { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send, Brain, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiPost } from "@/lib/api";
const INITIAL_GREETING = "Neural link established. I am your Strategic Career Architect. How shall we optimize your trajectory today?";

const SUGGESTIONS = [
  "How can I improve my technical score?",
  "Analyze my current career roadmap.",
  "Which field simulations are trending?",
  "Explain the Neural Spectrum results."
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([
    { role: 'ai', content: INITIAL_GREETING }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;
    
    const userMsg = { role: 'user' as const, content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    
    // Construct history string
    const history = messages
      .slice(-6) // Last 6 messages for context
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    try {
      const data = await apiPost<{ response: string }>("/api/ai/chat", { 
        message: text,
        history: history
      });
      
      // Pseudo-streaming / Typewriter effect
      const response = data.response;
      setMessages(prev => [...prev, { role: 'ai', content: "" }]);
      
      let currentIdx = 0;
      const interval = setInterval(() => {
        setMessages(prev => {
          const updated = [...prev.slice(0, -1), { role: 'ai' as const, content: response.substring(0, currentIdx + 1) }];
          return updated;
        });
        currentIdx++;
        if (currentIdx >= response.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 15); // Fast typewriter

    } catch (err: any) {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', content: "Neural link disrupted. " + (err.message || "Failed to connect.") }]);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="absolute bottom-24 right-0 w-[420px] max-w-[calc(100vw-80px)] glass-card-plus flex flex-col shadow-[0_32px_128px_-32px_rgba(0,0,0,0.8)] overflow-hidden gpu"
            style={{ height: '600px' }}
          >
            {/* AI Header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-glow">
                  <Brain size={24} className="text-accent animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1">Neural Architect</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Active Intelligence Agency</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-white/5 text-text-tertiary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-primary/20"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`
                    max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed border
                    ${msg.role === 'ai' 
                      ? 'bg-white/[0.03] border-white/5 text-text-secondary rounded-tl-none' 
                      : 'bg-accent text-primary font-bold border-accent rounded-tr-none shadow-glow text-right'
                    }
                  `}>
                    {msg.content}
                    {msg.role === 'ai' && msg.content === "" && (
                      <div className="flex gap-1 py-1">
                        <div className="w-1 h-1 bg-accent rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Suggestions / Actions */}
            <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                 <Zap size={14} className="text-accent" />
                 <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">Protocol</span>
              </div>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  disabled={isTyping}
                  className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-text-tertiary uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-all hover:bg-white/10 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <div className="relative group">
                <input 
                  type="text"
                  placeholder={isTyping ? "Processing Query..." : "Inquire Strategic Direction..."}
                  value={input}
                  disabled={isTyping}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-6 pr-14 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.08] outline-none transition-all placeholder:text-text-tertiary/50 disabled:opacity-50"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-glow disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Orb */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-[24px] flex items-center justify-center relative group
          transition-all duration-500 magnetic-pulse gpu
          ${isOpen ? 'bg-primary border-accent/50 rotate-90 shadow-glow' : 'bg-accent/10 border-white/10 shadow-2xl'}
          border backdrop-blur-xl
        `}
      >
        <div className="absolute inset-0 bg-accent/20 rounded-[24px] blur-2xl group-hover:bg-accent/30 transition-all opacity-50" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
              <X size={28} className="text-accent relative z-10" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative z-10 flex flex-col items-center">
                <Sparkles size={28} className="text-accent" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
