"use client"

import React from "react"

export function EgisMuLogo({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const isSmall = size === "sm";
  const isMedium = size === "md";

  return (
    <div className="relative inline-flex flex-col items-center select-none group">
      {/* Ambient Icy Glow Behind Logo */}
      <div className="absolute -inset-6 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-400/30 transition-all duration-500" />

      {/* Heraldic Ice Shield & Crossed Swords SVG Crest */}
      <div className={`relative z-10 flex items-center justify-center ${isSmall ? "w-16 h-16 -mb-4" : isMedium ? "w-24 h-24 -mb-6" : "w-32 h-32 sm:w-36 sm:h-36 -mb-8"}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_0_18px_rgba(0,210,255,0.65)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="egisMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="35%" stopColor="#94A3B8" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="75%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="egisIce" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="40%" stopColor="#38BDF8" />
              <stop offset="80%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="egisDarkCore" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="50%" stopColor="#082F49" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <radialGradient id="egisGemGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A5F3FC" />
              <stop offset="45%" stopColor="#00D2FF" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Frost Wings / Spikes */}
          <path
            d="M100 12 L122 38 L158 26 L144 64 L178 78 L148 106 L162 138 L128 134 L100 186 L72 134 L38 138 L52 106 L22 78 L56 64 L42 26 L78 38 Z"
            fill="url(#egisDarkCore)"
            stroke="url(#egisMetal)"
            strokeWidth="3"
          />

          {/* Inner Shield Frame */}
          <path
            d="M100 24 L138 48 L132 112 L100 168 L68 112 L62 48 Z"
            fill="url(#egisDarkCore)"
            stroke="url(#egisIce)"
            strokeWidth="3.5"
          />

          {/* Metallic Filigree Crown Top */}
          <path
            d="M75 44 L100 18 L125 44 L115 54 L100 36 L85 54 Z"
            fill="url(#egisMetal)"
          />

          {/* Glowing Ice Runes & Faceted Central Crystal */}
          <polygon
            points="100,46 120,82 100,136 80,82"
            fill="url(#egisIce)"
            stroke="#E0F2FE"
            strokeWidth="1.5"
          />
          <polygon
            points="100,56 112,82 100,122 88,82"
            fill="#E0F2FE"
            fillOpacity="0.65"
          />

          {/* Side Wing Blades */}
          <path
            d="M60 62 L28 48 L42 82 L64 96 Z"
            fill="url(#egisIce)"
            opacity="0.85"
          />
          <path
            d="M140 62 L172 48 L158 82 L136 96 Z"
            fill="url(#egisIce)"
            opacity="0.85"
          />

          {/* Center Core Radial Glow */}
          <circle cx="100" cy="85" r="28" fill="url(#egisGemGlow)" />
        </svg>
      </div>

      {/* Main Title: EGIS-MU */}
      <div className="relative z-20 flex flex-col items-center">
        <div
          className={`font-serif font-black tracking-[0.12em] uppercase bg-gradient-to-b from-white via-slate-200 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] ${
            isSmall
              ? "text-xl"
              : isMedium
              ? "text-3xl"
              : "text-4xl sm:text-5xl md:text-6xl"
          }`}
          style={{
            textShadow: "0 0 24px rgba(0, 210, 255, 0.45), 0 2px 4px rgba(0,0,0,0.9)",
          }}
        >
          EGIS-MU
        </div>

        {/* Subtitle: M U  O N L I N E */}
        <div
          className={`font-sans font-bold tracking-[0.45em] uppercase text-sky-200/90 -mt-1 ${
            isSmall ? "text-[8px]" : isMedium ? "text-[10px]" : "text-xs sm:text-sm"
          }`}
        >
          MU ONLINE
        </div>

        {/* Season 2 Fiery Ribbon / Slash */}
        <div className="relative flex items-center justify-center mt-0.5">
          <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent via-amber-400 to-orange-500" />
          <span
            className={`px-2 font-serif italic font-extrabold bg-gradient-to-b from-amber-200 via-amber-400 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)] ${
              isSmall ? "text-xs" : isMedium ? "text-base" : "text-lg sm:text-2xl"
            }`}
          >
            Season <span className="not-italic font-black text-amber-400">2</span>
          </span>
          <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent via-amber-400 to-orange-500" />
        </div>
      </div>
    </div>
  )
}

export function IcyPanelHeader({ title }: { title: React.ReactNode }) {
  return (
    <div className="relative w-full pt-3 pb-2.5 px-4 bg-gradient-to-b from-[#10233a] via-[#0a1626] to-[#060e1a] border-b border-cyan-500/40 shadow-[inset_0_1px_0_rgba(125,211,252,0.25)] flex items-center justify-center">
      {/* Top Center Frost Gem Ornament */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
        <svg width="46" height="16" viewBox="0 0 46 16" fill="none">
          <path d="M2 8 L16 2 L23 0 L30 2 L44 8 L30 14 L23 16 L16 14 Z" fill="#081526" stroke="#38BDF8" strokeWidth="1.2" />
          <polygon points="23,2 29,8 23,14 17,8" fill="#00D2FF" />
          <circle cx="23" cy="8" r="2.5" fill="#E0F2FE" />
        </svg>
      </div>

      {/* Corner Frost Accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />

      <h3 className="font-serif text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase text-sky-100 drop-shadow-[0_0_8px_rgba(0,210,255,0.5)] text-center">
        {title}
      </h3>
    </div>
  )
}

export default EgisMuLogo;

