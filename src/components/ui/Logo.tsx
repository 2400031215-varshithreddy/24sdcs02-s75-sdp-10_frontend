import { Compass, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "standard" | "icon";
  showText?: boolean;
  onClick?: () => void;
}

export default function Logo({ 
  className = "", 
  size = "md", 
  variant = "standard",
  showText = true, 
  onClick 
}: LogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", container: "w-10 h-10", text: "text-lg", gap: "gap-2" },
    md: { icon: "w-12 h-12", container: "w-16 h-16", text: "text-xl", gap: "gap-4" },
    lg: { icon: "w-20 h-20", container: "w-24 h-24", text: "text-4xl", gap: "gap-6" },
  };

  const current = sizes[size];

  return (
    <div 
      className={`flex items-center ${current.gap} ${className} group ${onClick ? 'cursor-pointer' : ''} leading-normal`}
      onClick={onClick}
    >
      <div className="relative">
        <motion.div 
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          className={`${current.container} flex items-center justify-center relative transition-all duration-500`}
        >
          {/* Main Logo Image */}
          <img 
            src="/logo.png" 
            alt="Career Compass AI" 
            className={`${current.icon} object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(197,160,89,0.6)] transition-all`}
          />
          
          {/* Premium Glow Effect */}
          <div className="absolute inset-0 bg-accent/10 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
        </motion.div>
      </div>

      {showText && variant !== "icon" && (
        <div className="flex flex-col justify-center -space-y-1">
          <h1 className={`${current.text} font-black text-text-primary tracking-tighter leading-none group-hover:text-accent transition-colors`}>
            CAREER <span className="accent-gradient">COMPASS.</span>
          </h1>
          <p className="text-[10px] font-black text-accent tracking-[0.4em] uppercase group-hover:opacity-100 transition-opacity whitespace-nowrap">
            PREMIUM INTELLIGENCE <span className="text-[8px] text-text-tertiary ml-2 font-mono">v5.0</span>
          </p>
        </div>
      )}
    </div>
  );
}
