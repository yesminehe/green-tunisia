"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
          y: 35,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-transparent text-gray-700 pt-16 pb-12 px-6 sm:px-12 lg:px-16 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Main 5-Column Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#3d683a] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                Green Tunisia
              </span>
            </Link>

            <p className="text-gray-500 text-xs sm:text-[13.5px] leading-relaxed mt-4 max-w-xs">
              Together, we can create a sustainable future for generations to
              come.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
              Explore
            </h4>
            <Link
              href="#mission"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              Our Mission
            </Link>
            <Link
              href="/projets"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/arbres"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              Resources
            </Link>
            <Link
              href="#initiatives"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              Blog
            </Link>
          </div>

          {/* Column 3: Get Involved */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
              Get Involved
            </h4>
            <Link
              href="/volunteers"
              className="text-xs sm:text-[13px] font-semibold text-[#3d683a] hover:underline transition-colors"
            >
              Volunteers & Associations
            </Link>
            <Link
              href="/membre/dashboard"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              Member Portal
            </Link>
            <Link
              href="/membre/dashboard"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              Donate
            </Link>
            <Link
              href="/admin/login"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              Partner With Us
            </Link>
            <Link
              href="/projets"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              Events
            </Link>
          </div>

          {/* Column 4: Support */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
              Support
            </h4>
            <Link
              href="/contact"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="/contact"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs sm:text-[13px] text-gray-600 hover:text-[#3d683a] transition-colors"
            >
              Terms of Use
            </Link>
          </div>

          {/* Column 5: Follow Us & Copyright */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
              Follow Us
            </h4>

            {/* Circular Social Buttons */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#3d683a] text-gray-500 hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#3d683a] text-gray-500 hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#3d683a] text-gray-500 hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#3d683a] text-gray-500 hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>

            <p className="text-gray-400 text-xs pt-4">
              © {new Date().getFullYear()} Green Tunisia. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}