import { useEffect, useRef, useState } from "react";

interface Metric {
  value: number;
  suffix: string;
  prefix: string;
  label: string;
}

const metrics: Metric[] = [
  { prefix: "+", value: 80, suffix: "", label: "Projetos entregues" },
  { prefix: "+", value: 20, suffix: " mil", label: "m² construídos" },
  { prefix: "", value: 10, suffix: "", label: "Anos de atuação" },
];

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame: number;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);

  return count;
}

function CounterCard({ metric, visible }: { metric: Metric; visible: boolean }) {
  const count = useCountUp(metric.value, 1800, visible);

  return (
    <div className="flex flex-col items-center text-center">
      <span
        className="font-syncopate font-bold"
        style={{ fontSize: 48, lineHeight: 1, color: "#22D3EE" }}
      >
        {metric.prefix}{count}{metric.suffix}
      </span>
      <span
        className="font-dm mt-2"
        style={{ fontSize: 13, color: "rgba(249,250,251,0.45)" }}
      >
        {metric.label}
      </span>
    </div>
  );
}

export default function NumerosSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "#0D0D0D",
        padding: "80px 0",
        borderTop: "1px solid rgba(34,211,238,0.08)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
          <span
            className="font-dm uppercase"
            style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}
          >
            Resultados
          </span>
          <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
        </div>

        <h2
          className="font-syncopate font-bold uppercase text-center mb-14"
          style={{ fontSize: 28, lineHeight: 1, color: "#F9FAFB" }}
        >
          NÚMEROS QUE FALAM
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {metrics.map((m, i) => (
            <CounterCard key={i} metric={m} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
