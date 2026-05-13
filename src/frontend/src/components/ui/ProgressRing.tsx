import { motion } from "motion/react";

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  animate?: boolean;
}

export function ProgressRing({
  percent,
  size = 64,
  strokeWidth = 5,
  color = "#00f5ff",
  label,
  animate = true,
}: ProgressRingProps) {
  const clampedPercent = Math.min(Math.max(percent, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercent / 100) * circumference;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
      role="img"
      aria-label={`${clampedPercent}% complete`}
    >
      {/* Track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <motion.circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={
          animate ? { strokeDashoffset: offset } : { strokeDashoffset: offset }
        }
        transition={{ duration: 1, ease: "easeOut" }}
        transform={`rotate(-90 ${center} ${center})`}
        style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
      />
      {/* Center label */}
      <text
        x={center}
        y={center + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.22}
        fontWeight="bold"
        fill={color}
        style={{ fontFamily: "'Orbitron', monospace" }}
      >
        {label ?? `${clampedPercent}%`}
      </text>
    </svg>
  );
}
