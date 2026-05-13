import { GlowButton } from "@/components/ui/GlowButton";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/hooks/useBackend";
import { useNavigate } from "@tanstack/react-router";
import { Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, login, loginStatus } = useAuth();
  const navigate = useNavigate();
  const isLoading = loginStatus === "logging-in";
  const { data: profile, isLoading: profileLoading } = useMyProfile();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (profileLoading) return;
    if (profile) {
      navigate({ to: "/world-map" });
    } else {
      navigate({ to: "/onboarding" });
    }
  }, [isAuthenticated, profile, profileLoading, navigate]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      data-ocid="login.page"
    >
      <ParticleBackground count={70} />

      {/* Radial glow accents */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-[#7c3aed]/5 blur-[80px]" />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
        data-ocid="login.card"
      >
        <div className="glass-card rounded-2xl p-8 border border-primary/20 shadow-glow-cyan">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
              className="mb-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary/50 bg-primary/10 mb-4 shadow-glow-cyan">
                <Zap className="h-8 w-8 text-primary animate-glow-pulse" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-black tracking-widest uppercase glow-cyan-text mb-1"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              SmartLearn
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-xl font-bold tracking-[0.3em] uppercase text-foreground/60 mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Quest
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-sm text-muted-foreground italic"
            >
              Restore intelligence to civilization
            </motion.p>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <GlowButton
              variant="primary"
              size="lg"
              loading={isLoading}
              onClick={login}
              className="w-full"
              data-ocid="login.connect_button"
            >
              <Shield className="h-5 w-5" />
              Connect with Internet Identity
            </GlowButton>

            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Secure, passwordless authentication powered by Internet Identity.
              Your progress is saved to the blockchain.
            </p>
          </motion.div>

          {/* Ghana Education Service badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 pt-6 border-t border-border/30 text-center"
          >
            <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-1">
              Aligned with
            </p>
            <p className="text-sm font-bold text-foreground/70">
              Ghana Education Service Curriculum
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Basic 1 — Basic 9
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
