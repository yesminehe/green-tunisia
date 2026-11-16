"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sprout, Waves, Users, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const trustedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Left Column Entrance Animation
      if (leftColRef.current) {
        gsap.from(leftColRef.current.children, {
          scrollTrigger: {
            trigger: leftColRef.current,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
        });
      }

      // 2. Three Cards Staggered Reveal on Scroll
      const cards = [card1Ref.current, card2Ref.current, card3Ref.current].filter(Boolean);
      gsap.from(cards, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play reverse play reverse",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power3.out",
      });

      // 3. Connected Scrubbed Parallax on Cards (Dynamic Scroll Top/Bottom Reaction)
      if (card1Ref.current) {
        gsap.to(card1Ref.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
          y: -50,
          ease: "none",
        });
      }

      if (card2Ref.current) {
        gsap.to(card2Ref.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
          y: 45,
          ease: "none",
        });
      }

      if (card3Ref.current) {
        gsap.to(card3Ref.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
          y: -40,
          ease: "none",
        });
      }

      // 4. "TRUSTED BY" Strip Entrance
      if (trustedRef.current) {
        gsap.from(trustedRef.current.children, {
          scrollTrigger: {
            trigger: trustedRef.current,
            start: "top 90%",
            toggleActions: "play reverse play reverse",
          },
          y: 25,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="mission"
      className="relative w-full bg-transparent text-[#132a16] py-20 sm:py-24 lg:py-32 overflow-hidden"
    >
      {/* Subtle ambient light glow */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Main Grid: Left copy & Right 3 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div ref={leftColRef} className="lg:col-span-5 flex flex-col items-start">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebf4eb] border border-emerald-900/10 text-[#3e663a] text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
              <Sprout className="w-3.5 h-3.5 text-[#3e663a]" />
              <span>OUR MISSION</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#112415] tracking-tight leading-[1.08] select-none">
              We&apos;re Building
              <br />
              <span className="text-[#3d683a] font-serif italic font-normal">
                a Greener,
              </span>
              <br />
              Cleaner, Stronger
              <br />
              World.
            </h2>

            {/* Description */}
            <p className="text-gray-600 sm:text-[15px] leading-relaxed mt-6 max-w-md font-normal">
              Through education, action, and innovation, we empower people to
              protect nature and create lasting change.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                href="/projets"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#4c6b3e] hover:bg-[#3f5b33] text-white font-semibold text-sm tracking-wide shadow-md shadow-emerald-950/15 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#about"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm tracking-wide border border-gray-200/90 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Column: Three Interactive Cards with GSAP Parallax */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-5 lg:gap-6 justify-center items-center">
            {/* Card 1: Sustainable Land Use */}
            <div
              ref={card1Ref}
              className="group relative flex-1 min-w-[260px] max-w-[380px] h-[480px] sm:h-[530px] lg:h-[560px] rounded-[30px] overflow-hidden shadow-xl shadow-black/10 transition-transform duration-300 ease-out will-change-transform border border-black/5"
            >
              <Image
                src="/mission/sustainable-land.jpg"
                alt="Sustainable Land Use"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 pointer-events-none" />
              <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-end">
                <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/20 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
                  <Sprout className="w-5 h-5 text-[#3d683a]" />
                </div>
                <h3 className="text-2xl sm:text-[26px] font-bold text-white leading-[1.15] tracking-tight drop-shadow-sm">
                  <span>Sustainable</span>
                  <br />
                  <span>Land Use</span>
                </h3>
                <p className="text-white/80 text-xs sm:text-[13.5px] font-normal leading-relaxed mt-2.5 max-w-[260px]">
                  Promoting responsible land management.
                </p>
              </div>
            </div>

            {/* Card 2: Climate Action */}
            <div
              ref={card2Ref}
              className="group relative flex-1 min-w-[260px] max-w-[380px] h-[480px] sm:h-[530px] lg:h-[560px] rounded-[30px] overflow-hidden shadow-xl shadow-black/10 transition-transform duration-300 ease-out will-change-transform border border-black/5"
            >
              <Image
                src="/mission/climate-action.jpg"
                alt="Climate Action"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 pointer-events-none" />
              <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-end">
                <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/20 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
                  <Waves className="w-5 h-5 text-[#1e617d]" />
                </div>
                <h3 className="text-2xl sm:text-[26px] font-bold text-white leading-[1.15] tracking-tight drop-shadow-sm">
                  <span>Climate</span>
                  <br />
                  <span>Action</span>
                </h3>
                <p className="text-white/80 text-xs sm:text-[13.5px] font-normal leading-relaxed mt-2.5 max-w-[260px]">
                  Reducing emissions, building resilience.
                </p>
              </div>
            </div>

            {/* Card 3: Community Empowerment */}
            <div
              ref={card3Ref}
              className="group relative flex-1 min-w-[260px] max-w-[380px] h-[480px] sm:h-[530px] lg:h-[560px] rounded-[30px] overflow-hidden shadow-xl shadow-black/10 transition-transform duration-300 ease-out will-change-transform border border-black/5"
            >
              <Image
                src="/mission/community-empowerment.jpg"
                alt="Community Empowerment"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 pointer-events-none" />
              <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-end">
                <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/20 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
                  <Users className="w-5 h-5 text-[#3d683a]" />
                </div>
                <h3 className="text-2xl sm:text-[26px] font-bold text-white leading-[1.15] tracking-tight drop-shadow-sm">
                  <span>Community</span>
                  <br />
                  <span>Empowerment</span>
                </h3>
                <p className="text-white/80 text-xs sm:text-[13.5px] font-normal leading-relaxed mt-2.5 max-w-[260px]">
                  Empowering local heroes, creating impact.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: TRUSTED BY Strip */}
        <div
          ref={trustedRef}
          className="mt-20 pt-10 border-t border-gray-200/60 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <span className="text-[11px] font-bold tracking-[0.22em] text-gray-400 uppercase select-none">
            TRUSTED BY
          </span>

          <div className="flex flex-wrap items-center justify-center md:justify-between gap-8 lg:gap-12 text-gray-400">
            <div className="flex items-center gap-2 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="font-bold text-sm tracking-tight">Logoipsum</span>
            </div>

            <div className="flex items-center gap-2 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <polygon points="12,2 22,20 2,20" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="12" cy="14" r="2.5" fill="currentColor" />
              </svg>
              <span className="font-bold text-sm tracking-tight">Logoipsum</span>
            </div>

            <div className="flex items-center gap-2 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M9 9h6v6H9z" fill="currentColor" />
              </svg>
              <span className="font-bold text-sm tracking-tight">Logoipsum</span>
            </div>

            <div className="flex items-center gap-2 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="font-bold text-sm tracking-tight">Logoipsum</span>
            </div>

            <div className="flex items-center gap-2 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 3l9 6-9 6-9-6z" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M3 13l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              <span className="font-bold text-sm tracking-tight">Logoipsum</span>
            </div>

            <div className="flex items-center gap-2 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <circle cx="8" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="16" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              <span className="font-bold text-sm tracking-tight">Logoipsum</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}