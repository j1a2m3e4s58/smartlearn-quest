import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  type GameConfig,
  type GameResult,
  buildResult,
  useGameTimer,
} from "../GameEngine";

interface Props {
  config: GameConfig;
  onGameEnd: (r: GameResult) => void;
}

function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// ── GAME 1: market-merchant (preserved) ─────────────────────────────────────────────

interface Customer {
  name: string;
  items: { name: string; price: number; qty: number }[];
  paid: number;
  correctChange: number;
  discount?: number;
  tax?: number;
}

const NAMES = ["Kofi", "Ama", "Kwame", "Adwoa", "Yaw", "Efua", "Kweku", "Akua"];

function genCustomer(diff: 1 | 2 | 3): Customer {
  const itemCount = diff === 1 ? 1 : diff === 2 ? 2 : randInt(2, 3);
  const items = Array.from({ length: itemCount }, () => {
    const price =
      diff === 1
        ? randInt(1, 9) + 0.99
        : diff === 2
          ? randInt(1, 20) + 0.5
          : randInt(1, 30) + randInt(0, 99) / 100;
    return {
      name: ["Pencil", "Book", "Ruler", "Bag", "Pen", "Calculator"][
        randInt(0, 5)
      ],
      price,
      qty: diff === 3 ? randInt(1, 3) : 1,
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
  const paid =
    diff === 1
      ? Math.floor(subtotal) + 1
      : diff === 2
        ? Math.ceil(subtotal / 5) * 5
        : Math.ceil(subtotal / 10) * 10;
  const correctChange = round2(paid - subtotal);
  return {
    name: NAMES[randInt(0, NAMES.length - 1)],
    items,
    paid,
    correctChange,
    discount: discount || undefined,
    tax: tax || undefined,
  };
}

function MarketMerchant({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [customer, setCustomer] = useState<Customer>(
    genCustomer(config.difficulty),
  );
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [served, setServed] = useState(0);
  const MAX_CUSTOMERS = 8;
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const correctRef = useRef(correct);
  correctRef.current = correct;
  const totalRef = useRef(total);
  totalRef.current = total;

  const { timeLeft, start: startTimer } = useGameTimer(config.timeLimit, () => {
    setPhase("over");
    const acc =
      totalRef.current > 0 ? (correctRef.current / totalRef.current) * 100 : 0;
    onGameEnd(
      buildResult(
        config,
        scoreRef.current,
        acc,
        Math.floor((Date.now() - startTimeRef.current) / 1000),
        false,
      ),
    );
  });

  const endGame = useCallback(
    (s: number, c: number, t: number) => {
      setPhase("over");
      onGameEnd(
        buildResult(
          config,
          s,
          t > 0 ? (c / t) * 100 : 0,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          true,
        ),
      );
    },
    [config, onGameEnd],
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
      msg: ok
        ? `Correct! Change: GHS ${customer.correctChange.toFixed(2)}`
        : `Wrong. Change should be GHS ${customer.correctChange.toFixed(2)}`,
      ok,
    });
    const nextServed = served + 1;
    setServed(nextServed);
    if (nextServed >= MAX_CUSTOMERS) {
      setTimeout(() => endGame(newScore, newCorrect, newTotal), 1000);
    } else {
      setTimeout(() => {
        setCustomer(genCustomer(config.difficulty));
        setInput("");
        setFeedback(null);
      }, 1200);
    }
  }

  const subtotal = customer.items.reduce((s, i) => s + i.price * i.qty, 0);
  const timePct = (timeLeft / config.timeLimit) * 100;

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="money_math.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#4ade80]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Market Merchant
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Customers arrive with purchases. Calculate the correct change.{" "}
            {config.difficulty === 3 ? "Includes discounts and tax." : ""}
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
              startTimer();
            }}
            className="px-8 py-3 rounded-lg bg-[#4ade80] text-black font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="money_math.start_button"
          >
            Open Shop
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="w-full h-2 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-[#4ade80] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Customer {served + 1}/{MAX_CUSTOMERS}
            </span>
            <span>
              Score: <span className="text-[#4ade80] font-bold">{score}</span>
            </span>
            <span>{timeLeft}s</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={served}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="p-4 rounded-xl border border-border/30 bg-card space-y-3"
            >
              <div className="font-bold text-[#4ade80]">
                {customer.name} wants to buy:
              </div>
              {customer.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.qty > 1 ? `${item.qty}x ` : ""}
                    {item.name}
                  </span>
                  <span className="font-mono">
                    GHS {(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-border/30 pt-2 space-y-1 text-sm">
                {customer.discount && (
                  <div className="flex justify-between text-red-400">
                    <span>Discount ({customer.discount}%)</span>
                    <span>
                      -GHS {((subtotal * customer.discount) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                {customer.tax && (
                  <div className="flex justify-between text-[#f59e0b]">
                    <span>Tax ({customer.tax}%)</span>
                    <span />
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="font-mono">
                    GHS {(customer.paid - customer.correctChange).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#4ade80] font-bold text-lg">
                  <span>Customer pays:</span>
                  <span className="font-mono">
                    GHS {customer.paid.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Enter the correct change (GHS):
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                step="0.01"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="w-36 text-center text-xl font-bold rounded border-2 border-[#4ade80]/50 bg-background focus:border-[#4ade80] focus:outline-none p-2"
                placeholder="0.00"
                data-ocid="money_math.change_input"
              />
              <button
                type="button"
                onClick={submit}
                className="px-5 py-2 rounded bg-[#4ade80] text-black font-bold hover:opacity-90 transition-opacity"
                data-ocid="money_math.submit_button"
              >
                Give Change
              </button>
            </div>
            {feedback && (
              <p
                className="text-sm font-bold"
                style={{ color: feedback.ok ? "#4ade80" : "#f43f5e" }}
              >
                {feedback.msg}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── GAME 2: budget-master ─────────────────────────────────────────────────────────

interface BudgetCategory {
  name: string;
  essentialMin: number;
  type: "essential" | "discretionary";
}
interface BudgetScenario {
  income: number;
  categories: BudgetCategory[];
  minSavings: number;
}

const BUDGET_CATEGORIES: BudgetCategory[] = [
  { name: "Rent", essentialMin: 150, type: "essential" },
  { name: "Food & Groceries", essentialMin: 80, type: "essential" },
  { name: "Transport", essentialMin: 40, type: "essential" },
  { name: "School Fees", essentialMin: 60, type: "essential" },
  { name: "Utilities (Water/Light)", essentialMin: 30, type: "essential" },
  { name: "Clothing", essentialMin: 20, type: "discretionary" },
  { name: "Entertainment", essentialMin: 10, type: "discretionary" },
  { name: "Phone Credit", essentialMin: 15, type: "discretionary" },
];

function genBudgetScenario(diff: 1 | 2 | 3): BudgetScenario {
  const incomes =
    diff === 1
      ? [600, 800]
      : diff === 2
        ? [800, 1000, 1200]
        : [1000, 1200, 1500, 2000];
  const income = incomes[randInt(0, incomes.length - 1)];
  const count = diff === 1 ? 4 : diff === 2 ? 5 : 6;
  const cats = BUDGET_CATEGORIES.slice(0, count);
  return { income, categories: cats, minSavings: 10 };
}

function BudgetMaster({ config, onGameEnd }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [scenario] = useState<BudgetScenario>(
    genBudgetScenario(config.difficulty),
  );
  const [allocations, setAllocations] = useState<Record<string, number>>(() =>
    Object.fromEntries(BUDGET_CATEGORIES.slice(0, 8).map((c) => [c.name, 0])),
  );
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    msg: string;
    details: string[];
  } | null>(null);
  const [score, setScore] = useState(0);
  const startTimeRef = useRef(Date.now());

  const endGame = useCallback(
    (s: number) => {
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, s, 100, ts, true));
    },
    [config, onGameEnd],
  );

  const totalAllocated = scenario.categories.reduce(
    (sum, cat) => sum + (allocations[cat.name] || 0),
    0,
  );
  const savings = scenario.income - totalAllocated;
  const savingsPct = (savings / scenario.income) * 100;

  function updateAllocation(name: string, value: string) {
    const num = Number.parseFloat(value) || 0;
    setAllocations((prev) => ({ ...prev, [name]: num }));
  }

  function submitBudget() {
    const details: string[] = [];
    let ok = true;
    if (totalAllocated > scenario.income) {
      ok = false;
      details.push(
        `Overspent! Total GHS ${totalAllocated} > income GHS ${scenario.income}`,
      );
    }
    if (savingsPct < scenario.minSavings) {
      ok = false;
      details.push(
        `Must save at least ${scenario.minSavings}% (GHS ${(scenario.income * 0.1).toFixed(2)}). You saved GHS ${savings.toFixed(2)}`,
      );
    }
    scenario.categories
      .filter((c) => c.type === "essential")
      .forEach((c) => {
        if ((allocations[c.name] || 0) < c.essentialMin) {
          ok = false;
          details.push(`${c.name} needs at least GHS ${c.essentialMin}`);
        }
      });
    const pts = ok
      ? 500 + Math.floor(savingsPct) * 10
      : Math.max(0, 200 - details.length * 50);
    setScore(pts);
    setResult({
      ok,
      msg: ok
        ? `Budget approved! Savings: GHS ${savings.toFixed(2)} (${savingsPct.toFixed(1)}%)`
        : "Budget needs adjustment.",
      details,
    });
    setSubmitted(true);
    setTimeout(() => endGame(pts), 2000);
  }

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="budget_master.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#4ade80]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Budget Master
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Allocate a monthly income to essential and discretionary expenses.
            Must cover all essentials and save at least 10%.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
            }}
            className="px-8 py-3 rounded-lg bg-[#4ade80] text-black font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="budget_master.start_button"
          >
            Manage Budget
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between items-center p-3 rounded-xl border border-[#4ade80]/30 bg-card">
            <span className="font-bold text-[#4ade80]">
              Income: GHS {scenario.income.toFixed(2)}
            </span>
            <span
              className={`text-sm font-bold ${savings < 0 ? "text-red-400" : savingsPct < 10 ? "text-[#f59e0b]" : "text-[#4ade80]"}`}
            >
              Remaining: GHS {savings.toFixed(2)}
            </span>
          </div>
          <div className="space-y-2 overflow-y-auto flex-1">
            {scenario.categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between gap-3 p-2 rounded border border-border/20 bg-card/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {cat.type === "essential"
                      ? `Min: GHS ${cat.essentialMin}`
                      : "Optional"}
                  </p>
                </div>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={allocations[cat.name] || ""}
                  onChange={(e) => updateAllocation(cat.name, e.target.value)}
                  className="w-24 text-right text-sm font-mono rounded border border-[#4ade80]/30 bg-background p-1.5 focus:border-[#4ade80] focus:outline-none"
                  placeholder="0"
                  disabled={submitted}
                  data-ocid={`budget_master.input.${cat.name.replace(/ /g, "_").toLowerCase()}`}
                />
              </div>
            ))}
          </div>
          {!submitted && (
            <button
              type="button"
              onClick={submitBudget}
              className="w-full py-3 rounded-lg bg-[#4ade80] text-black font-bold hover:opacity-90 transition-opacity"
              data-ocid="budget_master.submit_button"
            >
              Submit Budget
            </button>
          )}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl border ${result.ok ? "border-[#4ade80]/40 bg-[#4ade80]/10" : "border-red-500/40 bg-red-500/10"}`}
            >
              <p
                className="font-bold text-sm"
                style={{ color: result.ok ? "#4ade80" : "#f43f5e" }}
              >
                {result.msg}
              </p>
              {result.details.map((d, i) => (
                <p key={i} className="text-xs text-muted-foreground mt-1">
                  {d}
                </p>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// ── GAME 3: profit-loss ────────────────────────────────────────────────────────────

interface PLTransaction {
  product: string;
  buyPrice: number;
  sellPrice: number;
  qty: number;
  profitPerUnit: number;
  profitPct: number;
  totalProfit: number;
  isProfitable: boolean;
}

const PRODUCTS = [
  "Mangoes",
  "Notebooks",
  "Bottles of Water",
  "Pens (box)",
  "Bags of Rice",
  "Oranges",
  "Shoes",
  "Mobile Phones",
];

function genTransaction(diff: 1 | 2 | 3): PLTransaction {
  const product = PRODUCTS[randInt(0, PRODUCTS.length - 1)];
  const buyPrice =
    diff === 1
      ? randInt(5, 20)
      : diff === 2
        ? randInt(10, 50)
        : randInt(20, 200);
  const profitPctTarget = randInt(-15, 40);
  const sellPrice = round2(buyPrice * (1 + profitPctTarget / 100));
  const qty = diff === 1 ? 1 : diff === 2 ? randInt(2, 5) : randInt(5, 20);
  const profitPerUnit = round2(sellPrice - buyPrice);
  const totalProfit = round2(profitPerUnit * qty);
  const profitPct = round2(((sellPrice - buyPrice) / buyPrice) * 100);
  return {
    product,
    buyPrice,
    sellPrice: Math.max(1, sellPrice),
    qty,
    profitPerUnit,
    profitPct,
    totalProfit,
    isProfitable: totalProfit > 0,
  };
}

type PLStep = "sellPrice" | "profitPct" | "verdict";

function ProfitLoss({ config, onGameEnd }: Props) {
  const TOTAL = 10;
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [transaction, setTransaction] = useState<PLTransaction>(
    genTransaction(config.difficulty),
  );
  const [step, setStep] = useState<PLStep>("sellPrice");
  const [totalGrossProfit, setTotalGrossProfit] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const correctRef = useRef(correct);
  correctRef.current = correct;

  const endGame = useCallback(
    (s: number, c: number) => {
      const acc = TOTAL > 0 ? (c / TOTAL) * 100 : 0;
      const ts = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onGameEnd(buildResult(config, s, acc, ts, true));
    },
    [config, onGameEnd],
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
      msg: ok
        ? `Correct! ${transaction.profitPct}%`
        : `Wrong. Profit% = (${transaction.profitPerUnit}/${transaction.buyPrice}) × 100 = ${transaction.profitPct}%`,
      ok,
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
      msg: ok
        ? `Profit/unit = GHS ${transaction.profitPerUnit}`
        : `Wrong. Profit/unit = ${transaction.sellPrice} - ${transaction.buyPrice} = GHS ${transaction.profitPerUnit}`,
      ok,
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

  return (
    <div
      className="w-full h-full flex flex-col select-none gap-4"
      data-ocid="profit_loss.page"
    >
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          <h2
            className="text-3xl font-black text-[#4ade80]"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Profit and Loss
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Buy products at wholesale prices. Calculate profit/loss per unit and
            the profit percentage. Track your total profit over 10 transactions.
          </p>
          <button
            type="button"
            onClick={() => {
              startTimeRef.current = Date.now();
              setPhase("playing");
            }}
            className="px-8 py-3 rounded-lg bg-[#4ade80] text-black font-bold text-lg hover:opacity-90 transition-opacity"
            data-ocid="profit_loss.start_button"
          >
            Open Business
          </button>
        </motion.div>
      )}
      {phase === "playing" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Transaction {qIdx + 1}/{TOTAL}
            </span>
            <span
              className={`font-bold ${totalGrossProfit >= 0 ? "text-[#4ade80]" : "text-red-400"}`}
            >
              Net P/L: GHS {totalGrossProfit.toFixed(2)}
            </span>
            <span>
              Score: <span className="text-[#4ade80] font-bold">{score}</span>
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col gap-4"
            >
              <div className="p-4 rounded-xl border border-border/30 bg-card space-y-2">
                <p className="font-bold text-[#4ade80]">
                  {transaction.product}
                </p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Buy Price</p>
                    <p className="font-mono font-bold">
                      GHS {transaction.buyPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Sell Price</p>
                    <p className="font-mono font-bold">
                      GHS {transaction.sellPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Quantity</p>
                    <p className="font-mono font-bold">
                      {transaction.qty} units
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div
                  className={`px-2 py-1 rounded text-xs font-bold border ${step === "sellPrice" ? "border-[#4ade80] text-[#4ade80]" : "border-border text-muted-foreground"}`}
                >
                  1. Profit/Unit
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-bold border ${step === "profitPct" ? "border-[#4ade80] text-[#4ade80]" : "border-border text-muted-foreground"}`}
                >
                  2. Profit %
                </div>
              </div>
              {step === "sellPrice" && (
                <div className="space-y-2">
                  <p className="text-sm">
                    Calculate profit (or loss) per unit (GHS):
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Profit/Unit = Selling Price − Cost Price
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      step="0.01"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitSellPrice()}
                      className="w-32 text-center text-xl font-bold rounded border-2 border-[#4ade80]/50 bg-background focus:border-[#4ade80] focus:outline-none p-2"
                      placeholder="?"
                      data-ocid="profit_loss.profit_input"
                    />
                    <button
                      type="button"
                      onClick={submitSellPrice}
                      className="px-5 py-2 rounded bg-[#4ade80] text-black font-bold hover:opacity-90 transition-opacity"
                      data-ocid="profit_loss.profit_submit"
                    >
                      Calculate
                    </button>
                  </div>
                </div>
              )}
              {step === "profitPct" && (
                <div className="space-y-2">
                  <p className="text-sm">Calculate profit percentage (%):</p>
                  <p className="text-xs text-muted-foreground">
                    Profit% = (Profit/Cost Price) × 100
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      step="0.1"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitProfitPct()}
                      className="w-32 text-center text-xl font-bold rounded border-2 border-[#4ade80]/50 bg-background focus:border-[#4ade80] focus:outline-none p-2"
                      placeholder="?"
                      data-ocid="profit_loss.pct_input"
                    />
                    <button
                      type="button"
                      onClick={submitProfitPct}
                      className="px-5 py-2 rounded bg-[#4ade80] text-black font-bold hover:opacity-90 transition-opacity"
                      data-ocid="profit_loss.pct_submit"
                    >
                      Submit %
                    </button>
                  </div>
                </div>
              )}
              {feedback && (
                <p
                  className="text-sm font-bold"
                  style={{ color: feedback.ok ? "#4ade80" : "#f43f5e" }}
                >
                  {feedback.msg}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Router ───────────────────────────────────────────────────────────────────

export default function MoneyMath({ config, onGameEnd }: Props) {
  if (config.gameId === "budget-master")
    return <BudgetMaster config={config} onGameEnd={onGameEnd} />;
  if (config.gameId === "profit-loss")
    return <ProfitLoss config={config} onGameEnd={onGameEnd} />;
  return <MarketMerchant config={config} onGameEnd={onGameEnd} />;
}
