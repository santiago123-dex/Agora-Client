"use client";

import { useEffect, useState, useRef } from "react";

function parseCounterValue(raw: string): { target: number; prefix: string; suffix: string } {
  const match = raw.match(/^([\d.]+)(k|K|%)?(.*)$/);
  if (!match) return { target: 0, prefix: "", suffix: raw };
  const num = parseFloat(match[1]);
  const mod = match[2]?.toLowerCase();
  const rest = match[3] ?? "";
  const multiplier = mod === "k" ? 1000 : 1;
  const suffix = (mod === "%" ? "%" : "") + rest;
  return { target: Math.round(num * multiplier), prefix: "", suffix };
}

export default function AnimatedCounter({ value, duration = 1500 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const { target, prefix, suffix } = parseCounterValue(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const display = target >= 1000 ? `${Math.floor(count / 1000)}k` : count.toString();

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}
