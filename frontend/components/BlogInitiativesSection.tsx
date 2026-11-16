"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sprout, ArrowRight, ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface InitiativeCard {
  id: string;
  tag: string;
  image: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  href: string;
}

const initiativesData: InitiativeCard[] = [
  {
    id: "ocean-cleanup",
    tag: "Ocean Cleanup",
    image: "/blog/ocean-cleanup.jpg",
    titleLine1: "Clean Oceans,",
    titleLine2: "Bright Future",
    description: "Removing plastic and debris from our oceans and coastlines.",
    href: "/projets",
  },
  {
    id: "reforestation",
    tag: "Reforestation",
    image: "/blog/reforestation-waterfall.jpg",
    titleLine1: "More Trees,",
    titleLine2: "Better Planet",
    description: "Planting and restoring forests for a healthier Earth.",
    href: "/arbres",
  },
  {
    id: "community",
    tag: "Community",
    image: "/blog/community-planting.jpg",
    titleLine1: "Stronger Communities,",
    titleLine2: "Stronger Future",
    description: "Empowering communities to lead local change.",
    href: "/membre/dashboard",
  },
];

export default function BlogInitiativesSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const newsletterCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Header Row Reveal
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 82%",
            toggleActions: "play reverse play reverse",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        });
      }

      // 2. Initiative Cards Staggered Slide-up
      if (cardsGridRef.current) {
        const cards = cardsGridRef.current.querySelectorAll(".initiative-card");
        gsap.from(cards, {
          scrollTrigger: {
            trigger: cardsGridRef.current,
            start: "top 78%",
            toggleActions: "play reverse play reverse",
          },
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.18,
          ease: "power3.out",
        });
      }

      // 3. Right Lime Newsletter Card Bouncy Entrance
      if (newsletterCardRef.current) {
        gsap.from(newsletterCardRef.current, {
          scrollTrigger: {
            trigger: newsletterCardRef.current,
            start: "top 82%",
            toggleActions: "play reverse play reverse",
          },
          scale: 0.92,
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "back.out(1.5)",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="initiatives"
      className="w-full bg-transparent py-20 lg:py-28 px-6 sm:px-12 lg:px-16 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Top Header Row */}
        <div ref={headerRef} className="flex items-center justify-between mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ebf4eb] border border-emerald-900/10 text-[#3e663a] text-xs font-bold tracking-wider uppercase shadow-sm">
            <Sprout className="w-3.5 h-3.5 text-[#3e663a]" />
            <span>OUR INITIATIVES</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous initiatives"
              className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Next initiatives"
              className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors shadow-xs cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-Column Grid: 3 Interactive Initiative Cards + 1 Right Action Block */}
        <div ref={cardsGridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-7 items-start">
          {/* Three Initiative Cards */}
          {initiativesData.map((item) => (
            <div
              key={item.id}
              className="initiative-card group flex flex-col bg-transparent rounded-[28px] transition-transform duration-300 hover:-translate-y-1.5 will-change-transform"
            >
              {/* Card Image Container */}
              <div className="relative w-full h-[300px] sm:h-[340px] rounded-[26px] overflow-hidden shadow-md shadow-black/5 border border-black/5">
                <Image
                  src={item.image}
                  alt={`${item.titleLine1} ${item.titleLine2}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 z-10">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-gray-900 shadow-md">
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Text Meta Below Image */}
              <div className="pt-5 flex flex-col">
                <h3 className="text-xl sm:text-[22px] font-bold text-gray-900 leading-[1.2] tracking-tight group-hover:text-[#3d683a] transition-colors">
                  <span>{item.titleLine1}</span>
                  <br />
                  <span>{item.titleLine2}</span>
                </h3>

                <p className="text-gray-500 text-xs sm:text-[13px] leading-relaxed mt-2.5">
                  {item.description}
                </p>

                <div className="mt-4">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 group-hover:text-[#3d683a] group-hover:gap-2 transition-all duration-200"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Right Column: Headline, Description & Lime Newsletter Card */}
          <div className="flex flex-col justify-between h-full pt-1">
            <div>
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-gray-900 leading-[1.18] tracking-tight">
                Real Actions. Real Impact.
                <br />
                A Better Future.
              </h2>

              <p className="text-gray-600 text-xs sm:text-[13.5px] leading-relaxed mt-3">
                Discover how we turn ideas into impact through projects that
                protect our planet and support communities.
              </p>

              <div className="mt-4">
                <Link
                  href="/projets"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800 hover:text-[#3d683a] transition-colors"
                >
                  <span>View All Initiatives</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Vibrant Lime Newsletter Box */}
            <div
              ref={newsletterCardRef}
              className="mt-6 p-6 rounded-[26px] bg-[#d7ee6b] text-[#14290d] shadow-sm flex flex-col justify-between will-change-transform"
            >
              <div>
                <h3 className="text-lg font-extrabold text-[#11260a] tracking-tight leading-snug">
                  Stay Inspired. Stay Informed.
                </h3>
                <p className="text-xs text-[#264216] leading-relaxed mt-2">
                  Subscribe to our newsletter and get the latest updates on our
                  projects, stories, and how you can help.
                </p>

                <form onSubmit={handleSubscribe} className="mt-4 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full bg-white text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#456930] shadow-2xs"
                    />
                    <button
                      type="submit"
                      className="shrink-0 px-4 py-2.5 rounded-full bg-[#466931] hover:bg-[#385526] text-white text-xs font-semibold inline-flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {subscribed && (
                    <p className="text-[11px] font-bold text-[#1f4211] pt-1">
                      ✓ Thank you for subscribing!
                    </p>
                  )}
                </form>
              </div>

              {/* Social Proof */}
              <div className="mt-5 pt-4 border-t border-[#c6df54] flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-[#d7ee6b] shadow-2xs">
                    <Image
                      src="/blog/avatar1.jpg"
                      alt="Subscriber avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-[#d7ee6b] shadow-2xs">
                    <Image
                      src="/blog/avatar2.jpg"
                      alt="Subscriber avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-[#d7ee6b] shadow-2xs">
                    <Image
                      src="/blog/avatar3.jpg"
                      alt="Subscriber avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-medium text-[#264216]">
                  <Sprout className="w-3 h-3 text-[#264216]" />
                  <span>Join thousands of change-makers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}