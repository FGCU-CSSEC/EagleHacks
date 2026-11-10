import CustomCursor from "@/components/CustomCursor";
import About from "@/components/About";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Location from "@/components/Location";
import PhotoMosaic from "@/components/PhotoMosaic";
import Sponsors from "@/components/Sponsors";
import Team from "@/components/Team";

// Opt out of the dev-only instant-navigation check; the settings read is cached and does not affect the build.
export const instant = false;

export default function Home() {
  return (
    <>
      <CustomCursor />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <main id="main">
        <Hero />
        <PhotoMosaic />
        <About />
        <Location />
        <Sponsors />
        <Faq />
        <Team />
      </main>
      <Footer />
    </>
  );
}
