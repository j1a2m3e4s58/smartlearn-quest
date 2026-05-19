import { c as createLucideIcon, u as useNavigate, j as jsxRuntimeExports, A as ArrowLeft, m as motion } from "./index-bdQaMNSA.js";
import { L as Layout } from "./Layout-etJikChT.js";
import { T as TrendingUp } from "./trending-up-BCF05R7n.js";
import "./map-CgAdZPgE.js";
import "./coins-B9mN5ZCZ.js";
import "./x-BFFiCf8T.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
function ParentDashboardPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "container mx-auto px-4 py-10",
      "data-ocid": "parent_dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/dashboard" }),
            className: "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-6",
            "data-ocid": "parent_dashboard.back_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
              " Dashboard"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h1",
                {
                  className: "text-2xl font-black uppercase tracking-widest glow-cyan-text mb-1",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Parent Portal"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8", children: "Monitor your child's learning journey" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
                {
                  icon: UserCheck,
                  label: "My Children",
                  desc: "View linked student accounts"
                },
                {
                  icon: TrendingUp,
                  label: "Progress",
                  desc: "Track learning milestones"
                },
                {
                  icon: Bell,
                  label: "Alerts",
                  desc: "Receive intervention notifications"
                }
              ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "glass-card rounded-xl p-5 border border-border/30",
                  "data-ocid": `parent_dashboard.card.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-6 w-6 text-primary mb-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm text-foreground mb-1", children: item.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.desc })
                  ]
                },
                item.label
              )) })
            ]
          }
        )
      ]
    }
  ) });
}
export {
  ParentDashboardPage as default
};
