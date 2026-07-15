"use client";
import { stats } from "@/data/content";
import { useCountUpRef } from "@/hooks/useCountUp";
import { Reveal } from "@/components/ui/Reveal";

function StatItem({ value, suffix, unit, label, delay }: {
  value: number; suffix: string; unit: string; label: string; delay: number;
}) {
  const ref = useCountUpRef(value);
  return (
    <Reveal delay={delay}>
      <div className="stat">
        <div className="num">
          <span ref={ref}>0</span>
          {suffix && <span className="sfx">{suffix}</span>}
          {unit && <i>{unit}</i>}
        </div>
        <div className="lab">{label}</div>
      </div>
    </Reveal>
  );
}

export function Stats() {
  return (
    <section className="stats" aria-label="Company figures">
      <div className="stats-grid">
        {stats.map((s, i) => (
          <StatItem key={s.label} {...s} delay={i * 0.07} />
        ))}
      </div>
    </section>
  );
}
