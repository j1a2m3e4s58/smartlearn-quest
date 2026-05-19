import { c as createLucideIcon, u as useNavigate, j as jsxRuntimeExports, A as ArrowLeft, m as motion } from "./index-bdQaMNSA.js";
import { L as Layout } from "./Layout-etJikChT.js";
import { U as Users } from "./users-i3WNAdwI.js";
import { B as BookOpen } from "./book-open-C7UfpZKi.js";
import "./map-CgAdZPgE.js";
import "./coins-B9mN5ZCZ.js";
import "./x-BFFiCf8T.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode);
function TeacherDashboardPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "container mx-auto px-4 py-10",
      "data-ocid": "teacher_dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/dashboard" }),
            className: "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-6",
            "data-ocid": "teacher_dashboard.back_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
              " Student Dashboard"
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
                  children: "Teacher Portal"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8", children: "Manage your classroom and monitor student progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
                {
                  icon: Users,
                  label: "Classroom",
                  desc: "View and manage enrolled students"
                },
                {
                  icon: BookOpen,
                  label: "Curriculum",
                  desc: "Plan lessons and assign content"
                },
                {
                  icon: ClipboardList,
                  label: "Reports",
                  desc: "Download progress reports"
                }
              ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "glass-card rounded-xl p-5 border border-border/30",
                  "data-ocid": `teacher_dashboard.card.${i + 1}`,
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
  TeacherDashboardPage as default
};
