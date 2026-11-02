"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full z-40 bg-transparent transition-all">
      <div className="max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-14 py-5 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-700/30 rounded-md"
          aria-label="Green Tunisia Home"
        >
          <div className="relative h-9 w-[190px] sm:h-10 sm:w-[210px]">
            <Image
              src="/logo-green-tunisia.png"
              alt="Green Tunisia"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-7 lg:gap-9 text-[13px] lg:text-[14px] font-semibold tracking-wider text-[#3d5f46]"
          aria-label="Main Navigation"
        >
          <Link
            href="/"
            className="hover:text-[#173a21] transition-colors duration-200 py-1 border-b-2 border-transparent hover:border-[#3d5f46]"
          >
            HOME
          </Link>

          <Link
            href="/arbres"
            className="hover:text-[#173a21] transition-colors duration-200 py-1 border-b-2 border-transparent hover:border-[#3d5f46]"
          >
            PROJECTS
          </Link>

          <Link
            href="#about"
            className="hover:text-[#173a21] transition-colors duration-200 py-1 border-b-2 border-transparent hover:border-[#3d5f46]"
          >
            ABOUT
          </Link>

          <Link
            href="#join"
            className="hover:text-[#173a21] transition-colors duration-200 py-1 border-b-2 border-transparent hover:border-[#3d5f46]"
          >
            JOIN US
          </Link>

          <Link
            href="/membre/dashboard"
            className="flex items-center gap-1.5 hover:text-[#173a21] transition-colors duration-200 py-1 border-b-2 border-transparent hover:border-[#3d5f46]"
          >
            <span>VOLUNTEER PROFILE</span>
            <svg
              className="w-4 h-4 ml-0.5 inline-block"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#3d5f46] hover:text-[#173a21] hover:bg-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f4faf4]/95 backdrop-blur-md border-b border-emerald-900/10 px-6 py-4 space-y-3 font-semibold text-sm text-[#3d5f46] shadow-lg animate-in fade-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-[#173a21] hover:translate-x-1 transition-all"
          >
            HOME
          </Link>
          <Link
            href="/arbres"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-[#173a21] hover:translate-x-1 transition-all"
          >
            PROJECTS
          </Link>
          <Link
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-[#173a21] hover:translate-x-1 transition-all"
          >
            ABOUT
          </Link>
          <Link
            href="#join"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-[#173a21] hover:translate-x-1 transition-all"
          >
            JOIN US
          </Link>
          <Link
            href="/membre/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 hover:text-[#173a21] hover:translate-x-1 transition-all"
          >
            <span>VOLUNTEER PROFILE</span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>
      )}
    </header>
  );
}
