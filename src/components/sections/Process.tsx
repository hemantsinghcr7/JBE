import { processSteps } from "@/data/content";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";

export function Process() {
  return (
    <section className="process-sec" id="process">
      <div className="wrap">
        <Reveal>
          <div className="shead">
            <Kicker dark>Process</Kicker>
            <h2>
              One loop, run
              <br />
              for <span className="accent-cu">28 years.</span>
            </h2>
            <p>
              Buy, process, supply. Three steps, no middlemen — the same loop
              we&apos;ve run since 1998.
            </p>
          </div>
        </Reveal>

        <div className="steps">
          {processSteps.map((step, i) => (
            <Reveal key={step.no} delay={i * 0.08}>
              <div className="step">
                <span className="s-no">0{i + 1}</span>
                <div className="s-content">
                  <span className="s-tag">{step.no}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
