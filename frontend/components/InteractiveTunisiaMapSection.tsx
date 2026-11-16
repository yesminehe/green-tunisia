"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sprout,
  Users,
  Building2,
  TreePine,
  ShieldCheck,
  Wind,
  MapPin,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import tunisiaMapData from "./tunisiaMapData.json";

interface GovernorateData {
  id: string;
  name: string;
  arabic: string;
  region: string;
  trees: number;
  volunteers: number;
  donors: number;
  co2: string;
  species: string;
  project: string;
  companies: string[];
  d: string;
}

export default function InteractiveTunisiaMapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const detailsCardRef = useRef<HTMLDivElement>(null);

  // Default selected: Jendouba (historic green forest hub of Ain Draham)
  const [selectedId, setSelectedId] = useState<string>("TN.JE");
  const [hoveredGov, setHoveredGov] = useState<GovernorateData | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const governorates: GovernorateData[] = tunisiaMapData.paths as GovernorateData[];
  const selectedGov = governorates.find((g) => g.id === selectedId) || governorates[0];

  // Total summary statistics across Tunisia
  const totalTrees = governorates.reduce((acc, g) => acc + g.trees, 0);
  const totalVolunteers = governorates.reduce((acc, g) => acc + g.volunteers, 0);
  const totalDonors = governorates.reduce((acc, g) => acc + g.donors, 0);

  // GSAP on Scroll Reveal
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

      // 2. Map & Details Card Reveal
      if (mapWrapperRef.current && detailsCardRef.current) {
        gsap.fromTo(
          [mapWrapperRef.current, detailsCardRef.current],
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mapWrapperRef.current,
              start: "top 78%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP Smooth Transition every time the selected city changes
  useEffect(() => {
    if (detailsCardRef.current) {
      gsap.fromTo(
        detailsCardRef.current.querySelectorAll(".anim-switch"),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [selectedId]);

  // Optional Gentle Auto-tour (pauses when user interacts)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const keyGovs = ["TN.JE", "TN.BZ", "TN.TU", "TN.KS", "TN.SF", "TN.TO"];
    const interval = setInterval(() => {
      setSelectedId((prev) => {
        const idx = keyGovs.indexOf(prev);
        const nextIdx = (idx + 1) % keyGovs.length;
        return keyGovs[nextIdx];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleSelect = (id: string) => {
    setIsAutoPlaying(false);
    setSelectedId(id);
  };

  return (
    <section
      ref={sectionRef}
      id="reforestation-map"
      className="relative w-full bg-transparent text-[#122815] py-24 sm:py-28 lg:py-36 px-6 sm:px-12 lg:px-16 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-emerald-200/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-[600px] h-[600px] bg-teal-100/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ebf4eb] border border-emerald-900/10 text-[#3e663a] text-xs font-bold tracking-wider uppercase mb-5 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#3e663a]" />
            <span>INTERACTIVE NATIONAL MAP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#112415] tracking-tight leading-[1.12]">
            Explore Reforestation Across{" "}
            <span className="text-[#3d683a] font-serif italic font-normal">
              Every Governorate.
            </span>
          </h2>

          <p className="text-gray-600 sm:text-[15px] leading-relaxed mt-4 max-w-2xl mx-auto font-normal">
            Click on any region on the map to see real-time tree plantation numbers,
            active community volunteers, and sponsoring corporate partners.
          </p>

          {/* National Totals Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 pt-6 border-t border-emerald-900/10 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-gray-500">Total Planted:</span>
              <strong className="text-emerald-900 font-extrabold">
                {totalTrees.toLocaleString()} Trees
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span className="text-gray-500">Active Volunteers:</span>
              <strong className="text-emerald-900 font-extrabold">
                {totalVolunteers.toLocaleString()} Citizens
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3d683a]" />
              <span className="text-gray-500">Partner Sponsors:</span>
              <strong className="text-emerald-900 font-extrabold">
                {totalDonors} Entities
              </strong>
            </div>
          </div>
        </div>

        {/* Main Grid: Interactive SVG Map (Left) + Detailed City Impact Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive Tunisia SVG Map Container */}
          <div
            ref={mapWrapperRef}
            className="lg:col-span-5 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-emerald-900/10 shadow-xl shadow-emerald-950/5 relative"
          >
            {/* Map Top Helper Bar */}
            <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-gray-100 text-xs">
              <div className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold text-gray-700">Click any governorate</span>
              </div>

              {isAutoPlaying && (
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(false)}
                  className="text-[11px] font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 transition-colors"
                >
                  Auto-touring • Pause
                </button>
              )}
            </div>

            {/* The SVG Tunisia Map */}
            <div className="relative w-full max-w-[340px] h-[520px] sm:h-[580px] flex items-center justify-center">
              <svg
                viewBox="0 0 330 700"
                className="w-full h-full drop-shadow-md select-none transition-all duration-300"
                xmlns="http://www.w3.org/2000/svg"
              >
                {governorates.map((gov) => {
                  const isSelected = gov.id === selectedId;
                  const isHovered = hoveredGov?.id === gov.id;

                  return (
                    <path
                      key={gov.id}
                      id={gov.id}
                      d={gov.d}
                      onMouseEnter={() => setHoveredGov(gov)}
                      onMouseLeave={() => setHoveredGov(null)}
                      onClick={() => handleSelect(gov.id)}
                      className={`cursor-pointer transition-all duration-300 stroke-[0.8] ${
                        isSelected
                          ? "fill-[#357a3e] stroke-[#d7ee6b] stroke-[2] filter drop-shadow-[0_0_8px_rgba(53,122,62,0.6)]"
                          : isHovered
                          ? "fill-[#4c8f56] stroke-white stroke-[1.2]"
                          : "fill-[#1e3b25] stroke-[#3a6845] hover:fill-[#2d5c36]"
                      }`}
                    >
                      <title>{`${gov.name} (${gov.arabic}) - ${gov.trees.toLocaleString()} trees`}</title>
                    </path>
                  );
                })}
              </svg>

              {/* Hover Floating Tooltip */}
              {hoveredGov && (
                <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-xl shadow-lg border border-white/10 pointer-events-none transition-all duration-150 z-20">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>{hoveredGov.name}</span>
                    <span className="text-emerald-400 font-sans">{hoveredGov.arabic}</span>
                  </div>
                  <div className="text-emerald-300 text-[11px] mt-0.5">
                    🌱 {hoveredGov.trees.toLocaleString()} trees planted
                  </div>
                </div>
              )}
            </div>

            {/* Quick Governorate Selector Pills for Mobile/Desktop */}
            <div className="w-full mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase shrink-0">
                Key Regions:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {["TN.JE", "TN.BZ", "TN.TU", "TN.KS", "TN.SF", "TN.TO"].map((id) => {
                  const g = governorates.find((item) => item.id === id);
                  if (!g) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleSelect(id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedId === id
                          ? "bg-[#3d683a] text-white shadow-xs"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Interactive City Impact Card */}
          <div
            ref={detailsCardRef}
            className="lg:col-span-7 bg-white rounded-[32px] p-8 sm:p-10 border border-emerald-900/10 shadow-2xl shadow-emerald-950/5 flex flex-col justify-between min-h-[580px] relative overflow-hidden"
          >
            {/* Top Region Title with Arabic Emblem */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="anim-switch inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-800 tracking-wider uppercase mb-2 border border-emerald-200/60">
                    <TreePine className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{selectedGov.region}</span>
                  </span>

                  <h3 className="anim-switch text-3xl sm:text-4xl font-black text-gray-900 tracking-tight flex items-baseline gap-3">
                    <span>{selectedGov.name}</span>
                    <span
                      dir="rtl"
                      lang="ar"
                      className="text-2xl sm:text-3xl text-emerald-700 font-serif font-bold"
                    >
                      {selectedGov.arabic}
                    </span>
                  </h3>
                </div>

                {/* Status Indicator */}
                <div className="anim-switch flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-semibold border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Active Reforestation Zone</span>
                </div>
              </div>

              {/* Active Project Title */}
              <p className="anim-switch text-gray-600 text-xs sm:text-sm mt-3 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Current Project: <strong className="text-gray-900">{selectedGov.project}</strong></span>
              </p>

              {/* Key 4 Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="anim-switch p-4 rounded-2xl bg-[#f7faf7] border border-emerald-900/5">
                  <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold mb-1">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <span>Trees Planted</span>
                  </div>
                  <span className="text-2xl sm:text-[26px] font-black text-gray-900">
                    {selectedGov.trees.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">verified saplings</p>
                </div>

                <div className="anim-switch p-4 rounded-2xl bg-[#f7faf7] border border-emerald-900/5">
                  <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold mb-1">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Volunteers</span>
                  </div>
                  <span className="text-2xl sm:text-[26px] font-black text-gray-900">
                    {selectedGov.volunteers.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">registered citizens</p>
                </div>

                <div className="anim-switch p-4 rounded-2xl bg-[#f7faf7] border border-emerald-900/5">
                  <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold mb-1">
                    <Wind className="w-4 h-4 text-emerald-600" />
                    <span>CO₂ Offset</span>
                  </div>
                  <span className="text-2xl sm:text-[26px] font-black text-gray-900">
                    {selectedGov.co2}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">per year absorbed</p>
                </div>

                <div className="anim-switch p-4 rounded-2xl bg-[#f7faf7] border border-emerald-900/5">
                  <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Survival Rate</span>
                  </div>
                  <span className="text-2xl sm:text-[26px] font-black text-emerald-700">
                    94.2%
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">telemetry monitored</p>
                </div>
              </div>

              {/* Indigenous Species Breakdown */}
              <div className="anim-switch mt-6 p-4 rounded-2xl bg-[#fbfdfb] border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider block">
                    Indigenous Species Planted
                  </span>
                  <span className="text-gray-800 font-bold text-sm">
                    {selectedGov.species}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
                  Resilient to Mediterranean Drought
                </span>
              </div>

              {/* Corporate Donors & Partners Section */}
              <div className="anim-switch mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#3d683a]" />
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Corporate Donors & Sponsoring Partners
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {selectedGov.donors} partner entities
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {selectedGov.companies.map((company, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200/70 text-xs font-semibold text-gray-800 shadow-2xs hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>{company}</span>
                    </div>
                  ))}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/5 text-xs font-bold text-emerald-800">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>+ {selectedGov.donors - selectedGov.companies.length} more contributors</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="anim-switch mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500">
                Want to support <strong className="text-gray-900">{selectedGov.name}</strong>? Volunteer in person or sponsor saplings online.
              </p>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/membre/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#3d683a] hover:bg-[#2e522b] text-white text-xs font-bold tracking-wide shadow-md shadow-emerald-950/15 hover:shadow-lg transition-all duration-200"
                >
                  <span>Volunteer in {selectedGov.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/arbres"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-full bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold tracking-wide border border-gray-200/90 shadow-2xs transition-all"
                >
                  Sponsor Trees
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
