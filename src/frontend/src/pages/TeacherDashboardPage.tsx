import { Layout } from "@/components/Layout";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ClipboardList, Users } from "lucide-react";
import { motion } from "motion/react";

export default function TeacherDashboardPage() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div
        className="container mx-auto px-4 py-10"
        data-ocid="teacher_dashboard.page"
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-6"
          data-ocid="teacher_dashboard.back_button"
        >
          <ArrowLeft className="h-4 w-4" /> Student Dashboard
        </button>
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1
            className="text-2xl font-black uppercase tracking-widest glow-cyan-text mb-1"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Teacher Portal
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Manage your classroom and monitor student progress
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Users,
                label: "Classroom",
                desc: "View and manage enrolled students",
              },
              {
                icon: BookOpen,
                label: "Curriculum",
                desc: "Plan lessons and assign content",
              },
              {
                icon: ClipboardList,
                label: "Reports",
                desc: "Download progress reports",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className="glass-card rounded-xl p-5 border border-border/30"
                data-ocid={`teacher_dashboard.card.${i + 1}`}
              >
                <item.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-bold text-sm text-foreground mb-1">
                  {item.label}
                </h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
