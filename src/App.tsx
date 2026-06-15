import React, { useEffect, useState } from "react";
import MacbookScrollDemo from "@/components/macbook-scroll-demo";
import MarkerWipe from "@/components/marker-wipe";

/* Custom-property style helper (scroll-reveal stagger) */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const subheading: React.CSSProperties = {
  fontSize: "var(--text-subheading)",
  lineHeight: 1.1,
  letterSpacing: "-0.72px",
};
const bodySm: React.CSSProperties = { fontSize: "var(--text-body-sm)" };

/* Hero ticker words. Repeated enough times that one loop-unit always exceeds the
   viewport, so the -50% marquee loop stays continuous with no gap. */
const TICKER = ["MAKING THINGS", "RESEARCH", "CYBERSECURITY", "BADMINTON", "ORCHESTRA"];

/* Live Manhattan Beach clock — PST/PDT resolved automatically by the runtime */
function useLocalClock() {
  const [t, setT] = useState("00:00 PT");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZoneName: "short",
    });
    const tick = () => {
      const parts = fmt.formatToParts(new Date());
      const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
      setT(`${get("hour")}:${get("minute")} ${get("timeZoneName")}`);
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* Scroll reveals — add .is-visible as elements enter view */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  const clock = useLocalClock();
  useReveal();

  return (
    <>
      <div className="grain" aria-hidden="true"></div>

      {/* ====================== NAV ====================== */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-mist/70 bg-bone/80 backdrop-blur-md">
        <nav className="relative mx-auto max-w-[1600px] flex items-center justify-between px-24 py-18">
          <a href="#top" className="mono flex items-center gap-6 text-obsidian">
            <span className="text-ember">✳</span> Hao&nbsp;Lin
          </a>

          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-48">
            <a href="#highlights" className="mono nav-link text-graphite">Highlights</a>
            <a href="#about" className="mono nav-link text-graphite">About</a>
          </div>

          <div className="flex items-center gap-18">
            <span className="mono-xs hidden sm:inline text-slate">{clock}</span>
            <a
              href="#contact"
              className="mono-xs inline-flex items-center gap-6 rounded-full bg-obsidian px-[16px] py-[7px] text-bone transition-colors hover:bg-ember"
            >
              Contact <span aria-hidden="true">↗</span>
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ====================== HERO ====================== */}
        <section className="relative min-h-screen flex flex-col justify-between bg-obsidian text-bone pt-120 pb-48 px-24">
          <div className="flex items-start justify-between mono-xs text-ash reveal">
            <div className="space-y-6">
              <p>Portfolio — V0.9</p>
              <p>Design × Development</p>
            </div>
            <div className="text-right space-y-6">
              <p>Manhattan Beach, CA</p>
              <p>Lat 33.88 / Lon −118.41</p>
            </div>
          </div>

          <div className="-mt-12">
            <h1 className="display-hero text-bone reveal" style={delay(80)}>
              HAO<br />
              <span className="text-mist">LIN</span>
              <span className="text-ember">.</span>
            </h1>
            <div
              className="mt-24 flex flex-col md:flex-row md:items-end md:justify-between gap-24 reveal"
              style={delay(200)}
            >
              <p
                className="max-w-[44ch] text-mist"
                style={{ fontSize: "var(--text-body-lg)", lineHeight: 1.25, letterSpacing: "-0.42px" }}
              >
                High schooler from Manhattan Beach.
              </p>
              <a href="#highlights" className="btn-outline on-dark mono shrink-0">
                Highlights
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* ====================== MARQUEE ====================== */}
        <div className="marquee bg-bone text-slate py-12 border-y border-mist">
          {/* track = loop-unit duplicated; the keyframe shifts exactly -50% for a seamless loop */}
          <div className="marquee__track">
            {Array.from({ length: 2 }).flatMap((_, half) =>
              Array.from({ length: 4 }).flatMap((_, rep) =>
                TICKER.map((word, i) => (
                  <span key={`${half}-${rep}-${i}`} className="mono px-12">
                    {word}
                    <span className="px-12 text-ember">✳</span>
                  </span>
                )),
              ),
            )}
          </div>
        </div>

        {/* ====================== MACBOOK (scroll-scrubbed) ====================== */}
        <section className="dark relative bg-obsidian">
          <MacbookScrollDemo />
        </section>

        {/* ====================== WORK ====================== */}
        <section id="highlights" className="bg-bone px-24 py-120">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-end justify-between border-b border-mist pb-24 mb-72 reveal">
              <h2 className="heading text-obsidian">Highlights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-48 gap-y-96">
              <article className="group reveal" style={delay(0)}>
                <div className="block">
                  <div className="ember-frame aspect-[4/3]">
                    <img
                      src="/hao-isef.jpg"
                      alt="Hao Lin presenting his earthquake-hazard research at the ISEF science fair (project EAEV067)"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-start justify-between mt-24">
                    <div>
                      <h3 className="text-obsidian" style={subheading}>Not When, Where First?</h3>
                      <p className="mono-xs text-slate mt-6">Research · Seismic-Hazard ML</p>
                    </div>
                    <span className="mono-xs text-ash">01 — ISEF</span>
                  </div>
                </div>
              </article>

              <article className="group reveal" style={delay(120)}>
                <div className="block">
                  <div className="ember-frame aspect-[4/3] md:translate-y-72">
                    <img
                      src="/cyber-league.jpg"
                      alt="Hao Lin and his cofounder Dennis — their two-person high-school team placed in the top 0.5% nationally in the National Cyber League"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-start justify-between mt-24 md:translate-y-72">
                    <div>
                      <h3 className="text-obsidian" style={subheading}>2-Person High-School Team</h3>
                      <p className="mono-xs text-slate mt-6">CTF · Top 0.5% Nationally</p>
                    </div>
                    <span className="mono-xs text-ash">02 — NCL</span>
                  </div>
                </div>
              </article>

              <article className="group reveal" style={delay(0)}>
                <div className="block">
                  <div className="ember-frame aspect-[4/3]">
                    <img
                      src="/badminton.jpg"
                      alt="Hao Lin mid-air executing a badminton jump smash, racket cocked back over a dark court"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-start justify-between mt-24">
                    <div>
                      <h3 className="text-obsidian" style={subheading}>Badminton</h3>
                      <p className="mono-xs text-slate mt-6">Sport · #5 CIF Southern Section</p>
                    </div>
                    <span className="mono-xs text-ash">03 — Sport</span>
                  </div>
                </div>
              </article>

              <article className="group reveal" style={delay(120)}>
                <div className="block">
                  <div className="ember-frame aspect-[4/3] md:translate-y-72">
                    <img
                      src="/orchestra.jpg"
                      alt="Hao Lin's high-school chamber orchestra, a string ensemble in formal black with cellos and violins on the steps"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-start justify-between mt-24 md:translate-y-72">
                    <div>
                      <h3 className="text-obsidian" style={subheading}>Orchestra</h3>
                      <p className="mono-xs text-slate mt-6">Music · Chamber Orchestra</p>
                    </div>
                    <span className="mono-xs text-ash">04 — Music</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ======= ABOUT → CONTACT (marker-wipe scroll hijack) =======
            Pins on About, paints it over in orange marker, then erases to reveal Contact. */}
        <MarkerWipe
          anchorId="contact"
          cover={
            <section id="about" className="min-h-screen h-full bg-paper px-24 flex items-center">
              <div className="mx-auto w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-48">
                <div className="lg:col-span-3 reveal">
                  <span className="mono-xs text-slate">(About)</span>
                  <div className="ember-frame aspect-[3/4] mt-24 max-w-[320px]">
                    <img
                      src="/portrait.jpg"
                      alt="Portrait of Hao Lin in a denim jacket at the museum's Matisse exhibition"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="lg:col-span-8 lg:col-start-5 flex flex-col justify-center reveal" style={delay(120)}>
                  <p
                    className="text-obsidian"
                    style={{ fontSize: "clamp(24px, 3.4vw, 36px)", lineHeight: 1.18, letterSpacing: "-0.02em" }}
                  >
                    I just like{" "}
                    <span className="ink-underline text-ember">
                      making things
                      <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                        <path pathLength={1} d="M4,12 C60,4 120,18 170,9 C210,3 260,14 296,8" />
                      </svg>
                    </span>
                    .
                  </p>
                </div>
              </div>
            </section>
          }
          reveal={
            <section className="min-h-screen h-full bg-obsidian text-bone px-24 flex flex-col justify-center">
              <div className="mx-auto w-full max-w-[1600px]">
                <div className="flex items-start justify-between mono-xs text-ash reveal">
                  <span>(Contact)</span>
                  <span>Let's build something</span>
                </div>

                <a
                  href="mailto:hlincontacts@gmail.com"
                  className="display-hero block mt-24 text-bone hover:text-ember transition-colors reveal"
                  style={delay(80)}
                >
                  LET'S<br />TALK<span className="text-ember">.</span>
                </a>

                <div className="mt-96 grid grid-cols-2 md:grid-cols-4 gap-24 border-t border-graphite pt-24 reveal" style={delay(160)}>
                  <div>
                    <p className="mono-xs text-slate">Email</p>
                    <a href="mailto:hlincontacts@gmail.com" className="nav-link mt-6 inline-block" style={bodySm}>hlincontacts@gmail.com</a>
                  </div>
                  <div>
                    <p className="mono-xs text-slate">Social</p>
                    <a href="https://www.instagram.com/haox.lin" target="_blank" rel="noopener noreferrer" className="nav-link mt-6 inline-block" style={bodySm}>Instagram ↗</a>
                  </div>
                  <div>
                    <p className="mono-xs text-slate">Network</p>
                    <a href="https://www.linkedin.com/in/haolinpacific/" target="_blank" rel="noopener noreferrer" className="nav-link mt-6 inline-block" style={bodySm}>LinkedIn ↗</a>
                  </div>
                  <div>
                    <p className="mono-xs text-slate">Source</p>
                    <a href="https://github.com/jappabl" target="_blank" rel="noopener noreferrer" className="nav-link mt-6 inline-block" style={bodySm}>GitHub ↗</a>
                  </div>
                </div>
              </div>
            </section>
          }
        />
      </main>

      {/* ====================== FOOTER ====================== */}
      <footer className="bg-obsidian text-ash border-t border-graphite px-24 py-24">
        <div className="mx-auto max-w-[1600px] flex flex-col sm:flex-row items-center justify-between gap-12 mono-xs">
          <span>© 2026 Hao Lin — All Rights Reserved</span>
        </div>
      </footer>
    </>
  );
}
