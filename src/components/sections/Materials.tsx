import { materials, supplyItems } from "@/data/content";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";

export function Materials() {
  return (
    <section className="section materials" id="materials">
      <div className="wrap">
        <Reveal>
          <div className="shead">
            <Kicker>Materials</Kicker>
            <h2>
              Three metals.
              <br />
              Any honest <span className="rd">volume.</span>
            </h2>
            <p className="lede">
              We buy across the common trade grades — factory scrap, yard lots,
              mixed or segregated. If it&apos;s non-ferrous, call us before you
              sell it.
            </p>
          </div>
        </Reveal>

        <div className="mat-grid">
          {materials.map((mat, i) => (
            <Reveal key={mat.id} delay={i * 0.08}>
              <article className="mat-card">
                <div className={`mat-swatch ${mat.swatchClass}`}>
                  <span className="swatch-sheen" aria-hidden="true" />
                  <span className="swatch-grain" aria-hidden="true" />
                  <span className="no">{mat.matNo}</span>
                  <span className="sym">{mat.symbol}</span>
                </div>
                <div className="mat-body">
                  <h3>{mat.name}</h3>
                  <p className="mat-sub">{mat.description}</p>
                  <div className="grades">
                    {mat.grades.map((g) => (
                      <div className="grow" key={g.code}>
                        <span className="gname">{g.name}</span>
                        <span className="gcode">{g.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="supply">
            <div className="sp-label">We also supply</div>
            <div className="sp-items">
              {supplyItems.map((item) => (
                <span key={item.label}>
                  <i className={item.colorClass} />
                  {item.label}
                </span>
              ))}
            </div>
            <div className="sp-note">OUTBOUND · TO MANUFACTURERS IN MH &amp; GJ</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
