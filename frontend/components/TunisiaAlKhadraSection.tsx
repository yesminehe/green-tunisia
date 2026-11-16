"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sprout, ShieldAlert, HeartHandshake, ArrowRight, CheckCircle2, TreePine } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SoftSatelliteTunisiaMap from "./SoftSatelliteTunisiaMap";

export default function TunisiaAlKhadraSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const arabicRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const pledgeCardRef = useRef<HTMLDivElement>(null);

  const [pledged, setPledged] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(12480);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Arabic Calligraphy & Sub-header Reveal
      if (arabicRef.current) {
        gsap.from(arabicRef.current, {
          scrollTrigger: {
            trigger: arabicRef.current,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
          scale: 0.85,
          opacity: 0,
          y: -30,
          duration: 1,
          ease: "power3.out",
        });
      }

      // 2. Headline & Manifesto Reveal
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
        });
      }

      // 3. Contrast Comparison Cards Reveal
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 78%",
            toggleActions: "play reverse play reverse",
          },
          y: 60,
          opacity: 0,
          stagger: 0.2,
          duration: 0.9,
          ease: "power3.out",
        });
      }

      // 4. Interactive Pledge Card Pop-in
      if (pledgeCardRef.current) {
        gsap.from(pledgeCardRef.current, {
          scrollTrigger: {
            trigger: pledgeCardRef.current,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          scale: 0.94,
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "back.out(1.5)",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePledge = () => {
    if (!pledged) {
      setPledged(true);
      setPledgeCount((prev) => prev + 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="stand-for-tunisia"
      className="relative w-full bg-transparent text-white py-14 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12 overflow-hidden"
    >
      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Floating Curved Sanctuary Card */}
        <div className="relative rounded-[36px] sm:rounded-[44px] lg:rounded-[52px] bg-gradient-to-br from-[#091d0f] via-[#0d2714] to-[#07170c] py-16 sm:py-20 lg:py-24 px-6 sm:px-12 lg:px-16 shadow-2xl shadow-emerald-950/25 border border-emerald-500/20 overflow-hidden">
          {/* Atmospheric Dark Green Glow Orbs */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none" />

          {/* Subtle Background Pattern Texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat"
            style={{
              backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Soft Satellite Map Overlay with Little Trees */}
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 opacity-45 sm:opacity-55 lg:opacity-65 transition-opacity duration-700 pointer-events-none"
            style={{
              maskImage: "radial-gradient(ellipse 95% 90% at 50% 50%, black 55%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 95% 90% at 50% 50%, black 55%, transparent 100%)",
            }}
          >
            <SoftSatelliteTunisiaMap />
          </div>

          <div className="relative z-10">
            {/* Top Centered Header with Arabic Emblem */}
            <div className="text-center max-w-4xl mx-auto">
          {/* Stylized Arabic "تونس الخضراء" Badge */}
          <div ref={arabicRef} className="inline-flex flex-col items-center mb-6">
            <span
              dir="rtl"
              lang="ar"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-100 to-[#d7ee6b] tracking-wider drop-shadow-md select-none"
              style={{ fontFamily: "'Noto Sans Arabic', 'Amiri', 'Traditional Arabic', serif" }}
            >
              تونس الخضراء
            </span>
            <div className="flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-widest uppercase shadow-inner">
              <TreePine className="w-3.5 h-3.5 text-emerald-400" />
              <span>THE NAME WE PROMISED TO KEEP</span>
            </div>
          </div>

          {/* Main Manifesto Headline */}
          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-[52px] font-extrabold text-white tracking-tight leading-[1.12] mt-4"
          >
            <span>The world has always called it &ldquo;Tunisia the Green&rdquo;.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-[#d7ee6b] font-serif italic font-normal">
              Today, our lands are drying up. It is time to stand up.
            </span>
          </h2>

          <p className="text-emerald-100/70 sm:text-base lg:text-[17px] leading-relaxed mt-6 max-w-2xl mx-auto font-normal">
            Decades of recurring droughts, severe wildfires in Tabarka and Jendouba, and advancing desertification
            are threatening the soil our ancestors nurtured. We cannot let &ldquo;El Khadhra&rdquo; become just a memory.
            Every sapling we plant today is an act of patriotism.
          </p>
        </div>

        {/* Two Dramatic Comparison Pillars: The Urgency vs. The Stand */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-16 sm:mt-20">
          {/* Card 1: The Urgent Crisis */}
          <div className="relative bg-[#132c19]/70 backdrop-blur-md rounded-[32px] p-8 sm:p-10 border border-red-500/20 shadow-xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 shadow-sm">
                <ShieldAlert className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest text-red-400 uppercase font-mono">
                  THE REALITY
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Our Forests Under Threat
                </h3>
              </div>
            </div>

            <p className="text-emerald-100/70 text-xs sm:text-sm leading-relaxed">
              Between northern mountain fires and southern arid winds, over 1.2 million hectares of Tunisian land
              face imminent degradation. In regions like Kasserine, Siliana, and Zaghouan, forest cover has steadily receded.
            </p>

            {/* Stat Points */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-emerald-900/40">
              <div className="p-4 rounded-2xl bg-black/25 border border-white/5">
                <span className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono">
                  -42%
                </span>
                <p className="text-[11px] sm:text-xs text-emerald-200/60 mt-1">
                  Water reservoir capacity in dry seasons
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-black/25 border border-white/5">
                <span className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono">
                  +1.2M ha
                </span>
                <p className="text-[11px] sm:text-xs text-emerald-200/60 mt-1">
                  Land exposed to severe soil erosion
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: The National Awakening & Action */}
          <div className="relative bg-[#132c19]/70 backdrop-blur-md rounded-[32px] p-8 sm:p-10 border border-emerald-500/30 shadow-xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-sm">
                <HeartHandshake className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase font-mono">
                  THE COMMITMENT
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Stand for Green Tunisia
                </h3>
              </div>
            </div>

            <p className="text-emerald-100/70 text-xs sm:text-sm leading-relaxed">
              We are planting native Aleppo pine, stone pine, cork oak, and olive trees that have survived in North Africa
              for thousands of years. Monitored with smart sensors and nurtured by citizens in every delegation.
            </p>

            {/* Stat Points */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-emerald-900/40">
              <div className="p-4 rounded-2xl bg-black/25 border border-emerald-500/15">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                  24 / 24
                </span>
                <p className="text-[11px] sm:text-xs text-emerald-200/60 mt-1">
                  Governorates mobilizing volunteers
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-black/25 border border-emerald-500/15">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#d7ee6b] font-mono">
                  12M Trees
                </span>
                <p className="text-[11px] sm:text-xs text-emerald-200/60 mt-1">
                  Target: 1 tree for every Tunisian citizen
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Citizen Pledge Card */}
        <div
          ref={pledgeCardRef}
          className="mt-12 sm:mt-16 relative rounded-[32px] bg-gradient-to-br from-[#1a3d22] via-[#14321b] to-[#0f2715] p-8 sm:p-12 border border-emerald-500/30 shadow-2xl overflow-hidden text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-5">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>CITIZEN REFORESTATION PLEDGE</span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            I Stand for Tunisia the Green.
          </h3>

          <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl mx-auto mt-3 leading-relaxed">
            Take the digital pledge to plant at least one tree this season, support our reforestation expeditions,
            and keep our country green for generations to come.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={handlePledge}
              disabled={pledged}
              className={`px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 transform shadow-lg flex items-center justify-center gap-2 ${
                pledged
                  ? "bg-emerald-500 text-white cursor-default"
                  : "bg-gradient-to-r from-[#d7ee6b] to-emerald-400 hover:from-[#e2f974] hover:to-emerald-300 text-[#0c2310] hover:scale-105 active:scale-95 cursor-pointer shadow-emerald-500/20"
              }`}
            >
              {pledged ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>You Have Taken the Pledge! 🇹🇳</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="w-5 h-5" />
                  <span>Take the Pledge to Plant for Tunisia</span>
                </>
              )}
            </button>

            <Link
              href="/membre/dashboard"
              className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all duration-200 flex items-center justify-center gap-2 hover:border-white/40"
            >
              <span>Join a Planting Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

            {/* Live Pledge Counter */}
            <div className="mt-8 pt-6 border-t border-emerald-800/40 flex items-center justify-center gap-2 text-emerald-300/80 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                <strong className="text-white text-sm font-sans">{pledgeCount.toLocaleString()}</strong> Tunisians have taken the pledge so far
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
