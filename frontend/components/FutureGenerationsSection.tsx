"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FutureGenerationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Header Reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 2. Three Frosted Glass Cards Staggered Rise with fromTo
      const cards = [card1Ref.current, card2Ref.current, card3Ref.current].filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.95,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-cover bg-center bg-no-repeat py-24 sm:py-28 lg:py-36 px-6 sm:px-12 lg:px-16 overflow-hidden"
      style={{
        backgroundImage: "url('/future/greening-platform-bg.jpg')",
        backgroundColor: "#f4faf4",
      }}
    >
      {/* Top seamless gradient wash melting into the page background */}
      <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-[#f4faf4] via-[#f4faf4]/90 to-transparent pointer-events-none" />

      {/* Bottom seamless blend to next section */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#f4faf4] via-[#f4faf4]/90 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Section Header matching reference image */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* Eyebrow Tag: minimal black square + text */}
          <div className="inline-flex items-center justify-center gap-2 mb-3 select-none">
            <span className="w-1.5 h-1.5 bg-black rounded-xs inline-block" />
            <span className="text-[11px] font-bold tracking-[0.22em] text-gray-800 uppercase">
              WHY CHOOSE US
            </span>
          </div>

          {/* Main Headline: "A Greening Platform You Can [Icon] Trust" */}
          <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold text-gray-900 tracking-tight leading-[1.14]">
            A Greening Platform You
            <br />
            Can{" "}
            <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black text-white mx-1.5 align-middle shadow-md">
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </span>{" "}
            Trust
          </h2>

          <p className="text-gray-500 text-xs sm:text-[14px] max-w-xl mx-auto mt-3 font-normal leading-relaxed">
            A Greener Tunisia for Future Generations — transparent reforestation,
            verified telemetry, and nationwide citizen collaboration.
          </p>
        </div>

        {/* Floating Glassmorphic Cards Layout over the Rolling Meadow Hills */}
        <div className="relative">
          {/* Top Row: Two Cards on Left and Right (sitting higher on the hills) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-start max-w-5xl mx-auto">
            {/* Card 1 (Left): Verified Projects & Impact Reports */}
            <div
              ref={card1Ref}
              className="group relative bg-white/80 backdrop-blur-xl rounded-[32px] sm:rounded-[36px] p-8 sm:p-10 border border-white/90 shadow-2xl shadow-emerald-950/10 hover:bg-white/90 transition-all duration-300 will-change-transform flex flex-col justify-between min-h-[290px]"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-[1.25]">
                  Verified Projects &<br />
                  Impact Reports
                </h3>

                <p className="text-gray-600 text-xs sm:text-[13.5px] leading-relaxed mt-4 font-normal">
                  You&apos;ll receive detailed, verified impact reports showcasing
                  the number of trees planted, CO₂ offset, and the health of each
                  project.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/arbres"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-xs font-semibold text-gray-900 border border-gray-200/70 shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <span>Read More</span>
                  <span className="w-4 h-4 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    ↗
                  </span>
                </Link>
              </div>
            </div>

            {/* Card 2 (Right): Collaboration Tools for Organizations */}
            <div
              ref={card2Ref}
              className="group relative bg-white/80 backdrop-blur-xl rounded-[32px] sm:rounded-[36px] p-8 sm:p-10 border border-white/90 shadow-2xl shadow-emerald-950/10 hover:bg-white/90 transition-all duration-300 will-change-transform flex flex-col justify-between min-h-[290px]"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-[1.25]">
                  Collaboration Tools for<br />
                  Organizations
                </h3>

                <p className="text-gray-600 text-xs sm:text-[13.5px] leading-relaxed mt-4 font-normal">
                  Designed for businesses, schools, and NGOs, our platform provides
                  collaboration tools to manage large-scale greening programs,
                  including team coordination and real-time reporting.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/membre/dashboard"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-xs font-semibold text-gray-900 border border-gray-200/70 shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <span>Read More</span>
                  <span className="w-4 h-4 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row: Middle Card (Nestled centered in the valley between the hills) */}
          <div className="mt-8 sm:mt-12 max-w-lg mx-auto">
            <div
              ref={card3Ref}
              className="group relative bg-white/80 backdrop-blur-xl rounded-[32px] sm:rounded-[36px] p-8 sm:p-10 border border-white/90 shadow-2xl shadow-emerald-950/10 hover:bg-white/90 transition-all duration-300 will-change-transform flex flex-col justify-between min-h-[270px]"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-[1.25]">
                  Interactive Planting<br />
                  Maps & Telemetry
                </h3>

                <p className="text-gray-600 text-xs sm:text-[13.5px] leading-relaxed mt-4 font-normal">
                  Explore interactive satellite maps, real-time soil hydration telemetry,
                  and monitor sapling survival rates across all 24 Tunisian governorates.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-xs font-semibold text-gray-900 border border-gray-200/70 shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <span>Read More</span>
                  <span className="w-4 h-4 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}