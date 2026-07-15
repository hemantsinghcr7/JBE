import { howWeWork, timeline } from "@/data/content";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section className="about-sec" id="about">
      <div className="wrap">
        <Reveal>
          <div className="shead">
            <Kicker dark>About</Kicker>
            <h2>
              Built on weighbridges
              <br />
              and <span className="accent-cu">word.</span>
            </h2>
            <p>
              A family business from MIDC Ambad — buying honestly, grading
              honestly, moving metal for close to three decades.
            </p>
          </div>
        </Reveal>

        <div className="about-grid">
          <Reveal>
            <div className="about-body">
              <p>
                Jai Bhawani Enterprises started in <b>1998</b> with one yard
                and a simple rule: the weighbridge doesn&apos;t lie, and neither
                do we. That rule hasn&apos;t changed.
              </p>
              <p>
                Today we run <b>two processing sites in MIDC Ambad</b> with a
                crew of 25, three owned trucks, and long-standing supply
                relationships with manufacturers across Maharashtra and Gujarat.
                Scrap comes in from factories and yard lots; graded, baled
                material goes out.
              </p>

              <ul className="tl">
                {timeline.map((item) => (
                  <li key={item.when}>
                    <span className="tl-when">{item.when}</span>
                    <div>
                      <div className="tl-what">{item.what}</div>
                      <div className="tl-note">{item.note}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="how">
            {howWeWork.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.07}>
                <div className="how-card">
                  <span className="hc-tag">{card.tag}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
