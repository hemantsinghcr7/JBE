import { Btn } from "@/components/ui/Btn";

export function ExportBand() {
  return (
    <section className="export">
      <div className="wrap">
        <div className="export-content">
          <p className="export-kicker">Next</p>
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
        <div className="export-cta">
          <Btn variant="dark" href="#contact">
            Partner with us →
          </Btn>
        </div>
      </div>
    </section>
  );
}
