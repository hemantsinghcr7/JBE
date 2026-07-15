import { Kicker } from "@/components/ui/Kicker";
import { Btn } from "@/components/ui/Btn";

export function ExportBand() {
  return (
    <section className="section export">
      <div className="wrap">
        <div>
          <Kicker white>Next</Kicker>
          <h2>
            Cross-border
            <br />
            supply lines.
          </h2>
          <p>
            We&apos;re laying the groundwork for import and export of graded
            non-ferrous scrap. If you ship, buy or broker across borders —
            let&apos;s talk early.
          </p>
        </div>
        <Btn variant="white" href="#contact" className="ex-cta">
          Partner with us →
        </Btn>
      </div>
    </section>
  );
}
