import { processSteps } from "@/data/content";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";

export function Process() {
  return (
    <section className="section" id="process">
      <div className="wrap">
        <Reveal>
          <div className="shead">
            <Kicker>Process</Kicker>
            <h2>
              One loop, run
              <br />
              for <span className="rd">28 years.</span>
            </h2>
            <p className="lede">
              Buy, process, supply. Three steps, no middlemen theatrics — the
              same loop we&apos;ve run since 1998.
            </p>
          </div>
        </Reveal>

        <div className="steps">
          {processSteps.map((step, i) => (
            <Reveal key={step.no} delay={i * 0.1}>
              <div className="step">
                {i < processSteps.length - 1 && (
                  <span className="s-arrow">→</span>
                )}
                <span className="s-no">{step.no}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
