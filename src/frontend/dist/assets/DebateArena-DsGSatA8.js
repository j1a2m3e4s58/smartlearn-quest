import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, G as GlowButton, n as AnimatePresence, k as Shield } from "./index-bdQaMNSA.js";
import { b as buildResult, u as useGameTimer } from "./GameEngine-aM6bVHjI.js";
import { M as Mic } from "./mic-QB2xxd_J.js";
import { H as Heart } from "./heart-BzPlSO6g.js";
import { C as CircleCheckBig } from "./circle-check-big-Ctqehkuj.js";
import { C as CircleX } from "./circle-x-HpfU5D7p.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z", key: "7g6ntu" }],
  ["path", { d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z", key: "ijws7r" }],
  ["path", { d: "M7 21h10", key: "1b0cd5" }],
  ["path", { d: "M12 3v18", key: "108xh3" }],
  ["path", { d: "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2", key: "3gwbw2" }]
];
const Scale = createLucideIcon("scale", __iconNode);
const MOTIONS = [
  {
    id: "m1",
    motion: "Schools should ban social media from campus networks.",
    forArguments: [
      {
        text: "Social media distracts students, reducing academic performance by an average of 23% in studies.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Cyberbullying incidents drop significantly when schools restrict social media access.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Schools have a duty of care to protect students from addictive technology.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Everyone uses social media so it must be bad — that proves it.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "My friend got bullied once, so all social media is dangerous forever.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "Social media is sometimes distracting.",
        weight: 30,
        type: "weak"
      },
      {
        text: "Banning it would make students less happy.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "Digital literacy is better taught through guided, monitored access rather than blanket bans.",
        weight: -50,
        type: "fallacy"
      }
    ],
    againstArguments: [
      {
        text: "Blanket bans teach students nothing about responsible digital citizenship.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Social media is a vital tool for collaborative learning and group projects.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Restricting access on campus pushes usage to unmonitored home environments.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Everything can be distracting — should we ban books too? That proves my point.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "My cousin uses social media and got good grades, so it cannot be harmful.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "Banning social media is bad because it is popular.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "Some students use social media responsibly.",
        weight: 30,
        type: "weak"
      },
      {
        text: "Free speech means students should use whatever they want.",
        weight: -50,
        type: "fallacy"
      }
    ],
    opponentFor: [
      {
        text: "Research in 15 countries shows unrestricted campus social media correlates with a 31% drop in attentiveness.",
        weight: 110,
        type: "valid"
      },
      {
        text: "Responsible use requires maturity that adolescents are still developing.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Several high-performing school systems in Asia have implemented bans with measurable academic gains.",
        weight: 100,
        type: "valid"
      }
    ],
    opponentAgainst: [
      {
        text: "Controlled digital environments with teaching guides are more effective than prohibition.",
        weight: 110,
        type: "valid"
      },
      {
        text: "Students who learn self-regulation in school outperform peers on university digital assessments.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Communication, critical evaluation, and media literacy require practice with real platforms.",
        weight: 100,
        type: "valid"
      }
    ],
    rebuttals: [
      {
        text: "The evidence cited ignores schools with structured digital programmes that outperform ban-based systems.",
        weight: 80
      },
      {
        text: "Correlation does not establish causation — poor performance may stem from underlying disengagement, not the platform.",
        weight: 80
      },
      {
        text: "The proposal conflates access and addiction, overlooking that moderated use builds healthy habits.",
        weight: 80
      },
      {
        text: "Their argument relies on anecdote rather than longitudinal data across diverse school populations.",
        weight: 80
      },
      {
        text: "That point concedes our core claim while repackaging it — enforcement remains the unaddressed variable.",
        weight: 80
      }
    ]
  },
  {
    id: "m2",
    motion: "Artificial intelligence will do more harm than good to the workforce.",
    forArguments: [
      {
        text: "AI automation has already displaced over 1.4 million manufacturing jobs in the past decade.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Wage stagnation in mid-skill roles directly correlates with AI adoption in logistics and data entry.",
        weight: 100,
        type: "valid"
      },
      {
        text: "AI decision-making in hiring perpetuates historical biases encoded in training data.",
        weight: 100,
        type: "valid"
      },
      {
        text: "AI is new technology, so it will definitely destroy everything like past technologies did.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "Computers were invented by humans so AI must be safe and helpful always.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "AI sometimes makes mistakes at work.",
        weight: 30,
        type: "weak"
      },
      {
        text: "Rich tech companies support AI, which proves it harms workers.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "My uncle lost his job to automation, so all AI harms all workers.",
        weight: -50,
        type: "fallacy"
      }
    ],
    againstArguments: [
      {
        text: "Every major technological revolution — printing press, electricity, internet — created more jobs than it eliminated over time.",
        weight: 100,
        type: "valid"
      },
      {
        text: "AI removes repetitive, hazardous tasks, freeing workers for higher-value creative and strategic roles.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Healthcare AI is already detecting cancers missed by human radiologists, saving thousands of lives annually.",
        weight: 100,
        type: "valid"
      },
      {
        text: "AI is fast so it must be better than humans at everything — that is obvious.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "If you oppose AI you are just afraid of progress, which proves you are wrong.",
        weight: -50,
        type: "fallacy"
      },
      { text: "Some jobs created by AI pay well.", weight: 30, type: "weak" },
      {
        text: "AI is used in hospitals, therefore it benefits all workers in all sectors.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "The economy grew after the internet, so AI will definitely make everything better.",
        weight: -50,
        type: "fallacy"
      }
    ],
    opponentFor: [
      {
        text: "Reskilling programmes have a 34% completion rate — most displaced workers never recover equivalent incomes.",
        weight: 110,
        type: "valid"
      },
      {
        text: "New AI-created roles require a decade of education most current workers cannot access mid-career.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Transition periods impose severe human costs even if long-term outcomes improve for some.",
        weight: 100,
        type: "valid"
      }
    ],
    opponentAgainst: [
      {
        text: "Nations with proactive AI-reskilling investment show net employment growth within five years of adoption.",
        weight: 110,
        type: "valid"
      },
      {
        text: "AI productivity gains fund the social programmes needed to support workforce transitions.",
        weight: 100,
        type: "valid"
      },
      {
        text: "The question is policy design, not technology itself — well-governed AI demonstrably benefits workers.",
        weight: 100,
        type: "valid"
      }
    ],
    rebuttals: [
      {
        text: "Transition benefits the economy in aggregate but distributes harm unevenly across low-income workers.",
        weight: 80
      },
      {
        text: "Historical analogies ignore the pace and breadth of current AI displacement, which is unprecedented.",
        weight: 80
      },
      {
        text: "The argument conflates productivity gains for firms with improved outcomes for individual workers.",
        weight: 80
      },
      {
        text: "Their reskilling evidence draws from small pilot programmes not representative of national labour markets.",
        weight: 80
      },
      {
        text: "Healthcare AI benefits patients, not workers — the claim switches subjects without acknowledging it.",
        weight: 80
      }
    ]
  },
  {
    id: "m3",
    motion: "Examinations are a poor measure of student ability and should be replaced.",
    forArguments: [
      {
        text: "Timed exams systematically disadvantage students with test anxiety, ADHD, and language barriers.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Rote memorisation required for exams does not reflect critical thinking or real-world competence.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Portfolio-based assessment captures growth, creativity, and process — skills employers value most.",
        weight: 100,
        type: "valid"
      },
      {
        text: "My friend failed exams but is successful, which proves exams are meaningless.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "Exams cause stress, and stress is always bad, so exams must be abolished.",
        weight: -50,
        type: "fallacy"
      },
      { text: "Some students find exams unfair.", weight: 30, type: "weak" },
      {
        text: "Countries that use fewer exams must be smarter because they do things differently.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "Exams were invented long ago so they cannot work today.",
        weight: -50,
        type: "fallacy"
      }
    ],
    againstArguments: [
      {
        text: "Standardised examinations provide objective, comparable benchmarks across schools and socioeconomic backgrounds.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Under-pressure performance is a genuine workplace skill — timed assessments measure it validly.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Portfolio and continuous assessment are vulnerable to teacher bias and resource inequalities.",
        weight: 100,
        type: "valid"
      },
      {
        text: "The best students all like exams, which proves exams are the best system.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "Replacing exams is a radical idea, and radical ideas always fail.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "Exams have worked for a long time in many countries.",
        weight: 30,
        type: "weak"
      },
      {
        text: "Since examinations exist in every major economy, they must be working correctly.",
        weight: -50,
        type: "fallacy"
      },
      {
        text: "Students who oppose exams just want to avoid hard work.",
        weight: -50,
        type: "fallacy"
      }
    ],
    opponentFor: [
      {
        text: "Finland and Singapore both reduced high-stakes exams and now lead global learning outcome rankings.",
        weight: 110,
        type: "valid"
      },
      {
        text: "Neuroscience shows chronic exam stress impairs the hippocampal memory consolidation exams purport to test.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Continuous assessment used in professional accreditation predicts long-term performance better than single exams.",
        weight: 100,
        type: "valid"
      }
    ],
    opponentAgainst: [
      {
        text: "Robust moderation frameworks remove subjectivity concerns from portfolio systems at scale.",
        weight: 110,
        type: "valid"
      },
      {
        text: "Exam reform need not mean abolition — calibrated, low-stakes formative exams retain benefits without harm.",
        weight: 100,
        type: "valid"
      },
      {
        text: "Without standardised benchmarks, education systems cannot identify and resource struggling schools equitably.",
        weight: 100,
        type: "valid"
      }
    ],
    rebuttals: [
      {
        text: "Standardisation advantages certain demographics — it does not neutralise socioeconomic inequality, it encodes it.",
        weight: 80
      },
      {
        text: "The workplace skill argument applies to deadlines and pressure, not artificial single-session memory recall.",
        weight: 80
      },
      {
        text: "Portfolio bias can be addressed through blind marking and inter-rater reliability protocols.",
        weight: 80
      },
      {
        text: "The objectivity claim assumes all students have equal access to quality teaching — they do not.",
        weight: 80
      },
      {
        text: "Their defence concedes the need for reform while arguing for the status quo under a different label.",
        weight: 80
      }
    ]
  }
];
const EVIDENCE_CLAIMS = [
  {
    claim: "Eating chocolate every day improves memory and cognitive function.",
    sources: [
      {
        label: "A blogger writes: 'I eat chocolate daily and my memory is amazing!'",
        type: "Personal Opinion Blog",
        correctRank: 4,
        explanation: "Anecdotal — single person, no controls, no data."
      },
      {
        label: "BBC Health News reports on a study linking flavonoids to brain health.",
        type: "News Article",
        correctRank: 2,
        explanation: "Credible outlet but secondary — reports on research, not the source."
      },
      {
        label: "A peer-reviewed study in Nature Neuroscience: RCT, 200 participants, 12 weeks.",
        type: "Peer-Reviewed Study",
        correctRank: 1,
        explanation: "Primary research, rigorous methodology, expert-reviewed."
      },
      {
        label: "A Facebook post: '5 foods that boost your brain — chocolate is #1!'",
        type: "Social Media Post",
        correctRank: 3,
        explanation: "No author credentials, no methodology, often clickbait."
      }
    ]
  },
  {
    claim: "Getting 8 hours of sleep per night significantly improves academic performance.",
    sources: [
      {
        label: "A student tweets: 'I slept 8 hours and got an A — sleep works!'",
        type: "Social Media Post",
        correctRank: 3,
        explanation: "Anecdotal with no generalizable data."
      },
      {
        label: "A meta-analysis in Sleep Medicine Reviews covering 32 studies on adolescent sleep and grades.",
        type: "Peer-Reviewed Study",
        correctRank: 1,
        explanation: "Meta-analysis aggregates multiple studies — highest evidence level."
      },
      {
        label: "A personal blog: 'How I fixed my grades by sleeping more'",
        type: "Personal Opinion Blog",
        correctRank: 4,
        explanation: "Subjective, unverified, could have confounding factors."
      },
      {
        label: "CNN Health: 'Teens who sleep more do better in school, researchers find'",
        type: "News Article",
        correctRank: 2,
        explanation: "Reports on research accurately but is secondary source."
      }
    ]
  },
  {
    claim: "Regular physical exercise reduces symptoms of depression.",
    sources: [
      {
        label: "Instagram post by a fitness influencer: 'Exercise cured my depression!'",
        type: "Social Media Post",
        correctRank: 3,
        explanation: "Personal testimony with no data, highly variable."
      },
      {
        label: "A randomised controlled trial in JAMA Psychiatry: 300 participants, 16 weeks exercise intervention.",
        type: "Peer-Reviewed Study",
        correctRank: 1,
        explanation: "RCT is the gold standard for establishing cause-effect."
      },
      {
        label: "NHS News: 'Study shows exercise helps depression — but isn't a replacement for therapy'",
        type: "News Article",
        correctRank: 2,
        explanation: "Credible secondary report with important context."
      },
      {
        label: "Personal blog: 'I stopped my medication and started running — I feel fine now'",
        type: "Personal Opinion Blog",
        correctRank: 4,
        explanation: "Dangerous misinformation risk — no clinical grounding."
      }
    ]
  },
  {
    claim: "Screen time before bed negatively affects sleep quality in teenagers.",
    sources: [
      {
        label: "A TikTok video: 'I stopped using my phone before bed and now I sleep perfectly'",
        type: "Social Media Post",
        correctRank: 3,
        explanation: "One person's experience — no controlled variables."
      },
      {
        label: "A peer-reviewed paper in Pediatrics journal: polysomnography data on 180 teenagers.",
        type: "Peer-Reviewed Study",
        correctRank: 1,
        explanation: "Objective sleep measurement, peer-reviewed, strong methodology."
      },
      {
        label: "Personal blog: 'Why I banned my kids from phones — and why you should too'",
        type: "Personal Opinion Blog",
        correctRank: 4,
        explanation: "Opinion piece, may have confirmation bias, no data cited."
      },
      {
        label: "Guardian article citing a new study on blue light and melatonin suppression.",
        type: "News Article",
        correctRank: 2,
        explanation: "Quality journalism with sourced research — useful but secondary."
      }
    ]
  },
  {
    claim: "Learning a second language in childhood improves problem-solving abilities.",
    sources: [
      {
        label: "A Facebook group post: 'My bilingual child is so much smarter than his classmates!'",
        type: "Social Media Post",
        correctRank: 3,
        explanation: "Biased parental observation with no controls."
      },
      {
        label: "A longitudinal study in Developmental Psychology tracking 400 bilingual children over 6 years.",
        type: "Peer-Reviewed Study",
        correctRank: 1,
        explanation: "Longitudinal design controls for developmental changes — highly credible."
      },
      {
        label: "Personal blog: 'I raised my kids bilingual — here is what I noticed'",
        type: "Personal Opinion Blog",
        correctRank: 4,
        explanation: "Anecdotal parenting experience, not scientific evidence."
      },
      {
        label: "The Atlantic: 'The bilingual advantage — what the science actually says'",
        type: "News Article",
        correctRank: 2,
        explanation: "Quality reporting that engages with the research — secondary but informed."
      }
    ]
  },
  {
    claim: "Reducing meat consumption lowers an individual's carbon footprint significantly.",
    sources: [
      {
        label: "A vegan YouTube channel: 'Going vegan HALVED my carbon footprint in 30 days!'",
        type: "Social Media Post",
        correctRank: 3,
        explanation: "Unverified personal claim with ideological framing."
      },
      {
        label: "A life cycle analysis published in Nature Food comparing dietary patterns across 54,000 people.",
        type: "Peer-Reviewed Study",
        correctRank: 1,
        explanation: "Large-scale LCA is the appropriate methodology for this claim."
      },
      {
        label: "A blog post by a nutritionist: 'Why I tell all my clients to eat less meat'",
        type: "Personal Opinion Blog",
        correctRank: 4,
        explanation: "Professional opinion but not peer-reviewed research."
      },
      {
        label: "BBC Future: 'What is the best diet for the environment? Scientists weigh in'",
        type: "News Article",
        correctRank: 2,
        explanation: "Well-researched journalism covering multiple scientific perspectives."
      }
    ]
  },
  {
    claim: "Higher minimum wage reduces poverty without significantly increasing unemployment.",
    sources: [
      {
        label: "A tweet by an economist: 'Minimum wage hikes always cause unemployment. Basic economics!'",
        type: "Social Media Post",
        correctRank: 3,
        explanation: "Expert Twitter opinions lack citation — oversimplified claim."
      },
      {
        label: "A working paper by economists at UC Berkeley examining employment data across 290 US counties.",
        type: "Peer-Reviewed Study",
        correctRank: 1,
        explanation: "Empirical analysis with controls for border regions — strong evidence."
      },
      {
        label: "Blog post: 'The minimum wage debate — my experience working at minimum wage'",
        type: "Personal Opinion Blog",
        correctRank: 4,
        explanation: "Personal experience cannot generalise to macroeconomic effects."
      },
      {
        label: "Reuters: 'New study challenges assumptions about minimum wage and employment'",
        type: "News Article",
        correctRank: 2,
        explanation: "References specific research, balanced framing."
      }
    ]
  },
  {
    claim: "Installing solar panels on homes reduces electricity bills over the long term.",
    sources: [
      {
        label: "Neighbour's Facebook post: 'Solar panels saved me GHS 400 last month — everyone should get them!'",
        type: "Social Media Post",
        correctRank: 3,
        explanation: "Single household, no mention of installation costs or climate zone."
      },
      {
        label: "An energy economics study in Applied Energy: 15-year payback analysis across 8 countries.",
        type: "Peer-Reviewed Study",
        correctRank: 1,
        explanation: "Long-term multi-country analysis addresses geographic and cost variables."
      },
      {
        label: "A solar company blog: 'Why solar panels are the best investment you can make'",
        type: "Personal Opinion Blog",
        correctRank: 4,
        explanation: "Commercial incentive — likely biased toward positive framing."
      },
      {
        label: "Financial Times: 'When do solar panels actually pay off? The numbers explained'",
        type: "News Article",
        correctRank: 2,
        explanation: "Quantitative journalism citing industry and academic data."
      }
    ]
  },
  {
    claim: "Video games improve spatial reasoning and reaction time in adolescents.",
    sources: [
      {
        label: "Gaming forum post: 'Gaming makes you smarter, studies prove it, I've been saying this for years!'",
        type: "Social Media Post",
        correctRank: 3,
        explanation: "Vague reference to 'studies' with no citations — confirmation bias."
      },
      {
        label: "A cognitive science meta-analysis in Psychological Bulletin covering 89 studies on gaming and cognition.",
        type: "Peer-Reviewed Study",
        correctRank: 1,
        explanation: "Meta-analysis of 89 studies provides very robust evidence."
      },
      {
        label: "A parent blog: 'I let my son game for a year — here's what happened to his grades'",
        type: "Personal Opinion Blog",
        correctRank: 4,
        explanation: "Single case study with many confounding variables."
      },
      {
        label: "Wired magazine: 'Video games and the brain — the science so far'",
        type: "News Article",
        correctRank: 2,
        explanation: "Well-researched technology journalism — secondary but credible."
      }
    ]
  },
  {
    claim: "Handwriting notes during lectures improves retention better than typing.",
    sources: [
      {
        label: "LinkedIn post: 'I switched to handwriting notes and became a top student. Trust me.'",
        type: "Social Media Post",
        correctRank: 3,
        explanation: "Testimonial — no controls, self-selection bias."
      },
      {
        label: "A study in Psychological Science: 327 university students, 3 experiments comparing note-taking methods.",
        type: "Peer-Reviewed Study",
        correctRank: 1,
        explanation: "Experimental design with replication — appropriate methodology."
      },
      {
        label: "A study skills blog: 'Why I always handwrite my notes and you should too'",
        type: "Personal Opinion Blog",
        correctRank: 4,
        explanation: "Preference dressed as advice, no empirical basis stated."
      },
      {
        label: "The Conversation: 'Should students take notes by hand or laptop? Researchers weigh in'",
        type: "News Article",
        correctRank: 2,
        explanation: "Academic-facing journalism with expert quotes and research citations."
      }
    ]
  }
];
const APPROACH_LABELS = {
  contradiction: "Direct Contradiction",
  superior_evidence: "Provide Superior Evidence",
  logical_flaw: "Expose Logical Flaw"
};
const ARGUMENT_SETS = [
  {
    motion: "School uniforms improve academic performance.",
    points: [
      {
        text: "Students who wear uniforms focus better because they are not distracted by fashion.",
        evidence: "A survey of 200 uniform-school teachers found 78% reported fewer fashion-related distractions.",
        counterOptions: [
          {
            text: "Teacher perception of distraction does not establish that uniform policy causes better grades.",
            isStrongest: true
          },
          {
            text: "Fashion is not really that distracting anyway.",
            isStrongest: false
          },
          {
            text: "Many students actually enjoy expressing themselves through fashion.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: uniforms cause more distraction through discomfort.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Cite superior evidence: academic performance data across uniform vs non-uniform schools shows no significant difference.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: fewer distractions observed by teachers does not prove grade improvement — many other variables affect academic performance.",
            isCorrect: true
          }
        ]
      },
      {
        text: "Uniforms reduce economic inequality because no student can show off expensive clothing.",
        evidence: "In schools without uniforms, 65% of low-income students reported feeling economically inferior due to clothing.",
        counterOptions: [
          {
            text: "Economic inequality manifests in many ways beyond clothing — school supplies, devices, transportation — which uniforms do not address.",
            isStrongest: true
          },
          {
            text: "Students still find ways to show off with accessories.",
            isStrongest: false
          },
          {
            text: "Some low-income students prefer to wear their own clothes.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: uniforms actually increase inequality because poor families must buy an additional clothing set.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present data: uniform costs disproportionately burden low-income families, with mandatory purchases averaging GHS 300 per student annually.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: uniforms address one visible signal of inequality while leaving root economic disparities (devices, nutrition, transport) entirely untouched.",
            isCorrect: true
          }
        ]
      },
      {
        text: "Countries with mandatory uniforms consistently outperform non-uniform countries in international tests.",
        evidence: "Japan and South Korea, both with strict uniform policies, rank in the top 5 in PISA scores.",
        counterOptions: [
          {
            text: "Japan and South Korea's high performance is driven by intensive academic culture, after-school tutoring systems, and parental involvement — not uniform policy.",
            isStrongest: true
          },
          {
            text: "Not all countries with uniforms do well in tests.",
            isStrongest: false
          },
          {
            text: "PISA tests don't measure everything important in education.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: some high-performing countries do not use uniforms — Finland for example.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present superior evidence: comparative education research controls for cultural and institutional factors that explain East Asian performance — uniform policy is not a predictor.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: this is a false correlation — the same countries have intensive study cultures, high teacher pay, and strong parental expectations which explain the results far more than uniform policy.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    motion: "Online learning is superior to classroom learning.",
    points: [
      {
        text: "Students can learn at their own pace online, which accommodates different learning styles.",
        evidence: "MOOC platforms show 42 million enrollments, suggesting huge demand for self-paced learning.",
        counterOptions: [
          {
            text: "High enrollment does not measure learning outcomes — MOOC completion rates average just 5-15%, indicating that self-paced flexibility often translates to abandonment, not mastery.",
            isStrongest: true
          },
          { text: "Some students prefer classrooms.", isStrongest: false },
          { text: "Online courses can be boring.", isStrongest: false }
        ],
        bestApproach: "superior_evidence",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: online learning imposes rigid schedules for live sessions.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present superior evidence: MOOC completion rate data (5-15%) shows that self-paced learning without external accountability structures leads to widespread non-completion.",
            isCorrect: true
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: enrollment measures interest, not learning — the evidence does not support the conclusion.",
            isCorrect: false
          }
        ]
      },
      {
        text: "Online learning removes geographical barriers, making education accessible to everyone globally.",
        evidence: "Coursera now serves learners in 190 countries.",
        counterOptions: [
          {
            text: "Access requires devices, stable internet, electricity, and quiet study space — the 37% of the global population without reliable internet access remain excluded from online learning entirely.",
            isStrongest: true
          },
          {
            text: "Not everyone speaks the language of online courses.",
            isStrongest: false
          },
          {
            text: "Online courses are sometimes too expensive.",
            isStrongest: false
          }
        ],
        bestApproach: "superior_evidence",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: online learning creates new barriers — technology and connectivity requirements.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present superior evidence: ITU data shows 37% of the world lacks reliable internet access, meaning online-only education systematically excludes the most disadvantaged populations.",
            isCorrect: true
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: operating in 190 countries does not mean reaching those who need education most within each country.",
            isCorrect: false
          }
        ]
      },
      {
        text: "Technology makes online learning more engaging through interactive content and simulations.",
        evidence: "EdTech tools like virtual labs have been shown to increase engagement scores by 30%.",
        counterOptions: [
          {
            text: "Engagement scores measure enjoyment and attention, not learning outcomes — a student can be highly engaged and still fail to retain or apply knowledge, making engagement metrics insufficient evidence for learning superiority.",
            isStrongest: true
          },
          {
            text: "Some students find technology frustrating.",
            isStrongest: false
          },
          {
            text: "Classroom teachers can also use technology.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: many students find screen-based learning fatiguing and less engaging than human interaction.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present superior evidence: meta-analysis shows no significant advantage in long-term knowledge retention between online interactive tools and traditional classroom instruction.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: engagement is not the same as learning — higher engagement scores do not prove superior educational outcomes, which are measured through retention, application, and long-term performance.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    motion: "Homework should be abolished in primary schools.",
    points: [
      {
        text: "Homework causes stress and anxiety in young children, damaging their mental health.",
        evidence: "A Stanford study found that 56% of students identified homework as a primary stressor.",
        counterOptions: [
          {
            text: "Stress caused by homework does not automatically mean homework should be abolished — productive challenge is a known component of skill development; the evidence establishes harm from excessive homework, not all homework.",
            isStrongest: true
          },
          {
            text: "Children experience stress from many other things.",
            isStrongest: false
          },
          {
            text: "Parents should help reduce homework stress.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: homework builds resilience and coping skills that benefit mental health long-term.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present evidence: research distinguishes between excessive homework and moderate homework — only excessive loads correlate with anxiety.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: this conflates moderate homework with excessive homework — the evidence addresses overload, not the existence of homework as a practice.",
            isCorrect: true
          }
        ]
      },
      {
        text: "Children need unstructured play time for healthy development, which homework eliminates.",
        evidence: "Child development research shows play is critical for cognitive and social development in ages 5-11.",
        counterOptions: [
          {
            text: "The research establishes the importance of play but does not establish that modest homework assignments eliminate adequate play time — the claim overstates the evidence by assuming a zero-sum relationship.",
            isStrongest: true
          },
          {
            text: "Children can do both homework and play.",
            isStrongest: false
          },
          {
            text: "Play time varies by family, not just school policy.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: structured activities including some homework can support cognitive development.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present evidence: time-use studies show children with moderate homework still average 2+ hours of play daily — well above developmental minimums.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: the evidence establishes that play matters, not that homework eliminates sufficient play — the connection between the two is assumed, not demonstrated.",
            isCorrect: true
          }
        ]
      },
      {
        text: "Countries with no homework policies, such as Finland, have higher academic achievement.",
        evidence: "Finland consistently ranks in the top 10 in PISA, despite assigning minimal homework.",
        counterOptions: [
          {
            text: "Finland's educational outcomes are attributable to highly selective and well-paid teacher training, a culture of reading, and low socioeconomic inequality — the absence of homework is one policy among dozens; isolating it as the causal factor is unsupported.",
            isStrongest: true
          },
          {
            text: "Finland is a small country so comparison is difficult.",
            isStrongest: false
          },
          {
            text: "Finnish students may get informal practice at home.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: South Korea, which assigns heavy homework, also performs very well in PISA.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present superior evidence: comparative education meta-analyses attribute Finland's success to teacher quality, equity policy, and reading culture rather than homework policy.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: Finland's result involves confounding variables across an entire national education system — selecting the no-homework policy as the cause without controlling for teacher quality, inequality, and culture is a false causal attribution.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    motion: "Governments should regulate fast food advertising targeting children.",
    points: [
      {
        text: "Children lack the cognitive ability to critically evaluate advertising, making them easy targets.",
        evidence: "Research shows children under 8 cannot distinguish advertising from editorial content.",
        counterOptions: [
          {
            text: "The inability to distinguish advertising from content applies to all advertising, not specifically fast food — if this justifies regulation, it would need to apply to all child-directed advertising, raising a scope problem the argument has not addressed.",
            isStrongest: true
          },
          {
            text: "Parents should teach children to identify advertising.",
            isStrongest: false
          },
          {
            text: "Not all children are the same — some are more media-savvy.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: children develop media literacy quickly with proper education.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present evidence: advertising literacy programmes effectively teach children to critically evaluate commercials by age 7.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: the principle established (children cannot evaluate ads) would logically require regulating all advertising to children, not just food — the conclusion is narrower than the premise warrants.",
            isCorrect: true
          }
        ]
      },
      {
        text: "Fast food advertising directly causes childhood obesity, a major public health crisis.",
        evidence: "Countries with high fast food advertising spend have higher childhood obesity rates.",
        counterOptions: [
          {
            text: "Correlation between advertising spend and obesity does not establish causation — both may be driven by underlying economic factors such as income levels, food deserts, and dietary culture, which also correlate with high fast food market penetration.",
            isStrongest: true
          },
          {
            text: "Many other factors cause childhood obesity too.",
            isStrongest: false
          },
          {
            text: "Children can choose healthy options even when seeing fast food ads.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: advertising promotes awareness, but purchase decisions are made by parents.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present evidence: experiments controlling for socioeconomic factors show advertising effects on food preference are modest and short-lived.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: correlation does not establish causation — countries with high advertising spend also have higher income inequality, more food deserts, and faster urbanisation, all of which independently predict obesity.",
            isCorrect: true
          }
        ]
      },
      {
        text: "Regulation works — countries that banned fast food ads to children saw measurable health improvements.",
        evidence: "The UK's 2007 ban on junk food advertising before 9pm led to reduced junk food preferences in children.",
        counterOptions: [
          {
            text: "The UK ban coincided with parallel school nutrition reforms, sugar taxes under consideration, and public health campaigns — attributing the entire change in child food preference to the advertising ban alone confounds multiple simultaneous interventions.",
            isStrongest: true
          },
          {
            text: "Other countries tried bans without seeing similar results.",
            isStrongest: false
          },
          {
            text: "Children still see fast food advertising online where regulations do not apply.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: online advertising has replaced TV advertising, eliminating the effectiveness of broadcast-only bans.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present evidence: a controlled analysis found that the UK advertising ban had a marginal independent effect when school meal reforms and tax discussions were controlled for.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: the UK policy was part of a multi-intervention package — attributing health improvements solely to the advertising ban ignores that sugar tax legislation, school meal reforms, and public campaigns were introduced simultaneously.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    motion: "Public transport should be made free for all citizens.",
    points: [
      {
        text: "Free public transport would reduce car usage and therefore lower carbon emissions significantly.",
        evidence: "In Tallinn, Estonia, free transit increased public transport ridership by 14%.",
        counterOptions: [
          {
            text: "A 14% ridership increase does not automatically mean a proportional emissions reduction — the source of new riders matters: if they switched from walking or cycling rather than from cars, emissions may not have changed meaningfully.",
            isStrongest: true
          },
          {
            text: "Not all cities are like Tallinn — results may not transfer.",
            isStrongest: false
          },
          {
            text: "Electric cars are a better solution to carbon emissions.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: increased ridership fills capacity, creating more emissions per journey.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present evidence: Tallinn follow-up studies found most new riders switched from walking, not driving, limiting actual emission reductions.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: ridership increase and emissions reduction are not equivalent — the evidence shows more people on buses, not that car use fell; the argument assumes the link without evidence.",
            isCorrect: true
          }
        ]
      },
      {
        text: "Free public transport is a social justice measure that helps low-income citizens access employment.",
        evidence: "Transport costs represent up to 20% of low-income household budgets in many cities.",
        counterOptions: [
          {
            text: "Targeted subsidies for low-income users achieve the same social justice outcome at a fraction of the cost of free transit for all, including high-income users who do not need the subsidy — the universal policy is inefficient when the goal is poverty-targeted.",
            isStrongest: true
          },
          {
            text: "Low-income people can sometimes get concessions already.",
            isStrongest: false
          },
          {
            text: "Free transport for everyone would be too expensive.",
            isStrongest: false
          }
        ],
        bestApproach: "superior_evidence",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: many low-income workers use informal transport that would not be covered by free public transit policies.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present superior evidence: means-tested transport subsidies in comparable cities achieve 90% of the social equity benefits at 35% of the cost of universal free transit.",
            isCorrect: true
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: the argument proves that transport costs burden the poor but does not prove that universal free transit — rather than targeted subsidies — is the most effective response.",
            isCorrect: false
          }
        ]
      },
      {
        text: "The economic benefit to society from reduced congestion outweighs the cost of funding free transit.",
        evidence: "Traffic congestion costs the average major city $1 billion annually in lost productivity.",
        counterOptions: [
          {
            text: "The congestion cost figure establishes that congestion is expensive, but the argument requires showing that free transit specifically reduces congestion more cost-effectively than alternatives such as congestion charges, park-and-ride schemes, or road pricing — this comparison is missing from the evidence.",
            isStrongest: true
          },
          {
            text: "Free transit may not reduce congestion if it attracts cyclists rather than drivers.",
            isStrongest: false
          },
          {
            text: "Funding free transit would require raising taxes, which also has economic costs.",
            isStrongest: false
          }
        ],
        bestApproach: "logical_flaw",
        approaches: [
          {
            id: "contradiction",
            label: "Directly contradict: free transit increases overcrowding on public transport, creating new costs.",
            isCorrect: false
          },
          {
            id: "superior_evidence",
            label: "Present evidence: cost-benefit analyses of free transit programmes show that the revenue lost rarely equals the congestion savings achieved.",
            isCorrect: false
          },
          {
            id: "logical_flaw",
            label: "Expose the flaw: establishing the cost of congestion does not prove free transit is the most effective or cost-efficient solution compared to congestion pricing, investment in transit quality, or other interventions.",
            isCorrect: true
          }
        ]
      }
    ]
  }
];
function DebateArena({ config, onGameEnd }) {
  const gameId = config.gameId;
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(config.livesCount);
  const [correct, setCorrect] = reactExports.useState(0);
  const [total, setTotal] = reactExports.useState(0);
  const startTimeRef = reactExports.useRef(Date.now());
  const gameOverRef = reactExports.useRef(false);
  const scoreRef = reactExports.useRef(score);
  const correctRef = reactExports.useRef(correct);
  const totalRef = reactExports.useRef(total);
  const livesRef = reactExports.useRef(lives);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  livesRef.current = lives;
  const endGame = reactExports.useCallback(
    (done) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc = totalRef.current > 0 ? correctRef.current / totalRef.current * 100 : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1e3),
          done
        )
      );
    },
    [config, onGameEnd]
  );
  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = timeLeft / config.timeLimit * 100;
  const [g1Phase, setG1Phase] = reactExports.useState("idle");
  const [round, setRound] = reactExports.useState(0);
  const [side, setSide] = reactExports.useState("for");
  const [selectedArgs, setSelectedArgs] = reactExports.useState([]);
  const [selectedRebuttals, setSelectedRebuttals] = reactExports.useState([]);
  const [playerTotal, setPlayerTotal] = reactExports.useState(0);
  const [opponentTotal, setOpponentTotal] = reactExports.useState(0);
  const [roundResult, setRoundResult] = reactExports.useState(null);
  const [g1Feedback, setG1Feedback] = reactExports.useState(null);
  const currentMotion = MOTIONS[round % MOTIONS.length];
  const playerArgPool = side === "for" ? currentMotion.forArguments : currentMotion.againstArguments;
  const opponentArgs = side === "for" ? currentMotion.opponentAgainst : currentMotion.opponentFor;
  function startRound() {
    const assignedSide = round % 2 === 0 ? "for" : "against";
    setSide(assignedSide);
    setSelectedArgs([]);
    setSelectedRebuttals([]);
    setPlayerTotal(0);
    setOpponentTotal(0);
    setRoundResult(null);
    setG1Feedback(null);
    setG1Phase("args");
  }
  function toggleArg(i) {
    if (selectedArgs.includes(i))
      setSelectedArgs((p) => p.filter((x) => x !== i));
    else if (selectedArgs.length < 3) setSelectedArgs((p) => [...p, i]);
  }
  function submitArgs() {
    if (selectedArgs.length !== 3) return;
    const pts = selectedArgs.reduce(
      (s, i) => s + Math.max(0, playerArgPool[i].weight),
      0
    );
    const penalty = selectedArgs.filter((i) => playerArgPool[i].type === "fallacy").length * 50;
    setPlayerTotal(pts - penalty);
    setTotal((t) => t + 3);
    setCorrect(
      (c) => c + selectedArgs.filter((i) => playerArgPool[i].type === "valid").length
    );
    setOpponentTotal(opponentArgs.reduce((s, a) => s + a.weight, 0));
    setG1Phase("opponent");
  }
  function submitRebuttals() {
    if (selectedRebuttals.length !== 2) return;
    const rebPts = selectedRebuttals.reduce(
      (s, i) => s + currentMotion.rebuttals[i].weight,
      0
    );
    const finalPlayer = playerTotal + rebPts;
    const result = finalPlayer > opponentTotal ? "win" : finalPlayer < opponentTotal ? "lose" : "draw";
    setRoundResult(result);
    const pts = result === "win" ? 400 * config.difficulty : result === "draw" ? 150 : 0;
    setScore((s) => s + pts);
    if (result !== "win") {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 2e3);
        return nl;
      });
    }
    setG1Feedback(
      `Your score: ${finalPlayer} pts | Opponent: ${opponentTotal} pts`
    );
    setG1Phase("round_result");
    setTotal((t) => t + 2);
    setCorrect((c) => c + (result === "win" ? 2 : result === "draw" ? 1 : 0));
  }
  function nextRound() {
    if (round + 1 >= 3) {
      endGame(true);
      return;
    }
    setRound((r) => r + 1);
    setG1Phase("idle");
    setTimeout(() => startRound(), 50);
  }
  const claimCount = config.difficulty === 1 ? 4 : config.difficulty === 2 ? 7 : 10;
  const [evClaims] = reactExports.useState(() => {
    const shuffled = [...EVIDENCE_CLAIMS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, claimCount).map((c) => ({
      ...c,
      sources: [...c.sources].sort(() => Math.random() - 0.5)
    }));
  });
  const [evPhase, setEvPhase] = reactExports.useState("idle");
  const [evIdx, setEvIdx] = reactExports.useState(0);
  const [evRanks, setEvRanks] = reactExports.useState([]);
  const [evSubmitted, setEvSubmitted] = reactExports.useState(false);
  const [evAccuracy, setEvAccuracy] = reactExports.useState(0);
  const currentClaim = evClaims[evIdx];
  function setRankForSource(sourceIdx, rank) {
    const next = [...evRanks];
    const oldIdx = next.indexOf(rank);
    if (oldIdx !== -1) next[oldIdx] = 0;
    next[sourceIdx] = rank;
    setEvRanks(next);
  }
  function startEvidenceGame() {
    setEvRanks(new Array(currentClaim.sources.length).fill(0));
    setEvSubmitted(false);
    setEvPhase("ranking");
    startTimeRef.current = Date.now();
  }
  function submitEvRanking() {
    if (evRanks.some((r) => r === 0)) return;
    let correct_count = 0;
    currentClaim.sources.forEach((src, i) => {
      if (evRanks[i] === src.correctRank) correct_count++;
    });
    const accuracy = correct_count / currentClaim.sources.length * 100;
    setEvAccuracy(accuracy);
    setEvSubmitted(true);
    setScore((s) => s + Math.round(accuracy * config.difficulty * 3));
    setTotal((t) => t + 4);
    setCorrect((c) => c + correct_count);
  }
  function nextEvidenceClaim() {
    if (evIdx + 1 >= evClaims.length) {
      endGame(true);
      return;
    }
    setEvIdx((i) => i + 1);
    setEvSubmitted(false);
    setEvRanks(new Array(evClaims[evIdx + 1].sources.length).fill(0));
  }
  const setCount = config.difficulty === 1 ? 2 : config.difficulty === 2 ? 3 : 5;
  const [rbSets] = reactExports.useState(
    () => [...ARGUMENT_SETS].sort(() => Math.random() - 0.5).slice(0, setCount)
  );
  const [rbPhase, setRbPhase] = reactExports.useState("idle");
  const [rbSetIdx, setRbSetIdx] = reactExports.useState(0);
  const [rbPointIdx, setRbPointIdx] = reactExports.useState(0);
  const [rbCounterChoice, setRbCounterChoice] = reactExports.useState(null);
  const [rbApproachChoice, setRbApproachChoice] = reactExports.useState(null);
  const [rbShowResult, setRbShowResult] = reactExports.useState(false);
  const [rbPoints, setRbPoints] = reactExports.useState(0);
  const currentSet = rbSets[rbSetIdx];
  const currentPoint = currentSet == null ? void 0 : currentSet.points[rbPointIdx];
  function startRebuttalGame() {
    setRbPhase("counter");
    startTimeRef.current = Date.now();
  }
  function chooseCounter(idx) {
    setRbCounterChoice(idx);
    setRbPhase("approach");
  }
  function chooseApproach(id) {
    var _a;
    setRbApproachChoice(id);
    setRbShowResult(true);
    const counterCorrect = (currentPoint == null ? void 0 : currentPoint.counterOptions[rbCounterChoice ?? 0].isStrongest) ?? false;
    const approachCorrect = ((_a = currentPoint == null ? void 0 : currentPoint.approaches.find((a) => a.id === id)) == null ? void 0 : _a.isCorrect) ?? false;
    const pts = (counterCorrect ? 100 : 30) + (approachCorrect ? 100 : 30);
    setRbPoints(pts);
    setScore((s) => s + pts * config.difficulty);
    setTotal((t) => t + 2);
    setCorrect((c) => c + (counterCorrect ? 1 : 0) + (approachCorrect ? 1 : 0));
  }
  function nextRebuttalPoint() {
    setRbCounterChoice(null);
    setRbApproachChoice(null);
    setRbShowResult(false);
    const nextPoint = rbPointIdx + 1;
    if (nextPoint >= currentSet.points.length) {
      const nextSet = rbSetIdx + 1;
      if (nextSet >= rbSets.length) {
        endGame(true);
        return;
      }
      setRbSetIdx(nextSet);
      setRbPointIdx(0);
    } else {
      setRbPointIdx(nextPoint);
    }
    setRbPhase("counter");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full flex flex-col gap-3 select-none",
      "data-ocid": "debate_arena.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-hud flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-4 w-4 text-[#7c3aed]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#00f5ff]", children: score.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: config.livesCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: `h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`
            },
            `h-${i}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-[#7c3aed] transition-all duration-1000",
                style: { width: `${timePct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground", children: [
              timeLeft,
              "s"
            ] })
          ] })
        ] }),
        gameId === "argument-gladiator" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          g1Phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              className: "glass-card rounded-2xl p-10 text-center max-w-xl w-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-14 w-14 mx-auto mb-4 text-[#7c3aed]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black mb-2",
                    style: {
                      fontFamily: "'Orbitron', sans-serif",
                      color: "#7c3aed"
                    },
                    children: "Argument Gladiator"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "3 debate rounds. Select 3 arguments (avoid fallacies), then 2 rebuttals to counter the opponent." }),
                round > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#7c3aed] mb-4", children: [
                  "Round ",
                  round + 1,
                  " of 3"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "lg",
                    onClick: startRound,
                    "data-ocid": "debate_arena.start_button",
                    children: round === 0 ? "Enter the Arena" : `Begin Round ${round + 1}`
                  }
                )
              ]
            }
          ) }),
          g1Phase === "args" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#7c3aed]/30 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs uppercase tracking-widest text-[#7c3aed] mb-1",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: [
                    "Round ",
                    round + 1,
                    " — Motion"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-bold", children: currentMotion.motion }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                "Arguing:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-bold",
                    style: { color: side === "for" ? "#10b981" : "#f43f5e" },
                    children: side === "for" ? "FOR" : "AGAINST"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground shrink-0", children: "Select exactly 3 arguments. Logical fallacies hurt your score." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto flex flex-col gap-2", children: playerArgPool.map((arg, i) => {
              const sel = selectedArgs.includes(i);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  type: "button",
                  whileTap: { scale: 0.98 },
                  onClick: () => toggleArg(i),
                  "data-ocid": `debate_arena.arg.${i + 1}`,
                  className: `text-left px-4 py-3 rounded-xl border text-sm transition-all glass-card ${sel ? "border-[#7c3aed] bg-[#7c3aed]/10 text-[#7c3aed]" : "border-border/40 hover:border-[#7c3aed]/40 text-foreground"}`,
                  children: arg.text
                },
                i
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              GlowButton,
              {
                variant: "primary",
                size: "md",
                disabled: selectedArgs.length !== 3,
                onClick: submitArgs,
                "data-ocid": "debate_arena.submit_args_button",
                children: [
                  "Submit Arguments (",
                  selectedArgs.length,
                  "/3)"
                ]
              }
            )
          ] }),
          g1Phase === "opponent" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 40 },
              animate: { opacity: 1, x: 0 },
              className: "flex-1 flex flex-col gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#f43f5e]/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs uppercase tracking-widest text-[#f43f5e] mb-2",
                      style: { fontFamily: "'Orbitron', sans-serif" },
                      children: "Opponent's Arguments"
                    }
                  ),
                  opponentArgs.map((arg, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm text-foreground mb-2 pl-2 border-l-2 border-[#f43f5e]/40",
                      children: arg.text
                    },
                    i
                  ))
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Opponent:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#f43f5e] font-bold", children: [
                    opponentTotal,
                    " pts"
                  ] }),
                  " ",
                  "| Your args:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#10b981] font-bold", children: [
                    playerTotal,
                    " pts"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "md",
                    onClick: () => setG1Phase("rebuttal"),
                    "data-ocid": "debate_arena.proceed_rebuttal_button",
                    children: "Choose Rebuttals"
                  }
                )
              ]
            },
            "opp"
          ) }),
          g1Phase === "rebuttal" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground shrink-0", children: "Select 2 rebuttals to counter the opponent:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto flex flex-col gap-2", children: currentMotion.rebuttals.map((reb, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                type: "button",
                whileTap: { scale: 0.98 },
                onClick: () => {
                  if (selectedRebuttals.includes(i))
                    setSelectedRebuttals((p) => p.filter((x) => x !== i));
                  else if (selectedRebuttals.length < 2)
                    setSelectedRebuttals((p) => [...p, i]);
                },
                "data-ocid": `debate_arena.rebuttal.${i + 1}`,
                className: `text-left px-4 py-3 rounded-xl border text-sm transition-all glass-card ${selectedRebuttals.includes(i) ? "border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff]" : "border-border/40 text-foreground hover:border-[#00f5ff]/40"}`,
                children: reb.text
              },
              i
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              GlowButton,
              {
                variant: "primary",
                size: "md",
                disabled: selectedRebuttals.length !== 2,
                onClick: submitRebuttals,
                "data-ocid": "debate_arena.submit_rebuttals_button",
                children: [
                  "Deliver Rebuttals (",
                  selectedRebuttals.length,
                  "/2)"
                ]
              }
            )
          ] }),
          g1Phase === "round_result" && roundResult && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              className: "flex-1 flex flex-col items-center justify-center gap-6",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "glass-card rounded-2xl p-10 text-center max-w-md w-full",
                  style: {
                    borderColor: roundResult === "win" ? "#10b981" : roundResult === "draw" ? "#f59e0b" : "#f43f5e"
                  },
                  children: [
                    roundResult === "win" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-14 w-14 mx-auto mb-3 text-[#10b981]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleX,
                      {
                        className: "h-14 w-14 mx-auto mb-3",
                        style: {
                          color: roundResult === "draw" ? "#f59e0b" : "#f43f5e"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h3",
                      {
                        className: "text-3xl font-black mb-2",
                        style: {
                          fontFamily: "'Orbitron', sans-serif",
                          color: roundResult === "win" ? "#10b981" : roundResult === "draw" ? "#f59e0b" : "#f43f5e"
                        },
                        children: roundResult === "win" ? "ROUND WON" : roundResult === "draw" ? "DRAW" : "ROUND LOST"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: g1Feedback }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      GlowButton,
                      {
                        variant: "primary",
                        size: "lg",
                        onClick: nextRound,
                        "data-ocid": "debate_arena.next_round_button",
                        children: round + 1 < 3 ? "Next Round" : "See Final Results"
                      }
                    )
                  ]
                }
              )
            },
            "result"
          ) })
        ] }),
        gameId === "evidence-weigher" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          evPhase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              className: "glass-card rounded-2xl p-10 text-center max-w-xl w-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-14 w-14 mx-auto mb-4 text-[#f59e0b]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black mb-2",
                    style: {
                      fontFamily: "'Orbitron', sans-serif",
                      color: "#f59e0b"
                    },
                    children: "Evidence Weigher"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mb-2", children: [
                  claimCount,
                  " claim scenarios. For each, rank 4 sources from most credible (1) to least credible (4)."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Source types: Peer-Reviewed Study, News Article, Social Media Post, Personal Opinion Blog." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "lg",
                    onClick: startEvidenceGame,
                    "data-ocid": "debate_arena.ev_start_button",
                    children: "Begin Assessment"
                  }
                )
              ]
            }
          ) }),
          evPhase === "ranking" && currentClaim && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#f59e0b]/30 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs uppercase tracking-widest text-[#f59e0b] mb-1",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: [
                    "Claim ",
                    evIdx + 1,
                    " of ",
                    evClaims.length
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: currentClaim.claim })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground shrink-0", children: "Rank each source 1 (most credible) to 4 (least credible). Each rank can only be used once." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto flex flex-col gap-3", children: currentClaim.sources.map((src, si) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "glass-card rounded-xl p-3 border border-border/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#f59e0b] mb-1", children: src.type }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mb-2", children: src.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4].map((rank) => {
                    const selected = evRanks[si] === rank;
                    const usedElsewhere = evRanks.some(
                      (r, ri) => r === rank && ri !== si
                    );
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => !usedElsewhere && setRankForSource(si, rank),
                        disabled: usedElsewhere,
                        "data-ocid": `debate_arena.ev_rank.${si + 1}.${rank}`,
                        className: `w-9 h-9 rounded-lg border text-sm font-bold transition-all ${selected ? "border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b]" : usedElsewhere ? "border-border/20 text-muted-foreground/30 cursor-not-allowed" : "border-border/40 text-foreground hover:border-[#f59e0b]/60"}`,
                        children: rank
                      },
                      rank
                    );
                  }) })
                ]
              },
              si
            )) }),
            !evSubmitted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              GlowButton,
              {
                variant: "primary",
                size: "md",
                disabled: evRanks.some((r) => r === 0) || evRanks.length !== currentClaim.sources.length,
                onClick: submitEvRanking,
                "data-ocid": "debate_arena.ev_submit_button",
                children: "Submit Rankings"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#10b981]/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-[#10b981] mb-2", children: [
                  "Results — ",
                  Math.round(evAccuracy),
                  "% accuracy"
                ] }),
                currentClaim.sources.map((src, si) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: `text-xs font-bold ${evRanks[si] === src.correctRank ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                        children: [
                          "Your rank: ",
                          evRanks[si],
                          " | Correct:",
                          " ",
                          src.correctRank
                        ]
                      }
                    ),
                    evRanks[si] === src.correctRank ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 text-[#10b981]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 text-[#f43f5e]" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: src.explanation })
                ] }, si))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlowButton,
                {
                  variant: "primary",
                  size: "md",
                  onClick: nextEvidenceClaim,
                  "data-ocid": "debate_arena.ev_next_button",
                  children: evIdx + 1 < evClaims.length ? "Next Claim" : "Finish"
                }
              )
            ] })
          ] })
        ] }),
        gameId === "rebuttal-master" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          rbPhase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              className: "glass-card rounded-2xl p-10 text-center max-w-xl w-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-14 w-14 mx-auto mb-4 text-[#00f5ff]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-3xl font-black mb-2",
                    style: {
                      fontFamily: "'Orbitron', sans-serif",
                      color: "#00f5ff"
                    },
                    children: "Rebuttal Master"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mb-2", children: [
                  setCount,
                  " argument sets. For each opponent point: choose the strongest counter-evidence, then identify the best rebuttal approach."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6", children: "Approaches: Direct Contradiction / Superior Evidence / Expose Logical Flaw." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "lg",
                    onClick: startRebuttalGame,
                    "data-ocid": "debate_arena.rb_start_button",
                    children: "Begin Rebuttals"
                  }
                )
              ]
            }
          ) }),
          (rbPhase === "counter" || rbPhase === "approach") && currentPoint && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3 overflow-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-[#00f5ff]/30 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs uppercase tracking-widest text-[#00f5ff] mb-1",
                  style: { fontFamily: "'Orbitron', sans-serif" },
                  children: [
                    "Set ",
                    rbSetIdx + 1,
                    " — ",
                    currentSet.motion
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Point ",
                rbPointIdx + 1,
                " of ",
                currentSet.points.length
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-[#f43f5e]/30 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#f43f5e] mb-1", children: "OPPONENT ARGUES:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: currentPoint.text }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 italic", children: [
                "Evidence: ",
                currentPoint.evidence
              ] })
            ] }),
            rbPhase === "counter" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Select the strongest counter-evidence:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: currentPoint.counterOptions.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  type: "button",
                  whileTap: { scale: 0.98 },
                  onClick: () => chooseCounter(i),
                  "data-ocid": `debate_arena.rb_counter.${i + 1}`,
                  className: "text-left px-4 py-3 rounded-xl border border-border/40 text-sm text-foreground hover:border-[#00f5ff]/50 transition-all glass-card",
                  children: opt.text
                },
                i
              )) })
            ] }),
            rbPhase === "approach" && rbCounterChoice !== null && !rbShowResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-3 border border-[#00f5ff]/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#00f5ff] font-bold mb-1", children: "Your counter-evidence:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: currentPoint.counterOptions[rbCounterChoice].text })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Which rebuttal approach is most effective here?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: currentPoint.approaches.map((app) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  type: "button",
                  whileTap: { scale: 0.98 },
                  onClick: () => chooseApproach(app.id),
                  "data-ocid": `debate_arena.rb_approach.${app.id}`,
                  className: "text-left px-4 py-3 rounded-xl border border-border/40 text-sm text-foreground hover:border-[#7c3aed]/50 transition-all glass-card",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#7c3aed]", children: [
                      APPROACH_LABELS[app.id],
                      ":",
                      " "
                    ] }),
                    app.label
                  ]
                },
                app.id
              )) })
            ] })
          ] }),
          rbShowResult && rbCounterChoice !== null && rbApproachChoice !== null && currentPoint && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              className: "flex-1 flex flex-col gap-3 overflow-auto",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 border border-[#00f5ff]/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs uppercase tracking-widest text-[#00f5ff] mb-2",
                      style: { fontFamily: "'Orbitron', sans-serif" },
                      children: "Result"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                      currentPoint.counterOptions[rbCounterChoice].isStrongest ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-[#10b981] mt-0.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-[#f43f5e] mt-0.5 shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "p",
                          {
                            className: `text-xs font-bold mb-0.5 ${currentPoint.counterOptions[rbCounterChoice].isStrongest ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                            children: [
                              "Counter-Evidence:",
                              " ",
                              currentPoint.counterOptions[rbCounterChoice].isStrongest ? "Strongest choice" : "Not the strongest"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: currentPoint.counterOptions[rbCounterChoice].text })
                      ] })
                    ] }),
                    (() => {
                      const app = currentPoint.approaches.find(
                        (a) => a.id === rbApproachChoice
                      );
                      const correctApp = currentPoint.approaches.find(
                        (a) => a.isCorrect
                      );
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                          (app == null ? void 0 : app.isCorrect) ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-[#10b981] mt-0.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-[#f43f5e] mt-0.5 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "p",
                            {
                              className: `text-xs font-bold mb-0.5 ${(app == null ? void 0 : app.isCorrect) ? "text-[#10b981]" : "text-[#f43f5e]"}`,
                              children: [
                                "Approach:",
                                " ",
                                APPROACH_LABELS[rbApproachChoice],
                                " ",
                                "—",
                                " ",
                                (app == null ? void 0 : app.isCorrect) ? "Best approach" : `Better: ${correctApp ? APPROACH_LABELS[correctApp.id] : ""}`
                              ]
                            }
                          ) })
                        ] }),
                        !(app == null ? void 0 : app.isCorrect) && correctApp && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pl-6", children: correctApp.label })
                      ] });
                    })(),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-[#00f5ff]", children: [
                      "+",
                      rbPoints * config.difficulty,
                      " pts"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlowButton,
                  {
                    variant: "primary",
                    size: "md",
                    onClick: nextRebuttalPoint,
                    "data-ocid": "debate_arena.rb_next_button",
                    children: rbPointIdx + 1 >= currentSet.points.length && rbSetIdx + 1 >= rbSets.length ? "Finish" : "Next Point"
                  }
                )
              ]
            },
            "rb-result"
          ) })
        ] })
      ]
    }
  );
}
export {
  DebateArena as default
};
