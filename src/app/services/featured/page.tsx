'use client';

import { FeaturedServices } from "@/components/featured-services";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function FeaturedServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50 text-gray-800 overflow-hidden">
      {/* HERO SECTION */}
      <section
        className="relative w-full h-[60vh] md:h-[70vh] bg-cover bg-center bg-no-repeat flex items-center"
        style={{ backgroundImage: "url('/images/bener/baner-unggulan.jpg')" }}
      >
        {/* Overlay gradient halus */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/60 via-emerald-900/40 to-transparent md:bg-gradient-to-r md:from-emerald-900/70 md:via-emerald-900/30 md:to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 mb-4 border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-emerald-100" />
              <span className="ml-2 text-xs font-medium tracking-wide text-emerald-50 uppercase">
                Layanan Premium
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight drop-shadow-md">
              Layanan Unggulan Kami
            </h1>
            <p className="text-sm md:text-base text-emerald-50/90 max-w-lg leading-relaxed">
              Temukan layanan kesehatan terbaik dengan dukungan teknologi modern
              dan tenaga medis profesional untuk kenyamanan Anda.
            </p>
          </motion.div>
        </div>

        {/* Smooth wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 180"
            className="w-full h-[90px] text-white fill-current"
            preserveAspectRatio="none"
          >
            <path d="M0,64L48,90.7C96,117,192,171,288,170.7C384,171,480,117,576,112C672,107,768,149,864,160C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96L1440,180L0,180Z" />
          </svg>
        </div>
      </section>

      {/* FEATURED SERVICES SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-white to-emerald-50">
        <div className="absolute inset-0">
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-emerald-100/40 blur-3xl rounded-full"></div>
        </div>

        <div className="relative container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-lg border border-emerald-100 shadow-lg rounded-3xl py-10 px-5 md:px-10"
          >
            <FeaturedServices />
          </motion.div>
        </div>
      </section>

      
    </main>
  );
}
