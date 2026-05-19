import { j as jsxRuntimeExports, r as reactExports, m as motion, G as GlowButton, n as AnimatePresence } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { F as FileText } from "./file-text-7x6WuCaf.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
import { A as ArrowUp, a as ArrowDown } from "./arrow-up-DBX_ZmgS.js";
const STORIES = {
  1: [
    {
      title: "The Broken Bridge",
      paragraphs: [
        "Villagers discovered the bridge had collapsed overnight, cutting them off from the market town.",
        "For years, the old wooden bridge had served the village well, connecting farmers to the market.",
        "After the flood, the situation became desperate — food supplies dwindled rapidly.",
        "The engineer finally completed the new steel bridge, and the village celebrated with a feast.",
        "Working together, villagers gathered materials and the community engineer designed a new structure."
      ],
      correctOrder: [1, 0, 2, 4, 3],
      stages: [
        "exposition",
        "rising_action",
        "climax",
        "falling_action",
        "resolution"
      ],
      transitions: {
        transition_1: {
          question: "Between introduction and the bridge collapsing, which word best connects them?",
          options: ["However", "Therefore", "Meanwhile", "Similarly"],
          answer: "However"
        },
        transition_2: {
          question: "Between the desperate situation and the community working together?",
          options: ["Nevertheless", "Additionally", "Consequently", "Whereas"],
          answer: "Consequently"
        },
        transition_3: {
          question: "Between building and the final celebration?",
          options: ["Meanwhile", "Finally", "Although", "Because"],
          answer: "Finally"
        }
      }
    }
  ],
  2: [
    {
      title: "The Silent Algorithm",
      paragraphs: [
        "Tensions peaked when the system began flagging innocent citizens — protests erupted outside city hall.",
        "Meridian City deployed an AI surveillance network promising to reduce crime by 40% within a year.",
        "A young data analyst discovered the algorithm had been trained on biased historical arrest data.",
        "The city council ordered an independent audit and suspended the system pending review.",
        "Gradually, civilian oversight boards were established, setting transparency standards for AI policing tools."
      ],
      correctOrder: [1, 2, 0, 3, 4],
      stages: [
        "exposition",
        "rising_action",
        "climax",
        "falling_action",
        "resolution"
      ],
      transitions: {
        transition_1: {
          question: "Between deploying the AI and discovering the bias?",
          options: ["Nevertheless", "However", "Whereas", "Therefore"],
          answer: "However"
        },
        transition_2: {
          question: "Between the protests and the council's response?",
          options: ["In response", "Similarly", "For example", "Despite this"],
          answer: "In response"
        },
        transition_3: {
          question: "Between the audit and establishing oversight boards?",
          options: ["Subsequently", "Although", "Because", "Namely"],
          answer: "Subsequently"
        }
      }
    }
  ],
  3: [
    {
      title: "The Cartographer's Dilemma",
      paragraphs: [
        "Dr. Aruna Patel published a map projection that accurately depicted relative landmass sizes — upending the dominant Mercator tradition.",
        "For centuries, European cartographers had used the Mercator projection, unknowingly distorting Africa and South America's true scale.",
        "The map went viral; established geographic institutes rejected it as confusing, while educators worldwide adopted it immediately.",
        "After years of debate, a new international cartographic standard was proposed incorporating multiple projections for different contexts.",
        "The controversy forced a global conversation about how maps encode political and cultural assumptions."
      ],
      correctOrder: [1, 0, 2, 4, 3],
      stages: [
        "exposition",
        "rising_action",
        "climax",
        "falling_action",
        "resolution"
      ],
      transitions: {
        transition_1: {
          question: "Between the centuries-long Mercator tradition and the new publication?",
          options: [
            "Challenging this",
            "In addition",
            "For instance",
            "Meanwhile"
          ],
          answer: "Challenging this"
        },
        transition_2: {
          question: "Between the mixed reaction and the global conversation?",
          options: ["This polarization", "However", "Moreover", "Similarly"],
          answer: "This polarization"
        },
        transition_3: {
          question: "Between the global conversation and the new standard?",
          options: ["Ultimately", "Although", "Yet", "Furthermore"],
          answer: "Ultimately"
        }
      }
    }
  ]
};
const STAGE_COLORS = {
  exposition: "#7c3aed",
  rising_action: "#f59e0b",
  climax: "#f43f5e",
  falling_action: "#00f5ff",
  resolution: "#10b981"
};
const CHARACTERS = {
  1: [
    {
      name: "Marcus",
      description: "Marcus always volunteers first in class. He stays late to help the teacher arrange chairs and brings extra pencils for friends who forget theirs. He gets upset if others don't follow the rules.",
      trait: "helpful",
      traitOptions: ["helpful", "selfish", "lazy", "cruel"],
      motivation: "to be liked by everyone",
      motivationOptions: [
        "to be liked by everyone",
        "to become rich",
        "to travel the world",
        "to win prizes"
      ],
      flaw: "needs approval to feel worthy",
      flawOptions: [
        "needs approval to feel worthy",
        "is physically weak",
        "cannot read well",
        "dislikes animals"
      ]
    },
    {
      name: "Efua",
      description: "Efua reads every book in the library and asks her teacher endless questions. She stays up past midnight researching. She struggles to connect with classmates who don't share her interests.",
      trait: "curious",
      traitOptions: ["curious", "brave", "dishonest", "generous"],
      motivation: "to understand everything",
      motivationOptions: [
        "to understand everything",
        "to find treasure",
        "to become a doctor",
        "to please her parents"
      ],
      flaw: "alienates peers with her intensity",
      flawOptions: [
        "alienates peers with her intensity",
        "is afraid of heights",
        "cannot swim",
        "loses things easily"
      ]
    },
    {
      name: "Kwame",
      description: "Kwame never backs down from any challenge. He crossed the flooded river when others refused. He doesn't think twice about risk and has broken bones twice already.",
      trait: "brave",
      traitOptions: ["brave", "kind", "artistic", "smart"],
      motivation: "to prove himself to his father",
      motivationOptions: [
        "to prove himself to his father",
        "to win a trophy",
        "to impress girls",
        "to escape boredom"
      ],
      flaw: "underestimates danger recklessly",
      flawOptions: [
        "underestimates danger recklessly",
        "is too quiet",
        "eats too much",
        "forgets homework"
      ]
    }
  ],
  2: [
    {
      name: "Dr. Miriam",
      description: "Dr. Miriam works 80-hour weeks at the clinic, turns down promotions, and donates her salary increase to equipment. She rarely sleeps and snaps at her family during rare visits home.",
      trait: "dedicated",
      traitOptions: ["dedicated", "ruthless", "arrogant", "naive"],
      motivation: "to save lives that the system abandoned",
      motivationOptions: [
        "to save lives that the system abandoned",
        "to become famous",
        "to earn a large salary",
        "to retire early"
      ],
      flaw: "sacrifices personal relationships for work",
      flawOptions: [
        "sacrifices personal relationships for work",
        "is afraid of blood",
        "cannot drive",
        "dislikes children"
      ]
    },
    {
      name: "Victor",
      description: "Victor always finds a shortcut. He copied classmates in school, faked references at work, and takes credit for team ideas. He is charming and rises quickly through every organisation.",
      trait: "opportunistic",
      traitOptions: ["opportunistic", "generous", "courageous", "nurturing"],
      motivation: "to reach the top by any means",
      motivationOptions: [
        "to reach the top by any means",
        "to protect his family",
        "to serve his country",
        "to create art"
      ],
      flaw: "builds success on unstable foundations",
      flawOptions: [
        "builds success on unstable foundations",
        "cannot concentrate",
        "is too honest",
        "is physically frail"
      ]
    },
    {
      name: "Yemi",
      description: "Yemi mediates every conflict in her village. She listens for hours, finds common ground, and never takes sides publicly. Her neighbours trust her. But she has never shared her own opinion on anything.",
      trait: "empathetic",
      traitOptions: ["empathetic", "selfish", "stubborn", "reckless"],
      motivation: "to keep her community in harmony",
      motivationOptions: [
        "to keep her community in harmony",
        "to become a politician",
        "to leave her village",
        "to become wealthy"
      ],
      flaw: "suppresses her own needs and identity",
      flawOptions: [
        "suppresses her own needs and identity",
        "cannot cook",
        "speaks too loudly",
        "avoids hard work"
      ]
    }
  ],
  3: [
    {
      name: "Ambassador Selene",
      description: "Ambassador Selene negotiated three landmark treaties and speaks seven languages. Every word she utters is measured against its strategic value. She ended a war but lost her marriage and both children's trust in the process.",
      trait: "strategically brilliant",
      traitOptions: [
        "strategically brilliant",
        "emotionally warm",
        "physically strong",
        "creatively gifted"
      ],
      motivation: "to create a world without war at any personal cost",
      motivationOptions: [
        "to create a world without war at any personal cost",
        "to gain international recognition",
        "to avenge a past betrayal",
        "to accumulate political power"
      ],
      flaw: "cannot separate purpose from identity",
      flawOptions: [
        "cannot separate purpose from identity",
        "is afraid of crowds",
        "lacks intelligence",
        "has a speech impediment"
      ]
    },
    {
      name: "The Architect",
      description: "The Architect designed the city's masterpiece tower but buried the evidence that its foundations were cut to save costs. The tower stands. He lives in dread. He mentors young engineers and demands absolute integrity from them.",
      trait: "privately hypocritical",
      traitOptions: [
        "privately hypocritical",
        "openly corrupt",
        "naively idealistic",
        "consistently virtuous"
      ],
      motivation: "to be remembered as a great builder",
      motivationOptions: [
        "to be remembered as a great builder",
        "to accumulate wealth",
        "to mentor the next generation",
        "to atone for past failures"
      ],
      flaw: "cannot confront the gap between ideals and actions",
      flawOptions: [
        "cannot confront the gap between ideals and actions",
        "lacks technical skill",
        "is too generous",
        "avoids responsibility"
      ]
    }
  ]
};
const BRANCH_STORIES = {
  1: [
    {
      title: "The New Student",
      opening: "Kofi notices a new student sitting alone at lunch, looking overwhelmed. Nobody else has gone to speak with them.",
      choices: [
        [
          {
            text: "Walk over and introduce yourself",
            shortTerm: "The student looks relieved and smiles.",
            longTerm: "You develop a lasting friendship and the student becomes confident.",
            score: 3
          },
          {
            text: "Wait to see if someone else goes",
            shortTerm: "Nobody approaches. The student eats alone.",
            longTerm: "The student withdraws from school activities.",
            score: 1
          },
          {
            text: "Mention it to the teacher and move on",
            shortTerm: "The teacher nods but is busy.",
            longTerm: "The student receives some support but feels isolated.",
            score: 2
          }
        ],
        [
          {
            text: "Invite them to join your group's activity",
            shortTerm: "The student joins and participates carefully.",
            longTerm: "They integrate into the class and gain confidence.",
            score: 3
          },
          {
            text: "Suggest they speak to the class rep",
            shortTerm: "The student is uncertain who that is.",
            longTerm: "Minor improvement but connection remains thin.",
            score: 2
          },
          {
            text: "Talk to them but leave after five minutes",
            shortTerm: "Brief warmth but they are alone again.",
            longTerm: "The student sees the gesture as hollow.",
            score: 1
          }
        ],
        [
          {
            text: "Continue checking in with them daily",
            shortTerm: "They open up and share what is difficult.",
            longTerm: "Full inclusion in the class community.",
            score: 3
          },
          {
            text: "Move on to your existing friends",
            shortTerm: "The new student manages independently.",
            longTerm: "They do fine but never feel fully included.",
            score: 2
          },
          {
            text: "Discourage others from being exclusive",
            shortTerm: "Some classmates become more welcoming.",
            longTerm: "Class culture shifts positively for everyone.",
            score: 3
          }
        ]
      ],
      bestPath: [0, 0, 0],
      bestOutcome: "You consistently showed empathy and inclusion. The student thrives and the class grows stronger.",
      poorOutcome: "Passive or shallow responses left the student isolated and the opportunity for genuine connection missed."
    }
  ],
  2: [
    {
      title: "The Group Project",
      opening: "Your group must submit a major project in three days. One member hasn't contributed at all. Another wants to exclude them from the final submission and divide the grade among those who worked.",
      choices: [
        [
          {
            text: "Speak privately with the absent member about what's wrong",
            shortTerm: "They reveal a family crisis you didn't know about.",
            longTerm: "Trust increases and they contribute as much as possible.",
            score: 3
          },
          {
            text: "Report them to the teacher immediately",
            shortTerm: "The teacher investigates but disrupts the group.",
            longTerm: "Resentment develops and the final product suffers.",
            score: 1
          },
          {
            text: "Carry on without them to protect the grade",
            shortTerm: "Work progresses but unfairness grows.",
            longTerm: "A rift forms that persists beyond the project.",
            score: 2
          }
        ],
        [
          {
            text: "Negotiate a reduced but genuine contribution they can manage",
            shortTerm: "They complete a small section with real effort.",
            longTerm: "Everyone feels fairly treated and group cohesion improves.",
            score: 3
          },
          {
            text: "Give them a token task that doesn't affect quality",
            shortTerm: "They sense the sidelining and withdraw.",
            longTerm: "They stop engaging with group work altogether.",
            score: 1
          },
          {
            text: "Let them choose their own task freely",
            shortTerm: "Some ambiguity remains about expectations.",
            longTerm: "Mixed results depending on their choice.",
            score: 2
          }
        ],
        [
          {
            text: "Present the group as a united team",
            shortTerm: "Submission goes smoothly and fairly.",
            longTerm: "Group emerges more cohesive and empathetic.",
            score: 3
          },
          {
            text: "Note individually who contributed what",
            shortTerm: "Accurate but creates division.",
            longTerm: "The struggling member is further stigmatised.",
            score: 2
          },
          {
            text: "Ask the teacher to reassign the group",
            shortTerm: "Disruption at a critical stage.",
            longTerm: "All suffer from the reassignment delay.",
            score: 1
          }
        ]
      ],
      bestPath: [0, 0, 0],
      bestOutcome: "You led with empathy, adapted to circumstances, and kept the team intact. A stronger result for everyone.",
      poorOutcome: "Prioritizing grades over people fractured the group and failed the struggling member when they needed support."
    }
  ],
  3: [
    {
      title: "The Whistleblower",
      opening: "You discover that a trusted colleague has been falsifying safety data. If reported, the project gets cancelled, many jobs are lost, and your career suffers. If ignored, a dangerous product reaches the public.",
      choices: [
        [
          {
            text: "Gather all the evidence carefully before acting",
            shortTerm: "You have an airtight case and protect yourself legally.",
            longTerm: "The report carries maximum credibility and impact.",
            score: 3
          },
          {
            text: "Confront the colleague directly",
            shortTerm: "They deny everything and begin covering tracks.",
            longTerm: "Evidence disappears and the situation worsens.",
            score: 1
          },
          {
            text: "Speak informally to your manager first",
            shortTerm: "The manager is conflicted and asks you to wait.",
            longTerm: "Delay allows harm to accumulate.",
            score: 2
          }
        ],
        [
          {
            text: "Report to the regulatory authority with your evidence",
            shortTerm: "Investigation begins promptly and officially.",
            longTerm: "Public safety is protected and your integrity is established.",
            score: 3
          },
          {
            text: "Report anonymously through an internal hotline",
            shortTerm: "Investigation starts but lacks your evidence.",
            longTerm: "Outcome is uncertain and may not be fully effective.",
            score: 2
          },
          {
            text: "Consult a lawyer about personal risk only",
            shortTerm: "Your legal protection improves.",
            longTerm: "You protect yourself but delay the public good.",
            score: 1
          }
        ],
        [
          {
            text: "Cooperate fully with investigators and accept the consequences",
            shortTerm: "Short-term career disruption occurs.",
            longTerm: "You are vindicated; the product is recalled; lives saved.",
            score: 3
          },
          {
            text: "Minimise your role to reduce personal impact",
            shortTerm: "Reduced exposure initially.",
            longTerm: "Incomplete investigation leaves gaps.",
            score: 2
          },
          {
            text: "Distance yourself from the outcome",
            shortTerm: "You feel safe temporarily.",
            longTerm: "Moral cost compounds over time.",
            score: 1
          }
        ]
      ],
      bestPath: [0, 0, 0],
      bestOutcome: "You gathered evidence, reported properly, and cooperated fully. A difficult but ethically sound path that protects public safety.",
      poorOutcome: "Prioritizing personal safety over public welfare allowed preventable harm and eroded your own integrity."
    }
  ]
};
function PlotArchitect({ config, onGameEnd }) {
  const story = STORIES[config.difficulty][0];
  const [phase, setPhase] = reactExports.useState("idle");
  const [order, setOrder] = reactExports.useState(
    () => story.paragraphs.map((_, i) => i).sort(() => Math.random() - 0.5)
  );
  const [stageSelections, setStageSelections] = reactExports.useState(
    new Array(5).fill(null)
  );
  const [stageIdx, setStageIdx] = reactExports.useState(0);
  const [connIdx, setConnIdx] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(null);
  const [orderScore, setOrderScore] = reactExports.useState(0);
  const startTime = reactExports.useRef(Date.now());
  const gameOver = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  scoreRef.current = score;
  const endGame = reactExports.useCallback(
    (done) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc = total > 0 ? correct / total * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1e3),
          done
        )
      );
    },
    [config, correct, total, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  function moveUp(i) {
    if (i === 0) return;
    const o = [...order];
    [o[i], o[i - 1]] = [o[i - 1], o[i]];
    setOrder(o);
  }
  function moveDown(i) {
    if (i === order.length - 1) return;
    const o = [...order];
    [o[i], o[i + 1]] = [o[i + 1], o[i]];
    setOrder(o);
  }
  function submitOrder() {
    let pts = 0;
    let c = 0;
    order.forEach((paraIdx, position) => {
      if (paraIdx === story.correctOrder[position]) {
        pts += 200 * config.difficulty;
        c++;
      }
    });
    setTotal((t) => t + 5);
    setCorrect((cr) => cr + c);
    setScore((s) => s + pts);
    setOrderScore(pts);
    setPhase("stages");
  }
  function handleStageSelect(stage) {
    if (feedback) return;
    const isCorrect = stage === story.stages[stageIdx];
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 150 * config.difficulty);
    }
    const newSel = [...stageSelections];
    newSel[stageIdx] = stage;
    setStageSelections(newSel);
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      if (stageIdx + 1 >= 5) setPhase("connectives");
      else setStageIdx((i) => i + 1);
    }, 1500);
  }
  function handleConnective(opt) {
    if (feedback) return;
    const key = `transition_${connIdx + 1}`;
    const isCorrect = opt === story.transitions[key].answer;
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 200 * config.difficulty);
    }
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      if (connIdx + 1 >= 3) endGame(true);
      else setConnIdx((i) => i + 1);
    }, 1500);
  }
  const STAGES = [
    "exposition",
    "rising_action",
    "climax",
    "falling_action",
    "resolution"
  ];
  const timePct = timeLeft / config.timeLimit * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "story_builder.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-[#f59e0b]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#00f5ff] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground", children: [
            timeLeft,
            "s"
          ] })
        ] }),
        phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-14 w-14 mx-auto mb-4 text-[#f59e0b]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Plot Architect"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Arrange scrambled paragraphs, identify narrative stages, and select transition words." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => setPhase("order"),
                  "data-ocid": "story_builder.start_button",
                  children: "Begin Building"
                }
              )
            ]
          }
        ) }),
        phase === "order" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Arrange paragraphs for:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f59e0b] font-bold", children: story.title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 flex-1 overflow-y-auto", children: order.map((paraIdx, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              layout: true,
              className: "glass-card rounded-xl p-3 border border-border/40 flex items-start gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => moveUp(i),
                      disabled: i === 0,
                      className: "p-1 rounded hover:bg-muted disabled:opacity-30",
                      "data-ocid": `story_builder.move_up.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-3 w-3" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => moveDown(i),
                      disabled: i === order.length - 1,
                      className: "p-1 rounded hover:bg-muted disabled:opacity-30",
                      "data-ocid": `story_builder.move_down.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-3 w-3" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground mb-1 block", children: [
                    "Position ",
                    i + 1
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: story.paragraphs[paraIdx] })
                ] })
              ]
            },
            paraIdx
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlowButton,
            {
              variant: "primary",
              onClick: submitOrder,
              "data-ocid": "story_builder.submit_order_button",
              children: "Confirm Order"
            }
          )
        ] }),
        phase === "stages" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Order score:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f59e0b] font-bold", children: [
              orderScore,
              " pts"
            ] }),
            " — now identify narrative stages"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 40 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -40 },
              className: "glass-card rounded-2xl p-6 neon-top-border flex-1 flex flex-col gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: [
                  "Stage ",
                  stageIdx + 1,
                  " of 5"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed border-l-2 border-[#f59e0b] pl-3", children: story.paragraphs[story.correctOrder[stageIdx]] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "What narrative stage is this?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: STAGES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    disabled: !!feedback,
                    onClick: () => handleStageSelect(s),
                    className: `px-3 py-2 rounded-xl border text-sm font-semibold transition-all text-left ${feedback && s === story.stages[stageIdx] ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:bg-muted text-foreground"}`,
                    "data-ocid": `story_builder.stage.${s}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "inline-block w-2 h-2 rounded-full mr-2",
                          style: { background: STAGE_COLORS[s] }
                        }
                      ),
                      s.replace("_", " ").toUpperCase()
                    ]
                  },
                  s
                )) }),
                feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `flex items-center gap-2 text-sm ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                    children: [
                      feedback === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
                      feedback === "correct" ? "Correct narrative stage!" : `Incorrect. This is ${story.stages[stageIdx].replace("_", " ")}`
                    ]
                  }
                )
              ]
            },
            stageIdx
          ) })
        ] }),
        phase === "connectives" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Final phase: select the correct transition words" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 40 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -40 },
              className: "glass-card rounded-2xl p-6 neon-top-border flex-1 flex flex-col gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: [
                  "Transition ",
                  connIdx + 1,
                  " of 3"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: story.transitions[`transition_${connIdx + 1}`].question }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: story.transitions[`transition_${connIdx + 1}`].options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    disabled: !!feedback,
                    onClick: () => handleConnective(opt),
                    className: `px-4 py-3 rounded-xl border text-sm font-bold transition-all ${feedback && opt === story.transitions[`transition_${connIdx + 1}`].answer ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/40 bg-card hover:border-[#7c3aed]/60 text-foreground"}`,
                    "data-ocid": `story_builder.connective.${i + 1}`,
                    children: opt
                  },
                  i
                )) }),
                feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `flex items-center gap-2 text-sm ${feedback === "correct" ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                    children: [
                      feedback === "correct" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
                      feedback === "correct" ? "Excellent connective choice!" : `Incorrect. Best: "${story.transitions[`transition_${connIdx + 1}`].answer}"`
                    ]
                  }
                )
              ]
            },
            connIdx
          ) })
        ] })
      ]
    }
  );
}
function CharacterCreator({ config, onGameEnd }) {
  const pool = CHARACTERS[config.difficulty];
  const [started, setStarted] = reactExports.useState(false);
  const [idx, setIdx] = reactExports.useState(0);
  const [phase, setPhase] = reactExports.useState("trait");
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const [feedback, setFeedback] = reactExports.useState(
    null
  );
  const startTime = reactExports.useRef(Date.now());
  const gameOver = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  const endGame = reactExports.useCallback(
    (done) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1e3),
          done
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = timeLeft / config.timeLimit * 100;
  const item = pool[idx];
  function handleAnswer(opt) {
    if (feedback || !item) return;
    let correct_val = "";
    let label = "";
    if (phase === "trait") {
      correct_val = item.trait;
      label = "Trait";
    } else if (phase === "motivation") {
      correct_val = item.motivation;
      label = "Motivation";
    } else {
      correct_val = item.flaw;
      label = "Flaw";
    }
    const ok = opt === correct_val;
    setTotal((t) => t + 1);
    if (ok) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 150 * config.difficulty);
    }
    setFeedback({
      ok,
      msg: ok ? `Correct ${label}! ${item.name}'s ${label.toLowerCase()} is indeed: ${correct_val}` : `Wrong. ${item.name}'s ${label.toLowerCase()} is: ${correct_val}`
    });
    setTimeout(() => {
      setFeedback(null);
      if (phase === "trait") setPhase("motivation");
      else if (phase === "motivation") setPhase("flaw");
      else {
        setPhase("trait");
        if (idx + 1 >= pool.length) endGame(true);
        else setIdx((i) => i + 1);
      }
    }, 2e3);
  }
  const currentOptions = phase === "trait" ? item == null ? void 0 : item.traitOptions : phase === "motivation" ? item == null ? void 0 : item.motivationOptions : item == null ? void 0 : item.flawOptions;
  const phaseColors = {
    trait: "#00f5ff",
    motivation: "#f59e0b",
    flaw: "#f43f5e"
  };
  if (!started) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "story_builder.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Character Creator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "A character is described in 3-4 sentences. Identify their core Trait, Motivation, and Flaw." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Real character analysis — no trick options." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    setStarted(true);
                    startTime.current = Date.now();
                  },
                  "data-ocid": "story_builder.start_button",
                  children: "Analyse Characters"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "story_builder.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full transition-all duration-1000",
              style: { width: `${timePct}%`, background: phaseColors[phase] }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground", children: [
            idx + 1,
            "/",
            pool.length,
            " — ",
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
            className: "flex-1 flex flex-col gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-5 neon-top-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-xs uppercase tracking-widest mb-2",
                    style: { color: phaseColors[phase] },
                    children: [
                      item == null ? void 0 : item.name,
                      " — identify the ",
                      phase.toUpperCase()
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: item == null ? void 0 : item.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: currentOptions == null ? void 0 : currentOptions.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: !!feedback,
                  onClick: () => handleAnswer(opt),
                  className: `px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-left ${feedback ? opt === (phase === "trait" ? item.trait : phase === "motivation" ? item.motivation : item.flaw) ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]" : "border-border/20 text-muted-foreground" : "border-border/40 bg-card hover:bg-muted text-foreground"}`,
                  "data-ocid": `story_builder.char_option.${i + 1}`,
                  children: opt
                },
                i
              )) }),
              feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  className: `p-4 rounded-xl border flex items-start gap-3 ${feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f43f5e]/40 bg-[#f43f5e]/10"}`,
                  children: [
                    feedback.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-[#10b981] shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-[#f43f5e] shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: `text-sm ${feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                        children: feedback.msg
                      }
                    )
                  ]
                }
              )
            ]
          },
          `${idx}-${phase}`
        ) })
      ]
    }
  );
}
function StoryContinuer({ config, onGameEnd }) {
  const pool = BRANCH_STORIES[config.difficulty];
  const [started, setStarted] = reactExports.useState(false);
  const [storyIdx, setStoryIdx] = reactExports.useState(0);
  const [choicePhase, setChoicePhase] = reactExports.useState(0);
  const [scores, setScores] = reactExports.useState([0, 0, 0]);
  const [chosen, setChosen] = reactExports.useState([null, null, null]);
  const [totalScore, setTotalScore] = reactExports.useState(0);
  const [showConsequence, setShowConsequence] = reactExports.useState(null);
  const startTime = reactExports.useRef(Date.now());
  const gameOver = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(totalScore);
  scoreRef.current = totalScore;
  const endGame = reactExports.useCallback(
    (done) => {
      if (gameOver.current) return;
      gameOver.current = true;
      const finalScore = scores.reduce((a, b) => a + b, 0);
      const acc = finalScore / (3 * 3) * 100;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTime.current) / 1e3),
          done
        )
      );
    },
    [config, scores, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = timeLeft / config.timeLimit * 100;
  const story = pool[storyIdx];
  function handleChoice(choiceIdx) {
    if (showConsequence) return;
    const choice = story.choices[choicePhase][choiceIdx];
    const newChosen = [...chosen];
    newChosen[choicePhase] = choiceIdx;
    setChosen(newChosen);
    const newScores = [...scores];
    newScores[choicePhase] = choice.score;
    setScores(newScores);
    const pts = choice.score * 100 * config.difficulty;
    setTotalScore((s) => s + pts);
    setShowConsequence({
      short: choice.shortTerm,
      long: choice.longTerm,
      score: choice.score
    });
    setTimeout(() => {
      setShowConsequence(null);
      if (choicePhase + 1 >= 3) {
        setTimeout(() => {
          if (storyIdx + 1 >= pool.length) endGame(true);
          else {
            setStoryIdx((i) => i + 1);
            setChoicePhase(0);
            setScores([0, 0, 0]);
            setChosen([null, null, null]);
          }
        }, 2e3);
      } else setChoicePhase((p) => p + 1);
    }, 3e3);
  }
  const isBestPath = chosen.every(
    (c, i) => c === story.bestPath[i]
  );
  if (!started) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        "data-ocid": "story_builder.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: "glass-card rounded-2xl p-10 text-center max-w-lg w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-14 w-14 mx-auto mb-4 text-[#f43f5e]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-3xl font-black glow-cyan-text mb-2",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: "Story Continuer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "A story opening is shown. Make 3 choices that shape the narrative. Each choice has short-term and long-term consequences." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Aim for the best possible outcome across all three decisions." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "lg",
                  onClick: () => {
                    setStarted(true);
                    startTime.current = Date.now();
                  },
                  "data-ocid": "story_builder.start_button",
                  children: "Begin Story"
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3",
      "data-ocid": "story_builder.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: totalScore.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-2 w-8 rounded-full transition-all ${i < choicePhase ? "bg-[#10b981]" : i === choicePhase ? "bg-[#f59e0b]" : "bg-muted"}`
            },
            i
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[#f43f5e] transition-all duration-1000",
              style: { width: `${timePct}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -40 },
            className: "flex-1 flex flex-col gap-4",
            children: [
              choicePhase === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#f43f5e]/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-[#f43f5e] mb-2", children: story.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: story.opening })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground", children: [
                "Decision ",
                choicePhase + 1,
                " of 3: What do you do?"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: story.choices[choicePhase].map((choice, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: !!showConsequence,
                  onClick: () => handleChoice(i),
                  className: `text-left px-4 py-3 rounded-xl border text-sm transition-all ${chosen[choicePhase] === i ? scores[choicePhase] === 3 ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : scores[choicePhase] === 2 ? "border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b]" : "border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e]" : "border-border/40 bg-card hover:border-[#f43f5e]/40 text-foreground"}`,
                  "data-ocid": `story_builder.choice.${i + 1}`,
                  children: choice.text
                },
                i
              )) }),
              showConsequence && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  className: "glass-card rounded-xl p-4 border border-[#f59e0b]/30 bg-[#f59e0b]/5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-[#f59e0b] mb-2", children: "Consequences" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#00f5ff] font-bold", children: "Short-term: " }),
                      showConsequence.short
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#7c3aed] font-bold", children: "Long-term: " }),
                      showConsequence.long
                    ] })
                  ]
                }
              ),
              choicePhase === 2 && chosen[2] !== null && !showConsequence && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: `p-4 rounded-xl border ${isBestPath ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f59e0b]/40 bg-[#f59e0b]/10"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: `text-sm font-bold mb-1 ${isBestPath ? "text-[#10b981]" : "text-[#f59e0b]"}`,
                        children: isBestPath ? "Optimal Path!" : "Good effort"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: isBestPath ? story.bestOutcome : story.poorOutcome })
                  ]
                }
              )
            ]
          },
          `${storyIdx}-${choicePhase}`
        ) })
      ]
    }
  );
}
function StoryBuilder({ config, onGameEnd }) {
  if (config.gameId === "character-creator")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CharacterCreator, { config, onGameEnd });
  if (config.gameId === "story-continuer")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(StoryContinuer, { config, onGameEnd });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PlotArchitect, { config, onGameEnd });
}
export {
  StoryBuilder as default
};
