import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyProgression } from "@/hooks/useBackend";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Coins,
  LayoutDashboard,
  Map as MapIcon,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "World Map", path: "/world-map", icon: MapIcon },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
];

function xpForLevel(level: number) {
  return level * level * 100;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { data: progression } = useMyProgression();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const level = progression ? Number(progression.currentLevel) : 1;
  const xp = progression ? Number(progression.xp) : 0;
  const coins = progression ? Number(progression.coins) : 0;
  const xpNeeded = xpForLevel(level);
  const xpPercent = Math.min((xp / xpNeeded) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header
        className="sticky top-0 z-50 bg-card border-b border-border/60 shadow-subtle neon-top-border"
        data-ocid="layout.header"
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link
            to="/world-map"
            className="flex items-center gap-2 min-w-0"
            data-ocid="layout.logo_link"
          >
            <span
              className="font-display text-lg sm:text-xl font-black tracking-widest glow-cyan-text uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              SmartLearn
            </span>
            <span
              className="font-display text-lg sm:text-xl font-black tracking-widest text-foreground/70 uppercase hidden sm:inline"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Quest
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            data-ocid="layout.nav"
          >
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  data-ocid={`layout.nav_${link.label.toLowerCase().replace(" ", "_")}`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* XP / Coins / Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated && progression && (
              <div
                className="hidden sm:flex items-center gap-3"
                data-ocid="layout.hud"
              >
                {/* XP Bar */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 border border-primary/40"
                    title={`Level ${level}`}
                  >
                    <span
                      className="text-xs font-black text-primary"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      {level}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-[72px]">
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full xp-fill rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {xp} / {xpNeeded} XP
                    </span>
                  </div>
                </div>
                {/* Coins */}
                <div
                  className="flex items-center gap-1"
                  data-ocid="layout.coins"
                >
                  <Coins className="h-4 w-4 text-accent" />
                  <span className="text-sm font-bold text-accent">
                    {coins.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="hidden md:flex text-muted-foreground hover:text-foreground"
                data-ocid="layout.logout_button"
              >
                Logout
              </Button>
            ) : null}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              data-ocid="layout.mobile_menu_toggle"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/40 bg-card"
              data-ocid="layout.mobile_nav"
            >
              <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentPath.startsWith(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-smooth ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                    data-ocid="layout.mobile_logout_button"
                  >
                    <Zap className="h-4 w-4" />
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background" data-ocid="layout.main">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="bg-card border-t border-border/40 py-4"
        data-ocid="layout.footer"
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
