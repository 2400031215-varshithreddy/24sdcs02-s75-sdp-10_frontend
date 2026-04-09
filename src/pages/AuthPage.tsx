import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, ShieldCheck, Cpu, KeyRound, RefreshCw, ArrowLeft, Sparkles } from "lucide-react";
import { apiPost } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../components/ui/Logo";

type AuthView = "login" | "register" | "mfa" | "forgot" | "reset" | "verify-success";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle MFA persistence and deep links
  useEffect(() => {
    // Check for password reset token
    const reset = searchParams.get("reset");
    if (reset) {
      setResetToken(reset);
      setView("reset");
    }

    // Check for verification success redirect
    const verified = searchParams.get("verified");
    if (verified) {
      setView("verify-success");
    }

    // Recover pending MFA email from storage
    const pendingMfa = sessionStorage.getItem("pending_mfa_email");
    if (pendingMfa && view === "mfa") {
      setEmail(pendingMfa);
    }
  }, [searchParams, view]);

  // ── HANDLERS ───────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const data = await apiPost<{ message: string; role: string; mfaRequired: boolean }>("/api/auth/login", { 
        email, 
        password
      });
      if (data.mfaRequired) {
        sessionStorage.setItem("pending_mfa_email", email);
        setView("mfa");
      } else {
        sessionStorage.removeItem("pending_mfa_email");
        login(data.role);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const data = await apiPost<{ message: string }>("/api/auth/register", { name, email, password });
      setSuccess(data.message || "Registration processed. Check your email.");
      setView("login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await apiPost<{ role: string }>("/api/auth/verify-mfa", { email, otp });
      sessionStorage.removeItem("pending_mfa_email");
      login(data.role);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const data = await apiPost<{ message: string }>("/api/auth/forgot-password", { email });
      setSuccess(data.message || "If an account exists, a reset link has been sent.");
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const data = await apiPost<{ message: string }>("/api/auth/reset-password", { token: resetToken, newPassword });
      setSuccess(data.message || "Password reset successfully.");
      setView("login");
      setResetToken("");
    } catch (err: any) {
      setError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const switchView = (newView: AuthView) => {
    setError("");
    setSuccess("");
    setView(newView);
  };

  // ── COMPUTED & HELPERS ─────────────────────────────────

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const titleMap: Record<AuthView, string> = {
    login: "Synchronize Access",
    register: "Create Master Identity",
    mfa: "Two-Factor Verification",
    forgot: "Reset Secure Key",
    reset: "Create New Secure Key",
    "verify-success": "Identity Verified",
  };

  const subtitleMap: Record<AuthView, string> = {
    login: "Enter your credentials to re-sync with the AI engine.",
    register: "Initialize your profile to begin neural mapping.",
    mfa: "Enter the 6-digit code sent to your authentication channel.",
    forgot: "Enter your email to receive a reset link.",
    reset: "Choose a new secure password for your identity.",
    "verify-success": "Your email has been verified. You may now log in.",
  };

  const renderFormContent = () => {
    switch (view) {
      case "login":
        return (
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" size={18} />
                <input type="email" required placeholder="you@example.com"
                  className="w-full h-16 bg-white/[0.03] border border-glass-border rounded-2xl pl-16 pr-6 text-sm font-bold text-text-primary focus:border-accent/40 focus:bg-accent/5 focus:shadow-[0_0_30px_rgba(197,160,89,0.05)] outline-none transition-all placeholder:text-text-tertiary/50"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary ml-4">Password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" size={18} />
                <input type="password" required placeholder="••••••••"
                  className="w-full h-16 bg-white/[0.03] border border-glass-border rounded-2xl pl-16 pr-6 text-sm font-bold text-text-primary focus:border-accent/40 focus:bg-accent/5 focus:shadow-[0_0_30px_rgba(197,160,89,0.05)] outline-none transition-all placeholder:text-text-tertiary/50"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 text-red-400 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 text-center">
                {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="btn-premium w-full h-18 text-xs uppercase tracking-[0.3em] font-black shadow-glow group">
              {loading ? (
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Authenticate <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <div className="flex items-center justify-between mt-4">
              <button type="button" onClick={() => switchView("register")}
                className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] hover:text-accent transition-all">
                New here? <span className="text-accent ml-2">Create Account</span>
              </button>
              <button type="button" onClick={() => switchView("forgot")}
                className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] hover:text-accent transition-all">
                <span className="text-accent">Forgot Password?</span>
              </button>
            </div>
          </form>
        );
      case "register":
        return (
          <form onSubmit={handleRegister} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary ml-4">Full Name</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" size={18} />
                <input type="text" required placeholder="Full Name"
                  className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-accent/5 focus:shadow-[0_0_30px_rgba(197,160,89,0.05)] outline-none transition-all placeholder:text-text-tertiary/50"
                  value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary ml-4">Access Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" size={18} />
                <input type="email" required placeholder="name@nexus.com"
                  className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-accent/5 focus:shadow-[0_0_30px_rgba(197,160,89,0.05)] outline-none transition-all placeholder:text-text-tertiary/50"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary ml-4">Secure Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" size={18} />
                <input type="password" required placeholder="••••••••"
                  className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-accent/5 focus:shadow-[0_0_30px_rgba(197,160,89,0.05)] outline-none transition-all placeholder:text-text-tertiary/50"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 text-red-400 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 text-center">
                {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="btn-premium w-full h-18 text-xs uppercase tracking-[0.3em] font-black shadow-glow group">
              {loading ? (
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Initialize Identity <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <div className="mt-4 text-center">
              <button type="button" onClick={() => switchView("login")}
                className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] hover:text-accent transition-all">
                Already have access? <span className="text-accent ml-2">Sign In Here</span>
              </button>
            </div>
          </form>
        );
      case "mfa":
        return (
          <form onSubmit={handleMfa} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary ml-4">OTP Code</label>
              <div className="relative group">
                <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" size={18} />
                <input type="text" required placeholder="123456" maxLength={6}
                  className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-6 text-2xl font-black text-white text-center tracking-[0.5em] focus:border-accent/40 focus:bg-accent/5 focus:shadow-[0_0_30px_rgba(197,160,89,0.05)] outline-none transition-all placeholder:text-text-tertiary/50"
                  value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 text-red-400 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 text-center">
                {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="btn-premium w-full h-18 text-xs uppercase tracking-[0.3em] font-black shadow-glow group">
              {loading ? (
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Verify Code <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
                </span>
              )}
            </button>

            <div className="mt-4 text-center">
              <button type="button" onClick={() => switchView("login")}
                className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] hover:text-accent transition-all">
                <span className="text-accent">Back to Login</span>
              </button>
            </div>
          </form>
        );
      case "forgot":
        return (
          <form onSubmit={handleForgotPassword} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary ml-4">Account Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" size={18} />
                <input type="email" required placeholder="name@nexus.com"
                  className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-accent/5 focus:shadow-[0_0_30px_rgba(197,160,89,0.05)] outline-none transition-all placeholder:text-text-tertiary/50"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 text-red-400 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 text-center">
                {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="btn-premium w-full h-18 text-xs uppercase tracking-[0.3em] font-black shadow-glow group">
              {loading ? (
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Send Reset Link <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                </span>
              )}
            </button>

            <div className="mt-4 text-center">
              <button type="button" onClick={() => switchView("login")}
                className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] hover:text-accent transition-all">
                <span className="text-accent">Back to Login</span>
              </button>
            </div>
          </form>
        );
      case "reset":
        return (
          <form onSubmit={handleResetPassword} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary ml-4">New Secure Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" size={18} />
                <input type="password" required placeholder="••••••••"
                  className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-accent/5 focus:shadow-[0_0_30px_rgba(197,160,89,0.05)] outline-none transition-all placeholder:text-text-tertiary/50"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 text-red-400 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 text-center">
                {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="btn-premium w-full h-18 text-xs uppercase tracking-[0.3em] font-black shadow-glow group">
              {loading ? (
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Reset Secure Key <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        );
      case "verify-success":
        return (
          <div className="text-center space-y-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
              <ShieldCheck size={36} className="text-green-400" />
            </motion.div>
            <button onClick={() => switchView("login")}
              className="btn-premium w-full h-18 text-xs uppercase tracking-[0.3em] font-black shadow-glow group">
              <span className="flex items-center justify-center gap-3">
                Proceed to Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden selection:bg-accent/30 transition-colors duration-700">
      
      {/* Background Ambience - Optimized for performance */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-accent/3 blur-[40px] gpu" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent-blue/3 blur-[40px] gpu" />
      </div>

      <div className="w-full max-w-[500px] relative z-10">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-tertiary hover:text-accent transition-all mb-12 group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
            <ArrowLeft size={14} />
          </div>
          Back to Terminal
        </motion.button>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="glass-card p-bento shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] border-white/10 gpu"
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "circOut" }}
            >
              <div className="mb-12">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
                  <Logo size="md" variant="icon" />
                  <div className="hidden md:block w-[2px] h-12 bg-white/10" />
                  <div className="text-center md:text-left">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[8px] font-black uppercase tracking-widest mb-3"
                    >
                      <Sparkles size={10} />
                      {view === "mfa" ? "MFA Protected" : "Tier 4 Secure Channel"}
                    </motion.div>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
                      {titleMap[view]}
                    </h1>
                  </div>
                </div>
                <p className="text-text-secondary text-sm font-medium px-4 text-center leading-relaxed max-w-[90%] mx-auto">
                  {subtitleMap[view]}
                </p>
              </div>

              {/* ── SUCCESS / ERROR BANNERS ── */}
              <AnimatePresence>
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-green-500/10 text-green-400 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-500/20 text-center mb-8"
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── FORM CONTENT INJECTED BY VIEW ── */}
              {renderFormContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Support Grid Tags */}
        <div className="mt-12 grid grid-cols-2 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
          <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
            <ShieldCheck size={18} className="text-accent" />
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">AES-256 Encrypted</span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.02]"
          >
            <Cpu size={18} className="text-accent-blue" />
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">GPU Optimized</span>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
