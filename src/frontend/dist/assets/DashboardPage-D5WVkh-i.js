import { c as createLucideIcon, s as isEasingArray, V as VisualElement, t as createBox, w as useConstant, x as motionValue, r as reactExports, M as MotionConfigContext, y as resolveElements, z as mixNumber, B as removeItem, D as isMotionValue, E as defaultOffset, F as createGeneratorEasing, H as fillOffset, I as isGenerator, J as secondsToMilliseconds, K as progress, N as isSVGElement, O as isSVGSVGElement, Q as SVGVisualElement, R as HTMLVisualElement, T as visualElementStore, U as animateSingleValue, W as animateTarget, X as spring, j as jsxRuntimeExports, m as motion, h as Shield, Z as Zap, i as Star, Y as useMyProfile, $ as useMyProgression, a as useAllHubProgress, f as useMyRecentScores, b as ProgressRing, a0 as Link, a1 as GradeLevel } from "./index-YNz7x6b_.js";
import { c as cn, L as Layout } from "./Layout-DS1GQZu5.js";
import { a as Trophy, T as Target } from "./trophy-hcACKst3.js";
import { K as Keyboard } from "./keyboard-ClqhCTD4.js";
import { C as CircleCheckBig } from "./circle-check-big-CtJI2EqC.js";
import { T as TrendingUp } from "./trending-up-JJXGTBBd.js";
import { C as Coins } from "./map-DQRt6rDA.js";
import { C as Clock } from "./clock-BMYSPsG3.js";
import "./x-BjS-gBGY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$2);
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
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode);
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
};
function getEasingForSegment(easing, i) {
  return isEasingArray(easing) ? easing[wrap(0, easing.length, i)] : easing;
}
class GroupAnimation {
  constructor(animations) {
    this.stop = () => this.runAll("stop");
    this.animations = animations.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((animation) => animation.finished));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(propName) {
    return this.animations[0][propName];
  }
  setAll(propName, newValue) {
    for (let i = 0; i < this.animations.length; i++) {
      this.animations[i][propName] = newValue;
    }
  }
  attachTimeline(timeline) {
    const subscriptions = this.animations.map((animation) => animation.attachTimeline(timeline));
    return () => {
      subscriptions.forEach((cancel, i) => {
        cancel && cancel();
        this.animations[i].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(time) {
    this.setAll("time", time);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(speed) {
    this.setAll("speed", speed);
  }
  get state() {
    return this.getAll("state");
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    return getMax(this.animations, "duration");
  }
  get iterationDuration() {
    return getMax(this.animations, "iterationDuration");
  }
  runAll(methodName) {
    this.animations.forEach((controls) => controls[methodName]());
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
function getMax(animations, propName) {
  let max = 0;
  for (let i = 0; i < animations.length; i++) {
    const value = animations[i][propName];
    if (value !== null && value > max) {
      max = value;
    }
  }
  return max;
}
class GroupAnimationWithThen extends GroupAnimation {
  then(onResolve, _onReject) {
    return this.finished.finally(onResolve).then(() => {
    });
  }
}
function isObjectKey(key, object) {
  return key in object;
}
class ObjectVisualElement extends VisualElement {
  constructor() {
    super(...arguments);
    this.type = "object";
  }
  readValueFromInstance(instance, key) {
    if (isObjectKey(key, instance)) {
      const value = instance[key];
      if (typeof value === "string" || typeof value === "number") {
        return value;
      }
    }
    return void 0;
  }
  getBaseTargetFromProps() {
    return void 0;
  }
  removeValueFromRenderState(key, renderState) {
    delete renderState.output[key];
  }
  measureInstanceViewportBox() {
    return createBox();
  }
  build(renderState, latestValues) {
    Object.assign(renderState.output, latestValues);
  }
  renderInstance(instance, { output }) {
    Object.assign(instance, output);
  }
  sortInstanceNodePosition() {
    return 0;
  }
}
function useMotionValue(initial) {
  const value = useConstant(() => motionValue(initial));
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  if (isStatic) {
    const [, setLatest] = reactExports.useState(initial);
    reactExports.useEffect(() => value.on("change", setLatest), []);
  }
  return value;
}
function isDOMKeyframes(keyframes) {
  return typeof keyframes === "object" && !Array.isArray(keyframes);
}
function resolveSubjects(subject, keyframes, scope, selectorCache) {
  if (subject == null) {
    return [];
  }
  if (typeof subject === "string" && isDOMKeyframes(keyframes)) {
    return resolveElements(subject, scope, selectorCache);
  } else if (subject instanceof NodeList) {
    return Array.from(subject);
  } else if (Array.isArray(subject)) {
    return subject.filter((s) => s != null);
  } else {
    return [subject];
  }
}
function calculateRepeatDuration(duration, repeat, _repeatDelay) {
  return duration * (repeat + 1);
}
function calcNextTime(current, next, prev, labels) {
  if (typeof next === "number") {
    return next;
  } else if (next.startsWith("-") || next.startsWith("+")) {
    return Math.max(0, current + parseFloat(next));
  } else if (next === "<") {
    return prev;
  } else if (next.startsWith("<")) {
    return Math.max(0, prev + parseFloat(next.slice(1)));
  } else {
    return labels.get(next) ?? current;
  }
}
function eraseKeyframes(sequence, startTime, endTime) {
  for (let i = 0; i < sequence.length; i++) {
    const keyframe = sequence[i];
    if (keyframe.at > startTime && keyframe.at < endTime) {
      removeItem(sequence, keyframe);
      i--;
    }
  }
}
function addKeyframes(sequence, keyframes, easing, offset, startTime, endTime) {
  eraseKeyframes(sequence, startTime, endTime);
  for (let i = 0; i < keyframes.length; i++) {
    sequence.push({
      value: keyframes[i],
      at: mixNumber(startTime, endTime, offset[i]),
      easing: getEasingForSegment(easing, i)
    });
  }
}
function normalizeTimes(times, repeat) {
  for (let i = 0; i < times.length; i++) {
    times[i] = times[i] / (repeat + 1);
  }
}
function compareByTime(a, b) {
  if (a.at === b.at) {
    if (a.value === null)
      return 1;
    if (b.value === null)
      return -1;
    return 0;
  } else {
    return a.at - b.at;
  }
}
const defaultSegmentEasing = "easeInOut";
function createAnimationsFromSequence(sequence, { defaultTransition = {}, ...sequenceTransition } = {}, scope, generators) {
  const defaultDuration = defaultTransition.duration || 0.3;
  const animationDefinitions = /* @__PURE__ */ new Map();
  const sequences = /* @__PURE__ */ new Map();
  const elementCache = {};
  const timeLabels = /* @__PURE__ */ new Map();
  let prevTime = 0;
  let currentTime = 0;
  let totalDuration = 0;
  for (let i = 0; i < sequence.length; i++) {
    const segment = sequence[i];
    if (typeof segment === "string") {
      timeLabels.set(segment, currentTime);
      continue;
    } else if (!Array.isArray(segment)) {
      timeLabels.set(segment.name, calcNextTime(currentTime, segment.at, prevTime, timeLabels));
      continue;
    }
    let [subject, keyframes, transition = {}] = segment;
    if (transition.at !== void 0) {
      currentTime = calcNextTime(currentTime, transition.at, prevTime, timeLabels);
    }
    let maxDuration = 0;
    const resolveValueSequence = (valueKeyframes, valueTransition, valueSequence, elementIndex = 0, numSubjects = 0) => {
      const valueKeyframesAsList = keyframesAsList(valueKeyframes);
      const { delay = 0, times = defaultOffset(valueKeyframesAsList), type = defaultTransition.type || "keyframes", repeat, repeatType, repeatDelay = 0, ...remainingTransition } = valueTransition;
      let { ease = defaultTransition.ease || "easeOut", duration } = valueTransition;
      const calculatedDelay = typeof delay === "function" ? delay(elementIndex, numSubjects) : delay;
      const numKeyframes = valueKeyframesAsList.length;
      const createGenerator = isGenerator(type) ? type : generators == null ? void 0 : generators[type || "keyframes"];
      if (numKeyframes <= 2 && createGenerator) {
        let absoluteDelta = 100;
        if (numKeyframes === 2 && isNumberKeyframesArray(valueKeyframesAsList)) {
          const delta = valueKeyframesAsList[1] - valueKeyframesAsList[0];
          absoluteDelta = Math.abs(delta);
        }
        const springTransition = {
          ...defaultTransition,
          ...remainingTransition
        };
        if (duration !== void 0) {
          springTransition.duration = secondsToMilliseconds(duration);
        }
        const springEasing = createGeneratorEasing(springTransition, absoluteDelta, createGenerator);
        ease = springEasing.ease;
        duration = springEasing.duration;
      }
      duration ?? (duration = defaultDuration);
      const startTime = currentTime + calculatedDelay;
      if (times.length === 1 && times[0] === 0) {
        times[1] = 1;
      }
      const remainder = times.length - valueKeyframesAsList.length;
      remainder > 0 && fillOffset(times, remainder);
      valueKeyframesAsList.length === 1 && valueKeyframesAsList.unshift(null);
      if (repeat) {
        duration = calculateRepeatDuration(duration, repeat);
        const originalKeyframes = [...valueKeyframesAsList];
        const originalTimes = [...times];
        ease = Array.isArray(ease) ? [...ease] : [ease];
        const originalEase = [...ease];
        for (let repeatIndex = 0; repeatIndex < repeat; repeatIndex++) {
          valueKeyframesAsList.push(...originalKeyframes);
          for (let keyframeIndex = 0; keyframeIndex < originalKeyframes.length; keyframeIndex++) {
            times.push(originalTimes[keyframeIndex] + (repeatIndex + 1));
            ease.push(keyframeIndex === 0 ? "linear" : getEasingForSegment(originalEase, keyframeIndex - 1));
          }
        }
        normalizeTimes(times, repeat);
      }
      const targetTime = startTime + duration;
      addKeyframes(valueSequence, valueKeyframesAsList, ease, times, startTime, targetTime);
      maxDuration = Math.max(calculatedDelay + duration, maxDuration);
      totalDuration = Math.max(targetTime, totalDuration);
    };
    if (isMotionValue(subject)) {
      const subjectSequence = getSubjectSequence(subject, sequences);
      resolveValueSequence(keyframes, transition, getValueSequence("default", subjectSequence));
    } else {
      const subjects = resolveSubjects(subject, keyframes, scope, elementCache);
      const numSubjects = subjects.length;
      for (let subjectIndex = 0; subjectIndex < numSubjects; subjectIndex++) {
        keyframes = keyframes;
        transition = transition;
        const thisSubject = subjects[subjectIndex];
        const subjectSequence = getSubjectSequence(thisSubject, sequences);
        for (const key in keyframes) {
          resolveValueSequence(keyframes[key], getValueTransition(transition, key), getValueSequence(key, subjectSequence), subjectIndex, numSubjects);
        }
      }
    }
    prevTime = currentTime;
    currentTime += maxDuration;
  }
  sequences.forEach((valueSequences, element) => {
    for (const key in valueSequences) {
      const valueSequence = valueSequences[key];
      valueSequence.sort(compareByTime);
      const keyframes = [];
      const valueOffset = [];
      const valueEasing = [];
      for (let i = 0; i < valueSequence.length; i++) {
        const { at, value, easing } = valueSequence[i];
        keyframes.push(value);
        valueOffset.push(progress(0, totalDuration, at));
        valueEasing.push(easing || "easeOut");
      }
      if (valueOffset[0] !== 0) {
        valueOffset.unshift(0);
        keyframes.unshift(keyframes[0]);
        valueEasing.unshift(defaultSegmentEasing);
      }
      if (valueOffset[valueOffset.length - 1] !== 1) {
        valueOffset.push(1);
        keyframes.push(null);
      }
      if (!animationDefinitions.has(element)) {
        animationDefinitions.set(element, {
          keyframes: {},
          transition: {}
        });
      }
      const definition = animationDefinitions.get(element);
      definition.keyframes[key] = keyframes;
      const { type: _type, ...remainingDefaultTransition } = defaultTransition;
      definition.transition[key] = {
        ...remainingDefaultTransition,
        duration: totalDuration,
        ease: valueEasing,
        times: valueOffset,
        ...sequenceTransition
      };
    }
  });
  return animationDefinitions;
}
function getSubjectSequence(subject, sequences) {
  !sequences.has(subject) && sequences.set(subject, {});
  return sequences.get(subject);
}
function getValueSequence(name, sequences) {
  if (!sequences[name])
    sequences[name] = [];
  return sequences[name];
}
function keyframesAsList(keyframes) {
  return Array.isArray(keyframes) ? keyframes : [keyframes];
}
function getValueTransition(transition, key) {
  return transition && transition[key] ? {
    ...transition,
    ...transition[key]
  } : { ...transition };
}
const isNumber = (keyframe) => typeof keyframe === "number";
const isNumberKeyframesArray = (keyframes) => keyframes.every(isNumber);
function createDOMVisualElement(element) {
  const options = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        transform: {},
        transformOrigin: {},
        style: {},
        vars: {},
        attrs: {}
      },
      latestValues: {}
    }
  };
  const node = isSVGElement(element) && !isSVGSVGElement(element) ? new SVGVisualElement(options) : new HTMLVisualElement(options);
  node.mount(element);
  visualElementStore.set(element, node);
}
function createObjectVisualElement(subject) {
  const options = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        output: {}
      },
      latestValues: {}
    }
  };
  const node = new ObjectVisualElement(options);
  node.mount(subject);
  visualElementStore.set(subject, node);
}
function isSingleValue(subject, keyframes) {
  return isMotionValue(subject) || typeof subject === "number" || typeof subject === "string" && !isDOMKeyframes(keyframes);
}
function animateSubject(subject, keyframes, options, scope) {
  const animations = [];
  if (isSingleValue(subject, keyframes)) {
    animations.push(animateSingleValue(subject, isDOMKeyframes(keyframes) ? keyframes.default || keyframes : keyframes, options ? options.default || options : options));
  } else {
    if (subject == null) {
      return animations;
    }
    const subjects = resolveSubjects(subject, keyframes, scope);
    const numSubjects = subjects.length;
    for (let i = 0; i < numSubjects; i++) {
      const thisSubject = subjects[i];
      const createVisualElement = thisSubject instanceof Element ? createDOMVisualElement : createObjectVisualElement;
      if (!visualElementStore.has(thisSubject)) {
        createVisualElement(thisSubject);
      }
      const visualElement = visualElementStore.get(thisSubject);
      const transition = { ...options };
      if ("delay" in transition && typeof transition.delay === "function") {
        transition.delay = transition.delay(i, numSubjects);
      }
      animations.push(...animateTarget(visualElement, { ...keyframes, transition }, {}));
    }
  }
  return animations;
}
function animateSequence(sequence, options, scope) {
  const animations = [];
  const processedSequence = sequence.map((segment) => {
    if (Array.isArray(segment) && typeof segment[0] === "function") {
      const callback = segment[0];
      const mv = motionValue(0);
      mv.on("change", callback);
      if (segment.length === 1) {
        return [mv, [0, 1]];
      } else if (segment.length === 2) {
        return [mv, [0, 1], segment[1]];
      } else {
        return [mv, segment[1], segment[2]];
      }
    }
    return segment;
  });
  const animationDefinitions = createAnimationsFromSequence(processedSequence, options, scope, { spring });
  animationDefinitions.forEach(({ keyframes, transition }, subject) => {
    animations.push(...animateSubject(subject, keyframes, transition));
  });
  return animations;
}
function isSequence(value) {
  return Array.isArray(value) && value.some(Array.isArray);
}
function createScopedAnimate(options = {}) {
  const { scope, reduceMotion } = options;
  function scopedAnimate(subjectOrSequence, optionsOrKeyframes, options2) {
    let animations = [];
    let animationOnComplete;
    if (isSequence(subjectOrSequence)) {
      const { onComplete, ...sequenceOptions } = optionsOrKeyframes || {};
      if (typeof onComplete === "function") {
        animationOnComplete = onComplete;
      }
      animations = animateSequence(subjectOrSequence, reduceMotion !== void 0 ? { reduceMotion, ...sequenceOptions } : sequenceOptions, scope);
    } else {
      const { onComplete, ...rest } = options2 || {};
      if (typeof onComplete === "function") {
        animationOnComplete = onComplete;
      }
      animations = animateSubject(subjectOrSequence, optionsOrKeyframes, reduceMotion !== void 0 ? { reduceMotion, ...rest } : rest, scope);
    }
    const animation = new GroupAnimationWithThen(animations);
    if (animationOnComplete) {
      animation.finished.then(animationOnComplete);
    }
    if (scope) {
      scope.animations.push(animation);
      animation.finished.then(() => {
        removeItem(scope.animations, animation);
      });
    }
    return animation;
  }
  return scopedAnimate;
}
const animate = createScopedAnimate();
const ACHIEVEMENT_ICONS = {
  "first-login": /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5" }),
  "first-game": /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5" }),
  "score-1000": /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-5 w-5" }),
  "streak-3": /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5" }),
  "streak-7": /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }),
  "level-5": /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5" }),
  "level-10": /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5" }),
  "hub-complete": /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5" }),
  "perfect-game": /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5" }),
  "speed-typist": /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-5 w-5" })
};
const ACHIEVEMENT_COLORS = {
  "first-login": "var(--color-cyan)",
  "first-game": "var(--color-cyan)",
  "score-1000": "var(--color-cyan)",
  "streak-3": "var(--color-gold)",
  "streak-7": "var(--color-gold)",
  "level-5": "var(--color-purple)",
  "level-10": "var(--color-purple)",
  "hub-complete": "var(--color-emerald)",
  "perfect-game": "var(--color-gold)",
  "speed-typist": "var(--color-cyan)"
};
function AchievementBadge({
  achievementId,
  id,
  name,
  description,
  unlocked,
  icon,
  animate: animate2 = false,
  "data-ocid": dataOcid
}) {
  const resolvedId = achievementId ?? id ?? "";
  const accentColor = ACHIEVEMENT_COLORS[resolvedId] ?? "var(--color-cyan)";
  const resolvedIcon = icon ?? ACHIEVEMENT_ICONS[resolvedId] ?? /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: animate2 ? { scale: 0.5, opacity: 0 } : { scale: 1, opacity: unlocked ? 1 : 0.45 },
      animate: { scale: 1, opacity: unlocked ? 1 : 0.45 },
      whileHover: unlocked ? { scale: 1.06 } : void 0,
      transition: animate2 ? { type: "spring", stiffness: 320, damping: 22 } : { duration: 0.35 },
      className: [
        "flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-smooth cursor-default select-none",
        unlocked ? "glass-card border-white/10" : "bg-muted/20 border-border/20 grayscale"
      ].join(" "),
      style: unlocked ? { boxShadow: `0 0 16px ${accentColor}33` } : void 0,
      "data-ocid": dataOcid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative w-12 h-12 flex items-center justify-center",
            style: {
              clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              background: unlocked ? `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)` : "rgba(255,255,255,0.04)"
            },
            children: [
              unlocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "absolute inset-0",
                  animate: { opacity: [0.3, 0.7, 0.3] },
                  transition: {
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  },
                  style: {
                    background: `radial-gradient(circle at center, ${accentColor}22 0%, transparent 70%)`
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    color: unlocked ? accentColor : "rgba(255,255,255,0.25)",
                    position: "relative",
                    zIndex: 1
                  },
                  children: resolvedIcon
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-bold truncate",
              style: {
                color: unlocked ? accentColor : "rgba(255,255,255,0.3)",
                fontFamily: "'Orbitron', sans-serif"
              },
              children: name
            }
          ),
          description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-tight", children: description }),
          unlocked && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "inline-block mt-1 text-[9px] font-semibold uppercase tracking-widest",
              style: { color: accentColor, opacity: 0.75 },
              children: "Unlocked"
            }
          )
        ] })
      ]
    }
  );
}
function AnimatedCounter({
  target,
  duration = 1.2
}) {
  const ref = reactExports.useRef(null);
  const motionVal = useMotionValue(0);
  reactExports.useEffect(() => {
    const controls = animate(motionVal, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = Math.round(v).toLocaleString();
        }
      }
    });
    return () => controls.stop();
  }, [target, duration, motionVal]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { ref, children: "0" });
}
function XPBar({
  level,
  currentXP,
  xpToNext,
  totalXP,
  className = ""
}) {
  const percent = Math.min(currentXP / Math.max(xpToNext, 1) * 100, 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col gap-3 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative flex-shrink-0 w-14 h-14 flex items-center justify-center",
            style: {
              clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              background: "linear-gradient(135deg, rgba(0,245,255,0.25), rgba(0,245,255,0.06))"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "absolute inset-0",
                  animate: { opacity: [0.4, 0.9, 0.4] },
                  transition: {
                    duration: 2.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  },
                  style: {
                    background: "radial-gradient(circle at center, rgba(0,245,255,0.3) 0%, transparent 70%)",
                    clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center leading-none",
                  style: { position: "relative", zIndex: 1 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px] font-semibold uppercase tracking-widest",
                        style: {
                          color: "rgba(0,245,255,0.6)",
                          fontFamily: "'Orbitron', sans-serif"
                        },
                        children: "LVL"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-lg font-black leading-tight",
                        style: {
                          color: "var(--color-cyan)",
                          fontFamily: "'Orbitron', sans-serif",
                          textShadow: "0 0 12px rgba(0,245,255,0.8)"
                        },
                        children: level
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm font-bold uppercase tracking-widest",
              style: {
                color: "var(--color-cyan)",
                fontFamily: "'Orbitron', sans-serif"
              },
              children: "Experience"
            }
          ),
          totalXP !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Total: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCounter, { target: totalXP }),
            " XP"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "text-sm font-bold tabular-nums",
            style: {
              color: "var(--color-cyan)",
              fontFamily: "'Orbitron', sans-serif"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCounter, { target: currentXP }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal", children: [
                " ",
                "/ ",
                xpToNext.toLocaleString()
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-widest", children: "XP to next level" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative h-3 rounded-full overflow-hidden",
        style: { background: "rgba(255,255,255,0.06)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "h-full rounded-full",
              initial: { width: 0 },
              animate: { width: `${percent}%` },
              transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
              style: {
                background: "linear-gradient(90deg, var(--color-cyan), oklch(0.7 0.18 250))",
                boxShadow: "0 0 10px rgba(0,245,255,0.6), 0 0 20px rgba(0,245,255,0.25)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "absolute inset-0 rounded-full",
              animate: { x: ["-100%", "200%"] },
              transition: {
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                repeatDelay: 1.5
              },
              style: {
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                width: "40%"
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: Math.round(xpToNext / 2).toLocaleString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: xpToNext.toLocaleString() })
    ] })
  ] });
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function AnimatedNumber({ value }) {
  const ref = reactExports.useRef(null);
  const mv = useMotionValue(0);
  reactExports.useEffect(() => {
    const ctrl = animate(mv, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current)
          ref.current.textContent = Math.round(v).toLocaleString();
      }
    });
    return () => ctrl.stop();
  }, [value, mv]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { ref, children: "0" });
}
const GRADE_LABELS = {
  [GradeLevel.basic1]: "Basic 1",
  [GradeLevel.basic2]: "Basic 2",
  [GradeLevel.basic3]: "Basic 3",
  [GradeLevel.basic4]: "Basic 4",
  [GradeLevel.basic5]: "Basic 5",
  [GradeLevel.basic6]: "Basic 6",
  [GradeLevel.basic7]: "Basic 7",
  [GradeLevel.basic8]: "Basic 8",
  [GradeLevel.basic9]: "Basic 9"
};
const GAME_NAMES = {
  "cursor-precision": "Cursor Precision",
  "keyboard-ninja": "Keyboard Ninja",
  "typing-tournament": "Typing Tournament",
  "file-explorer": "File Explorer",
  "browser-quest": "Browser Quest",
  "shortcut-combat": "Shortcut Combat",
  "drag-maze": "Drag & Drop Maze",
  "double-click-race": "Double-Click Race",
  "phishing-detective": "Phishing Detective",
  "network-router": "Network Router"
};
const gameLabel = (id) => GAME_NAMES[id] ?? id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
function fmtTime(ns) {
  const secs = Number(ns / 1000000000n);
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}
const SUBJECTS = [
  { id: "ict", name: "ICT", color: "#00f5ff", ring: "#00f5ff" },
  { id: "mathematics", name: "Mathematics", color: "#7c3aed", ring: "#7c3aed" },
  { id: "science", name: "Science", color: "#10b981", ring: "#10b981" },
  { id: "english", name: "English", color: "#f59e0b", ring: "#f59e0b" },
  { id: "robotics", name: "Robotics", color: "#f43f5e", ring: "#f43f5e" },
  {
    id: "criticalThinking",
    name: "Critical Thinking",
    color: "#8b5cf6",
    ring: "#8b5cf6"
  }
];
const ACHIEVEMENTS = [
  {
    id: "first-login",
    name: "First Login",
    desc: "Entered the Knowledge World"
  },
  {
    id: "first-game",
    name: "First Mission",
    desc: "Completed your first game"
  },
  { id: "score-1000", name: "1K Score", desc: "Reached 1,000 points" },
  { id: "streak-3", name: "3-Day Streak", desc: "Played 3 days in a row" },
  { id: "streak-7", name: "Week Warrior", desc: "Played 7 days in a row" },
  { id: "level-5", name: "Level 5", desc: "Reached Commander Level 5" },
  { id: "level-10", name: "Level 10", desc: "Reached Commander Level 10" },
  { id: "hub-complete", name: "Hub Master", desc: "Mastered an entire hub" },
  { id: "perfect-game", name: "Perfect Run", desc: "100% accuracy on a game" },
  { id: "speed-typist", name: "Speed Typist", desc: "Typed 60+ WPM" }
];
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
function StatCard({
  label: _label,
  value,
  sublabel,
  icon,
  borderColor,
  glowColor,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      variants: item,
      className: "glass-card rounded-xl p-5 flex flex-col gap-2",
      style: {
        border: `1px solid ${borderColor}44`,
        boxShadow: `0 0 16px ${glowColor}22`
      },
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-muted-foreground",
              style: { color: borderColor, opacity: 0.8 },
              children: icon
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-3xl font-black tabular-nums leading-none",
              style: {
                fontFamily: "'Orbitron', sans-serif",
                color: borderColor,
                textShadow: `0 0 16px ${glowColor}88`
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedNumber, { value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: sublabel })
      ]
    }
  );
}
function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: progression, isLoading: progressionLoading } = useMyProgression();
  const { data: hubProgress, isLoading: hubLoading } = useAllHubProgress();
  const { data: recentScores, isLoading: scoresLoading } = useMyRecentScores();
  const isLoading = profileLoading || progressionLoading || hubLoading || scoresLoading;
  const level = Number((progression == null ? void 0 : progression.currentLevel) ?? 1n);
  const xp = Number((progression == null ? void 0 : progression.xp) ?? 0n);
  const coins = Number((progression == null ? void 0 : progression.coins) ?? 0n);
  const streak = Number((progression == null ? void 0 : progression.dailyStreak) ?? 0n);
  const xpToNext = level * level * 100;
  const ictHubs = hubProgress ?? [];
  const ictPercent = ictHubs.length > 0 ? Math.round(
    ictHubs.reduce((s, h) => s + Number(h.completionPercent), 0) / ictHubs.length
  ) : 0;
  const ictMastered = ictHubs.filter(
    (h) => Number(h.completionPercent) >= 100
  ).length;
  const scores = (recentScores == null ? void 0 : recentScores.slice(0, 5)) ?? [];
  const unlockedSet = new Set((progression == null ? void 0 : progression.unlockedAchievements) ?? []);
  const grade = (profile == null ? void 0 : profile.gradeLevel) ? GRADE_LABELS[profile.gradeLevel] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen py-8 px-4", "data-ocid": "dashboard.page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex flex-col gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "flex items-start justify-between gap-4 flex-wrap",
        "data-ocid": "dashboard.header",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h1",
              {
                className: "text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-widest leading-tight",
                style: {
                  fontFamily: "'Orbitron', sans-serif",
                  color: "var(--color-cyan)",
                  textShadow: "0 0 24px rgba(0,245,255,0.6), 0 0 48px rgba(0,245,255,0.2)"
                },
                children: "Command Center"
              }
            ),
            profile && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-1 font-medium tracking-wide", children: [
              "Welcome back,",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: profile.username })
            ] })
          ] }),
          grade && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "glass-card rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest border",
              style: {
                color: "var(--color-purple)",
                borderColor: "rgba(124,58,237,0.4)",
                boxShadow: "0 0 12px rgba(124,58,237,0.2)"
              },
              "data-ocid": "dashboard.grade_badge",
              children: grade
            }
          )
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        variants: container,
        initial: "hidden",
        animate: "visible",
        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
        "data-ocid": "dashboard.stats_row",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "XP",
              value: xp,
              sublabel: "Total XP",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }),
              borderColor: "#00f5ff",
              glowColor: "#00f5ff",
              ocid: "dashboard.stat_xp"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Level",
              value: level,
              sublabel: "Commander Level",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5" }),
              borderColor: "#7c3aed",
              glowColor: "#7c3aed",
              ocid: "dashboard.stat_level"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Coins",
              value: coins,
              sublabel: "Learning Coins",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-5 w-5" }),
              borderColor: "#f59e0b",
              glowColor: "#f59e0b",
              ocid: "dashboard.stat_coins"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Streak",
              value: streak,
              sublabel: "Day Streak",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5" }),
              borderColor: "#10b981",
              glowColor: "#10b981",
              ocid: "dashboard.stat_streak"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.25, duration: 0.5 },
        className: "glass-card rounded-2xl p-6 neon-top-border",
        "data-ocid": "dashboard.xp_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Trophy,
              {
                className: "h-4 w-4",
                style: { color: "var(--color-cyan)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-bold uppercase tracking-widest",
                style: {
                  color: "var(--color-cyan)",
                  fontFamily: "'Orbitron', sans-serif"
                },
                children: "Experience Progress"
              }
            )
          ] }),
          progressionLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            XPBar,
            {
              level,
              currentXP: xp,
              xpToNext,
              totalXP: xp
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.35, duration: 0.5 },
        "data-ocid": "dashboard.worlds_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "text-sm font-black uppercase tracking-widest mb-4",
              style: {
                fontFamily: "'Orbitron', sans-serif",
                color: "var(--color-cyan)"
              },
              children: "Knowledge Worlds"
            }
          ),
          hubLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              variants: container,
              initial: "hidden",
              animate: "visible",
              className: "grid grid-cols-2 sm:grid-cols-3 gap-4",
              children: SUBJECTS.map((subj, idx) => {
                const pct = subj.id === "ict" ? ictPercent : 0;
                const mastered = subj.id === "ict" ? ictMastered : 0;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    variants: item,
                    custom: idx,
                    className: "glass-card rounded-xl p-4 flex flex-col items-center gap-3 text-center border",
                    style: {
                      borderColor: `${subj.color}22`,
                      boxShadow: `0 0 12px ${subj.color}11`
                    },
                    "data-ocid": `dashboard.world.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ProgressRing,
                        {
                          percent: pct,
                          size: 72,
                          strokeWidth: 6,
                          color: subj.ring
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs font-bold uppercase tracking-wider leading-tight",
                            style: {
                              fontFamily: "'Orbitron', sans-serif",
                              color: subj.color
                            },
                            children: subj.name
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-1", children: [
                          mastered,
                          " Hub",
                          mastered !== 1 ? "s" : "",
                          " Mastered"
                        ] })
                      ] })
                    ]
                  },
                  subj.id
                );
              })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.45, duration: 0.5 },
        className: "glass-card rounded-2xl p-6",
        "data-ocid": "dashboard.missions_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Target,
              {
                className: "h-4 w-4",
                style: { color: "var(--color-purple)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "text-xs font-black uppercase tracking-widest",
                style: {
                  fontFamily: "'Orbitron', sans-serif",
                  color: "var(--color-purple)"
                },
                children: "Recent Missions"
              }
            )
          ] }),
          scoresLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-lg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-lg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-lg" })
          ] }) : scores.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-3 py-10 text-center",
              "data-ocid": "dashboard.missions_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-10 w-10 text-muted-foreground opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No missions completed yet." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: "Start your journey!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/world-map",
                    className: "mt-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-smooth",
                    style: {
                      background: "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,245,255,0.05))",
                      border: "1px solid rgba(0,245,255,0.35)",
                      color: "var(--color-cyan)"
                    },
                    "data-ocid": "dashboard.start_journey_link",
                    children: "Explore World Map"
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              variants: container,
              initial: "hidden",
              animate: "visible",
              className: "flex flex-col gap-2",
              children: scores.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  variants: item,
                  className: "flex items-center justify-between gap-3 rounded-lg px-4 py-3 border",
                  style: {
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.06)"
                  },
                  "data-ocid": `dashboard.mission.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-2 h-2 rounded-full flex-shrink-0",
                          style: {
                            background: "var(--color-cyan)",
                            boxShadow: "0 0 6px rgba(0,245,255,0.8)"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold truncate text-foreground", children: gameLabel(s.gameId) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-shrink-0 text-xs text-muted-foreground tabular-nums", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-bold",
                          style: { color: "var(--color-gold)" },
                          children: Number(s.score).toLocaleString()
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        Number(s.accuracy),
                        "%"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                        fmtTime(s.timeSpent)
                      ] })
                    ] })
                  ]
                },
                `score-${s.gameId}-${idx}`
              ))
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.55, duration: 0.5 },
        "data-ocid": "dashboard.achievements_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Trophy,
              {
                className: "h-4 w-4",
                style: { color: "var(--color-gold)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "text-xs font-black uppercase tracking-widest",
                style: {
                  fontFamily: "'Orbitron', sans-serif",
                  color: "var(--color-gold)"
                },
                children: "Achievements"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3", children: ACHIEVEMENTS.map((a, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            AchievementBadge,
            {
              achievementId: a.id,
              name: a.name,
              description: a.desc,
              unlocked: unlockedSet.has(a.id),
              animate: unlockedSet.has(a.id),
              "data-ocid": `dashboard.achievement.${idx + 1}`
            },
            a.id
          )) })
        ]
      }
    )
  ] }) }) });
}
export {
  DashboardPage as default
};
