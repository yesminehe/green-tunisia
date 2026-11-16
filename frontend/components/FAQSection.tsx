"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sprout, ChevronDown, HelpCircle, ArrowRight, MessageSquare } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  tag: string;
}

const faqs: FAQItem[] = [
  {
    id: "faq-1",
    tag: "VOLUNTEERING",
    question: "How can I participate as a volunteer in my governorate?",
    answer:
      "You can create a free Volunteer Profile on Green Tunisia. Browse ongoing weekend planting campaigns in your delegation, RSVP with one click, and join our local team leaders who supply saplings, gloves, and irrigation tools on-site in all 24 governorates.",
  },
  {
    id: "faq-2",
    tag: "SPECIES & ECOLOGY",
    question: "Which tree species are selected, and why are they native to Tunisia?",
    answer:
      "We exclusively plant indigenous species naturally adapted to North African climate conditions: Aleppo Pine (Snouber), Cork Oak (Fernan), Stone Pine, Wild Olive (Zebbouj), Carob (Kharroub), and Mediterranean Cypress. These species feature deep root systems that retain groundwater, resist wildfires, and prevent desert soil erosion.",
  },
  {
    id: "faq-3",
    tag: "PRECISION IRRIGATION",
    question: "How do you guarantee the survival of saplings during hot summer droughts?",
    answer:
      "Each planting site is paired with smart IoT soil moisture sensors and community guardian circles. In vulnerable arid regions, we employ sub-surface clay pot irrigation and biodegradable moisture-retaining mulch, achieving a verified 92%+ sapling survival rate.",
  },
  {
    id: "faq-4",
    tag: "CORPORATE SPONSORSHIP",
    question: "Can businesses and corporate sponsors adopt dedicated forest parcels?",
    answer:
      "Yes. Corporate partners can sponsor 500 to 50,000+ trees. We provide branded reforestation signage on-site, team-building planting days for your employees, and authenticated annual CO₂ offset certification with satellite verification.",
  },
  {
    id: "faq-5",
    tag: "VERIFICATION & TELEMETRY",
    question: "How is planting progress tracked and verified?",
    answer:
      "Every sapling is geolocated with GPS coordinates upon planting. Our open-access platform updates satellite vegetation indexes (NDVI) quarterly, allowing citizens and donors to inspect the health and growth of their trees directly on our interactive map.",
  },
  {
    id: "faq-6",
    tag: "COMMUNITY & EDUCATION",
    question: "Is participation completely free for citizens and schools?",
    answer:
      "Yes, 100% free. Green Tunisia provides all saplings, transportation logistics for student clubs, and guidance at no cost. All funding is provided through transparent corporate sponsorships and civic environmental grants.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string>("faq-1");

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const leafTopRef = useRef<HTMLDivElement>(null);
  const leafBottomRef = useRef<HTMLDivElement>(null);

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
              start: "top 82%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 2. Accordion Items Staggered Rise
      if (accordionRef.current) {
        gsap.fromTo(
          accordionRef.current.children,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: accordionRef.current,
              start: "top 78%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 3. Floating Botanical Leaves GSAP Parallax & Sway (Connected on Scroll Top/Bottom)
      if (leafTopRef.current) {
        gsap.to(leafTopRef.current, {
          y: 80,
          rotation: 18,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      if (leafBottomRef.current) {
        gsap.to(leafBottomRef.current, {
          y: -90,
          rotation: -16,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative w-full bg-transparent text-[#122a16] py-24 sm:py-28 lg:py-36 px-6 sm:px-12 lg:px-16 overflow-hidden"
    >
      {/* Floating Botanical Leaf 1 (Top Right) */}
      <div
        ref={leafTopRef}
        className="absolute -top-10 -right-14 sm:-right-8 w-44 sm:w-64 h-44 sm:h-64 pointer-events-none select-none z-10 opacity-75 sm:opacity-85 filter drop-shadow-xl will-change-transform"
      >
        <div className="relative w-full h-full rounded-full overflow-hidden p-2">
          <Image
            src="/faq/botanical-leaves.jpg"
            alt="Mediterranean botanical green leaves"
            fill
            className="object-contain transform rotate-45 scale-125"
          />
        </div>
      </div>

      {/* Floating Botanical Leaf 2 (Bottom Left) */}
      <div
        ref={leafBottomRef}
        className="absolute -bottom-12 -left-12 sm:-left-6 w-48 sm:w-72 h-48 sm:h-72 pointer-events-none select-none z-10 opacity-70 sm:opacity-80 filter drop-shadow-xl will-change-transform"
      >
        <div className="relative w-full h-full rounded-full overflow-hidden p-2">
          <Image
            src="/faq/botanical-leaves.jpg"
            alt="Olive and cork oak green foliage"
            fill
            className="object-contain transform -rotate-75 scale-135"
          />
        </div>
      </div>

      {/* Ambient background blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-100/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-20 max-w-[1200px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ebf4eb] border border-emerald-900/10 text-[#3e663a] text-xs font-bold tracking-wider uppercase mb-5 shadow-2xs">
            <Sprout className="w-3.5 h-3.5 text-[#3e663a]" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#112415] tracking-tight leading-[1.14]">
            Everything You Need to Know About{" "}
            <span className="text-[#3d683a] font-serif italic font-normal">
              Reforestation in Tunisia.
            </span>
          </h2>

          <p className="text-gray-600 sm:text-[15px] leading-relaxed mt-4 max-w-2xl mx-auto font-normal">
            Clear answers on citizen volunteering, corporate tree sponsorship,
            scientific planting methods, and sapling survival monitoring.
          </p>
        </div>

        {/* Accordion List */}
        <div ref={accordionRef} className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-[24px] sm:rounded-[28px] border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white border-emerald-500/40 shadow-lg shadow-emerald-950/5 ring-1 ring-emerald-500/15"
                    : "bg-white/75 hover:bg-white border-gray-200/70 shadow-xs hover:border-emerald-300/60"
                }`}
              >
                {/* Accordion Question Header */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pr-2">
                    <span className="text-[10px] font-bold tracking-widest text-emerald-800/60 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50 uppercase w-fit font-mono">
                      {faq.tag}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-[#3d683a] text-white rotate-180 shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Answer Content */}
                <div
                  className={`px-6 sm:px-7 pb-6 sm:pb-7 transition-all duration-300 ease-out ${
                    isOpen ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-600 text-xs sm:text-[14px] leading-relaxed font-normal">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Help Callout Box */}
        <div className="mt-14 max-w-3xl mx-auto rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-[#edf8e1] p-6 sm:p-8 border border-emerald-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-xs text-[#3d683a] shrink-0">
              <MessageSquare className="w-5 h-5 text-[#3d683a]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                Have a specific question about your region?
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Our team and local coordinators in all 24 governorates are here to assist.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3d683a] hover:bg-[#2f532c] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-200"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
