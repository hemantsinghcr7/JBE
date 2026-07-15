import { company } from "@/data/content";
import { Btn } from "@/components/ui/Btn";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="wrap">
        <Reveal>
          <p className="hero-eyebrow">
            Non-ferrous scrap · Nashik, MH · Est. {company.founded}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="hero-h1">
            JAI
            <br />
            BHAWANI
            <span className="ent">ENTERPRISES</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="hero-sub">
            We buy aluminium, copper and brass scrap in volume — straight from your
            factory gate, processed at two MIDC Ambad sites, and supplied to
            manufacturers across Maharashtra and Gujarat.
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="hero-ctas">
            <Btn variant="amber" href={`tel:${company.phoneTel}`}>
              Call {company.phone}
            </Btn>
            <Btn href="#materials">
              See materials ↓
            </Btn>
          </div>
        </Reveal>
      </div>

      <div className="hero-metals" aria-label="Materials we trade">
        <div className="hero-metal al">
          <span className="hm-sym">AL</span>
          <span className="hm-name">Aluminium</span>
        </div>
        <div className="hero-metal cu">
          <span className="hm-sym">CU</span>
          <span className="hm-name">Copper</span>
        </div>
        <div className="hero-metal br">
          <span className="hm-sym">BR</span>
          <span className="hm-name">Brass</span>
        </div>
      </div>
    </section>
  );
}
