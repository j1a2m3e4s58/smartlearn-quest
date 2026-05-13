import { Layout } from "@/components/Layout";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Database,
  Settings,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { motion } from "motion/react";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div
        className="container mx-auto px-4 py-10"
        data-ocid="admin_dashboard.page"
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-6"
          data-ocid="admin_dashboard.back_button"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </button>
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1
            className="text-2xl font-black uppercase tracking-widest glow-purple-text mb-1"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Admin Portal
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Platform management and system controls
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Users2,
                label: "Users",
                desc: "Manage all accounts and roles",
              },
              {
                icon: Database,
                label: "Data",
                desc: "Analytics and canister state",
              },
              {
                icon: Settings,
                label: "Settings",
                desc: "Platform configuration",
              },
              {
                icon: ShieldCheck,
                label: "Security",
                desc: "Access control and audit logs",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className="glass-card rounded-xl p-5 border border-[#7c3aed]/20"
                data-ocid={`admin_dashboard.card.${i + 1}`}
              >
                <item.icon className="h-6 w-6 text-[#7c3aed] mb-3" />
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
