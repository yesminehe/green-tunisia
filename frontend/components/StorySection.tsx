"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftIntroRef = useRef<HTMLDivElement>(null);
  const rightQuoteRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const bottomGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Top Left Intro & Wave Emblem Reveal
      if (leftIntroRef.current) {
        gsap.from(leftIntroRef.current.children, {
          scrollTrigger: {
            trigger: leftIntroRef.current,
            start: "top 82%",
            toggleActions: "play reverse play reverse",
          },
          x: -35,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
        });
      }

      // 2. Top Right Quote & Category Pills
      if (rightQuoteRef.current) {
        gsap.from(rightQuoteRef.current.children, {
          scrollTrigger: {
            trigger: rightQuoteRef.current,
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

      // 3. Sand Card Container Connected Lift & Scale
      if (cardContainerRef.current) {
        gsap.from(cardContainerRef.current, {
          scrollTrigger: {
            trigger: cardContainerRef.current,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          scale: 0.96,
          y: 50,
          opacity: 0.6,
          duration: 1,
          ease: "power3.out",
        });
      }

      // 4. Subtle Connected Image Parallax inside Card
      if (imageWrapperRef.current) {
        gsap.fromTo(
          imageWrapperRef.current.querySelector("img"),
          { scale: 1.1 },
          {
            scale: 1.0,
            scrollTrigger: {
              trigger: cardContainerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
            ease: "none",
          }
        );
      }

      // 5. Bottom Story Text Details & Contact Button
      if (bottomGridRef.current) {
        gsap.from(bottomGridRef.current.children, {
          scrollTrigger: {
            trigger: bottomGridRef.current,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          y: 35,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-transparent text-[#1b251d] py-20 sm:py-24 lg:py-28 px-6 sm:px-12 lg:px-16 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Top Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Sub-column */}
          <div ref={leftIntroRef} className="lg:col-span-4 flex flex-col justify-between h-full pt-1">
            <p className="text-xs sm:text-[13px] text-gray-500 font-normal leading-relaxed max-w-xs">
              We are passionate about transcending the limits of conventional
              conservation and environmental reforestation.
            </p>

            <div className="flex items-center gap-2.5 mt-8 lg:mt-16">
              <svg
                className="w-8 h-5 stroke-[#8c7457] fill-none"
                viewBox="0 0 32 20"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 14c4-4 8 4 12 0s8-4 12 0" />
                <path d="M6 18c3-3 6 3 9 0s6-3 9 0" />
                <circle cx="16" cy="6" r="3" fill="#8c7457" stroke="none" />
              </svg>
              <span className="text-xs font-bold text-[#3d3326] tracking-wider uppercase">
                About Us
              </span>
            </div>
          </div>

          {/* Right Sub-column */}
          <div ref={rightQuoteRef} className="lg:col-span-8 flex flex-col items-start">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1a251d] leading-[1.22] tracking-tight max-w-2xl">
              We believe that the natural ecosystems where we live, breathe, and
              dream have the power to transform lives and shape our collective
              future.
            </h2>

            {/* Three Soft Pastel Pills */}
            <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-7">
              <span className="px-5 py-2 rounded-full bg-[#ece6d8] text-[#554a3b] text-xs font-medium tracking-wide shadow-2xs hover:bg-[#e4ddcd] transition-colors cursor-pointer">
                Reforestation & Ecology
              </span>
              <span className="px-5 py-2 rounded-full bg-[#dfe9d7] text-[#375830] text-xs font-medium tracking-wide shadow-2xs hover:bg-[#d3e0cb] transition-colors cursor-pointer">
                Sustainability
              </span>
              <span className="px-5 py-2 rounded-full bg-[#dbe6e4] text-[#2d504e] text-xs font-medium tracking-wide shadow-2xs hover:bg-[#cfdedb] transition-colors cursor-pointer">
                Community Impact
              </span>
            </div>
          </div>
        </div>

        {/* Large Sand Card Container */}
        <div
          ref={cardContainerRef}
          className="mt-12 sm:mt-14 bg-[#ebe6dc] rounded-[30px] sm:rounded-[36px] p-5 sm:p-8 lg:p-10 border border-[#ded7ca]/80 shadow-sm will-change-transform"
        >
          {/* Panoramic Landscape Image */}
          <div
            ref={imageWrapperRef}
            className="relative w-full h-[300px] sm:h-[400px] lg:h-[480px] rounded-[22px] sm:rounded-[26px] overflow-hidden shadow-inner"
          >
            <Image
              src="/story/botanical-path.jpg"
              alt="Botanical path through Tunisian pine ecosystem"
              fill
              sizes="(max-width: 1440px) 100vw, 1400px"
              priority
              className="object-cover transition-transform duration-700 ease-out"
            />
          </div>

          {/* Two-Column Story Details */}
          <div ref={bottomGridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mt-8 sm:mt-10 items-start">
            <div className="lg:col-span-5">
              <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#1b271d] leading-[1.18] tracking-tight">
                The Story Behind Our Reforestation Movement
              </h3>
            </div>

            <div className="lg:col-span-7 flex flex-col items-start">
              <p className="text-xs sm:text-[13.5px] text-[#47433b] leading-relaxed font-normal">
                Green Tunisia was born from the vision of passionate botanists,
                foresters, and dedicated citizens committed to revitalizing our
                native woodlands, preventing soil erosion, and fighting climate change.
              </p>

              <p className="text-xs sm:text-[13.5px] text-[#47433b] leading-relaxed font-normal mt-4">
                We have built a resilient national network grounded in scientific
                planting methods, regional volunteer campaigns, and an uncompromising
                dedication to our indigenous flora.
              </p>

              <p className="text-xs sm:text-[13.5px] font-bold text-[#1c271e] mt-4 tracking-wide">
                It is time to act — beyond the conventional.
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 text-xs font-semibold text-[#1c271e] shadow-xs hover:shadow-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Contact Us</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}