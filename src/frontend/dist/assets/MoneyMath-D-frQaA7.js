import { j as jsxRuntimeExports, r as reactExports, m as motion, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function round2(n) {
  return Math.round(n * 100) / 100;
}
const NAMES = ["Kofi", "Ama", "Kwame", "Adwoa", "Yaw", "Efua", "Kweku", "Akua"];
function genCustomer(diff) {
  const itemCount = diff === 1 ? 1 : diff === 2 ? 2 : randInt(2, 3);
  const items = Array.from({ length: itemCount }, () => {
    const price = diff === 1 ? randInt(1, 9) + 0.99 : diff === 2 ? randInt(1, 20) + 0.5 : randInt(1, 30) + randInt(0, 99) / 100;
    return {
      name: ["Pencil", "Book", "Ruler", "Bag", "Pen", "Calculator"][randInt(0, 5)],
      price,
      qty: diff === 3 ? randInt(1, 3) : 1
    };
  });
  let subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;
  let tax = 0;
  if (diff === 3) {
    discount = randInt(5, 20);
    tax = 5;
    subtotal = round2(subtotal * (1 - discount / 100) * (1 + tax / 100));
  }
  const paid = diff === 1 ? Math.floor(subtotal) + 1 : diff === 2 ? Math.ceil(subtotal / 5) * 5 : Math.ceil(subtotal / 10) * 10;
  const correctChange = round2(paid - subtotal);
  return {
    name: NAMES[randInt(0, NAMES.length - 1)],
    items,
    paid,
    correctChange,
    discount: discount || void 0,
    tax: tax || void 0
  };
}
function MarketMerchant({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [customer, setCustomer] = reactExports.useState(
    genCustomer(config.difficulty)
  );
  const [input, setInput] = reactExports.useState("");
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [served, setServed] = reactExports.useState(0);
  const MAX_CUSTOMERS = 8;
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const totalRef = reactExports.useRef(total);
  totalRef.current = total;
  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () => {
    setPhase("over");
    const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
    onGameEnd(
      buildResult(
        config,
        scoreRef.current,
        acc,
        Math.floor((Date.now() - startTimeRef.current) / 1e3),
        false
      )
    );
  });
  const endGame = reactExports.useCallback(
    (s, c, t) => {
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          s,
          t > 0 ? c / t * 100 : 0,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          true
        )
      );
    },
    [config, onGameEnd]
  );
  function submit() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const newTotal = total + 1;
    setTotal(newTotal);
    const ok = Math.abs(val - customer.correctChange) < 0.02;
    const newCorrect = ok ? correct + 1 : correct;
    const newScore = ok ? score + 200 : Math.max(0, score - 50);
    setCorrect(newCorrect);
    setScore(newScore);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok ? `Correct! Change: GHS ${customer.correctChange.toFixed(2)}` : `Wrong. Change should be GHS ${customer.correctChange.toFixed(2)}`,
      ok
    });
    const nextServed = served + 1;
    setServed(nextServed);
    if (nextServed >= MAX_CUSTOMERS) {
      setTimeout(() => endGame(newScore, newCorrect, newTotal), 1e3);
    } else {
      setTimeout(() => {
        setCustomer(genCustomer(config.difficulty));
        setInput("");
        setFeedback(null);
      }, 1200);
    }
  }
  const subtotal = customer.items.reduce((s, i) => s + i.price * i.qty, 0);
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "money_math.page",
      children: [
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#4ade80]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Market Merchant"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm", children: [
                "Customers arrive with purchases. Calculate the correct change.",
                " ",
                config.difficulty === 3 ? "Includes discounts and tax." : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                    startTimer();
                  },
                  className: "px-8 py-3 rounded-lg bg-[#4ade80] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "money_math.start_button",
                  children: "Open Shop"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-muted rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#4ade80] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Customer ",
              served + 1,
              "/",
              MAX_CUSTOMERS
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#4ade80] font-bold", children: score })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              timeLeft,
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 40 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -40 },
              className: "p-4 rounded-xl border border-border/30 bg-card space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-[#4ade80]", children: [
                  customer.name,
                  " wants to buy:"
                ] }),
                customer.items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    item.qty > 1 ? `${item.qty}x ` : "",
                    item.name
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    "GHS ",
                    (item.price * item.qty).toFixed(2)
                  ] })
                ] }, i)),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/30 pt-2 space-y-1 text-sm", children: [
                  customer.discount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-red-400", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Discount (",
                      customer.discount,
                      "%)"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "-GHS ",
                      (subtotal * customer.discount / 100).toFixed(2)
                    ] })
                  ] }),
                  customer.tax && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[#f59e0b]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Tax (",
                      customer.tax,
                      "%)"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                      "GHS ",
                      (customer.paid - customer.correctChange).toFixed(2)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[#4ade80] font-bold text-lg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Customer pays:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                      "GHS ",
                      customer.paid.toFixed(2)
                    ] })
                  ] })
                ] })
              ]
            },
            served
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Enter the correct change (GHS):" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && submit(),
                  className: "w-36 text-center text-xl font-bold rounded border-2 border-[#4ade80]/50 bg-background focus:border-[#4ade80] focus:outline-none p-2",
                  placeholder: "0.00",
                  "data-ocid": "money_math.change_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: submit,
                  className: "px-5 py-2 rounded bg-[#4ade80] text-black font-bold hover:opacity-90 transition-opacity",
                  "data-ocid": "money_math.submit_button",
                  children: "Give Change"
                }
              )
            ] }),
            feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-sm font-bold",
                style: { color: feedback.ok ? "#4ade80" : "#f43f5e" },
                children: feedback.msg
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const BUDGET_CATEGORIES = [
  { name: "Rent", essentialMin: 150, type: "essential" },
  { name: "Food & Groceries", essentialMin: 80, type: "essential" },
  { name: "Transport", essentialMin: 40, type: "essential" },
  { name: "School Fees", essentialMin: 60, type: "essential" },
  { name: "Utilities (Water/Light)", essentialMin: 30, type: "essential" },
  { name: "Clothing", essentialMin: 20, type: "discretionary" },
  { name: "Entertainment", essentialMin: 10, type: "discretionary" },
  { name: "Phone Credit", essentialMin: 15, type: "discretionary" }
];
function genBudgetScenario(diff) {
  const incomes = diff === 1 ? [600, 800] : diff === 2 ? [800, 1e3, 1200] : [1e3, 1200, 1500, 2e3];
  const income = incomes[randInt(0, incomes.length - 1)];
  const count = diff === 1 ? 4 : diff === 2 ? 5 : 6;
  const cats = BUDGET_CATEGORIES.slice(0, count);
  return { income, categories: cats, minSavings: 10 };
}
function BudgetMaster({ config, onGameEnd }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [scenario] = reactExports.useState(
    genBudgetScenario(config.difficulty)
  );
  const [allocations, setAllocations] = reactExports.useState(
    () => Object.fromEntries(BUDGET_CATEGORIES.slice(0, 8).map((c) => [c.name, 0]))
  );
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const endGame = reactExports.useCallback(
    (s) => {
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, 100, ts, true));
    },
    [config, onGameEnd]
  );
  const totalAllocated = scenario.categories.reduce(
    (sum, cat) => sum + (allocations[cat.name] || 0),
    0
  );
  const savings = scenario.income - totalAllocated;
  const savingsPct = savings / scenario.income * 100;
  function updateAllocation(name, value) {
    const num = Number.parseFloat(value) || 0;
    setAllocations((prev) => ({ ...prev, [name]: num }));
  }
  function submitBudget() {
    const details = [];
    let ok = true;
    if (totalAllocated > scenario.income) {
      ok = false;
      details.push(
        `Overspent! Total GHS ${totalAllocated} > income GHS ${scenario.income}`
      );
    }
    if (savingsPct < scenario.minSavings) {
      ok = false;
      details.push(
        `Must save at least ${scenario.minSavings}% (GHS ${(scenario.income * 0.1).toFixed(2)}). You saved GHS ${savings.toFixed(2)}`
      );
    }
    scenario.categories.filter((c) => c.type === "essential").forEach((c) => {
      if ((allocations[c.name] || 0) < c.essentialMin) {
        ok = false;
        details.push(`${c.name} needs at least GHS ${c.essentialMin}`);
      }
    });
    const pts = ok ? 500 + Math.floor(savingsPct) * 10 : Math.max(0, 200 - details.length * 50);
    setScore(pts);
    setResult({
      ok,
      msg: ok ? `Budget approved! Savings: GHS ${savings.toFixed(2)} (${savingsPct.toFixed(1)}%)` : "Budget needs adjustment.",
      details
    });
    setSubmitted(true);
    setTimeout(() => endGame(pts), 2e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "budget_master.page",
      children: [
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#4ade80]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Budget Master"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Allocate a monthly income to essential and discretionary expenses. Must cover all essentials and save at least 10%." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#4ade80] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "budget_master.start_button",
                  children: "Manage Budget"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-3 rounded-xl border border-[#4ade80]/30 bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#4ade80]", children: [
              "Income: GHS ",
              scenario.income.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `text-sm font-bold ${savings < 0 ? "text-red-400" : savingsPct < 10 ? "text-[#f59e0b]" : "text-[#4ade80]"}`,
                children: [
                  "Remaining: GHS ",
                  savings.toFixed(2)
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 overflow-y-auto flex-1", children: scenario.categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between gap-3 p-2 rounded border border-border/20 bg-card/50",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: cat.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: cat.type === "essential" ? `Min: GHS ${cat.essentialMin}` : "Optional" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    step: "5",
                    value: allocations[cat.name] || "",
                    onChange: (e) => updateAllocation(cat.name, e.target.value),
                    className: "w-24 text-right text-sm font-mono rounded border border-[#4ade80]/30 bg-background p-1.5 focus:border-[#4ade80] focus:outline-none",
                    placeholder: "0",
                    disabled: submitted,
                    "data-ocid": `budget_master.input.${cat.name.replace(/ /g, "_").toLowerCase()}`
                  }
                )
              ]
            },
            cat.name
          )) }),
          !submitted && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: submitBudget,
              className: "w-full py-3 rounded-lg bg-[#4ade80] text-black font-bold hover:opacity-90 transition-opacity",
              "data-ocid": "budget_master.submit_button",
              children: "Submit Budget"
            }
          ),
          result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: `p-3 rounded-xl border ${result.ok ? "border-[#4ade80]/40 bg-[#4ade80]/10" : "border-red-500/40 bg-red-500/10"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-bold text-sm",
                    style: { color: result.ok ? "#4ade80" : "#f43f5e" },
                    children: result.msg
                  }
                ),
                result.details.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: d }, i))
              ]
            }
          )
        ] })
      ]
    }
  );
}
const PRODUCTS = [
  "Mangoes",
  "Notebooks",
  "Bottles of Water",
  "Pens (box)",
  "Bags of Rice",
  "Oranges",
  "Shoes",
  "Mobile Phones"
];
function genTransaction(diff) {
  const product = PRODUCTS[randInt(0, PRODUCTS.length - 1)];
  const buyPrice = diff === 1 ? randInt(5, 20) : diff === 2 ? randInt(10, 50) : randInt(20, 200);
  const profitPctTarget = randInt(-15, 40);
  const sellPrice = round2(buyPrice * (1 + profitPctTarget / 100));
  const qty = diff === 1 ? 1 : diff === 2 ? randInt(2, 5) : randInt(5, 20);
  const profitPerUnit = round2(sellPrice - buyPrice);
  const totalProfit = round2(profitPerUnit * qty);
  const profitPct = round2((sellPrice - buyPrice) / buyPrice * 100);
  return {
    product,
    buyPrice,
    sellPrice: Math.max(1, sellPrice),
    qty,
    profitPerUnit,
    profitPct,
    totalProfit,
    isProfitable: totalProfit > 0
  };
}
function ProfitLoss({ config, onGameEnd }) {
  const TOTAL = 10;
  const [phase, setPhase] = reactExports.useState("idle");
  const [transaction, setTransaction] = reactExports.useState(
    genTransaction(config.difficulty)
  );
  const [step, setStep] = reactExports.useState("sellPrice");
  const [totalGrossProfit, setTotalGrossProfit] = reactExports.useState(0);
  const [input, setInput] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [qIdx, setQIdx] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const correctRef = reactExports.useRef(correct);
  correctRef.current = correct;
  const endGame = reactExports.useCallback(
    (s, c) => {
      const acc = c / TOTAL * 100;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd]
  );
  function submitProfitPct() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const ok = Math.abs(val - transaction.profitPct) <= 0.6;
    const newScore = ok ? score + 150 : score;
    const newCorrect = ok ? correct + 1 : correct;
    setScore(newScore);
    setCorrect(newCorrect);
    scoreRef.current = newScore;
    correctRef.current = newCorrect;
    setFeedback({
      msg: ok ? `Correct! ${transaction.profitPct}%` : `Wrong. Profit% = (${transaction.profitPerUnit}/${transaction.buyPrice}) × 100 = ${transaction.profitPct}%`,
      ok
    });
    setTotalGrossProfit((p) => p + transaction.totalProfit);
    setTimeout(() => {
      const next = qIdx + 1;
      if (next >= TOTAL) {
        endGame(newScore, newCorrect);
        return;
      }
      setTransaction(genTransaction(config.difficulty));
      setStep("sellPrice");
      setInput("");
      setFeedback(null);
      setQIdx(next);
    }, 1200);
  }
  function submitSellPrice() {
    const val = Number.parseFloat(input.trim());
    if (Number.isNaN(val)) {
      setInput("");
      return;
    }
    const ok = Math.abs(val - transaction.profitPerUnit) <= 0.05;
    setFeedback({
      msg: ok ? `Profit/unit = GHS ${transaction.profitPerUnit}` : `Wrong. Profit/unit = ${transaction.sellPrice} - ${transaction.buyPrice} = GHS ${transaction.profitPerUnit}`,
      ok
    });
    if (ok) {
      setTimeout(() => {
        setStep("profitPct");
        setInput("");
        setFeedback(null);
      }, 900);
    } else {
      setTimeout(() => {
        setStep("profitPct");
        setInput("");
        setFeedback(null);
      }, 1200);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col select-none gap-4",
      "data-ocid": "profit_loss.page",
      children: [
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "flex-1 flex flex-col items-center justify-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black text-[#4ade80]",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Profit and Loss"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Buy products at wholesale prices. Calculate profit/loss per unit and the profit percentage. Track your total profit over 10 transactions." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    startTimeRef.current = Date.now();
                    setPhase("playing");
                  },
                  className: "px-8 py-3 rounded-lg bg-[#4ade80] text-black font-bold text-lg hover:opacity-90 transition-opacity",
                  "data-ocid": "profit_loss.start_button",
                  children: "Open Business"
                }
              )
            ]
          }
        ),
        phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Transaction ",
              qIdx + 1,
              "/",
              TOTAL
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `font-bold ${totalGrossProfit >= 0 ? "text-[#4ade80]" : "text-red-400"}`,
                children: [
                  "Net P/L: GHS ",
                  totalGrossProfit.toFixed(2)
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Score: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#4ade80] font-bold", children: score })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0 },
              className: "flex-1 flex flex-col gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border border-border/30 bg-card space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-[#4ade80]", children: transaction.product }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: "Buy Price" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono font-bold", children: [
                        "GHS ",
                        transaction.buyPrice.toFixed(2)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: "Sell Price" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono font-bold", children: [
                        "GHS ",
                        transaction.sellPrice.toFixed(2)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: "Quantity" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono font-bold", children: [
                        transaction.qty,
                        " units"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `px-2 py-1 rounded text-xs font-bold border ${step === "sellPrice" ? "border-[#4ade80] text-[#4ade80]" : "border-border text-muted-foreground"}`,
                      children: "1. Profit/Unit"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `px-2 py-1 rounded text-xs font-bold border ${step === "profitPct" ? "border-[#4ade80] text-[#4ade80]" : "border-border text-muted-foreground"}`,
                      children: "2. Profit %"
                    }
                  )
                ] }),
                step === "sellPrice" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Calculate profit (or loss) per unit (GHS):" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Profit/Unit = Selling Price − Cost Price" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        step: "0.01",
                        value: input,
                        onChange: (e) => setInput(e.target.value),
                        onKeyDown: (e) => e.key === "Enter" && submitSellPrice(),
                        className: "w-32 text-center text-xl font-bold rounded border-2 border-[#4ade80]/50 bg-background focus:border-[#4ade80] focus:outline-none p-2",
                        placeholder: "?",
                        "data-ocid": "profit_loss.profit_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: submitSellPrice,
                        className: "px-5 py-2 rounded bg-[#4ade80] text-black font-bold hover:opacity-90 transition-opacity",
                        "data-ocid": "profit_loss.profit_submit",
                        children: "Calculate"
                      }
                    )
                  ] })
                ] }),
                step === "profitPct" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Calculate profit percentage (%):" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Profit% = (Profit/Cost Price) × 100" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        step: "0.1",
                        value: input,
                        onChange: (e) => setInput(e.target.value),
                        onKeyDown: (e) => e.key === "Enter" && submitProfitPct(),
                        className: "w-32 text-center text-xl font-bold rounded border-2 border-[#4ade80]/50 bg-background focus:border-[#4ade80] focus:outline-none p-2",
                        placeholder: "?",
                        "data-ocid": "profit_loss.pct_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: submitProfitPct,
                        className: "px-5 py-2 rounded bg-[#4ade80] text-black font-bold hover:opacity-90 transition-opacity",
                        "data-ocid": "profit_loss.pct_submit",
                        children: "Submit %"
                      }
                    )
                  ] })
                ] }),
                feedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-bold",
                    style: { color: feedback.ok ? "#4ade80" : "#f43f5e" },
                    children: feedback.msg
                  }
                )
              ]
            },
            qIdx
          ) })
        ] })
      ]
    }
  );
}
function MoneyMath({ config, onGameEnd }) {
  if (config.gameId === "budget-master")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(BudgetMaster, { config, onGameEnd });
  if (config.gameId === "profit-loss")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProfitLoss, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MarketMerchant, { config, onGameEnd });
}
export {
  MoneyMath as default
};
