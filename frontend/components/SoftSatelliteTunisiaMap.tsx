"use client";

import React, { useState, memo } from "react";
import mapData from "./tunisiaMapData.json";

interface TreeLocation {
  id: string;
  name: string;
  type: "pine" | "olive" | "palm";
  x: number;
  y: number;
  scale?: number;
  label: string;
  spec: string;
  delay: string;
}

// 30 meticulously placed native trees across Tunisia's geographical terrain
const TUNISIA_TREES: TreeLocation[] = [
  // --- NORTH (Lush Mediterranean Forest Belt) ---
  { id: "ain-draham", name: "Ain Draham Kroumirie", type: "olive", x: 88, y: 72, scale: 1.25, label: "Ain Draham Cork Oaks", spec: "Quercus suber • High Canopy", delay: "0s" },
  { id: "tabarka", name: "Tabarka Coastal Forests", type: "pine", x: 96, y: 54, scale: 1.2, label: "Tabarka Maritime Pines", spec: "Pinus pinaster • Coastal", delay: "0.4s" },
  { id: "ichkeul", name: "Ichkeul UNESCO Biosphere", type: "olive", x: 172, y: 40, scale: 1.15, label: "Ichkeul Biosphere Reserve", spec: "Wild Olive & Lentisk", delay: "0.8s" },
  { id: "rimel", name: "Rimel Forest Bizerte", type: "pine", x: 188, y: 35, scale: 1.1, label: "Rimel Dunes Pine Belt", spec: "Pinus pinea (Stone Pine)", delay: "1.2s" },
  { id: "ennahli", name: "Ennahli Green Park", type: "pine", x: 202, y: 56, scale: 1.05, label: "Ennahli Metropolitan Forest", spec: "Aleppo Pine & Cypress", delay: "0.3s" },
  { id: "carthage", name: "Carthage & Sidi Bou Said", type: "olive", x: 215, y: 68, scale: 1.0, label: "Carthage Coastal Olives", spec: "Olea europaea • Heritage", delay: "0.7s" },
  { id: "boukornine", name: "Boukornine National Park", type: "pine", x: 218, y: 82, scale: 1.15, label: "Boukornine Mountain Reserve", spec: "Phoenician Juniper & Thuja", delay: "1.1s" },
  { id: "cap-bon", name: "El Haouaria Cap Bon", type: "olive", x: 265, y: 65, scale: 1.05, label: "Cap Bon Marine Forest", spec: "Citrus & Wild Olive", delay: "1.5s" },
  { id: "grombalia", name: "Grombalia Agroforestry", type: "olive", x: 238, y: 92, scale: 1.0, label: "Grombalia Fertile Basin", spec: "Ancient Olive Orchards", delay: "0.5s" },
  { id: "zaghouan", name: "Mount Zaghouan Sanctuary", type: "pine", x: 195, y: 115, scale: 1.2, label: "Zaghouan Water Temple Woods", spec: "Pinus halepensis • Elevation", delay: "0.9s" },
  { id: "beja-thibar", name: "Béja Thibar Watershed", type: "olive", x: 135, y: 75, scale: 1.1, label: "Thibar Reforestation Corridor", spec: "Oak, Carob & Eucalyptus", delay: "1.3s" },
  { id: "nefza", name: "Nefza Green Ridge", type: "pine", x: 118, y: 62, scale: 1.05, label: "Nefza Forest Hills", spec: "Native Aleppo Pine", delay: "0.2s" },

  // --- CENTRAL & HIGH PLATEAU (Highland Pine Forests & Ancient Groves) ---
  { id: "siliana-kesra", name: "Kesra High Forest", type: "pine", x: 148, y: 142, scale: 1.15, label: "Kesra Ancient Pine Woods", spec: "Highest Tunisian Village (1,200m)", delay: "0.6s" },
  { id: "mellege", name: "Le Kef Mellègue Belt", type: "pine", x: 94, y: 148, scale: 1.1, label: "Mellègue River Basin", spec: "Pine & Wild Rosemary", delay: "1.0s" },
  { id: "chaambi", name: "Mount Chaambi Peak", type: "pine", x: 98, y: 215, scale: 1.35, label: "Chaambi National Park (1,544m)", spec: "Highest Peak in Tunisia", delay: "0.15s" },
  { id: "sbeitla", name: "Sbeitla Roman Plain", type: "olive", x: 125, y: 228, scale: 1.05, label: "Sbeitla Historic Olives", spec: "Ancient Roman Olive Cultivars", delay: "0.45s" },
  { id: "oueslatia", name: "Kairouan Oueslatia", type: "pine", x: 175, y: 172, scale: 1.05, label: "Djebel Oueslat Pine Forest", spec: "Highland Pine Sanctuary", delay: "0.85s" },
  { id: "kairouan-olives", name: "Kairouan Olive Basin", type: "olive", x: 198, y: 192, scale: 1.1, label: "Kairouan Sacred Groves", spec: "Heritage Chemlali Olives", delay: "1.25s" },
  { id: "sousse-sahel", name: "Sousse Sahel Belt", type: "olive", x: 234, y: 160, scale: 1.15, label: "Sahel Infinite Olive Belt", spec: "Over 4M Olive Trees", delay: "0.35s" },
  { id: "monastir-coast", name: "Monastir Maritime Olive", type: "olive", x: 257, y: 182, scale: 1.0, label: "Monastir Coastal Groves", spec: "Saline-Tolerant Olive", delay: "0.75s" },
  { id: "mahdia-el-djem", name: "El Djem Roman Olive Basin", type: "olive", x: 248, y: 215, scale: 1.1, label: "El Djem Roman Basin", spec: "Millennium Olive Heritage", delay: "1.15s" },
  { id: "sidi-bouzid", name: "Regueb Agro-Valley", type: "olive", x: 160, y: 255, scale: 1.05, label: "Regueb Agricultural Oasis", spec: "Olive & Almond Reforestation", delay: "0.55s" },

  // --- SFAX & GABES (Chaal Olive Forest & Maritime Oases) ---
  { id: "sfax-chaal", name: "Sfax Chaal Olive Forest", type: "olive", x: 232, y: 275, scale: 1.35, label: "Chaal Reforestation Basin", spec: "Second Largest Olive Grove on Earth", delay: "0.25s" },
  { id: "kerkennah", name: "Kerkennah Archipelago", type: "olive", x: 285, y: 268, scale: 0.95, label: "Kerkennah Maritime Palms", spec: "Maritime Date Palms & Olives", delay: "0.65s" },
  { id: "gafsa-orbata", name: "Orbata Biosphere Gafsa", type: "pine", x: 98, y: 295, scale: 1.1, label: "Orbata Mountain Sanctuary", spec: "Pistacia atlantica & Pine", delay: "1.05s" },
  { id: "gabes-oasis", name: "Chenini Gabès Maritime Oasis", type: "palm", x: 182, y: 350, scale: 1.25, label: "Chenini Gabès Maritime Oasis", spec: "Unique Mediterranean Coastal Oasis", delay: "0.4s" },

  // --- SOUTH & SAHARA GREEN WALL (Desert Barrier & Oases) ---
  { id: "tozeur-palms", name: "Tozeur Great Oasis", type: "palm", x: 45, y: 328, scale: 1.3, label: "Tozeur Chott Great Oasis", spec: "Deglet Nour Palm Heritage", delay: "0.6s" },
  { id: "kebili-douz", name: "Douz Desert Green Barrier", type: "palm", x: 130, y: 395, scale: 1.2, label: "Douz Sahara Green Wall", spec: "Dune Stabilization Barrier", delay: "0.8s" },
  { id: "djerba-sanctuary", name: "Djerba UNESCO Biosphere", type: "olive", x: 285, y: 400, scale: 1.1, label: "Djerba Island Sacred Groves", spec: "UNESCO Biosphere Reserve", delay: "0.2s" },
  { id: "medenine-matmata", name: "Matmata Mountain Olives", type: "olive", x: 245, y: 425, scale: 1.05, label: "Matmata Terraced Olives", spec: "Mountain Water-Catchment Groves", delay: "0.5s" },
  { id: "tataouine-green", name: "Tataouine Arid Acacia Belt", type: "palm", x: 220, y: 510, scale: 1.15, label: "Tataouine Anti-Desertification", spec: "Acacia raddiana & Wild Fig", delay: "0.9s" },
];

function SoftSatelliteTunisiaMap() {
  const [activeTree, setActiveTree] = useState<TreeLocation | null>(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* Active Tree Satellite Telemetry Floating Pill */}
      {activeTree && (
        <div
          className="absolute top-6 right-6 sm:right-10 z-30 pointer-events-auto bg-[#041a0d]/90 backdrop-blur-md border border-emerald-400/40 rounded-2xl p-4 shadow-2xl shadow-emerald-950/60 max-w-[280px] animate-in fade-in zoom-in-95 duration-200"
          style={{
            boxShadow: "0 0 25px rgba(52, 211, 153, 0.25)",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              ORBITAL TELEMETRY • SENTINEL-2
            </span>
          </div>
          <div className="text-white font-bold text-sm tracking-tight flex items-center gap-1.5">
            <span>{activeTree.type === "pine" ? "🌲" : activeTree.type === "palm" ? "🌴" : "🌿"}</span>
            <span>{activeTree.label}</span>
          </div>
          <p className="text-emerald-200/80 text-xs mt-1 leading-snug">
            {activeTree.spec}
          </p>
          <div className="mt-2 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[10px] font-mono text-emerald-300/70">
            <span>COORDS: {activeTree.x}, {activeTree.y}</span>
            <span className="text-lime-300 font-semibold">REFORESTED</span>
          </div>
        </div>
      )}

      {/* SVG Canvas for Soft Satellite Map & Trees */}
      <svg
        viewBox="0 0 330 700"
        className="w-full h-full max-h-[860px] object-contain transition-all duration-700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 0 45px rgba(16, 185, 129, 0.22))",
        }}
      >
        <defs>
          {/* Luminous Tunisia Land Fill Gradient */}
          <linearGradient id="satLandGrad" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.16" />
            <stop offset="35%" stopColor="#059669" stopOpacity="0.09" />
            <stop offset="70%" stopColor="#047857" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#d7ee6b" stopOpacity="0.04" />
          </linearGradient>

          {/* Satellite Radar Scan Gradient */}
          <radialGradient id="satRadarGrad" cx="30%" cy="15%" r="65%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#10b981" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
          </radialGradient>

          {/* Pine Tree Foliage Gradient */}
          <linearGradient id="satPineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2f974" />
            <stop offset="30%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Olive Tree Foliage Gradient */}
          <linearGradient id="satOliveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bef264" />
            <stop offset="45%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>

          {/* Palm Frond Gradient */}
          <linearGradient id="satPalmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#a3e635" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Soft Glow Filter for Little Trees */}
          <filter id="satTreeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Satellite Telemetry Orbit Dash Pattern */}
          <linearGradient id="satOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
            <stop offset="45%" stopColor="#34d399" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#d7ee6b" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* 1. SATELLITE GRATICULE / GEODETIC COORDINATE GRID */}
        <g opacity="0.22" stroke="#34d399" strokeWidth="0.5" strokeDasharray="3 6">
          {/* Latitude Arcs */}
          <line x1="20" y1="50" x2="310" y2="50" />
          <line x1="10" y1="180" x2="320" y2="180" />
          <line x1="10" y1="320" x2="320" y2="320" />
          <line x1="20" y1="460" x2="310" y2="460" />
          <line x1="60" y1="620" x2="280" y2="620" />

          {/* Longitude Meridians */}
          <line x1="80" y1="20" x2="80" y2="670" />
          <line x1="180" y1="10" x2="180" y2="680" />
          <line x1="270" y1="30" x2="270" y2="550" />
        </g>

        {/* Latitude & Longitude HUD Labels */}
        <g fill="#34d399" opacity="0.35" fontSize="6.5" fontFamily="monospace" textAnchor="end">
          <text x="318" y="46">37°00′ N</text>
          <text x="318" y="176">35°50′ N</text>
          <text x="318" y="316">34°20′ N</text>
          <text x="318" y="456">33°00′ N</text>
          <text x="82" y="688" textAnchor="middle">8.5° E</text>
          <text x="182" y="688" textAnchor="middle">10.0° E</text>
        </g>

        {/* 2. SATELLITE RADAR SCAN CONE / CONCENTRIC TELEMETRY RINGS */}
        <g opacity="0.32">
          <circle cx="100" cy="70" r="145" stroke="#10b981" strokeWidth="0.6" strokeDasharray="2 4" fill="url(#satRadarGrad)" />
          <circle cx="100" cy="70" r="85" stroke="#34d399" strokeWidth="0.6" strokeDasharray="3 3" />
          <circle cx="100" cy="70" r="32" stroke="#a3e635" strokeWidth="0.7" />
        </g>

        {/* 3. TUNISIA MAP BASE LANDMASS & GOVERNORATE MESH */}
        <g id="tunisia-landmass">
          {mapData.paths.map((gov) => (
            <path
              key={gov.id}
              d={gov.d}
              fill="url(#satLandGrad)"
              stroke="rgba(52, 211, 153, 0.35)"
              strokeWidth="0.75"
              strokeLinejoin="round"
              className="transition-colors duration-500"
            />
          ))}
        </g>

        {/* Outer Coastline Accent Luminous Stroke */}
        <g opacity="0.65">
          {mapData.paths.map((gov) => (
            <path
              key={`stroke-${gov.id}`}
              d={gov.d}
              fill="none"
              stroke="rgba(167, 243, 208, 0.25)"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* 4. SATELLITE ORBITAL TRAJECTORY ARC & SATELLITE GLYPH */}
        <g id="satellite-orbit">
          {/* Orbital curved flight path */}
          <path
            d="M 15 110 Q 140 20 315 130"
            fill="none"
            stroke="url(#satOrbitGrad)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />

          {/* Target Scanning Beam Line from satellite to Kroumirie / Ain Draham */}
          <line
            x1="120"
            y1="52"
            x2="155"
            y2="135"
            stroke="#34d399"
            strokeWidth="0.7"
            strokeDasharray="2 3"
            opacity="0.4"
          />

          {/* Mini Satellite Glyph at (x: 120, y: 52) */}
          <g transform="translate(120, 52) rotate(-18)">
            {/* Pulsing Telemetry Ping Wave */}
            <circle cx="0" cy="0" r="14" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" className="animate-ping" />
            <circle cx="0" cy="0" r="7" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.8" />

            {/* Satellite Central Chassis */}
            <rect x="-4" y="-3" width="8" height="6" rx="1.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.6" />

            {/* Left Solar Panel Wing */}
            <g transform="translate(-14, -3.5)">
              <rect x="0" y="0" width="8" height="7" rx="0.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.5" />
              <line x1="4" y1="0" x2="4" y2="7" stroke="#bae6fd" strokeWidth="0.4" />
            </g>

            {/* Right Solar Panel Wing */}
            <g transform="translate(6, -3.5)">
              <rect x="0" y="0" width="8" height="7" rx="0.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.5" />
              <line x1="4" y1="0" x2="4" y2="7" stroke="#bae6fd" strokeWidth="0.4" />
            </g>

            {/* Antennae */}
            <line x1="0" y1="3" x2="0" y2="8" stroke="#38bdf8" strokeWidth="0.8" />
            <circle cx="0" cy="8" r="1" fill="#38bdf8" />
          </g>

          {/* Satellite Telemetry Tag */}
          <g transform="translate(138, 44)" opacity="0.85">
            <rect x="0" y="-8" width="92" height="15" rx="3" fill="#022c16" stroke="#10b981" strokeWidth="0.6" />
            <text x="5" y="2" fill="#6ee7b7" fontSize="5.5" fontFamily="monospace" fontWeight="bold">
              🛰️ SENTINEL-2 • 10m
            </text>
          </g>
        </g>

        {/* 5. DELICATE LITTLE TREES PLANTED ACROSS TUNISIA */}
        <g id="little-trees" filter="url(#satTreeGlow)">
          {TUNISIA_TREES.map((tree) => {
            const s = tree.scale || 1.0;
            const isHovered = activeTree?.id === tree.id;
            return (
              <g
                key={tree.id}
                transform={`translate(${tree.x}, ${tree.y}) scale(${isHovered ? s * 1.35 : s})`}
                className="pointer-events-auto cursor-pointer transition-transform duration-300"
                onMouseEnter={() => setActiveTree(tree)}
                onMouseLeave={() => setActiveTree(null)}
                style={{
                  animation: `pulse 3.8s ease-in-out infinite`,
                  animationDelay: tree.delay || "0s",
                }}
              >
                {/* Glowing root halo on terrain */}
                <circle
                  cx="0"
                  cy="4"
                  r={isHovered ? 6 : 4}
                  fill={tree.type === "pine" ? "#10b981" : tree.type === "palm" ? "#facc15" : "#a3e635"}
                  opacity={isHovered ? 0.8 : 0.4}
                  className={isHovered ? "animate-ping" : ""}
                />

                {/* --- TREE TYPE 1: CONIFER / PINE (Tabarka, Chaambi, Kesra, Zaghouan) --- */}
                {tree.type === "pine" && (
                  <g>
                    {/* Trunk */}
                    <rect x="-0.8" y="3" width="1.6" height="3" rx="0.4" fill="#78350f" />
                    {/* Layered Tiered Pine Needles */}
                    <path
                      d="M0,-11 L3.8,-5.5 L2,-5.5 L4.5,-1 L2.4,-1 L5.5,4 L-5.5,4 L-2.4,-1 L-4.5,-1 L-2,-5.5 L-3.8,-5.5 Z"
                      fill="url(#satPineGrad)"
                      stroke="#064e3b"
                      strokeWidth="0.4"
                    />
                    {/* Crown Star Highlight */}
                    <circle cx="0" cy="-11" r="0.9" fill="#fef08a" />
                  </g>
                )}

                {/* --- TREE TYPE 2: OLIVE / BROADLEAF (Sahel, Sfax, Cap Bon, Ain Draham) --- */}
                {tree.type === "olive" && (
                  <g>
                    {/* Trunk */}
                    <rect x="-0.8" y="3" width="1.6" height="3" rx="0.4" fill="#713f12" />
                    {/* Organic Fluffy Mediterranean Olive Canopy */}
                    <path
                      d="M0,-10 C-2.8,-10 -5,-8 -5,-5.2 C-6.5,-4.2 -6.8,-1.8 -5.2,-0.2 C-6.5,1.5 -5.8,3.5 -3.5,3.5 L3.5,3.5 C5.8,3.5 6.5,1.5 5.2,-0.2 C6.8,-1.8 6.5,-4.2 5,-5.2 C5,-8 2.8,-10 0,-10 Z"
                      fill="url(#satOliveGrad)"
                      stroke="#064e3b"
                      strokeWidth="0.4"
                    />
                    {/* Leaf Cluster Texture Highlights */}
                    <circle cx="-1.5" cy="-4" r="1.1" fill="#ecfccb" opacity="0.85" />
                    <circle cx="1.8" cy="-2.5" r="1.0" fill="#ecfccb" opacity="0.85" />
                    <circle cx="0" cy="-7" r="1.1" fill="#fef08a" opacity="0.95" />
                  </g>
                )}

                {/* --- TREE TYPE 3: DATE PALM (Tozeur, Kebili, Gabès, Tataouine) --- */}
                {tree.type === "palm" && (
                  <g>
                    {/* Slender Curved Oasis Trunk */}
                    <path d="M-0.6,6 Q0,1 0,-2" stroke="#854d0e" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                    {/* Radiating Palm Fronds */}
                    <path
                      d="M0,-2 Q-4.5,-5 -7.5,-3 M0,-2 Q-5.5,-7 -4,-9.5 M0,-2 Q0,-8.5 0,-11 M0,-2 Q5.5,-7 4,-9.5 M0,-2 Q4.5,-5 7.5,-3"
                      stroke="url(#satPalmGrad)"
                      strokeWidth="1.2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Palm Heart Center */}
                    <circle cx="0" cy="-2" r="1.3" fill="#fef08a" />
                  </g>
                )}

                {/* Micro Label for Famous Forest Landmarks */}
                {tree.label && (
                  <g transform="translate(8, -2)" opacity="0.75" className="hidden sm:block">
                    <line x1="-3" y1="0" x2="0" y2="0" stroke="#34d399" strokeWidth="0.5" />
                    <text
                      x="2"
                      y="1.5"
                      fill="#a7f3d0"
                      fontSize="4.8"
                      fontFamily="sans-serif"
                      fontWeight="600"
                    >
                      {tree.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* 6. BOTTOM HUD WATERMARK: RECONNAISSANCE SPECS */}
        <g transform="translate(18, 638)" opacity="0.6">
          <rect x="0" y="0" width="165" height="44" rx="4" fill="#022c16" stroke="#10b981" strokeWidth="0.6" />
          <text x="8" y="12" fill="#a7f3d0" fontSize="5.5" fontFamily="monospace" fontWeight="bold">
            🇹🇳 TUNISIA CANOPY SATELLITE
          </text>
          <text x="8" y="22" fill="#6ee7b7" fontSize="4.8" fontFamily="monospace">
            • 30 MONITORED NATIVE SITES
          </text>
          <text x="8" y="31" fill="#6ee7b7" fontSize="4.8" fontFamily="monospace">
            • DENSITY: 38% VEGETATION RESTORED
          </text>
          <text x="8" y="39" fill="#d7ee6b" fontSize="4.5" fontFamily="monospace">
            • ORBITAL STATUS: RECONNAISSANCE ACTIVE
          </text>
        </g>
      </svg>
    </div>
  );
}

export default memo(SoftSatelliteTunisiaMap);
