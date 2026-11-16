"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Trophy,
  Medal,
  Award,
  Sprout,
  Droplets,
  Heart,
  Users,
  Search,
  Filter,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  TreePine,
  UserCheck,
  Building2,
  X,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

// --- TYPES ---
interface Association {
  id: string;
  name: string;
  arabicName: string;
  acronym: string;
  region: string;
  founded: number;
  volunteersCount: number;
  treesPlanted: number;
  description: string;
  focus: string[];
  color: string;
  badgeBg: string;
}

interface Volunteer {
  id: string;
  name: string;
  avatar: string;
  governorate: string;
  isIndependent: boolean;
  associationId?: string;
  associationName?: string;
  roles: {
    planter: boolean;
    waterer: boolean;
    donor: boolean;
  };
  treesPlanted: number;
  waterSuppliedLiters: number;
  donationsTND: number;
  campaignsCount: number;
  impactScore: number;
  rankTitle: string;
}

interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  location: string;
  governorate: string;
  date: string;
  treesPlanted: number;
  association: string;
  description: string;
}

// --- MOCK ASSOCIATIONS DATA ---
const ASSOCIATIONS: Association[] = [
  {
    id: "soli-green",
    name: "Association Soli & Green",
    arabicName: "سولي آند غرين تونس",
    acronym: "SOLI & GREEN",
    region: "North & Kroumirie (Bizerte, Jendouba, Tunis)",
    founded: 2019,
    volunteersCount: 4820,
    treesPlanted: 89400,
    description: "Leading national reforestation camps, post-fire ecosystem recovery in Tabarka, and youth environmental activism.",
    focus: ["Wildfire Rehabilitation", "Native Oak Planting", "Zero Plastic Camps"],
    color: "from-emerald-500 to-green-600",
    badgeBg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  {
    id: "wwf-tunisie",
    name: "WWF Tunisie",
    arabicName: "الصندوق العالمي للطبيعة - مكتب تونس",
    acronym: "WWF",
    region: "National & Mediterranean Corridors",
    founded: 1993,
    volunteersCount: 3450,
    treesPlanted: 45600,
    description: "Preserving national biodiversity corridors, restoring wetland riparian woodlands, and safeguarding cork oak ecosystems.",
    focus: ["Biodiversity Corridors", "Wetland Restoration", "Scientific Monitoring"],
    color: "from-teal-600 to-emerald-700",
    badgeBg: "bg-teal-500/10 text-teal-700 border-teal-500/20",
  },
  {
    id: "atpne",
    name: "ATPNE (Nature & Environment)",
    arabicName: "الجمعية التونسية لحماية الطبيعة والبيئة",
    acronym: "ATPNE",
    region: "Central & Sahel (Sousse, Kairouan, Mahdia)",
    founded: 1971,
    volunteersCount: 2780,
    treesPlanted: 38200,
    description: "Tunisia's founding environmental organization with 20+ regional chapters mobilizing citizens for heritage olive and pine groves.",
    focus: ["Heritage Olive Groves", "Desertification Defense", "Citizen Science"],
    color: "from-green-600 to-lime-600",
    badgeBg: "bg-green-500/10 text-green-700 border-green-500/20",
  },
  {
    id: "tounes-clean",
    name: "Tounes Clean Movement",
    arabicName: "حركة تونس نظيفة وخضراء",
    acronym: "TOUNES CLEAN",
    region: "Greater Tunis & Cap Bon",
    founded: 2020,
    volunteersCount: 2120,
    treesPlanted: 24800,
    description: "Youth-powered grassroots movement revitalizing urban spaces, planting coastal dune binders, and organizing micro-forests.",
    focus: ["Urban Micro-Forests", "Coastal Dune Planting", "University Chapters"],
    color: "from-lime-500 to-emerald-600",
    badgeBg: "bg-lime-500/10 text-lime-800 border-lime-500/20",
  },
  {
    id: "forets-nature",
    name: "Association Forêts et Nature",
    arabicName: "جمعية الغابات والطبيعة بالشمال الغربي",
    acronym: "AFN",
    region: "Northwest (Ain Draham, Nefza, Siliana)",
    founded: 2017,
    volunteersCount: 1650,
    treesPlanted: 34100,
    description: "Specialized in native seed collection, community tree nurseries, and high-altitude Aleppo pine re-establishment.",
    focus: ["Seed Nurseries", "Highland Reforestation", "Fire Prevention Watch"],
    color: "from-emerald-700 to-teal-800",
    badgeBg: "bg-emerald-900/10 text-emerald-800 border-emerald-700/20",
  },
  {
    id: "acdd",
    name: "ACDD (Sustainable Development)",
    arabicName: "جمعية المواطنة والتنمية المستدامة",
    acronym: "ACDD",
    region: "South (Gabès, Tozeur, Kebili, Tataouine)",
    founded: 2015,
    volunteersCount: 1480,
    treesPlanted: 19300,
    description: "Frontline defenders against Sahara encroachment, safeguarding traditional multi-tiered oases and arid Acacia belts.",
    focus: ["Sahara Green Barrier", "Oasis Regeneration", "Water Conservation"],
    color: "from-amber-600 to-emerald-700",
    badgeBg: "bg-amber-500/10 text-amber-800 border-amber-500/20",
  },
];

// --- MOCK VOLUNTEERS LEADERBOARD DATA ---
const VOLUNTEERS: Volunteer[] = [
  {
    id: "v-1",
    name: "Yassine Ben Amor",
    avatar: "/volunteers/avatar-1.jpg",
    governorate: "Jendouba",
    isIndependent: false,
    associationId: "soli-green",
    associationName: "Soli & Green",
    roles: { planter: true, waterer: true, donor: true },
    treesPlanted: 2480,
    waterSuppliedLiters: 6200,
    donationsTND: 850,
    campaignsCount: 38,
    impactScore: 12450,
    rankTitle: "Grand Guardian of Kroumirie",
  },
  {
    id: "v-2",
    name: "Nourhene Trabelsi",
    avatar: "/volunteers/avatar-2.jpg",
    governorate: "Bizerte",
    isIndependent: false,
    associationId: "wwf-tunisie",
    associationName: "WWF Tunisie",
    roles: { planter: true, waterer: true, donor: false },
    treesPlanted: 2150,
    waterSuppliedLiters: 5800,
    donationsTND: 0,
    campaignsCount: 31,
    impactScore: 10890,
    rankTitle: "Ichkeul Forest Commander",
  },
  {
    id: "v-3",
    name: "Mohamed Ali Mansouri",
    avatar: "/volunteers/avatar-3.jpg",
    governorate: "Zaghouan",
    isIndependent: true,
    roles: { planter: true, waterer: false, donor: true },
    treesPlanted: 1890,
    waterSuppliedLiters: 2400,
    donationsTND: 1450,
    campaignsCount: 26,
    impactScore: 9840,
    rankTitle: "Zaghouan Mountain Patron",
  },
  {
    id: "v-4",
    name: "Mariem Cherif",
    avatar: "/volunteers/avatar-4.jpg",
    governorate: "Sfax",
    isIndependent: false,
    associationId: "atpne",
    associationName: "ATPNE",
    roles: { planter: true, waterer: true, donor: false },
    treesPlanted: 1640,
    waterSuppliedLiters: 4900,
    donationsTND: 0,
    campaignsCount: 22,
    impactScore: 8750,
    rankTitle: "Olive Grove Vanguard",
  },
  {
    id: "v-5",
    name: "Karim Dridi",
    avatar: "/volunteers/avatar-5.jpg",
    governorate: "Tunis",
    isIndependent: false,
    associationId: "tounes-clean",
    associationName: "Tounes Clean",
    roles: { planter: false, waterer: true, donor: true },
    treesPlanted: 680,
    waterSuppliedLiters: 3200,
    donationsTND: 2200,
    campaignsCount: 19,
    impactScore: 8200,
    rankTitle: "Urban Canopy Benefactor",
  },
  {
    id: "v-6",
    name: "Syrine Bouazizi",
    avatar: "/volunteers/avatar-6.jpg",
    governorate: "Kasserine",
    isIndependent: true,
    roles: { planter: true, waterer: true, donor: false },
    treesPlanted: 1520,
    waterSuppliedLiters: 4100,
    donationsTND: 0,
    campaignsCount: 20,
    impactScore: 7920,
    rankTitle: "Chaambi Alpine Ranger",
  },
  {
    id: "v-7",
    name: "Bilel Jaziri",
    avatar: "/volunteers/avatar-7.jpg",
    governorate: "Siliana",
    isIndependent: false,
    associationId: "forets-nature",
    associationName: "Assoc. Forêts & Nature",
    roles: { planter: true, waterer: true, donor: false },
    treesPlanted: 1410,
    waterSuppliedLiters: 3900,
    donationsTND: 0,
    campaignsCount: 18,
    impactScore: 7480,
    rankTitle: "Kesra Forest Sentinel",
  },
  {
    id: "v-8",
    name: "Emna Louhichi",
    avatar: "/volunteers/avatar-8.jpg",
    governorate: "Nabeul",
    isIndependent: true,
    roles: { planter: true, waterer: false, donor: true },
    treesPlanted: 1190,
    waterSuppliedLiters: 1800,
    donationsTND: 750,
    campaignsCount: 15,
    impactScore: 6890,
    rankTitle: "Cap Bon Coastal Sower",
  },
  {
    id: "v-9",
    name: "Hamza Ghrab",
    avatar: "/volunteers/avatar-9.jpg",
    governorate: "Tozeur",
    isIndependent: false,
    associationId: "acdd",
    associationName: "ACDD",
    roles: { planter: true, waterer: true, donor: false },
    treesPlanted: 1250,
    waterSuppliedLiters: 4600,
    donationsTND: 0,
    campaignsCount: 17,
    impactScore: 6720,
    rankTitle: "Sahara Green Wall Pioneer",
  },
  {
    id: "v-10",
    name: "Amira Mejri",
    avatar: "/volunteers/avatar-10.jpg",
    governorate: "Béja",
    isIndependent: true,
    roles: { planter: true, waterer: true, donor: true },
    treesPlanted: 1040,
    waterSuppliedLiters: 3100,
    donationsTND: 500,
    campaignsCount: 14,
    impactScore: 6410,
    rankTitle: "Thibar Watershed Steward",
  },
  {
    id: "v-11",
    name: "Anis Khemir",
    avatar: "/volunteers/avatar-11.jpg",
    governorate: "Gabès",
    isIndependent: false,
    associationId: "acdd",
    associationName: "ACDD",
    roles: { planter: false, waterer: true, donor: true },
    treesPlanted: 420,
    waterSuppliedLiters: 5200,
    donationsTND: 900,
    campaignsCount: 16,
    impactScore: 5980,
    rankTitle: "Oasis Irrigation Guardian",
  },
  {
    id: "v-12",
    name: "Leila Saidi",
    avatar: "/volunteers/avatar-12.jpg",
    governorate: "Mahdia",
    isIndependent: true,
    roles: { planter: true, waterer: false, donor: false },
    treesPlanted: 920,
    waterSuppliedLiters: 1500,
    donationsTND: 0,
    campaignsCount: 12,
    impactScore: 5240,
    rankTitle: "El Djem Green Planter",
  },
];

// --- MOCK PLANTING GALLERY DATA ---
const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "g-1",
    src: "/volunteers/planting-mountain.jpg",
    title: "Kroumirie Cork Oak Mission",
    location: "Ain Draham & Tabarka Slopes",
    governorate: "Jendouba",
    date: "November 2026",
    treesPlanted: 4200,
    association: "Soli & Green",
    description: "Over 180 volunteers climbed the foggy heights of Ain Draham to plant endemic cork oaks on slopes affected by summer wildfires.",
  },
  {
    id: "g-2",
    src: "/volunteers/planting-youth.jpg",
    title: "Youth Seedling Drive",
    location: "Djebel Zaghouan National Reserve",
    governorate: "Zaghouan",
    date: "October 2026",
    treesPlanted: 2850,
    association: "Independent Volunteers & AFN",
    description: "Young students and families planting resilient Aleppo pine saplings around the Roman Water Temple watershed.",
  },
  {
    id: "g-3",
    src: "/volunteers/watering-trees.jpg",
    title: "Chaal Summer Irrigation Patrol",
    location: "Chaal Mega Olive Basin",
    governorate: "Sfax",
    date: "August 2026",
    treesPlanted: 5600,
    association: "ATPNE Sfax",
    description: "Equipped with mobile water tanks, volunteer teams provided emergency deep-root irrigation to young olive saplings during record heatwaves.",
  },
  {
    id: "g-4",
    src: "/volunteers/volunteers-group.jpg",
    title: "Tabarka Post-Fire Renewal Day",
    location: "Melloula Pine Coast",
    governorate: "Jendouba",
    date: "October 2026",
    treesPlanted: 6400,
    association: "WWF & Soli & Green Joint Camp",
    description: "A united front of 320 citizens planting maritime pines and carob trees along the burnt coastal ridges of Melloula.",
  },
  {
    id: "g-5",
    src: "/volunteers/seedling-nursery.jpg",
    title: "Bizerte Community Nursery Care",
    location: "Menzel Bourguiba Native Nursery",
    governorate: "Bizerte",
    date: "September 2026",
    treesPlanted: 8500,
    association: "Tounes Clean",
    description: "Nurturing 10,000 endemic stone pines and cypress seedlings ahead of the winter national reforestation campaign.",
  },
  {
    id: "g-6",
    src: "/volunteers/planting-arid.jpg",
    title: "Sahara Anti-Desertification Wall",
    location: "Douz Desert Border",
    governorate: "Kebili",
    date: "November 2026",
    treesPlanted: 3100,
    association: "ACDD South Corps",
    description: "Planting drought-resistant Acacia raddiana and Tamarix green belts to anchor sand dunes and shield surrounding palm groves.",
  },
  {
    id: "g-7",
    src: "/volunteers/olive-groves.jpg",
    title: "Sahel Millennium Olive Revival",
    location: "Moknine & Bekalta Orchards",
    governorate: "Monastir",
    date: "September 2026",
    treesPlanted: 3900,
    association: "ATPNE Sahel",
    description: "Restoring saline-affected soils by planting heirloom Chemlali olive varieties nurtured with compost and rainwater collection trenches.",
  },
  {
    id: "g-8",
    src: "/volunteers/forest-team.jpg",
    title: "Chaambi High Altitude Expedition",
    location: "Chaambi National Park (1,544m)",
    governorate: "Kasserine",
    date: "October 2026",
    treesPlanted: 4100,
    association: "Independent Corps & WWF",
    description: "Ascending Tunisia's highest mountain to re-establish highland pine canopy corridors and protect endangered mountain gazelle habitat.",
  },
];

export default function VolunteersPage() {
  // --- STATE ---
  const [affiliationFilter, setAffiliationFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [governorateFilter, setGovernorateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal State
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<number>(1);
  const [formAffiliation, setFormAffiliation] = useState<"independent" | "association">("independent");
  const [formAssociation, setFormAssociation] = useState<string>("soli-green");
  const [formRoles, setFormRoles] = useState<{ planter: boolean; waterer: boolean; donor: boolean }>({
    planter: true,
    waterer: false,
    donor: false,
  });
  const [formGovernorate, setFormGovernorate] = useState<string>("Tunis");
  const [formName, setFormName] = useState<string>("");
  const [formEmail, setFormEmail] = useState<string>("");
  const [formPhone, setFormPhone] = useState<string>("");

  // Gallery Lightbox Modal State
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  // --- FILTERED VOLUNTEERS ---
  const filteredVolunteers = useMemo(() => {
    return VOLUNTEERS.filter((v) => {
      // Affiliation Filter
      if (affiliationFilter === "independent" && !v.isIndependent) return false;
      if (affiliationFilter === "association" && v.isIndependent) return false;
      if (
        affiliationFilter !== "all" &&
        affiliationFilter !== "independent" &&
        affiliationFilter !== "association" &&
        v.associationId !== affiliationFilter
      ) {
        return false;
      }

      // Role Filter
      if (roleFilter === "planter" && !v.roles.planter) return false;
      if (roleFilter === "waterer" && !v.roles.waterer) return false;
      if (roleFilter === "donor" && !v.roles.donor) return false;

      // Governorate Filter
      if (governorateFilter !== "all" && v.governorate !== governorateFilter) return false;

      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesAssoc = v.associationName?.toLowerCase().includes(q);
        const matchesGov = v.governorate.toLowerCase().includes(q);
        const matchesTitle = v.rankTitle.toLowerCase().includes(q);
        if (!matchesName && !matchesAssoc && !matchesGov && !matchesTitle) return false;
      }

      return true;
    });
  }, [affiliationFilter, roleFilter, governorateFilter, searchQuery]);

  // Handle Association Card Click: filter leaderboard
  const handleSelectAssociation = (assocId: string) => {
    setAffiliationFilter(assocId);
    const leaderboardEl = document.getElementById("leaderboard-section");
    if (leaderboardEl) {
      leaderboardEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4faf4] text-[#1c3324] font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar />

      {/* =========================================================================
          1. HERO SECTION: VOLUNTEERS & COMMUNITY MOVEMENT
      ========================================================================= */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-8 lg:px-12 overflow-hidden">
        {/* Ambient Organic Light Orbs */}
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[450px] h-[450px] bg-[#d7ee6b]/20 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-[1380px] mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-emerald-900/10 border border-emerald-700/20 text-emerald-800 text-xs sm:text-sm font-bold tracking-wider uppercase mb-6 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>NATIONWIDE VOLUNTEER CORPS • شبكة المتطوعين والجمعيات البيئية</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-black tracking-tight text-[#112918] leading-[1.08] max-w-4xl mx-auto">
            <span>Standing Together for</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-700 to-green-700 font-serif italic">
              Tunisia the Green.
            </span>
          </h1>

          <p className="text-[#3b5943] text-base sm:text-lg lg:text-xl leading-relaxed mt-6 max-w-3xl mx-auto font-normal">
            Whether you are an <strong>independent citizen volunteer</strong> or an active member of an <strong>environmental association</strong>,
            every planted seedling, every bucket of water, and every donation brings life back to our ancestral soil.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <button
              onClick={() => {
                setModalStep(1);
                setIsJoinModalOpen(true);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#173a21] hover:bg-[#122e1a] text-white text-sm sm:text-base font-bold shadow-xl shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sprout className="w-5 h-5 text-[#d7ee6b]" />
              <span>Join as a Volunteer</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <a
              href="#associations-section"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/80 hover:bg-white text-[#173a21] text-sm sm:text-base font-semibold border border-emerald-900/15 shadow-sm hover:border-emerald-800/30 transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Explore Associations</span>
            </a>
          </div>

          {/* 4 Impact Telemetry Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-14 sm:mt-16 max-w-5xl mx-auto">
            <div className="p-5 sm:p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-900/10 shadow-sm text-left">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold font-mono uppercase">
                <Users className="w-4 h-4" />
                <span>ACTIVE VOLUNTEERS</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#112918] mt-2 font-mono">
                14,820+
              </div>
              <p className="text-xs text-[#52705a] mt-1">Across 24 governorates</p>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-900/10 shadow-sm text-left">
              <div className="flex items-center gap-2 text-teal-700 text-xs font-bold font-mono uppercase">
                <Building2 className="w-4 h-4" />
                <span>PARTNER ASSOCIATIONS</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#112918] mt-2 font-mono">
                48
              </div>
              <p className="text-xs text-[#52705a] mt-1">Grassroots NGOs & Clubs</p>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-900/10 shadow-sm text-left">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold font-mono uppercase">
                <TreePine className="w-4 h-4" />
                <span>TREES PLANTED</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#112918] mt-2 font-mono">
                184,200
              </div>
              <p className="text-xs text-[#52705a] mt-1">Oak, Pine, Olive & Palm</p>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-900/10 shadow-sm text-left">
              <div className="flex items-center gap-2 text-blue-700 text-xs font-bold font-mono uppercase">
                <Droplets className="w-4 h-4" />
                <span>WATER DELIVERED</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#112918] mt-2 font-mono">
                390,000L
              </div>
              <p className="text-xs text-[#52705a] mt-1">Emergency sapling care</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ACTIVE ASSOCIATIONS SHOWCASE
      ========================================================================= */}
      <section id="associations-section" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1380px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>PRESENT ORGANIZATIONS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#112918] tracking-tight">
                Partner Associations in the Field.
              </h2>
              <p className="text-[#43624c] text-sm sm:text-base mt-2 max-w-2xl">
                Discover the leading Tunisian environmental NGOs organizing expeditions, seed nurseries, and forest rehabilitation on the ground.
              </p>
            </div>

            {affiliationFilter !== "all" && (
              <button
                onClick={() => setAffiliationFilter("all")}
                className="self-start md:self-end px-4 py-2 rounded-full bg-white text-xs font-semibold text-emerald-800 border border-emerald-200 hover:bg-emerald-50 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Reset Association Filter</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Associations Grid (6 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ASSOCIATIONS.map((assoc) => {
              const isSelected = affiliationFilter === assoc.id;
              return (
                <div
                  key={assoc.id}
                  className={`group relative rounded-[32px] p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? "bg-gradient-to-br from-[#0c2a15] to-[#143a1f] text-white shadow-2xl ring-2 ring-emerald-400"
                      : "bg-white/90 backdrop-blur-md border border-emerald-900/10 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  <div>
                    {/* Top Row: Acronym & Region */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span
                        className={`text-[11px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase ${
                          isSelected ? "bg-white/20 text-emerald-200" : assoc.badgeBg
                        }`}
                      >
                        {assoc.acronym} • EST. {assoc.founded}
                      </span>
                      <span className={`text-xs ${isSelected ? "text-emerald-200/80" : "text-[#587560]"}`}>
                        {assoc.region.split("(")[0]}
                      </span>
                    </div>

                    {/* Association Title */}
                    <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${isSelected ? "text-white" : "text-[#112918]"}`}>
                      {assoc.name}
                    </h3>
                    <div
                      dir="rtl"
                      className={`text-xs font-medium mt-1 ${isSelected ? "text-emerald-300" : "text-emerald-700"}`}
                    >
                      {assoc.arabicName}
                    </div>

                    {/* Description */}
                    <p className={`text-xs sm:text-sm mt-4 leading-relaxed ${isSelected ? "text-emerald-100/80" : "text-[#4a6953]"}`}>
                      {assoc.description}
                    </p>

                    {/* Focus Tag Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {assoc.focus.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-medium ${
                            isSelected
                              ? "bg-white/10 text-emerald-200 border border-white/10"
                              : "bg-[#edf6ed] text-[#285034] border border-emerald-900/5"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Stats & Filter Trigger */}
                  <div className="mt-8 pt-5 border-t border-emerald-900/10 flex items-center justify-between">
                    <div>
                      <div className={`text-lg sm:text-xl font-extrabold font-mono ${isSelected ? "text-[#d7ee6b]" : "text-[#112918]"}`}>
                        {assoc.treesPlanted.toLocaleString()}
                      </div>
                      <span className={`text-[11px] font-medium ${isSelected ? "text-emerald-200/70" : "text-[#62806a]"}`}>
                        Trees Planted • {assoc.volunteersCount} Volunteers
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectAssociation(assoc.id)}
                      className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? "bg-white text-[#112918] hover:bg-emerald-100 shadow-md"
                          : "bg-[#173a21] hover:bg-[#122e1a] text-white shadow-sm"
                      }`}
                    >
                      <span>{isSelected ? "Filtering Active" : "View Team"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. GAMIFIED VOLUNTEER LEADERBOARD & DIRECTORY
      ========================================================================= */}
      <section id="leaderboard-section" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-[#ebf5ec]/60">
        <div className="max-w-[1380px] mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>COMMUNITY IMPACT LEADERBOARD</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#112918] tracking-tight">
              Heroes of the Green Movement.
            </h2>
            <p className="text-[#43624c] text-sm sm:text-base mt-3">
              Ranked by combined ecological impact: trees planted in the soil, liters of emergency irrigation brought, and community campaigns attended.
            </p>
          </div>

          {/* Top 3 Podium Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {VOLUNTEERS.slice(0, 3).map((topVol, idx) => {
              const medals = [
                { badge: "🥇 1ST PLACE", medalColor: "bg-amber-400 text-amber-950", ring: "ring-amber-400/50" },
                { badge: "🥈 2ND PLACE", medalColor: "bg-slate-300 text-slate-900", ring: "ring-slate-300/50" },
                { badge: "🥉 3RD PLACE", medalColor: "bg-amber-700 text-amber-100", ring: "ring-amber-700/50" },
              ];
              const m = medals[idx];

              return (
                <div
                  key={topVol.id}
                  className={`relative rounded-[32px] p-6 sm:p-7 bg-white shadow-xl border border-emerald-900/10 flex flex-col justify-between overflow-hidden ring-2 ${m.ring} ${
                    idx === 0 ? "md:-translate-y-3" : ""
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-mono font-black tracking-widest px-3 py-1 rounded-full ${m.medalColor}`}>
                      {m.badge}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {topVol.governorate}
                    </span>
                  </div>

                  {/* Avatar & Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-emerald-500/20 shadow-md">
                      <Image src={topVol.avatar} alt={topVol.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-[#112918]">{topVol.name}</h4>
                      <p className="text-xs text-emerald-700 font-semibold">{topVol.rankTitle}</p>
                      <div className="mt-1">
                        {topVol.isIndependent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            <UserCheck className="w-3 h-3" />
                            Independent Volunteer (حر)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                            <Building2 className="w-3 h-3" />
                            {topVol.associationName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Impact Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-6 p-3 rounded-2xl bg-[#f4faf4] border border-emerald-900/5 text-center">
                    <div>
                      <span className="text-sm font-extrabold text-emerald-800 font-mono">
                        {topVol.treesPlanted}
                      </span>
                      <p className="text-[10px] text-[#5b7863] flex items-center justify-center gap-0.5 mt-0.5">
                        <Sprout className="w-3 h-3 text-emerald-600" />
                        Trees
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-teal-800 font-mono">
                        {topVol.waterSuppliedLiters}L
                      </span>
                      <p className="text-[10px] text-[#5b7863] flex items-center justify-center gap-0.5 mt-0.5">
                        <Droplets className="w-3 h-3 text-teal-600" />
                        Watered
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-amber-700 font-mono">
                        {topVol.campaignsCount}
                      </span>
                      <p className="text-[10px] text-[#5b7863] flex items-center justify-center gap-0.5 mt-0.5">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        Missions
                      </p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="mt-4 pt-4 border-t border-emerald-900/10 flex items-center justify-between">
                    <span className="text-xs text-[#52705a] font-medium">Impact Score:</span>
                    <span className="text-base font-black text-[#112918] font-mono">
                      {topVol.impactScore.toLocaleString()} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Filter & Search Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-emerald-900/10 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Bar */}
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 text-emerald-800/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by volunteer name, town or association..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f4faf4] border border-emerald-900/15 text-xs sm:text-sm text-[#112918] placeholder:text-[#6a8771] focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              {/* Affiliation Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={affiliationFilter}
                  onChange={(e) => setAffiliationFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f4faf4] border border-emerald-900/15 text-xs sm:text-sm text-[#112918] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                >
                  <option value="all">Affiliation: All (الجميع)</option>
                  <option value="independent">Independent Volunteer (متطوع حر)</option>
                  <option value="association">With Any Association</option>
                  {ASSOCIATIONS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Role Filter */}
              <div className="md:col-span-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f4faf4] border border-emerald-900/15 text-xs sm:text-sm text-[#112918] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                >
                  <option value="all">Contribution: All Actions</option>
                  <option value="planter">🌱 Tree Planters (غراسة)</option>
                  <option value="waterer">💧 Water Stewards (سقي ورعاية)</option>
                  <option value="donor">💚 Financial Donors (تبرع مالي)</option>
                </select>
              </div>

              {/* Governorate Filter */}
              <div className="md:col-span-2">
                <select
                  value={governorateFilter}
                  onChange={(e) => setGovernorateFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f4faf4] border border-emerald-900/15 text-xs sm:text-sm text-[#112918] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                >
                  <option value="all">Region: All</option>
                  <option value="Jendouba">Jendouba</option>
                  <option value="Bizerte">Bizerte</option>
                  <option value="Zaghouan">Zaghouan</option>
                  <option value="Sfax">Sfax</option>
                  <option value="Tunis">Tunis</option>
                  <option value="Kasserine">Kasserine</option>
                  <option value="Siliana">Siliana</option>
                  <option value="Nabeul">Nabeul</option>
                  <option value="Tozeur">Tozeur</option>
                  <option value="Béja">Béja</option>
                  <option value="Gabès">Gabès</option>
                  <option value="Mahdia">Mahdia</option>
                </select>
              </div>
            </div>

            {/* Quick Pills Row */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-emerald-900/10 text-xs">
              <span className="text-[#55735d] font-medium">Quick Filters:</span>
              <button
                onClick={() => {
                  setAffiliationFilter("independent");
                  setRoleFilter("all");
                }}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  affiliationFilter === "independent"
                    ? "bg-[#173a21] text-white"
                    : "bg-[#edf6ed] hover:bg-emerald-100 text-emerald-900"
                }`}
              >
                Free / Independent Only (متطوع حر)
              </button>
              <button
                onClick={() => {
                  setRoleFilter("planter");
                }}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  roleFilter === "planter"
                    ? "bg-emerald-700 text-white"
                    : "bg-[#edf6ed] hover:bg-emerald-100 text-emerald-900"
                }`}
              >
                🌱 Planters
              </button>
              <button
                onClick={() => {
                  setRoleFilter("waterer");
                }}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  roleFilter === "waterer"
                    ? "bg-teal-700 text-white"
                    : "bg-[#edf6ed] hover:bg-teal-100 text-teal-900"
                }`}
              >
                💧 Waterers
              </button>
              <button
                onClick={() => {
                  setRoleFilter("donor");
                }}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  roleFilter === "donor"
                    ? "bg-amber-600 text-white"
                    : "bg-[#edf6ed] hover:bg-amber-100 text-amber-900"
                }`}
              >
                💚 Donors
              </button>

              {(affiliationFilter !== "all" || roleFilter !== "all" || governorateFilter !== "all" || searchQuery !== "") && (
                <button
                  onClick={() => {
                    setAffiliationFilter("all");
                    setRoleFilter("all");
                    setGovernorateFilter("all");
                    setSearchQuery("");
                  }}
                  className="ml-auto text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset All Filters
                </button>
              )}
            </div>
          </div>

          {/* Leaderboard Table / Cards */}
          <div className="bg-white rounded-3xl shadow-sm border border-emerald-900/10 overflow-hidden">
            {filteredVolunteers.length === 0 ? (
              <div className="py-16 text-center">
                <Users className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#112918]">No volunteers found matching your filters</h3>
                <p className="text-xs text-[#52705a] mt-1">Try clearing your search query or broadening the filter options.</p>
              </div>
            ) : (
              <div className="divide-y divide-emerald-900/10">
                {filteredVolunteers.map((vol, index) => {
                  return (
                    <div
                      key={vol.id}
                      className="p-5 sm:p-6 hover:bg-[#f7fcf8] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Rank, Avatar & Identity */}
                      <div className="flex items-center gap-4">
                        <span className="w-8 text-center text-sm font-extrabold text-[#52705a] font-mono">
                          #{index + 1}
                        </span>

                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-emerald-900/10 shrink-0">
                          <Image src={vol.avatar} alt={vol.name} fill className="object-cover" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-[#112918]">{vol.name}</h4>
                            <span className="text-[11px] text-[#5b7863] font-medium flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              {vol.governorate}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {/* Affiliation Pill */}
                            {vol.isIndependent ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                <UserCheck className="w-3 h-3" />
                                Independent Volunteer (متطوع حر)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                                <Building2 className="w-3 h-3" />
                                {vol.associationName}
                              </span>
                            )}

                            {/* Title badge */}
                            <span className="text-[11px] text-[#4a6953] font-medium">
                              • {vol.rankTitle}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Contribution Roles Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {vol.roles.planter && (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                            <strong>{vol.treesPlanted}</strong> trees
                          </span>
                        )}

                        {vol.roles.waterer && (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
                            <Droplets className="w-3.5 h-3.5 text-teal-600" />
                            <strong>{vol.waterSuppliedLiters}L</strong> watered
                          </span>
                        )}

                        {vol.roles.donor && vol.donationsTND > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                            <Heart className="w-3.5 h-3.5 text-amber-600" />
                            <strong>{vol.donationsTND} TND</strong> donor
                          </span>
                        )}
                      </div>

                      {/* Right: Score */}
                      <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-emerald-900/10">
                        <div className="text-left md:text-right">
                          <div className="text-base sm:text-lg font-black text-[#112918] font-mono">
                            {vol.impactScore.toLocaleString()} pts
                          </div>
                          <span className="text-[11px] text-[#63806b]">
                            {vol.campaignsCount} campaigns completed
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setFormName(vol.name);
                            setFormGovernorate(vol.governorate);
                            setIsJoinModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-all cursor-pointer"
                        >
                          Join Team
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PLANTING PHOTO GALLERY (BENTO / MASONRY)
      ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1380px] mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>FIELD REFORESTATION ARCHIVES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#112918] tracking-tight">
              In the Dirt, Under the Sun.
            </h2>
            <p className="text-[#43624c] text-sm sm:text-base mt-3">
              Real moments captured from reforestation expeditions, coastal greening, and community nurseries throughout Tunisia. Click any photo to expand.
            </p>
          </div>

          {/* Bento Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GALLERY_PHOTOS.map((photo, index) => {
              const isLarge = index === 0 || index === 3;
              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhoto(photo)}
                  className={`group relative rounded-[28px] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 bg-emerald-950 ${
                    isLarge ? "sm:col-span-2 lg:col-span-2 aspect-[16/10]" : "aspect-square"
                  }`}
                >
                  {/* Photo */}
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 font-mono text-[11px]">
                      {photo.date}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white font-bold text-[11px] flex items-center gap-1">
                      <Sprout className="w-3 h-3" />
                      +{photo.treesPlanted.toLocaleString()}
                    </span>
                  </div>

                  {/* Bottom Captions */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-mono tracking-widest text-emerald-300 uppercase block mb-1">
                      {photo.governorate} • {photo.association}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight drop-shadow-sm group-hover:text-emerald-200 transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-2 mt-1">
                      {photo.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CTA TO JOIN: STAND FOR TUNISIA
      ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1200px] mx-auto rounded-[44px] bg-gradient-to-br from-[#0c2a15] via-[#12361b] to-[#07180c] p-8 sm:p-14 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-950/30 border border-emerald-500/30">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#d7ee6b]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4 text-[#d7ee6b]" />
              <span>BECOME A REGISTERED GREEN GUARDIAN</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ready to Put Roots in Tunisian Soil?
            </h2>

            <p className="text-emerald-100/80 text-sm sm:text-base mt-4 leading-relaxed max-w-2xl mx-auto">
              Choose your path: join as an <strong>independent volunteer</strong> or connect through our <strong>partner associations</strong>.
              Whether you can plant in the field, water saplings, or fund seedlings, your country needs your hands.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <button
                onClick={() => {
                  setModalStep(1);
                  setIsJoinModalOpen(true);
                }}
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-[#d7ee6b] to-emerald-400 hover:from-[#e2f974] hover:to-emerald-300 text-[#0c2310] font-bold text-sm tracking-wide shadow-lg shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sprout className="w-5 h-5 text-[#0c2310]" />
                <span>Register as a Volunteer</span>
              </button>

              <Link
                href="/membre/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Go to Volunteer Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. MULTI-STEP "JOIN THE COMMUNITY" MODAL
      ========================================================================= */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-[36px] p-6 sm:p-8 shadow-2xl border border-emerald-900/10 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#f4faf4] text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Progress Dots */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    modalStep === step
                      ? "w-8 bg-[#173a21]"
                      : modalStep > step
                      ? "w-3 bg-emerald-500"
                      : "w-3 bg-gray-200"
                  }`}
                />
              ))}
              <span className="text-xs font-mono text-gray-500 ml-2">Step {modalStep} of 4</span>
            </div>

            {/* STEP 1: AFFILIATION (Independent vs Association) */}
            {modalStep === 1 && (
              <div>
                <h3 className="text-2xl font-black text-[#112918] tracking-tight">
                  How are you volunteering?
                </h3>
                <p className="text-xs text-[#52705a] mt-1 mb-6">
                  Select whether you are joining as a free citizen or through an environmental organization.
                </p>

                <div className="space-y-4">
                  {/* Option 1: Independent */}
                  <div
                    onClick={() => setFormAffiliation("independent")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                      formAffiliation === "independent"
                        ? "border-[#173a21] bg-emerald-50/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        formAffiliation === "independent"
                          ? "border-[#173a21] bg-[#173a21] text-white"
                          : "border-gray-400"
                      }`}
                    >
                      {formAffiliation === "independent" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#112918]">
                        Independent / Free Volunteer (متطوع حر)
                      </h4>
                      <p className="text-xs text-[#5b7863] mt-0.5">
                        You volunteer on your own schedule across local campaigns without formal association membership.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Association */}
                  <div
                    onClick={() => setFormAffiliation("association")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                      formAffiliation === "association"
                        ? "border-[#173a21] bg-emerald-50/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        formAffiliation === "association"
                          ? "border-[#173a21] bg-[#173a21] text-white"
                          : "border-gray-400"
                      }`}
                    >
                      {formAffiliation === "association" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="w-full">
                      <h4 className="text-sm font-bold text-[#112918]">
                        Member of an Association (عضو في جمعية)
                      </h4>
                      <p className="text-xs text-[#5b7863] mt-0.5 mb-3">
                        You represent or belong to an active environmental NGO in Tunisia.
                      </p>

                      {formAffiliation === "association" && (
                        <select
                          value={formAssociation}
                          onChange={(e) => setFormAssociation(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-900/20 text-xs font-semibold text-[#112918] focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                        >
                          {ASSOCIATIONS.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.acronym})
                            </option>
                          ))}
                          <option value="other">Other Local Association...</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setModalStep(2)}
                    className="px-6 py-3 rounded-full bg-[#173a21] text-white text-xs font-bold hover:bg-[#122e1a] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: Ways to Help</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ROLES & CONTRIBUTION */}
            {modalStep === 2 && (
              <div>
                <h3 className="text-2xl font-black text-[#112918] tracking-tight">
                  How will you contribute?
                </h3>
                <p className="text-xs text-[#52705a] mt-1 mb-6">
                  Select all the ways you would like to support Green Tunisia (select multiple):
                </p>

                <div className="space-y-3">
                  {/* Planter */}
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      formRoles.planter ? "border-emerald-600 bg-emerald-50/60" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                        <Sprout className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#112918]">🌱 Plant Trees (غراسة الأشجار)</div>
                        <div className="text-[11px] text-[#55735d]">Participate in field digging & sapling planting campaigns.</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formRoles.planter}
                      onChange={(e) => setFormRoles({ ...formRoles, planter: e.target.checked })}
                      className="w-5 h-5 rounded accent-emerald-700"
                    />
                  </label>

                  {/* Waterer */}
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      formRoles.waterer ? "border-teal-600 bg-teal-50/60" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-800">
                        <Droplets className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#112918]">💧 Water & Care (سقي ورعاية)</div>
                        <div className="text-[11px] text-[#55735d]">Maintain saplings during dry months and monitor soil health.</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formRoles.waterer}
                      onChange={(e) => setFormRoles({ ...formRoles, waterer: e.target.checked })}
                      className="w-5 h-5 rounded accent-teal-700"
                    />
                  </label>

                  {/* Donor */}
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      formRoles.donor ? "border-amber-600 bg-amber-50/60" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#112918]">💚 Donate & Sponsor (تبرع ودعم)</div>
                        <div className="text-[11px] text-[#55735d]">Fund seedlings, watering equipment, or sponsor forest parcels.</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formRoles.donor}
                      onChange={(e) => setFormRoles({ ...formRoles, donor: e.target.checked })}
                      className="w-5 h-5 rounded accent-amber-600"
                    />
                  </label>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setModalStep(1)}
                    className="px-5 py-3 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setModalStep(3)}
                    className="px-6 py-3 rounded-full bg-[#173a21] text-white text-xs font-bold hover:bg-[#122e1a] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: Your Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT & GOVERNORATE */}
            {modalStep === 3 && (
              <div>
                <h3 className="text-2xl font-black text-[#112918] tracking-tight">
                  Your Volunteer Profile
                </h3>
                <p className="text-xs text-[#52705a] mt-1 mb-5">
                  Let our regional coordinators connect you with nearby reforestation missions.
                </p>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-[#112918] block mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sami Ben Amor"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4faf4] border border-emerald-900/15 text-xs text-[#112918] focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#112918] block mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="sami@example.tn"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4faf4] border border-emerald-900/15 text-xs text-[#112918] focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#112918] block mb-1">Phone (SMS alerts)</label>
                      <input
                        type="tel"
                        placeholder="+216 98 000 000"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4faf4] border border-emerald-900/15 text-xs text-[#112918] focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#112918] block mb-1">Governorate of Activity</label>
                    <select
                      value={formGovernorate}
                      onChange={(e) => setFormGovernorate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4faf4] border border-emerald-900/15 text-xs font-semibold text-[#112918] focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                    >
                      {[
                        "Tunis", "Ariana", "Ben Arous", "Manouba", "Bizerte", "Nabeul", "Zaghouan", "Béja",
                        "Jendouba", "Le Kef", "Siliana", "Kairouan", "Kasserine", "Sidi Bouzid", "Sousse",
                        "Monastir", "Mahdia", "Sfax", "Gafsa", "Tozeur", "Kebili", "Gabès", "Médenine", "Tataouine",
                      ].map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setModalStep(2)}
                    className="px-5 py-3 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setModalStep(4)}
                    className="px-7 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-700 text-white text-xs font-bold hover:from-emerald-700 hover:to-green-800 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Complete Registration 🇹🇳</span>
                    <Sparkles className="w-4 h-4 text-[#d7ee6b]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CELEBRATION & DIGITAL BADGE */}
            {modalStep === 4 && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>

                <h3 className="text-2xl font-black text-[#112918]">Welcome to the Movement!</h3>
                <p className="text-xs text-[#52705a] mt-1 max-w-sm mx-auto">
                  You are now registered as an active Green Tunisia volunteer in <strong>{formGovernorate}</strong>.
                </p>

                {/* Digital Volunteer Badge Card */}
                <div className="my-6 p-5 rounded-3xl bg-gradient-to-br from-[#0c2a15] to-[#143a1f] text-white max-w-sm mx-auto shadow-xl border border-emerald-500/30 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-400/10 rounded-full blur-xl" />
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 mb-3">
                    <span>OFFICIAL VOLUNTEER ID</span>
                    <span>🇹🇳 2026</span>
                  </div>
                  <h4 className="text-lg font-extrabold">{formName || "Registered Volunteer"}</h4>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    {formAffiliation === "independent" ? "Independent Corps (حر)" : `Member of ${formAssociation.toUpperCase()}`}
                  </p>

                  <div className="mt-4 pt-3 border-t border-emerald-800/50 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-300">Badge Awarded:</span>
                    <span className="font-bold text-[#d7ee6b]">Guardian of {formGovernorate}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setIsJoinModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#173a21] text-white text-xs font-bold hover:bg-[#122e1a] transition-all cursor-pointer"
                  >
                    View Community Directory
                  </button>
                  <Link
                    href="/membre/dashboard"
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold hover:bg-emerald-200 transition-all text-center"
                  >
                    Open Member Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          7. LIGHTBOX PHOTO MODAL
      ========================================================================= */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 cursor-default"
          >
            {/* Close */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Container */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9]">
              <Image src={activePhoto.src} alt={activePhoto.title} fill className="object-cover" />
            </div>

            {/* Photo Caption Details */}
            <div className="p-6 bg-[#0a1f11] text-white">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono text-[#d7ee6b] font-bold">
                  {activePhoto.governorate} • {activePhoto.location} • {activePhoto.date}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  🌱 +{activePhoto.treesPlanted.toLocaleString()} trees planted
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {activePhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
                {activePhoto.description}
              </p>
              <div className="mt-4 pt-3 border-t border-emerald-800/40 text-[11px] font-mono text-emerald-300/70">
                Organized with {activePhoto.association} & the Green Tunisia Volunteer Network
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
