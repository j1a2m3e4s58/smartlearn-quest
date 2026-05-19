import { c as createLucideIcon, u as useNavigate, j as jsxRuntimeExports, A as ArrowLeft, m as motion } from "./index-bdQaMNSA.js";
import { L as Layout } from "./Layout-etJikChT.js";
import { S as Settings } from "./settings-PszpihEQ.js";
import "./map-CgAdZPgE.js";
import "./coins-B9mN5ZCZ.js";
import "./x-BFFiCf8T.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];
const Database = createLucideIcon("database", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 21a8 8 0 0 0-16 0", key: "3ypg7q" }],
  ["circle", { cx: "10", cy: "8", r: "5", key: "o932ke" }],
  ["path", { d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3", key: "10s06x" }]
];
const UsersRound = createLucideIcon("users-round", __iconNode);
function AdminDashboardPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "container mx-auto px-4 py-10",
      "data-ocid": "admin_dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/dashboard" }),
            className: "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-6",
            "data-ocid": "admin_dashboard.back_button",
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
                  className: "text-2xl font-black uppercase tracking-widest glow-purple-text mb-1",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Admin Portal"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8", children: "Platform management and system controls" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
                {
                  icon: UsersRound,
                  label: "Users",
                  desc: "Manage all accounts and roles"
                },
                {
                  icon: Database,
                  label: "Data",
                  desc: "Analytics and canister state"
                },
                {
                  icon: Settings,
                  label: "Settings",
                  desc: "Platform configuration"
                },
                {
                  icon: ShieldCheck,
                  label: "Security",
                  desc: "Access control and audit logs"
                }
              ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "glass-card rounded-xl p-5 border border-[#7c3aed]/20",
                  "data-ocid": `admin_dashboard.card.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-6 w-6 text-[#7c3aed] mb-3" }),
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
  AdminDashboardPage as default
};
