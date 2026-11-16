"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Building2, Handshake, ArrowRight, ShieldCheck, TreePine, Award, Sparkles, ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface PartnerCompany {
  name: string;
  category: string;
  tier: "Strategic" | "Forest Patron" | "Technology";
  treesSponsored: string;
  governorates: string;
  description: string;
  iconBg: string;
}

const partners: PartnerCompany[] = [
  {
    name: "BIAT Foundation",
    category: "Banking & Social Impact",
    tier: "Strategic",
    treesSponsored: "120,000 Trees",
    governorates: "Jendouba, Siliana, Kasserine",
    description: "Funding major oak and pine replanting across fire-damaged northwestern forest reserves.",
    iconBg: "bg-emerald-950 text-white",
  },
  {
    name: "Poulina Group Holding",
    category: "Agro-Industry & Energy",
    tier: "Strategic",
    treesSponsored: "95,000 Trees",
    governorates: "Béja, Kairouan, Zaghouan",
    description: "Sponsoring watershed tree planting and agroforestry shelterbelts to combat desertification.",
    iconBg: "bg-[#183a20] text-emerald-300",
  },
  {
    name: "Telnet Holding",
    category: "Aerospace & IoT Telemetry",
    tier: "Technology",
    treesSponsored: "65,000 Trees",
    governorates: "Tunis, Sousse, Sfax",
    description: "Supplying smart IoT soil moisture sensors and drone vegetative health monitoring.",
    iconBg: "bg-teal-950 text-teal-300",
  },
  {
    name: "Ooredoo Tunisie",
    category: "Telecommunications & CSR",
    tier: "Forest Patron",
    treesSponsored: "75,000 Trees",
    governorates: "Tabarka, Gabès, Médenine",
    description: "Deploying solar-powered environmental gateways and sponsoring youth planting expeditions.",
    iconBg: "bg-red-950 text-red-300",
  },
  {
    name: "Délice Holding",
    category: "Food & Dairy Agriculture",
    tier: "Forest Patron",
    treesSponsored: "60,000 Trees",
    governorates: "Sidi Bouzid, Béja, Bizerte",
    description: "Promoting silvopastoral green belts and groundwater recharge olive plantations.",
    iconBg: "bg-blue-950 text-blue-300",
  },
  {
    name: "TotalEnergies Renouvelables",
    category: "Clean Energy Transition",
    tier: "Strategic",
    treesSponsored: "85,000 Trees",
    governorates: "Tataouine, Tozeur, Gafsa",
    description: "Creating green desert barriers and native acacia groves around southern solar installations.",
    iconBg: "bg-amber-950 text-amber-300",
  },
  {
    name: "Orange Tunisie Foundation",
    category: "Digital Education & Climate",
    tier: "Technology",
    treesSponsored: "45,000 Trees",
    governorates: "Manouba, Ariana, Nabeul",
    description: "Equipping schools with educational arboretums and digital tree tracking hubs.",
    iconBg: "bg-orange-950 text-orange-300",
  },
  {
    name: "Carthage Cement Green",
    category: "Infrastructure & Ecology",
    tier: "Forest Patron",
    treesSponsored: "50,000 Trees",
    governorates: "Jebel Ressas, Zaghouan",
    description: "Rehabilitating industrial limestone quarries into thriving pine and wild olive habitats.",
    iconBg: "bg-stone-900 text-stone-200",
  },
];

const marqueeLogos = [
  "BIAT Foundation",
  "Poulina Group",
  "Telnet Holding",
  "Ooredoo Tunisie",
  "Délice Holding",
  "TotalEnergies",
  "Orange Foundation",
  "SFBT Green",
  "Carthage Cement",
  "Attijari Bank",
  "Vermeg Eco",
  "Vitalait",
];

export default function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const ctaBoxRef = useRef<HTMLDivElement>(null);

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

      // 2. Stats Summary Reveal
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 3. Partner Cards Staggered Rise
      if (cardsGridRef.current) {
        gsap.fromTo(
          cardsGridRef.current.children,
          { y: 50, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: "top 80%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 4. CTA Box Bounce
      if (ctaBoxRef.current) {
        gsap.fromTo(
          ctaBoxRef.current,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: ctaBoxRef.current,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 5. Infinite Smooth Marquee Animation
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          repeat: -1,
          duration: 35,
          ease: "none",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="partners"
      className="relative w-full bg-transparent text-[#122a16] py-24 sm:py-28 lg:py-36 px-6 sm:px-12 lg:px-16 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] bg-teal-100/25 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ebf4eb] border border-emerald-900/10 text-[#3e663a] text-xs font-bold tracking-wider uppercase mb-5 shadow-2xs">
            <Handshake className="w-3.5 h-3.5 text-[#3e663a]" />
            <span>CORPORATE DONORS & PARTNERS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#112415] tracking-tight leading-[1.12]">
            Leading Businesses Standing for{" "}
            <span className="text-[#3d683a] font-serif italic font-normal">
              Green Tunisia.
            </span>
          </h2>

          <p className="text-gray-600 sm:text-[15px] leading-relaxed mt-4 max-w-2xl mx-auto font-normal">
            Meet the forward-thinking enterprises, foundations, and international coalitions
            funding native tree planting, deploying IoT telemetry, and restoring national forest parcels.
          </p>
        </div>

        {/* 3 Impact Key Metrics */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-emerald-900/5 shadow-xs text-center">
            <div className="text-3xl sm:text-4xl font-black text-gray-900">514+</div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mt-1">
              Active Corporate Donors
            </p>
            <p className="text-[11px] text-gray-500 mt-1">across financial, tech & industrial sectors</p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-emerald-900/5 shadow-xs text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#3d683a]">4.8M TND</div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mt-1">
              Private Capital Committed
            </p>
            <p className="text-[11px] text-gray-500 mt-1">directly dedicated to native reforestation</p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-emerald-900/5 shadow-xs text-center">
            <div className="text-3xl sm:text-4xl font-black text-teal-700">100%</div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mt-1">
              Verified CSR Impact
            </p>
            <p className="text-[11px] text-gray-500 mt-1">satellite geolocated with carbon certification</p>
          </div>
        </div>

        {/* Continuous Smooth Infinite Marquee Strip */}
        <div className="mb-14 overflow-hidden py-4 border-y border-gray-200/60 bg-white/40 backdrop-blur-xs">
          <div ref={marqueeRef} className="flex items-center gap-10 whitespace-nowrap will-change-transform">
            {[...marqueeLogos, ...marqueeLogos].map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/80 border border-gray-100 shadow-2xs text-gray-700 font-bold text-xs sm:text-sm tracking-tight shrink-0"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>{logo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 8 Featured Strategic Partner Cards Grid */}
        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-[26px] p-6 sm:p-7 border border-emerald-900/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Header: Company Name & Tier Tag */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#3d683a] font-bold text-sm shadow-2xs group-hover:scale-105 transition-transform">
                      <Building2 className="w-5 h-5 text-[#3d683a]" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-base leading-snug tracking-tight group-hover:text-[#3d683a] transition-colors">
                        {partner.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {partner.category}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase shrink-0 ${
                      partner.tier === "Strategic"
                        ? "bg-emerald-100 text-emerald-900"
                        : partner.tier === "Technology"
                        ? "bg-teal-100 text-teal-900"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {partner.tier}
                  </span>
                </div>

                {/* Trees Sponsored Highlight Badge */}
                <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f4faf4] text-xs font-bold text-[#2e572b] border border-emerald-900/5">
                  <TreePine className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{partner.treesSponsored} Sponsored</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-xs leading-relaxed font-normal">
                  {partner.description}
                </p>
              </div>

              {/* Card Footer: Regions Supported */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span className="font-medium truncate max-w-[200px]">
                  📍 {partner.governorates}
                </span>
                <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Sponsorship Callout Banner */}
        <div
          ref={ctaBoxRef}
          className="mt-16 sm:mt-20 rounded-[32px] bg-gradient-to-br from-[#123019] via-[#15381d] to-[#0c2211] p-8 sm:p-12 border border-emerald-500/25 shadow-2xl text-white flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>CORPORATE SOCIAL RESPONSIBILITY (CSR)</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Ready to Sponsor a Forest Parcel in Tunisia?
            </h3>

            <p className="text-emerald-100/75 text-xs sm:text-sm mt-3 leading-relaxed">
              Align your company with national ecological resilience. We offer verified CO₂ offset
              certificates, employee planting retreats, and dedicated geolocated parcels across all 24 governorates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#d7ee6b] to-emerald-400 hover:from-[#e2f974] hover:to-emerald-300 text-[#0e2712] font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Download CSR Pack</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all text-center"
            >
              Talk to Partnership Director
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
