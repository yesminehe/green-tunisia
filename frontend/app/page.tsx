import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4faf4] text-[#123719] selection:bg-emerald-200 selection:text-emerald-950 overflow-x-hidden">
      {/* Top Navbar matching the reference design */}
      <Navbar />

      {/* Main Hero Section */}
      <section
        className="relative w-full flex-1 min-h-[calc(100vh-80px)] flex items-center bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundColor: "#f4faf4",
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-8 sm:py-12 lg:py-16">
          <div className="max-w-3xl">
            {/* Flag + Title Container */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Tunisian Flag */}
              <div className="relative w-[100px] sm:w-[124px] lg:w-[132px] h-[66px] sm:h-[82px] lg:h-[88px] shrink-0 rounded-[5px] overflow-hidden shadow-md shadow-emerald-950/20 border border-white/90">
                <Image
                  src="/tunisia-flag.png"
                  alt="Tunisian Flag"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-black text-[#153e1f] tracking-tight uppercase leading-[1.04] select-none">
                <span>REPLANTING TUNISIA,</span>
                <span className="block mt-1">ONE TREE AT A TIME</span>
              </h1>
            </div>

            {/* Description & CTA Button - Precisely indented under the headline */}
            <div className="mt-5 sm:mt-7 sm:pl-[148px] lg:pl-[156px] space-y-6 sm:space-y-7">
              <p className="text-xs sm:text-[13.5px] lg:text-[15px] font-bold text-[#1f4825] uppercase tracking-wide leading-[1.65] max-w-lg">
                BECOME A VOLUNTEER. JOIN OUR NATIONWIDE
                <br className="hidden sm:inline" /> MOVEMENT TO RESTORE OUR
                FORESTS.
                <br className="hidden sm:inline" /> EACH TREE MAKES A
                DIFFERENCE.
              </p>

              <div>
                <Link
                  href="/membre/dashboard"
                  className="inline-flex items-center justify-center px-8 sm:px-9 py-3 sm:py-3.5 rounded-full bg-[#3d683a] hover:bg-[#30552d] text-white font-bold text-xs sm:text-[13.5px] tracking-wider uppercase shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  JOIN THE MOVEMENT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature & About Sections below Hero */}
      <section
        id="about"
        className="w-full bg-white/90 border-t border-emerald-900/10 py-16 px-6 sm:px-12 lg:px-16"
      >
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              Our Mission
            </span>
            <h2 className="text-3xl font-extrabold text-[#143a1a] mt-3 uppercase tracking-tight">
              A Greener Tunisia for Future Generations
            </h2>
            <p className="text-emerald-800 text-sm mt-3 font-medium">
              We empower citizens, volunteers, and organizations across Tunisia
              to monitor, protect, and plant indigenous trees in our national
              reforestation campaign.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#f7fbf7] p-8 rounded-2xl border border-emerald-900/10 hover:border-emerald-500/40 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl mb-5">
                🌱
              </div>
              <h3 className="text-lg font-bold text-[#143a1a] uppercase tracking-wide mb-2">
                Tree Plantation
              </h3>
              <p className="text-emerald-800 text-sm leading-relaxed font-medium">
                Locate reforestation zones and plant resilient olive, pine, and
                oak trees suited to the local climate.
              </p>
              <div className="mt-4">
                <Link
                  href="/arbres"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 uppercase tracking-wider"
                >
                  Explore trees →
                </Link>
              </div>
            </div>

            <div className="bg-[#f7fbf7] p-8 rounded-2xl border border-emerald-900/10 hover:border-emerald-500/40 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl mb-5">
                💧
              </div>
              <h3 className="text-lg font-bold text-[#143a1a] uppercase tracking-wide mb-2">
                Irrigation Tracking
              </h3>
              <p className="text-emerald-800 text-sm leading-relaxed font-medium">
                Monitor soil moisture, watering schedules, and survival rates to
                ensure healthy forest growth.
              </p>
              <div className="mt-4">
                <Link
                  href="/dashboard"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 uppercase tracking-wider"
                >
                  View dashboard →
                </Link>
              </div>
            </div>

            <div className="bg-[#f7fbf7] p-8 rounded-2xl border border-emerald-900/10 hover:border-emerald-500/40 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl mb-5">
                👥
              </div>
              <h3 className="text-lg font-bold text-[#143a1a] uppercase tracking-wide mb-2">
                Volunteer Network
              </h3>
              <p className="text-emerald-800 text-sm leading-relaxed font-medium">
                Connect with thousands of dedicated volunteers organizing
                planting campaigns throughout Tunisia.
              </p>
              <div className="mt-4">
                <Link
                  href="/membre/dashboard"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 uppercase tracking-wider"
                >
                  Join volunteer portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#122e17] text-emerald-100/70 py-8 px-6 text-center text-xs">
        <div className="max-w-[1300px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">
              GREEN TUNISIA
            </span>
            <span>— Replanting Tunisia, One Tree at a Time</span>
          </div>
          <div>
            © {new Date().getFullYear()} Green Tunisia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
