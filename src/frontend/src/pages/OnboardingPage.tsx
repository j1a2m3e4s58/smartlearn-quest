import { GlowButton } from "@/components/ui/GlowButton";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { useMutateRegisterProfile } from "@/hooks/useBackend";
import { GradeLevel, UserRole } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, GraduationCap, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const GRADE_LEVELS = [
  { label: "Basic 1", value: GradeLevel.basic1 },
  { label: "Basic 2", value: GradeLevel.basic2 },
  { label: "Basic 3", value: GradeLevel.basic3 },
  { label: "Basic 4", value: GradeLevel.basic4 },
  { label: "Basic 5", value: GradeLevel.basic5 },
  { label: "Basic 6", value: GradeLevel.basic6 },
  { label: "Basic 7", value: GradeLevel.basic7 },
  { label: "Basic 8", value: GradeLevel.basic8 },
  { label: "Basic 9", value: GradeLevel.basic9 },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | null>(null);
  const [usernameError, setUsernameError] = useState("");
  const navigate = useNavigate();
  const { mutate: registerProfile, isPending } = useMutateRegisterProfile();

  const validateUsername = (val: string) => {
    if (!val.trim()) return "Username is required";
    if (val.trim().length < 3) return "Username must be at least 3 characters";
    if (val.trim().length > 24) return "Username must be 24 characters or less";
    if (!/^[a-zA-Z0-9_]+$/.test(val.trim()))
      return "Letters, numbers, and underscores only";
    return "";
  };

  const handleUsernameNext = () => {
    const err = validateUsername(username);
    if (err) {
      setUsernameError(err);
      return;
    }
    setUsernameError("");
    setStep(1);
  };

  const handleGradeNext = () => {
    if (!gradeLevel) return;
    setStep(2);
  };

  const handleSubmit = () => {
    if (!gradeLevel) return;
    registerProfile(
      { username: username.trim(), role: UserRole.student, gradeLevel },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            navigate({ to: "/world-map" });
          }
        },
      },
    );
  };

  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      data-ocid="onboarding.page"
    >
      <ParticleBackground count={40} />

      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Step indicators */}
        <div
          className="flex items-center justify-center gap-3 mb-8"
          data-ocid="onboarding.steps"
        >
          {["Profile", "Grade", "Confirm"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-smooth ${
                  i <= step
                    ? "border-primary bg-primary/20 text-primary shadow-glow-cyan"
                    : "border-border/40 text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-8 h-0.5 transition-smooth ${
                    i < step ? "bg-primary" : "bg-border/40"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-8 border border-primary/20 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 0: Username */}
            {step === 0 && (
              <motion.div
                key="step-username"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2
                      className="text-lg font-black uppercase tracking-widest text-foreground"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      Choose Your Name
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      This is how you appear on the leaderboard
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-foreground/80 mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                    onBlur={() => setUsernameError(validateUsername(username))}
                    onKeyDown={(e) => e.key === "Enter" && handleUsernameNext()}
                    placeholder="e.g. StarCoder2024"
                    maxLength={24}
                    className={`w-full px-4 py-3 rounded-lg bg-muted/50 border text-foreground placeholder:text-muted-foreground/50 outline-none transition-smooth ${
                      usernameError
                        ? "border-destructive focus:border-destructive"
                        : "border-border/50 focus:border-primary"
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    data-ocid="onboarding.username_input"
                  />
                  {usernameError && (
                    <p
                      className="text-xs text-destructive mt-1.5"
                      data-ocid="onboarding.username_error"
                    >
                      {usernameError}
                    </p>
                  )}
                </div>

                <GlowButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={handleUsernameNext}
                  data-ocid="onboarding.username_next_button"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </GlowButton>
              </motion.div>
            )}

            {/* Step 1: Grade Level */}
            {step === 1 && (
              <motion.div
                key="step-grade"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2
                      className="text-lg font-black uppercase tracking-widest text-foreground"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      Select Your Grade
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Ghana Education Service curriculum
                    </p>
                  </div>
                </div>

                <div
                  className="grid grid-cols-3 gap-2 mb-6"
                  data-ocid="onboarding.grade_grid"
                >
                  {GRADE_LEVELS.map((gl, idx) => (
                    <motion.button
                      key={gl.value}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setGradeLevel(gl.value)}
                      className={`py-3 px-2 rounded-lg border text-sm font-bold transition-smooth ${
                        gradeLevel === gl.value
                          ? "border-primary bg-primary/15 text-primary shadow-glow-cyan"
                          : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                      data-ocid={`onboarding.grade_option.${idx + 1}`}
                    >
                      {gl.label}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <GlowButton
                    variant="ghost"
                    size="md"
                    onClick={() => setStep(0)}
                    className="flex-1"
                  >
                    Back
                  </GlowButton>
                  <GlowButton
                    variant="primary"
                    size="md"
                    disabled={!gradeLevel}
                    onClick={handleGradeNext}
                    className="flex-2"
                    data-ocid="onboarding.grade_next_button"
                  >
                    Continue <ChevronRight className="h-4 w-4" />
                  </GlowButton>
                </div>
              </motion.div>
            )}

            {/* Step 2: Confirmation */}
            {step === 2 && (
              <motion.div
                key="step-confirm"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/50 shadow-glow-cyan mb-4"
                  >
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h2
                    className="text-lg font-black uppercase tracking-widest text-foreground mb-2"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    Ready to Play
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Confirm your details below
                  </p>
                </div>

                <div className="glass rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Username</span>
                    <span className="font-bold text-foreground">
                      {username}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Grade Level</span>
                    <span className="font-bold text-primary">
                      {GRADE_LEVELS.find((g) => g.value === gradeLevel)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-bold text-foreground">Student</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <GlowButton
                    variant="ghost"
                    size="md"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </GlowButton>
                  <GlowButton
                    variant="primary"
                    size="md"
                    loading={isPending}
                    onClick={handleSubmit}
                    className="flex-2"
                    data-ocid="onboarding.submit_button"
                  >
                    Start Quest
                  </GlowButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
