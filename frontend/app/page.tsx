"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MissionSection from "@/components/MissionSection";
import FutureGenerationsSection from "@/components/FutureGenerationsSection";
import TunisiaAlKhadraSection from "@/components/TunisiaAlKhadraSection";
import InteractiveTunisiaMapSection from "@/components/InteractiveTunisiaMapSection";
import StorySection from "@/components/StorySection";
import FAQSection from "@/components/FAQSection";
import BlogInitiativesSection from "@/components/BlogInitiativesSection";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const flagRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Global Connected Scroll Progress Bar at Top
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: pageRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        });
      }

      // 2. Cinematic GSAP Opening Website Animation
      const openTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Ambient background image smooth scale settling on site load
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0.7 },
          { opacity: 1, duration: 1.3, ease: "power2.out" }
        );
      }

      // Flag springs in
      if (flagRef.current) {
        openTl.fromTo(
          flagRef.current,
          { scale: 0.55, opacity: 0, x: -35 },
          { scale: 1, opacity: 1, x: 0, duration: 0.9, ease: "back.out(2.2)" }
        );
      }

      // Headline lines slide up in staggered sequence
      if (heroTitleRef.current) {
        openTl.fromTo(
          heroTitleRef.current.children,
          { y: 48, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.14, duration: 0.95, ease: "power4.out" },
          "-=0.6"
        );
      }

      // Subtitle reveals
      if (descRef.current) {
        openTl.fromTo(
          descRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        );
      }

      // CTA button pops in with bounce
      if (ctaRef.current) {
        openTl.fromTo(
          ctaRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.75, ease: "back.out(2.4)" },
          "-=0.4"
        );
      }

      // 3. Connected Hero Scrubbed Parallax on Scroll
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
          backgroundPositionY: "25%",
          ease: "none",
        });

        if (heroContentRef.current) {
          gsap.to(heroContentRef.current, {
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
            y: -35,
            opacity: 0.7,
            ease: "none",
          });
        }
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen flex flex-col bg-[#f4faf4] text-[#123719] selection:bg-emerald-200 selection:text-emerald-950 overflow-x-hidden"
    >
      {/* Connected Top Scroll Progress Indicator */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-emerald-600 via-teal-500 to-[#c8e653] z-50 origin-left scale-x-0 pointer-events-none shadow-xs"
      />

      {/* Unified Ambient Light Orbs that drift fluidly across the entire page */}
      <div className="fixed top-1/4 -left-48 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="fixed top-2/3 -right-48 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-[160px] pointer-events-none -z-0" />

      {/* Main Hero Section matching user-hero-ref.jpg (Locked to 16:9 canvas so the full 3D map is displayed with zero cutoff) */}
      <section
        ref={heroRef}
        className="relative w-full bg-[#f4faf4] bg-no-repeat bg-right-bottom bg-contain lg:aspect-[16/9] min-h-[580px] sm:min-h-[640px] lg:min-h-[auto] flex flex-col justify-between overflow-hidden will-change-transform"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundColor: "#f4faf4",
        }}
      >
        {/* Top Navbar integrated at top of hero */}
        <Navbar />

        {/* Hero Content Container precisely aligned to match reference design */}
        <div
          ref={heroContentRef}
          className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 pt-2 pb-14 sm:pb-20 lg:pb-28 flex-1 flex flex-col justify-center"
        >
          <div className="max-w-2xl">
            {/* Row: Flag + Headline directly side-by-side */}
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Tunisian Flag */}
              <div
                ref={flagRef}
                className="relative w-[92px] sm:w-[110px] lg:w-[124px] h-[62px] sm:h-[74px] lg:h-[82px] shrink-0 rounded-[4px] overflow-hidden shadow-sm border border-white/90"
              >
                <Image
                  src="/tunisia-flag.png"
                  alt="Tunisian Flag"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Headline */}
              <h1
                ref={heroTitleRef}
                className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-black text-[#153e1f] tracking-tight uppercase leading-[1.03] select-none"
              >
                <span className="block">REPLANTING TUNISIA,</span>
                <span className="block mt-1">ONE TREE AT A TIME</span>
              </h1>
            </div>

            {/* Description & CTA Button indented directly underneath the headline */}
            <div className="mt-5 sm:mt-6 pl-[108px] sm:pl-[134px] lg:pl-[148px] space-y-6 sm:space-y-7">
              <p
                ref={descRef}
                className="text-xs sm:text-[13px] lg:text-[14.5px] font-bold text-[#1f4825] uppercase tracking-wide leading-[1.58] max-w-sm sm:max-w-md"
              >
                BECOME A VOLUNTEER. JOIN OUR NATIONWIDE
                <br className="hidden sm:inline" /> MOVEMENT TO RESTORE OUR FORESTS.
                <br className="hidden sm:inline" /> EACH TREE MAKES A DIFFERENCE.
              </p>

              <div>
                <Link
                  ref={ctaRef}
                  href="/membre/dashboard"
                  className="inline-flex items-center justify-center px-8 sm:px-9 py-3 sm:py-3.5 rounded-full bg-[#3d683a] hover:bg-[#30552d] text-white font-bold text-xs sm:text-[13.5px] tracking-wider uppercase shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  JOIN THE MOVEMENT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section with GSAP ScrollTrigger & Scrub Parallax */}
      <MissionSection />

      {/* Future Generations Action Pillars with GSAP ScrollTrigger */}
      <FutureGenerationsSection />

      {/* Tunisia Al-Khadra National Rallying Call Section */}
      <TunisiaAlKhadraSection />

      {/* Interactive Clickable 24-Governorate Tunisia Map Section */}
      <InteractiveTunisiaMapSection />

      {/* Story & Ecosystem Section with GSAP ScrollTrigger & Scrubbed Lift */}
      <StorySection />

      {/* Frequently Asked Questions with Floating Botanical Leaves & GSAP Parallax */}
      <FAQSection />

      {/* Blog & Initiatives Section with GSAP ScrollTrigger Stagger */}
      <BlogInitiativesSection />

      {/* Corporate Donors & Partner Companies Section with GSAP Animation */}
      <PartnersSection />

      {/* Modern Clean Footer with GSAP ScrollTrigger Stagger */}
      <Footer />
    </div>
  );
}