import { company } from "@/data/content";
import { Btn } from "@/components/ui/Btn";
import { Reveal } from "@/components/ui/Reveal";

function MetalChip({
  symbol,
  label,
  grades,
  swatchClass,
  rotate,
}: {
  symbol: string;
  label: string;
  grades: string;
  swatchClass: string;
  rotate: string;
}) {
  return (
    <div className={`chip ${swatchClass}`} style={{ transform: `rotate(${rotate})` }}>
      <i className="tick tl" /><i className="tick tr" />
      <i className="tick bl" /><i className="tick br" />
      <div className="c-top">
        <span>{label}</span>
        <span className="c-sym">{symbol}</span>
      </div>
      <div className="c-grades">{grades}</div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="wrap">
        <div>
          <Reveal>
            <div className="hero-eyebrow">
              <em>■</em>
              <span>NON-FERROUS SCRAP</span>
              <span>·</span>
              <span>NASHIK, MAHARASHTRA</span>
              <span>·</span>
              <span>EST. {company.founded}</span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="h-display hero-h1">
              Bought.
              <br />
              <span className="rd">Processed.</span>
              <br />
              <span className="ol">Supplied.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="hero-sub">
              Jai Bhawani Enterprises trades{" "}
              <b>aluminium, copper and brass scrap</b> in volume — bought from
              factories, processed at two MIDC Ambad sites, and supplied to
              manufacturers across <b>Maharashtra and Gujarat</b>. Same family,
              same yard, since {company.founded}.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="hero-ctas">
              <Btn variant="red" href="#contact">
                Get a quote →
              </Btn>
              <Btn href="#materials">See materials</Btn>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="hero-meta">
              <span>GST {company.gst}</span>
              <span>2 processing sites</span>
              <span>Own fleet</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="chips" aria-label="Materials we trade">
            <div className="stamp" aria-hidden="true">
              Est. {company.founded}
              <b>Nashik · MH</b>
            </div>

            <MetalChip
              symbol="AL"
              label="ALUMINIUM — SCRAP"
              grades="TAINT/TABOR · TENSE · UBC · 6063"
              swatchClass="chip-al"
              rotate="-1.6deg"
            />
            <MetalChip
              symbol="CU"
              label="COPPER — SCRAP"
              grades="MILLBERRY · BERRY · CANDY · BIRCH/CLIFF"
              swatchClass="chip-cu"
              rotate="1.2deg"
            />
            <MetalChip
              symbol="BR"
              label="BRASS — SCRAP"
              grades="HONEY · MIXED SOLIDS · TURNINGS"
              swatchClass="chip-br"
              rotate="-0.8deg"
            />

            <div className="chips-caption">
              MATERIAL SAMPLES — MANIFEST NO. {company.founded}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
