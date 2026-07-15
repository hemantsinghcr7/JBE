import { materials, supplyItems } from "@/data/content";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";

export function Materials() {
  return (
    <section className="materials-sec" id="materials">
      <div className="wrap">
        <Reveal>
          <div className="shead">
            <Kicker>Materials</Kicker>
            <h2>
              Three metals.
              <br />
              Any honest <span className="accent">volume.</span>
            </h2>
            <p>
              We buy across the common trade grades — factory scrap, yard lots,
              mixed or segregated. If it&apos;s non-ferrous, call us before you sell it.
            </p>
          </div>
        </Reveal>

        <div className="mat-rows">
          {materials.map((mat, i) => (
            <Reveal key={mat.id} delay={i * 0.06}>
              <div className={`mat-row mat-${mat.symbol.toLowerCase()}`}>
                <div className="mat-row-top">
                  <span className="mat-row-num">{mat.matNo}</span>
                  <span className="mat-row-name">{mat.name}</span>
                  <span className="mat-row-sym">{mat.symbol}</span>
                </div>
                <div className="mat-row-bottom">
                  <p className="mat-desc">{mat.description}</p>
                  <div className="grades">
                    {mat.grades.map((g) => (
                      <div className="grade-pill" key={g.code}>
                        <span className="gname">{g.name}</span>
                        <span className="gcode">{g.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="supply-strip">
            <span className="supply-label">We also supply</span>
            <div className="supply-items">
              {supplyItems.map((item) => (
                <span className="supply-item" key={item.label}>{item.label}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
