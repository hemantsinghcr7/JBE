import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollExtras } from "@/components/layout/ScrollExtras";
import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Materials } from "@/components/sections/Materials";
import { Process } from "@/components/sections/Process";
import { ExportBand } from "@/components/sections/ExportBand";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollExtras />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main id="main">
        <Hero />
        <Ticker />
        <Stats />
        <About />
        <Materials />
        <Process />
        <ExportBand />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
