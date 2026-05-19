import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle, Heart, Mail, MessageSquare, XCircle } from "lucide-react";
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
  onGameEnd: (result: GameResult) => void;
}

// ─── GAME 1: Social Situations data ───────────────────────────────────────────
interface SocialScenario {
  id: string;
  context: string;
  situation: string;
  difficulty: number;
  verbalOptions: { text: string; score: number; consequence: string }[];
  nonVerbalOptions: { text: string; appropriate: boolean }[];
  bestVerbalIndex: number;
  correctNonVerbals: number[];
}

const SOCIAL_SCENARIOS: SocialScenario[] = [
  {
    id: "meet_new",
    difficulty: 1,
    context: "Meeting Someone New at School",
    situation:
      "A new student has just joined your class and is sitting alone at lunch. You want to introduce yourself.",
    verbalOptions: [
      {
        text: "Hi, I'm [your name]. Mind if I sit with you? How are you finding things so far?",
        score: 4,
        consequence:
          "Warm, open-ended question invites conversation without pressure. Excellent first impression.",
      },
      {
        text: "You are new, right? Why did you move here?",
        score: 2,
        consequence:
          "Slightly interrogative. Shows interest but could feel intrusive without prior rapport.",
      },
      {
        text: "You should sit with us — we are the popular group.",
        score: 1,
        consequence:
          "Creates social hierarchy and pressure. Likely uncomfortable for a new student.",
      },
      {
        text: "Hey.",
        score: 2,
        consequence:
          "Minimal effort. Not hostile but misses the opportunity to make the new student feel welcome.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      { text: "Make eye contact and smile", appropriate: true },
      { text: "Check your phone while talking", appropriate: false },
      {
        text: "Sit down and face them with open body language",
        appropriate: true,
      },
      { text: "Stand over them with arms crossed", appropriate: false },
    ],
    correctNonVerbals: [0, 2],
  },
  {
    id: "disagree_teacher",
    difficulty: 1,
    context: "Disagreeing Politely with a Teacher",
    situation:
      "Your teacher marks your answer wrong, but you believe your interpretation was valid and well-reasoned.",
    verbalOptions: [
      {
        text: "Excuse me, I think my answer might be correct because [reason]. Could you help me understand where my reasoning went wrong?",
        score: 4,
        consequence:
          "Respectful, specific, invites dialogue. Models intellectual humility while advocating for your position.",
      },
      {
        text: "That is not fair — you marked it wrong but I know I am right.",
        score: 0,
        consequence:
          "Confrontational and disrespectful. Escalates rather than resolves.",
      },
      {
        text: "I do not agree but okay.",
        score: 1,
        consequence: "Passive. Misses the opportunity to learn or clarify.",
      },
      {
        text: "Could I see you after class to discuss my answer? I had a different interpretation and would like to understand the feedback.",
        score: 3,
        consequence:
          "Good approach — defers the conversation appropriately. Slightly less direct than addressing it right away.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      { text: "Raise your hand calmly", appropriate: true },
      { text: "Speak in a calm, moderate tone", appropriate: true },
      { text: "Roll your eyes while speaking", appropriate: false },
      {
        text: "Interrupt other students to make your point",
        appropriate: false,
      },
    ],
    correctNonVerbals: [0, 1],
  },
  {
    id: "ask_help",
    difficulty: 1,
    context: "Asking for Help with Homework",
    situation:
      "You have spent 30 minutes stuck on a maths problem. You want to ask your classmate for help without seeming lazy.",
    verbalOptions: [
      {
        text: "Could you help me with this? I tried steps A and B but I'm stuck at this part — I think I'm misapplying the formula.",
        score: 4,
        consequence:
          "Shows prior effort, pinpoints the problem. Productive and respectful of their time.",
      },
      {
        text: "Can you just give me the answer? I don't understand this at all.",
        score: 1,
        consequence:
          "Passive and asks for a shortcut rather than understanding. Disrespects both their time and your own learning.",
      },
      {
        text: "Do you understand question 7? I am confused.",
        score: 2,
        consequence:
          "Reasonable but vague. Does not show prior effort or specify where you are stuck.",
      },
      {
        text: "I think the teacher explained this badly. Can we figure it out together?",
        score: 2,
        consequence:
          "Deflects blame but proposes collaboration, which is positive. Avoid criticising the teacher to peers.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      { text: "Show them your work so far", appropriate: true },
      { text: "Ask when they are not busy", appropriate: true },
      { text: "Interrupt them mid-task", appropriate: false },
      { text: "Avoid eye contact and mumble", appropriate: false },
    ],
    correctNonVerbals: [0, 1],
  },
  {
    id: "apologise",
    difficulty: 2,
    context: "Apologising for a Mistake",
    situation:
      "You accidentally shared a classmate's personal story with others, and they found out and are upset.",
    verbalOptions: [
      {
        text: "I am genuinely sorry. I should not have shared that — it was not my story to tell. I understand if you need time. What can I do to make this right?",
        score: 4,
        consequence:
          "Takes full accountability, acknowledges the harm, offers repair. The gold standard for apology.",
      },
      {
        text: "I am sorry but I did not think it was a big deal at the time.",
        score: 1,
        consequence:
          "The qualifier 'but' undermines the apology. Minimising the impact signals you do not fully understand the harm.",
      },
      {
        text: "Everyone was going to find out anyway, so it does not really matter.",
        score: 0,
        consequence:
          "Dismissive and deflecting. Compounds the original breach with a second act of disrespect.",
      },
      {
        text: "I am sorry — it won't happen again.",
        score: 2,
        consequence:
          "Better than nothing but lacks specificity and genuine acknowledgement of impact.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      { text: "Speak directly to them privately", appropriate: true },
      { text: "Maintain a sincere tone, not defensive", appropriate: true },
      { text: "Cross your arms while apologising", appropriate: false },
      {
        text: "Apologise in front of a group to show you mean it",
        appropriate: false,
      },
    ],
    correctNonVerbals: [0, 1],
  },
  {
    id: "give_feedback",
    difficulty: 2,
    context: "Giving Feedback to a Classmate",
    situation:
      "Your classmate asks you to review their presentation before they deliver it. It has some significant structural problems.",
    verbalOptions: [
      {
        text: "Your introduction is strong and your examples are relevant. The main area to strengthen is the structure — right now the points feel disconnected. Want to walk through it together?",
        score: 4,
        consequence:
          "Balanced, specific, and collaborative. Identifies a real issue without demoralising. Offers to help.",
      },
      {
        text: "It is good but the structure is a bit messy.",
        score: 2,
        consequence:
          "Vague feedback. 'A bit messy' does not give them actionable information for improvement.",
      },
      {
        text: "Honestly it needs a lot of work. The structure does not make sense.",
        score: 1,
        consequence:
          "Blunt without being constructive. Risks damaging confidence without enabling improvement.",
      },
      {
        text: "It is great! You will do well.",
        score: 1,
        consequence:
          "Dishonest encouragement. Sets them up for a weaker performance when honesty could have helped.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      { text: "Point to specific slides or sections", appropriate: true },
      { text: "Use a calm, constructive tone", appropriate: true },
      { text: "Laugh at the weak parts", appropriate: false },
      { text: "Rush through your feedback", appropriate: false },
    ],
    correctNonVerbals: [0, 1],
  },
  {
    id: "group_project",
    difficulty: 2,
    context: "Group Project Conflict",
    situation:
      "One member of your group project is not contributing equally. Deadlines are approaching.",
    verbalOptions: [
      {
        text: "I noticed that your section is not complete yet and we are running short on time. Is there something making it difficult? How can we redistribute to make this work?",
        score: 4,
        consequence:
          "Addresses the issue without accusation, shows concern for the person, offers a constructive path forward.",
      },
      {
        text: "You are doing nothing and the rest of us are doing all the work. That is unfair.",
        score: 1,
        consequence:
          "Accusatory tone likely triggers defensiveness rather than cooperation.",
      },
      {
        text: "I will just do your part too. It is not worth the conflict.",
        score: 1,
        consequence:
          "Short-term solution that enables the behaviour and creates resentment long-term.",
      },
      {
        text: "Should we check in with each other to update progress and flag any blockers?",
        score: 3,
        consequence:
          "Tactful and collaborative but slightly indirect — does not acknowledge that a problem already exists.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      {
        text: "Speak privately before involving the teacher",
        appropriate: true,
      },
      { text: "Document what each person has done", appropriate: true },
      { text: "Vent to other group members first", appropriate: false },
      { text: "Exclude them from the final submission", appropriate: false },
    ],
    correctNonVerbals: [0, 1],
  },
  {
    id: "report_incident",
    difficulty: 3,
    context: "Reporting a Sensitive Incident",
    situation:
      "You witnessed a classmate being bullied. You want to report it without being seen as a 'snitch' and without worsening the situation.",
    verbalOptions: [
      {
        text: "Could I speak with you privately? I witnessed something that I think you need to know about. I am not comfortable with what I saw and I believe [classmate] may need support.",
        score: 4,
        consequence:
          "Private, thoughtful, describes impact rather than accusation. Protects all parties while ensuring accountability.",
      },
      {
        text: "[Name] is bullying [other name]. You need to do something about it right now.",
        score: 2,
        consequence:
          "Prompt reporting is good but public confrontation could escalate the situation.",
      },
      {
        text: "It is not really my business to get involved.",
        score: 0,
        consequence:
          "Bystander inaction enables the behaviour to continue. Speaks against the moral responsibility to report.",
      },
      {
        text: "I will tell [name]'s friends so they can sort it out.",
        score: 1,
        consequence:
          "Well-meaning but bypasses responsible authority. Risk of escalation into peer conflict.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      { text: "Choose a private moment with the teacher", appropriate: true },
      { text: "Speak calmly and factually", appropriate: true },
      { text: "Make the accusation in front of the class", appropriate: false },
      { text: "Post about it online first", appropriate: false },
    ],
    correctNonVerbals: [0, 1],
  },
  {
    id: "present_idea",
    difficulty: 3,
    context: "Presenting an Idea to a Group",
    situation:
      "You have an idea to improve how your school club is run, but you are the newest member and more experienced members are present.",
    verbalOptions: [
      {
        text: "I am relatively new so I may be missing context, but I noticed something that might be worth discussing. Would it be okay to share a thought about how we handle scheduling?",
        score: 4,
        consequence:
          "Acknowledges status, asks permission, frames as a question. Highly effective for speaking in a new social context.",
      },
      {
        text: "I have an idea that will make this much better. We should change the scheduling system completely.",
        score: 1,
        consequence:
          "Overconfident and prescriptive for a newcomer. Likely to trigger resistance from experienced members.",
      },
      {
        text: "I don't have much experience here, so maybe my idea is not worth sharing.",
        score: 1,
        consequence:
          "False modesty that prevents potentially valuable contribution. Underselling undermines your position.",
      },
      {
        text: "Could I share an observation? I am not sure if this is how things are usually done, but I think we could try [idea] and see if it helps.",
        score: 3,
        consequence:
          "Good framing. Slightly less structured than the ideal but still respectful and collaborative.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      { text: "Wait for a natural pause before speaking", appropriate: true },
      { text: "Speak at a clear, measured pace", appropriate: true },
      { text: "Speak louder to assert your point", appropriate: false },
      {
        text: "Look only at one person while speaking to the group",
        appropriate: false,
      },
    ],
    correctNonVerbals: [0, 1],
  },
  {
    id: "cultural_diff",
    difficulty: 3,
    context: "Navigating a Cultural Misunderstanding",
    situation:
      "A classmate from a different cultural background misinterprets something you said and seems offended.",
    verbalOptions: [
      {
        text: "I am sorry if what I said came across wrongly. I did not mean to cause offence. Could you help me understand how it landed so I can be more mindful going forward?",
        score: 4,
        consequence:
          "Apologises without over-admitting fault, shows genuine curiosity and willingness to learn. Exemplary cross-cultural communication.",
      },
      {
        text: "I was not being offensive. You misunderstood me.",
        score: 0,
        consequence:
          "Defensive and dismissive. Places the problem on the other person rather than seeking understanding.",
      },
      {
        text: "I am sorry you feel that way.",
        score: 1,
        consequence:
          "The passive construction 'sorry you feel' does not acknowledge any responsibility and often feels insincere.",
      },
      {
        text: "I am sorry — I clearly need to learn more about different perspectives. I did not mean it that way at all.",
        score: 3,
        consequence:
          "Genuine and humble. Slightly less precise than requesting the other person's perspective directly.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      { text: "Maintain open, non-defensive body language", appropriate: true },
      { text: "Listen fully before responding", appropriate: true },
      { text: "Look away while they explain", appropriate: false },
      { text: "Laugh nervously to break the tension", appropriate: false },
    ],
    correctNonVerbals: [0, 1],
  },
  {
    id: "compliment_receive",
    difficulty: 1,
    context: "Receiving a Compliment",
    situation:
      "A teacher praises your essay in front of the class, saying it was one of the best submissions.",
    verbalOptions: [
      {
        text: "Thank you — I spent a lot of time on it and I am glad the structure worked.",
        score: 4,
        consequence:
          "Gracious acceptance that acknowledges effort without arrogance or false modesty.",
      },
      {
        text: "It was not that good, honestly.",
        score: 0,
        consequence:
          "False modesty can seem fishing for more compliments or reflects poor self-esteem. Neither helps.",
      },
      {
        text: "Thanks.",
        score: 2,
        consequence:
          "Minimal but acceptable. Misses the opportunity to make the exchange warm and professional.",
      },
      {
        text: "I know — I always do good work.",
        score: 0,
        consequence:
          "Arrogant response that creates distance and awkwardness in a social setting.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      {
        text: "Smile and make brief eye contact with the teacher",
        appropriate: true,
      },
      { text: "Nod calmly", appropriate: true },
      { text: "Shrug dramatically", appropriate: false },
      {
        text: "Look at your desk and go red without responding",
        appropriate: false,
      },
    ],
    correctNonVerbals: [0, 1],
  },
  {
    id: "persuade_parent",
    difficulty: 2,
    context: "Persuading a Parent",
    situation:
      "You want to attend an overnight school trip but your parent is hesitant due to safety concerns.",
    verbalOptions: [
      {
        text: "I understand you are concerned about safety. The school has a detailed itinerary, qualified supervisors at a 1:8 ratio, and emergency protocols. Could we look at the information sheet together?",
        score: 4,
        consequence:
          "Acknowledges the concern, provides specific evidence, invites collaboration. Highly persuasive and respectful.",
      },
      {
        text: "All my friends are going. You are being overprotective.",
        score: 0,
        consequence:
          "Dismisses the valid concern and creates conflict rather than persuasion.",
      },
      {
        text: "Please, it will be really fun and educational.",
        score: 1,
        consequence:
          "Appeals to emotion without addressing the stated concern about safety.",
      },
      {
        text: "I will be fine. You do not need to worry.",
        score: 1,
        consequence:
          "Dismisses the concern rather than addressing it. Does not provide a persuasive basis.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      { text: "Remain calm and patient, not pleading", appropriate: true },
      {
        text: "Bring the information sheet to the conversation",
        appropriate: true,
      },
      {
        text: "Bring it up when they are stressed or busy",
        appropriate: false,
      },
      { text: "Storm off if they say no immediately", appropriate: false },
    ],
    correctNonVerbals: [0, 1],
  },
  {
    id: "decline_invitation",
    difficulty: 2,
    context: "Declining an Invitation",
    situation:
      "A friend invites you to their party but you genuinely cannot attend due to a family commitment.",
    verbalOptions: [
      {
        text: "Thank you so much for inviting me — I am genuinely sorry I cannot make it. I have a family commitment I cannot reschedule. Can we plan something just us soon?",
        score: 4,
        consequence:
          "Expresses genuine appreciation, gives a reason without oversharing, and preserves the relationship with an alternative.",
      },
      {
        text: "I can not come. I have family stuff.",
        score: 2,
        consequence:
          "Truthful but terse. Lacks warmth and misses the chance to affirm the friendship.",
      },
      {
        text: "I will try to come but probably not.",
        score: 1,
        consequence:
          "Vague and unreliable. Gives false hope and is unfair to the host who needs accurate numbers.",
      },
      {
        text: "I am busy that day.",
        score: 1,
        consequence:
          "Minimal and slightly evasive. No appreciation or alternative offered.",
      },
    ],
    bestVerbalIndex: 0,
    nonVerbalOptions: [
      { text: "Respond promptly so they can plan", appropriate: true },
      { text: "Express genuine regret in your tone", appropriate: true },
      { text: "Leave them on read and hope they forget", appropriate: false },
      { text: "Make an excuse that might not be believed", appropriate: false },
    ],
    correctNonVerbals: [0, 1],
  },
];

// ─── GAME 2: Active Listener data ─────────────────────────────────────────────
type ListeningTechnique =
  | "paraphrasing"
  | "clarifying_question"
  | "empathetic_response"
  | "validation";
interface ListeningExchange {
  speaker: string;
  activeResponse: string;
  passiveResponse: string;
  technique: ListeningTechnique;
  explanation: string;
}

const LISTENING_EXCHANGES: ListeningExchange[] = [
  {
    speaker: "I failed my maths test. I really thought I had studied enough.",
    activeResponse:
      "It sounds like you're really disappointed — especially after putting in the work. What do you think made it harder than expected?",
    passiveResponse: "You should have started studying earlier.",
    technique: "empathetic_response",
    explanation:
      "Empathetic response acknowledges feelings first, then opens dialogue. The passive response jumps to judgment.",
  },
  {
    speaker:
      "My parents have been arguing every night. I can't concentrate on anything.",
    activeResponse:
      "That sounds really stressful — hearing that at home must make it hard to feel settled. How long has this been going on?",
    passiveResponse: "All parents argue. It is normal.",
    technique: "empathetic_response",
    explanation:
      "Normalising dismisses the person's unique distress. Active listening acknowledges the specific impact.",
  },
  {
    speaker: "I've been feeling left out in our friend group lately.",
    activeResponse:
      "When you say left out, do you mean specific situations like lunch or group chats, or is it a more general feeling?",
    passiveResponse: "I'm sure they don't mean it. They're your friends.",
    technique: "clarifying_question",
    explanation:
      "Clarifying questions show you are paying attention and want to understand fully, not minimise.",
  },
  {
    speaker: "I worked for weeks on this science project and got a C.",
    activeResponse:
      "You put weeks into this and still got a C — that must be really frustrating. What did the feedback say?",
    passiveResponse: "A C is not that bad.",
    technique: "paraphrasing",
    explanation:
      "Paraphrasing reflects back what was said, showing you heard the effort and the disappointment, not just the grade.",
  },
  {
    speaker: "I don't think I'm smart enough to get into university.",
    activeResponse:
      "It sounds like you're carrying a lot of doubt right now. What's making you feel that way — is it a specific subject or more general?",
    passiveResponse: "Of course you are smart enough. Stop being silly.",
    technique: "clarifying_question",
    explanation:
      "Dismissing doubt with positivity feels invalidating. A clarifying question takes the concern seriously.",
  },
  {
    speaker:
      "My coach never gives me a starting position even though I train the hardest.",
    activeResponse:
      "So even with more training than others, you're not seeing it reflected in the coach's decisions — that's really demoralising. Have you spoken to them about it?",
    passiveResponse: "Coaches decide based on skill, not effort.",
    technique: "paraphrasing",
    explanation:
      "Paraphrasing shows understanding of the unfairness felt. The passive response is technically true but undermines the person's experience.",
  },
  {
    speaker:
      "I've been having panic attacks before presentations. It's getting worse.",
    activeResponse:
      "That must be really frightening — especially if it's escalating. Have you had a chance to speak to someone about it, like a counsellor?",
    passiveResponse: "Everyone gets nervous. Just breathe.",
    technique: "empathetic_response",
    explanation:
      "Panic attacks are a clinical experience, not just nerves. Treating them as such shows real attentiveness.",
  },
  {
    speaker: "I feel like my teacher picks on me compared to other students.",
    activeResponse:
      "When you say picks on you, do you mean in class discussions, marking, or how they speak to you? I want to understand what's happening.",
    passiveResponse:
      "Teachers have to treat everyone the same — it's probably just your impression.",
    technique: "clarifying_question",
    explanation:
      "Asking for specifics validates the experience and gathers information without immediately dismissing or agreeing.",
  },
  {
    speaker: "I am really worried about moving to a new school next year.",
    activeResponse:
      "Changing schools is a big transition. Is it more about missing your current friends or the uncertainty of fitting in somewhere new?",
    passiveResponse: "You'll be fine. New school, new opportunities!",
    technique: "clarifying_question",
    explanation:
      "The passive response is intended positively but dismisses the real concern. Active listening distinguishes between different types of worry.",
  },
  {
    speaker:
      "I helped my friend with their project for hours but they did not even thank me.",
    activeResponse:
      "So you invested a lot of time and effort and felt completely unacknowledged — that kind of thing can genuinely hurt. Did they know how much time you put in?",
    passiveResponse: "People forget sometimes. Do not take it personally.",
    technique: "paraphrasing",
    explanation:
      "Paraphrasing validates the emotional logic of the situation. The passive response minimises a legitimate feeling.",
  },
  {
    speaker:
      "I keep getting into arguments with my best friend and I don't know why.",
    activeResponse:
      "Recurring conflict with someone close can be really exhausting. Do the arguments tend to be about the same kinds of things or different issues each time?",
    passiveResponse: "All friends argue. It is part of friendship.",
    technique: "clarifying_question",
    explanation:
      "The clarifying question helps identify whether there is a pattern, which is useful and shows genuine engagement.",
  },
  {
    speaker: "I do not think my opinion matters in group discussions.",
    activeResponse:
      "You feel like your contributions are not being valued or heard. Is that something that happens with particular people or in most group settings?",
    passiveResponse: "Just speak up more loudly next time.",
    technique: "empathetic_response",
    explanation:
      "Advice without empathy can feel dismissive. Acknowledging the feeling first creates the trust needed for any advice to land well.",
  },
  {
    speaker: "I have been feeling really tired and unmotivated for weeks.",
    activeResponse:
      "Extended low energy and loss of motivation can be a sign that something more significant is going on. Are you sleeping, eating, and getting time for yourself?",
    passiveResponse: "Try exercising more. That usually helps.",
    technique: "clarifying_question",
    explanation:
      "Advice about exercise, though well-meaning, glosses over a potentially serious wellbeing issue. Active listening gathers context first.",
  },
  {
    speaker: "My parents want me to study medicine but I want to study art.",
    activeResponse:
      "So you are navigating a real tension between your own direction and your family's expectations. How long have you been feeling this way?",
    passiveResponse: "Your parents probably just want what is best for you.",
    technique: "empathetic_response",
    explanation:
      "Defending the parents' position, however reasonable, does not acknowledge the person's dilemma and internal conflict.",
  },
  {
    speaker: "I presented my idea in class and everyone laughed at me.",
    activeResponse:
      "That sounds like a genuinely humiliating experience — especially when you were brave enough to share your idea. How are you feeling about it now?",
    passiveResponse: "They were probably not laughing at you specifically.",
    technique: "empathetic_response",
    explanation:
      "Trying to reframe the event as non-targeted minimises the experience. Active listening sits with the person in their feeling first.",
  },
];

const TECHNIQUE_LABELS: Record<ListeningTechnique, string> = {
  paraphrasing: "Paraphrasing",
  clarifying_question: "Clarifying Question",
  empathetic_response: "Empathetic Response",
  validation: "Validation",
};

// ─── GAME 3: Email Etiquette data ─────────────────────────────────────────────
type EmailError =
  | "wrong_greeting"
  | "missing_subject"
  | "inappropriate_tone"
  | "no_sign_off"
  | "spelling_error";
interface EmailScenario {
  scenario: string;
  emailText: string;
  errors: { type: EmailError; description: string }[];
  correctVersions: { text: string; isCorrect: boolean }[];
}

const EMAIL_SCENARIOS: EmailScenario[] = [
  {
    scenario: "Email to teacher about missed homework",
    emailText:
      "Hey sir i didnt do the homework because i was sick can i submit it tomorrow its only one day late and it wont happen again thanks",
    errors: [
      {
        type: "wrong_greeting",
        description:
          "'Hey sir' is too informal for a professional context. Use 'Dear Mr/Ms [Name]'.",
      },
      {
        type: "missing_subject",
        description:
          "No subject line. A clear subject like 'Homework Submission — Extension Request' sets context.",
      },
      {
        type: "no_sign_off",
        description:
          "Email ends abruptly. A sign-off like 'Kind regards, [Name]' is required.",
      },
    ],
    correctVersions: [
      {
        text: "Subject: Homework Extension Request\n\nDear Mr Asare,\n\nI am writing to inform you that I was unwell yesterday and was unable to complete the assigned homework. I would be grateful if I could submit it tomorrow.\n\nKind regards,\nAkua Mensah",
        isCorrect: true,
      },
      {
        text: "Hey Mr Asare, I missed homework coz I was sick. Can I send it tmrw? Cheers",
        isCorrect: false,
      },
      {
        text: "Dear Mr Asare, I was sick. Homework late. I will do it tomorrow.",
        isCorrect: false,
      },
    ],
  },
  {
    scenario: "Formal complaint letter about a school facility",
    emailText:
      "To whoever,\nThe computers in the library are ALWAYS broken and nobody ever fixes them. This is completely unacceptable and the school should be ashamed. Fix it NOW please.\nAnonymous",
    errors: [
      {
        type: "wrong_greeting",
        description:
          "'To whoever' is dismissive. Use 'Dear [Name]' or 'Dear School Administrator'.",
      },
      {
        type: "inappropriate_tone",
        description:
          "Aggressive language ('ashamed', 'NOW') undermines a legitimate complaint. Formal complaints require measured, professional language.",
      },
    ],
    correctVersions: [
      {
        text: "Subject: Complaint Regarding Library Computer Availability\n\nDear School Administrator,\n\nI am writing to formally raise a concern regarding the library computers, which have been consistently unavailable due to technical faults over the past several weeks. This significantly impacts students' ability to complete research and classwork.\n\nI would appreciate your attention to this matter.\n\nYours sincerely,\nStudent Representative",
        isCorrect: true,
      },
      {
        text: "To whoever: the library computers are broken. Please fix them. Thanks",
        isCorrect: false,
      },
      {
        text: "Dear Sir, the computers are always broken and I'm very upset about this. Can someone please sort this out immediately?",
        isCorrect: false,
      },
    ],
  },
  {
    scenario: "Thank-you email to a guest speaker",
    emailText:
      "Subject: Thanks\n\nHi,\nThank you for coming to our school. It was interesting. I learnt alot. Hope to see you again maybe.\nBye",
    errors: [
      {
        type: "wrong_greeting",
        description:
          "'Hi' without a name is too casual. Use the speaker's name or title.",
      },
      {
        type: "spelling_error",
        description: "'alot' is not a word. The correct form is 'a lot'.",
      },
      {
        type: "no_sign_off",
        description:
          "'Bye' is too informal. Use 'Yours sincerely' or 'Kind regards'.",
      },
    ],
    correctVersions: [
      {
        text: "Subject: Thank You for Your Visit to Our School\n\nDear Dr Owusu,\n\nI am writing on behalf of our class to thank you sincerely for taking the time to speak to us yesterday. Your insights on renewable energy engineering were genuinely inspiring and gave us a clearer sense of career pathways in the field.\n\nKind regards,\nKofi Acheampong, Form 3B",
        isCorrect: true,
      },
      {
        text: "Subject: Thanks\n\nHi Dr Owusu, thanks for speaking to our class. It was really inspiring and I learned a lot. Kind regards.",
        isCorrect: false,
      },
      {
        text: "Dear Dr Owusu, thank you for coming. Your talk was very good. We all enjoyed it. Yours sincerely, Kofi",
        isCorrect: false,
      },
    ],
  },
  {
    scenario: "Meeting request to a senior colleague",
    emailText:
      "Subject: meeting\n\nHey Sarah,\nI want to meet you this week because I have some stuff to discuss. Let me know when your free.\nThanks",
    errors: [
      {
        type: "missing_subject",
        description:
          "'meeting' is too vague. A subject like 'Meeting Request — Project Update' is professional.",
      },
      {
        type: "inappropriate_tone",
        description:
          "'stuff to discuss' is unprofessional. Specify the purpose clearly.",
      },
      {
        type: "spelling_error",
        description:
          "'your free' should be 'you're free' — wrong use of your/you're.",
      },
    ],
    correctVersions: [
      {
        text: "Subject: Meeting Request — Project Budget Review\n\nDear Sarah,\n\nI hope you are well. I would appreciate the opportunity to meet this week to discuss the budget allocation for the Q3 project phase. Please let me know your availability.\n\nThank you,\nJames Boateng",
        isCorrect: true,
      },
      {
        text: "Subject: Quick Meeting Request\n\nHi Sarah, do you have time this week to talk about the project? I have a few questions. Thanks, James",
        isCorrect: false,
      },
      {
        text: "Dear Sarah, I would like to schedule a meeting this week to discuss our project. When are you available? Kind regards, James",
        isCorrect: false,
      },
    ],
  },
  {
    scenario: "School project inquiry to an external organisation",
    emailText:
      "Subject: help with project\n\nDear Sir/Madam,\n\nWe are doing a project on climate change and we want information. Can you help us? We need it quite quickly because the deadline is soon.\n\nThank you",
    errors: [
      {
        type: "missing_subject",
        description:
          "'help with project' is too vague. Specify: 'Student Research Inquiry — Climate Change Project'.",
      },
      {
        type: "inappropriate_tone",
        description:
          "'We want information' and 'we need it quite quickly' are demanding. Use polite, conditional phrasing.",
      },
      {
        type: "no_sign_off",
        description: "'Thank you' alone is incomplete. Add a name and school.",
      },
    ],
    correctVersions: [
      {
        text: "Subject: Student Research Inquiry — Climate Change Project\n\nDear [Organisation Name] Team,\n\nI am writing on behalf of my class at [School Name]. We are currently undertaking a research project on the local impacts of climate change and would greatly appreciate any resources or guidance your organisation could offer.\n\nThank you for your time and consideration.\n\nYours sincerely,\nAbena Darko, Form 4, [School Name]",
        isCorrect: true,
      },
      {
        text: "Subject: Climate Change Research\n\nDear Sir/Madam, our class is researching climate change. Could you provide information or resources? Thank you, Abena Darko",
        isCorrect: false,
      },
      {
        text: "Dear Organisation, we need information about climate change for our project. Can you help? Thank you, the students",
        isCorrect: false,
      },
    ],
  },
  {
    scenario: "Email to a teacher requesting exam feedback",
    emailText:
      "Subject: My exam\n\nDear Miss Asante,\n\nI was disappointment with my exam grade. Can you tell me what went wrong and what i need to do better next time.\n\nRegards",
    errors: [
      {
        type: "spelling_error",
        description:
          "'disappointment' should be 'disappointed'. Subject-verb agreement error.",
      },
      {
        type: "spelling_error",
        description: "'what i need' — 'i' should be capitalised as 'I'.",
      },
      {
        type: "no_sign_off",
        description:
          "'Regards' without a name is incomplete. Always include your full name.",
      },
    ],
    correctVersions: [
      {
        text: "Subject: Request for Exam Feedback\n\nDear Miss Asante,\n\nI hope you are well. I was disappointed with my performance in the recent exam and would appreciate any feedback on where I lost marks so that I can improve for future assessments.\n\nThank you for your time.\n\nKind regards,\nBenedicta Owusu",
        isCorrect: true,
      },
      {
        text: "Dear Miss Asante, could you please give me feedback on my exam? I want to do better next time. Kind regards, Benedicta",
        isCorrect: false,
      },
      {
        text: "Dear Miss Asante, I did not do well in the exam. What did I do wrong? Regards, Benedicta Owusu",
        isCorrect: false,
      },
    ],
  },
  {
    scenario: "Email to a potential employer requesting work experience",
    emailText:
      "Subject: Work Experience\n\nDear [Company],\n\nI am a student and I want work experience. I am hardworking and eager to learn. I am available in July. Please reply if you have anything.\n\nThank you\nKweku",
    errors: [
      {
        type: "wrong_greeting",
        description:
          "'Dear [Company]' should be a named contact where possible, or 'Dear Hiring Manager' formally.",
      },
      {
        type: "inappropriate_tone",
        description:
          "'Please reply if you have anything' sounds passive and uncertain. State your request confidently and professionally.",
      },
    ],
    correctVersions: [
      {
        text: "Subject: Work Experience Application — July Placement\n\nDear Hiring Manager,\n\nI am a Form 5 student at [School Name] with a strong interest in [industry]. I am writing to enquire about any available work experience placements in July. I am motivated, reliable, and eager to contribute.\n\nI have attached a brief CV for your consideration and would welcome the opportunity to discuss further.\n\nYours sincerely,\nKweku Asante",
        isCorrect: true,
      },
      {
        text: "Dear Hiring Manager, I am a student looking for work experience in July. I am hardworking and reliable. Could you let me know if you have any placements available? Kind regards, Kweku Asante",
        isCorrect: false,
      },
      {
        text: "Subject: July Work Experience Request\n\nDear [Company], I am interested in a work experience placement. I am available in July and would appreciate any opportunity. Thank you, Kweku",
        isCorrect: false,
      },
    ],
  },
  {
    scenario: "Email to a librarian requesting a resource extension",
    emailText:
      "Subject: Book\n\nHi,\n\ni borrowed a book last week and i still need it for my project. Can you extend it please. The book is called The History of Science.\n\nThanks",
    errors: [
      {
        type: "missing_subject",
        description:
          "'Book' is too vague. Use 'Loan Extension Request — The History of Science'.",
      },
      {
        type: "spelling_error",
        description:
          "'i' should always be capitalised as 'I'. This appears twice.",
      },
      {
        type: "no_sign_off",
        description:
          "'Thanks' alone is incomplete. Include your name and library card number if relevant.",
      },
    ],
    correctVersions: [
      {
        text: "Subject: Loan Extension Request — The History of Science\n\nDear Librarian,\n\nI am currently borrowing a copy of The History of Science and would like to request an extension as I am still using it for an ongoing school project. I would be grateful if the loan period could be extended by one week.\n\nKind regards,\nEsi Amoah, Form 3A",
        isCorrect: true,
      },
      {
        text: "Subject: Extension for Book Loan\n\nDear Librarian, I would like to extend my loan for The History of Science as I still need it for my project. Thank you, Esi Amoah",
        isCorrect: false,
      },
      {
        text: "Hi, could I keep the science history book for a bit longer? Thanks, Esi",
        isCorrect: false,
      },
    ],
  },
  {
    scenario: "Email to a parent after a sports event",
    emailText:
      "Subject: Event\n\nDear Parents,\n\nThank you for coming to our sports day. It was great to see many of you there. We hope you enjoyed watching your children compete. The results will be sent seperately.\n\nRegards\nSports Dept",
    errors: [
      {
        type: "missing_subject",
        description:
          "'Event' is too vague. Use 'Thank You for Attending Sports Day 2025'.",
      },
      {
        type: "spelling_error",
        description:
          "'seperately' is misspelled. The correct spelling is 'separately'.",
      },
    ],
    correctVersions: [
      {
        text: "Subject: Thank You for Attending Sports Day 2025\n\nDear Parents and Guardians,\n\nThank you for joining us at our annual Sports Day. Your support made the event memorable for our students.\n\nResult sheets will be distributed to students separately next week.\n\nKind regards,\nThe Sports Department",
        isCorrect: true,
      },
      {
        text: "Subject: Sports Day Follow-Up\n\nDear Parents, thank you for attending Sports Day. Results will be sent separately. Regards, Sports Dept",
        isCorrect: false,
      },
      {
        text: "Dear Parents, it was great to see you at sports day. Results coming soon. Thanks!",
        isCorrect: false,
      },
    ],
  },
  {
    scenario: "Email confirming attendance at a school event",
    emailText:
      "Subject: RE: School Trip Confirmation\n\nDear Mrs Owusu\n\nI confirm i will attend the trip on March 15th. My parents have given permission. I will bring the signed form tomorrow.\n\nBest Wishes\nAfia",
    errors: [
      {
        type: "spelling_error",
        description:
          "'I confirm i' — the second 'i' should be 'I'. Capitalisation of 'I' is mandatory.",
      },
    ],
    correctVersions: [
      {
        text: "Subject: RE: School Trip Confirmation\n\nDear Mrs Owusu,\n\nI am writing to confirm my attendance on the school trip on 15 March. My parents have given their full consent and I will bring the signed permission form to school tomorrow.\n\nBest wishes,\nAfia Boateng",
        isCorrect: true,
      },
      {
        text: "Dear Mrs Owusu, I can attend the trip. My parents said yes. I'll bring the form. Best wishes, Afia",
        isCorrect: false,
      },
      {
        text: "Dear Mrs Owusu, confirmed for March 15th. Signed form coming. Thanks, Afia",
        isCorrect: false,
      },
    ],
  },
];

const ERROR_TYPE_LABELS: Record<EmailError, string> = {
  wrong_greeting: "Wrong Greeting",
  missing_subject: "Missing/Vague Subject",
  inappropriate_tone: "Inappropriate Tone",
  no_sign_off: "Missing Sign-Off",
  spelling_error: "Spelling Error",
};

const ERROR_TYPE_COLORS: Record<EmailError, string> = {
  wrong_greeting: "#f59e0b",
  missing_subject: "#a855f7",
  inappropriate_tone: "#f43f5e",
  no_sign_off: "#6366f1",
  spelling_error: "#ef4444",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CommunicationSkills({ config, onGameEnd }: Props) {
  const gameId = config.gameId;

  // ── Shared ─────────────────────────────────────────────────────────────────
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.livesCount);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const startTimeRef = useRef(Date.now());
  const gameOverRef = useRef(false);
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  const totalRef = useRef(total);
  const livesRef = useRef(lives);
  scoreRef.current = score;
  correctRef.current = correct;
  totalRef.current = total;
  livesRef.current = lives;

  const endGame = useCallback(
    (done: boolean) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      const acc =
        totalRef.current > 0
          ? (correctRef.current / totalRef.current) * 100
          : 0;
      onGameEnd(
        buildResult(
          config,
          scoreRef.current,
          acc,
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          done,
        ),
      );
    },
    [config, onGameEnd],
  );

  const { timeLeft } = useGameTimer(config.timeLimit, () => endGame(false));
  const timePct = (timeLeft / config.timeLimit) * 100;

  // ── GAME 1: Social Situations ───────────────────────────────────────────────
  const scenarioCount =
    config.difficulty === 1 ? 4 : config.difficulty === 2 ? 7 : 12;
  const [g1Scenarios] = useState<SocialScenario[]>(() =>
    shuffle(SOCIAL_SCENARIOS).slice(0, scenarioCount),
  );
  const [g1Phase, setG1Phase] = useState<"idle" | "playing" | "feedback">(
    "idle",
  );
  const [g1Idx, setG1Idx] = useState(0);
  const [g1Chosen, setG1Chosen] = useState<number | null>(null);
  const [g1NonVerbal, setG1NonVerbal] = useState<number[]>([]);
  const [g1Feedback, setG1Feedback] = useState<{
    ok: boolean;
    msg: string;
    pts: number;
  } | null>(null);

  const g1Scenario = g1Scenarios[g1Idx];

  function handleG1Verbal(optIdx: number) {
    if (g1Feedback) return;
    setG1Chosen(optIdx);
  }

  function toggleG1NonVerbal(i: number) {
    if (g1Feedback) return;
    setG1NonVerbal((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }

  function submitG1() {
    if (g1Chosen === null || !g1Scenario) return;
    const opt = g1Scenario.verbalOptions[g1Chosen];
    const isBest = g1Chosen === g1Scenario.bestVerbalIndex;
    const correctNV = g1NonVerbal.filter((i) =>
      g1Scenario.correctNonVerbals.includes(i),
    ).length;
    const pts = opt.score * 40 + correctNV * 30;
    setScore((s) => s + pts * config.difficulty);
    setTotal((t) => t + 3);
    setCorrect((c) => c + (isBest ? 1 : 0) + correctNV);
    if (!isBest) {
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 2000);
        return nl;
      });
    }
    setG1Feedback({ ok: isBest, msg: opt.consequence, pts });
    setG1Phase("feedback");
    setTimeout(() => {
      setG1Feedback(null);
      setG1Chosen(null);
      setG1NonVerbal([]);
      if (g1Idx + 1 >= g1Scenarios.length) {
        endGame(true);
        return;
      }
      setG1Idx((i) => i + 1);
      setG1Phase("playing");
    }, 3000);
  }

  // ── GAME 2: Active Listener ─────────────────────────────────────────────────
  const listenCount =
    config.difficulty === 1 ? 5 : config.difficulty === 2 ? 10 : 15;
  const [g2Exchanges] = useState<ListeningExchange[]>(() =>
    shuffle(LISTENING_EXCHANGES).slice(0, listenCount),
  );
  const [g2Phase, setG2Phase] = useState<"idle" | "playing" | "feedback">(
    "idle",
  );
  const [g2Idx, setG2Idx] = useState(0);
  const [g2Technique, setG2Technique] = useState<ListeningTechnique | null>(
    null,
  );
  const [g2Feedback, setG2Feedback] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const [g2ShowAnswer, setG2ShowAnswer] = useState(false);

  const g2Exchange = g2Exchanges[g2Idx];

  function handleG2Answer(active: boolean) {
    if (g2Feedback) return;
    const pts = active ? 200 * config.difficulty : 0;
    setScore((s) => s + pts);
    setTotal((t) => t + 1);
    if (active) setCorrect((c) => c + 1);
    else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 2500);
        return nl;
      });
    setG2Feedback({ ok: active, msg: g2Exchange.explanation });
    setG2Phase("feedback");
    setG2ShowAnswer(false);
  }

  function submitG2Technique() {
    if (!g2Technique) return;
    const correct_tech = g2Technique === g2Exchange.technique;
    const pts = correct_tech ? 100 * config.difficulty : 0;
    setScore((s) => s + pts);
    setTotal((t) => t + 1);
    if (correct_tech) setCorrect((c) => c + 1);
    setTimeout(() => {
      setG2Feedback(null);
      setG2Technique(null);
      if (g2Idx + 1 >= g2Exchanges.length) {
        endGame(true);
        return;
      }
      setG2Idx((i) => i + 1);
      setG2Phase("playing");
    }, 2500);
  }

  // ── GAME 3: Email Etiquette ─────────────────────────────────────────────────
  const emailCount =
    config.difficulty === 1 ? 4 : config.difficulty === 2 ? 7 : 10;
  const [g3Emails] = useState<EmailScenario[]>(() =>
    shuffle(EMAIL_SCENARIOS).slice(0, emailCount),
  );
  const [g3Phase, setG3Phase] = useState<
    "idle" | "identify" | "correct" | "result"
  >("idle");
  const [g3Idx, setG3Idx] = useState(0);
  const [g3SelectedErrors, setG3SelectedErrors] = useState<string[]>([]);
  const [g3CorrectVersion, setG3CorrectVersion] = useState<number | null>(null);
  const [g3Phase2, setG3Phase2] = useState(false);

  const g3Email = g3Emails[g3Idx];

  function toggleG3Error(type: string) {
    setG3SelectedErrors((prev) =>
      prev.includes(type) ? prev.filter((x) => x !== type) : [...prev, type],
    );
  }

  function submitG3Errors() {
    if (g3SelectedErrors.length === 0) return;
    const correctErrors = g3Email.errors.map((e) => e.type);
    const correctHits = g3SelectedErrors.filter((e) =>
      correctErrors.includes(e as EmailError),
    ).length;
    const pts = correctHits * 80 * config.difficulty;
    setScore((s) => s + pts);
    setTotal((t) => t + correctErrors.length);
    setCorrect((c) => c + correctHits);
    setG3Phase2(true);
  }

  function submitG3Correction() {
    if (g3CorrectVersion === null) return;
    const correct_v = g3Email.correctVersions[g3CorrectVersion].isCorrect;
    const pts = correct_v ? 200 * config.difficulty : 0;
    setScore((s) => s + pts);
    setTotal((t) => t + 1);
    if (correct_v) setCorrect((c) => c + 1);
    else
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(false), 2000);
        return nl;
      });
    setG3Phase("result");
  }

  function nextG3Email() {
    if (g3Idx + 1 >= g3Emails.length) {
      endGame(true);
      return;
    }
    setG3Idx((i) => i + 1);
    setG3SelectedErrors([]);
    setG3CorrectVersion(null);
    setG3Phase2(false);
    setG3Phase("identify");
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full h-full flex flex-col gap-3 select-none"
      data-ocid="communication_skills.page"
    >
      {/* HUD */}
      <div className="game-hud flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#10b981]" />
          <span className="font-bold text-[#00f5ff]">
            {score.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: config.livesCount }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className={`h-4 w-4 ${i < lives ? "text-[#f43f5e] fill-[#f43f5e]" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#10b981] transition-all duration-1000"
              style={{ width: `${timePct}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* ═══════════ GAME 1: Social Situations ═══════════ */}
      {gameId === "social-situations" && (
        <>
          {g1Phase === "idle" && (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
              >
                <MessageSquare className="h-14 w-14 mx-auto mb-4 text-[#10b981]" />
                <h2
                  className="text-3xl font-black mb-2"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: "#10b981",
                  }}
                >
                  Social Situations
                </h2>
                <p className="text-muted-foreground text-sm mb-2">
                  {scenarioCount} social scenarios. For each: select the best
                  verbal response AND the appropriate non-verbal behaviours.
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Best verbal: up to +160 pts. Each correct non-verbal: +30 pts.
                </p>
                <GlowButton
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    startTimeRef.current = Date.now();
                    setG1Phase("playing");
                  }}
                  data-ocid="communication_skills.start_button"
                >
                  Begin Training
                </GlowButton>
              </motion.div>
            </div>
          )}

          {(g1Phase === "playing" || g1Phase === "feedback") && g1Scenario && (
            <div className="flex-1 flex flex-col gap-3 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={g1Scenario.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="flex flex-col gap-3"
                >
                  <div className="glass-card rounded-xl p-4 border border-[#10b981]/30">
                    <p
                      className="text-xs uppercase tracking-widest text-[#10b981] mb-1"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      {g1Scenario.context} — {g1Idx + 1}/{g1Scenarios.length}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {g1Scenario.situation}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    Select the best verbal response:
                  </p>
                  <div className="flex flex-col gap-2">
                    {g1Scenario.verbalOptions.map((opt, i) => {
                      const isSel = g1Chosen === i;
                      const isBest = i === g1Scenario.bestVerbalIndex;
                      const show = g1Feedback !== null;
                      let cls =
                        "border-border/40 hover:border-[#10b981]/40 text-foreground";
                      if (show && isBest)
                        cls = "border-[#10b981] bg-[#10b981]/15 text-[#10b981]";
                      else if (show && isSel && !isBest)
                        cls =
                          "border-[#f43f5e]/60 bg-[#f43f5e]/10 text-[#f43f5e]";
                      else if (isSel)
                        cls =
                          "border-[#10b981]/60 bg-[#10b981]/10 text-[#10b981]";
                      return (
                        <motion.button
                          key={i}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleG1Verbal(i)}
                          disabled={!!g1Feedback}
                          data-ocid={`communication_skills.verbal.${i + 1}`}
                          className={`text-left px-4 py-3 rounded-xl border text-sm transition-all glass-card ${cls}`}
                        >
                          {opt.text}
                        </motion.button>
                      );
                    })}
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    Select appropriate non-verbal behaviours (2):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {g1Scenario.nonVerbalOptions.map((opt, i) => {
                      const isSel = g1NonVerbal.includes(i);
                      const show = g1Feedback !== null;
                      const isCorrect =
                        g1Scenario.correctNonVerbals.includes(i);
                      let cls =
                        "border-border/40 hover:border-[#7c3aed]/40 text-foreground";
                      if (show && isCorrect)
                        cls = "border-[#10b981] bg-[#10b981]/15 text-[#10b981]";
                      else if (show && isSel && !isCorrect)
                        cls =
                          "border-[#f43f5e]/60 bg-[#f43f5e]/10 text-[#f43f5e]";
                      else if (isSel)
                        cls =
                          "border-[#7c3aed]/60 bg-[#7c3aed]/10 text-[#7c3aed]";
                      return (
                        <motion.button
                          key={i}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleG1NonVerbal(i)}
                          disabled={!!g1Feedback}
                          data-ocid={`communication_skills.nonverbal.${i + 1}`}
                          className={`text-left px-3 py-2 rounded-xl border text-xs transition-all glass-card ${cls}`}
                        >
                          {opt.text}
                        </motion.button>
                      );
                    })}
                  </div>
                  {!g1Feedback && (
                    <GlowButton
                      variant="primary"
                      size="md"
                      disabled={g1Chosen === null}
                      onClick={submitG1}
                      data-ocid="communication_skills.submit_button"
                    >
                      Submit Response
                    </GlowButton>
                  )}
                  {g1Feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl border p-4 flex items-start gap-3 ${g1Feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f59e0b]/40 bg-[#f59e0b]/10"}`}
                      data-ocid={
                        g1Feedback.ok
                          ? "communication_skills.success_state"
                          : "communication_skills.error_state"
                      }
                    >
                      {g1Feedback.ok ? (
                        <CheckCircle className="h-5 w-5 text-[#10b981] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-[#f59e0b] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p
                          className={`text-sm font-bold mb-1 ${g1Feedback.ok ? "text-[#10b981]" : "text-[#f59e0b]"}`}
                        >
                          {g1Feedback.ok ? "Best Response" : "Consequence"}
                        </p>
                        <p className="text-sm text-foreground/80">
                          {g1Feedback.msg}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          +{g1Feedback.pts * config.difficulty} pts
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* ═══════════ GAME 2: Active Listener ═══════════ */}
      {gameId === "active-listener" && (
        <>
          {g2Phase === "idle" && (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
              >
                <MessageSquare className="h-14 w-14 mx-auto mb-4 text-[#7c3aed]" />
                <h2
                  className="text-3xl font-black mb-2"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: "#7c3aed",
                  }}
                >
                  Active Listener
                </h2>
                <p className="text-muted-foreground text-sm mb-2">
                  {listenCount} conversation exchanges. Identify which response
                  shows active listening, then name the technique used.
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Techniques: Paraphrasing / Clarifying Question / Empathetic
                  Response / Validation.
                </p>
                <GlowButton
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    startTimeRef.current = Date.now();
                    setG2Phase("playing");
                  }}
                  data-ocid="communication_skills.g2_start_button"
                >
                  Begin Listening
                </GlowButton>
              </motion.div>
            </div>
          )}

          {(g2Phase === "playing" || g2Phase === "feedback") && g2Exchange && (
            <div className="flex-1 flex flex-col gap-3 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={g2Idx}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="flex flex-col gap-3"
                >
                  <div className="glass-card rounded-xl p-4 border border-[#7c3aed]/30">
                    <p
                      className="text-xs uppercase tracking-widest text-[#7c3aed] mb-1"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      Exchange {g2Idx + 1} of {g2Exchanges.length}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground mb-1">
                      Speaker says:
                    </p>
                    <p className="text-sm font-semibold text-foreground italic">
                      "{g2Exchange.speaker}"
                    </p>
                  </div>
                  {!g2Feedback && (
                    <>
                      <p className="text-xs font-bold text-foreground">
                        Which response shows active listening?
                      </p>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleG2Answer(true)}
                        data-ocid="communication_skills.g2_active"
                        className="text-left px-4 py-3 rounded-xl border border-[#7c3aed]/30 text-sm text-foreground hover:border-[#7c3aed] transition-all glass-card"
                      >
                        <span className="text-xs font-bold text-[#7c3aed] block mb-1">
                          Response A:
                        </span>
                        {g2Exchange.activeResponse}
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleG2Answer(false)}
                        data-ocid="communication_skills.g2_passive"
                        className="text-left px-4 py-3 rounded-xl border border-border/40 text-sm text-foreground hover:border-[#f43f5e]/30 transition-all glass-card"
                      >
                        <span className="text-xs font-bold text-muted-foreground block mb-1">
                          Response B:
                        </span>
                        {g2Exchange.passiveResponse}
                      </motion.button>
                    </>
                  )}
                  {g2Feedback && !g2ShowAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl border p-4 ${g2Feedback.ok ? "border-[#10b981]/40 bg-[#10b981]/10" : "border-[#f43f5e]/40 bg-[#f43f5e]/10"}`}
                      data-ocid={
                        g2Feedback.ok
                          ? "communication_skills.g2_success"
                          : "communication_skills.g2_error"
                      }
                    >
                      {g2Feedback.ok ? (
                        <CheckCircle className="h-5 w-5 text-[#10b981] mb-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-[#f43f5e] mb-2" />
                      )}
                      <p
                        className={`text-sm font-bold mb-1 ${g2Feedback.ok ? "text-[#10b981]" : "text-[#f43f5e]"}`}
                      >
                        {g2Feedback.ok
                          ? "Active listening identified"
                          : "That was the passive response"}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {g2Feedback.msg}
                      </p>
                      <p className="text-xs font-bold text-foreground mb-2">
                        Which technique was used in the active response?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            "paraphrasing",
                            "clarifying_question",
                            "empathetic_response",
                            "validation",
                          ] as ListeningTechnique[]
                        ).map((tech) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => setG2Technique(tech)}
                            data-ocid={`communication_skills.g2_technique.${tech}`}
                            className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${g2Technique === tech ? "border-[#7c3aed] bg-[#7c3aed]/20 text-[#7c3aed]" : "border-border/40 text-foreground hover:border-[#7c3aed]/40"}`}
                          >
                            {TECHNIQUE_LABELS[tech]}
                          </button>
                        ))}
                      </div>
                      {g2Technique && (
                        <GlowButton
                          variant="primary"
                          size="sm"
                          onClick={submitG2Technique}
                          data-ocid="communication_skills.g2_technique_submit"
                          className="mt-3"
                        >
                          Confirm Technique
                        </GlowButton>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* ═══════════ GAME 3: Email Etiquette ═══════════ */}
      {gameId === "email-etiquette" && (
        <>
          {g3Phase === "idle" && (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-10 text-center max-w-lg w-full"
              >
                <Mail className="h-14 w-14 mx-auto mb-4 text-[#6366f1]" />
                <h2
                  className="text-3xl font-black mb-2"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: "#6366f1",
                  }}
                >
                  Email Etiquette
                </h2>
                <p className="text-muted-foreground text-sm mb-2">
                  {emailCount} email audits. Identify all errors by type, then
                  select the correctly rewritten version.
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Error types: Wrong Greeting / Missing Subject / Inappropriate
                  Tone / No Sign-Off / Spelling Error.
                </p>
                <GlowButton
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    startTimeRef.current = Date.now();
                    setG3Phase("identify");
                  }}
                  data-ocid="communication_skills.g3_start_button"
                >
                  Begin Audit
                </GlowButton>
              </motion.div>
            </div>
          )}

          {(g3Phase === "identify" || g3Phase === "correct") && g3Email && (
            <div className="flex-1 flex flex-col gap-3 overflow-auto">
              <div className="glass-card rounded-xl p-4 border border-[#6366f1]/30 shrink-0">
                <p
                  className="text-xs uppercase tracking-widest text-[#6366f1] mb-1"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Email {g3Idx + 1} of {g3Emails.length}: {g3Email.scenario}
                </p>
                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono bg-background/50 rounded-lg p-3 mt-2 leading-relaxed">
                  {g3Email.emailText}
                </pre>
              </div>

              {!g3Phase2 ? (
                <>
                  <p className="text-xs font-bold text-foreground">
                    Identify all error types present in this email:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        "wrong_greeting",
                        "missing_subject",
                        "inappropriate_tone",
                        "no_sign_off",
                        "spelling_error",
                      ] as EmailError[]
                    ).map((errType) => {
                      const sel = g3SelectedErrors.includes(errType);
                      const color = ERROR_TYPE_COLORS[errType];
                      const borderSel = {
                        borderColor: color,
                        background: `${color}18`,
                      };
                      const borderNorm = { borderColor: `${color}40` };
                      return (
                        <button
                          key={errType}
                          type="button"
                          onClick={() => toggleG3Error(errType)}
                          data-ocid={`communication_skills.g3_error.${errType}`}
                          className={
                            "px-3 py-2 rounded-lg border text-xs font-bold transition-all"
                          }
                          style={sel ? borderSel : borderNorm}
                        >
                          <span style={{ color }}>
                            {ERROR_TYPE_LABELS[errType]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <GlowButton
                    variant="primary"
                    size="md"
                    disabled={g3SelectedErrors.length === 0}
                    onClick={submitG3Errors}
                    data-ocid="communication_skills.g3_identify_submit"
                  >
                    Confirm Error Types
                  </GlowButton>
                </>
              ) : (
                <>
                  <div className="glass-card rounded-xl p-3 border border-[#10b981]/30">
                    <p className="text-xs font-bold text-[#10b981] mb-2">
                      Errors found:
                    </p>
                    {g3Email.errors.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 mb-1">
                        {g3SelectedErrors.includes(e.type) ? (
                          <CheckCircle className="h-3 w-3 text-[#10b981] mt-0.5 shrink-0" />
                        ) : (
                          <XCircle className="h-3 w-3 text-[#f43f5e] mt-0.5 shrink-0" />
                        )}
                        <p className="text-xs text-foreground/80">
                          {e.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    Select the correctly rewritten version:
                  </p>
                  <div className="flex flex-col gap-2">
                    {g3Email.correctVersions.map((ver, i) => {
                      const sel = g3CorrectVersion === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setG3CorrectVersion(i)}
                          data-ocid={`communication_skills.g3_version.${i + 1}`}
                          className={`text-left px-3 py-3 rounded-xl border text-xs font-mono whitespace-pre-wrap transition-all ${sel ? "border-[#6366f1] bg-[#6366f1]/10 text-foreground" : "border-border/40 text-foreground hover:border-[#6366f1]/40"}`}
                        >
                          {ver.text}
                        </button>
                      );
                    })}
                  </div>
                  <GlowButton
                    variant="primary"
                    size="md"
                    disabled={g3CorrectVersion === null}
                    onClick={submitG3Correction}
                    data-ocid="communication_skills.g3_version_submit"
                  >
                    Submit Correction
                  </GlowButton>
                </>
              )}
            </div>
          )}

          {g3Phase === "result" && g3CorrectVersion !== null && g3Email && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`result-${g3Idx}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col gap-3 overflow-auto"
              >
                <div
                  className={`glass-card rounded-xl p-4 border ${g3Email.correctVersions[g3CorrectVersion].isCorrect ? "border-[#10b981]/40" : "border-[#f43f5e]/40"}`}
                  data-ocid={
                    g3Email.correctVersions[g3CorrectVersion].isCorrect
                      ? "communication_skills.g3_success"
                      : "communication_skills.g3_error"
                  }
                >
                  {g3Email.correctVersions[g3CorrectVersion].isCorrect ? (
                    <>
                      <CheckCircle className="h-8 w-8 text-[#10b981] mb-2" />
                      <p className="text-sm font-bold text-[#10b981] mb-1">
                        Correct rewrite selected
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-8 w-8 text-[#f43f5e] mb-2" />
                      <p className="text-sm font-bold text-[#f43f5e] mb-1">
                        Incorrect rewrite
                      </p>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Professional version:
                  </p>
                  <pre className="text-xs font-mono whitespace-pre-wrap mt-1 text-foreground/80">
                    {g3Email.correctVersions.find((v) => v.isCorrect)?.text}
                  </pre>
                </div>
                <GlowButton
                  variant="primary"
                  size="md"
                  onClick={nextG3Email}
                  data-ocid="communication_skills.g3_next_button"
                >
                  {g3Idx + 1 < g3Emails.length ? "Next Email" : "Finish"}
                </GlowButton>
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  );
}
