import React from 'react';
import {
  Crown,
  Scissors,
  Award,
  Sparkles,
  Heart,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Globe2,
  Ruler,
  Layers,
  Sparkle,
  PhoneCall
} from 'lucide-react';
import { SiteSettings } from '../types';
import { motion } from 'motion/react';

interface AboutPageProps {
  settings: SiteSettings;
  setCurrentPage: (page: string) => void;
}

const STATS = [
  { label: 'Happy Clients Dressed', value: '10,000+', icon: Users },
  { label: 'Custom Fitting Accuracy', value: '100%', icon: Ruler },
  { label: 'Countries Shipped To', value: '15+', icon: Globe2 },
  { label: 'Years of Fashion Excellence', value: '8+', icon: Award },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Custom Measurement',
    desc: 'We capture your exact bust, waist, hip, and gown height specs to ensure an impeccable silhouette.',
    icon: Ruler,
  },
  {
    step: '02',
    title: 'Premium Fabric Selection',
    desc: 'Hand-picked luxury Ankara, Silk Chiffon, Rich Velvet, and Crepe curated for durability and drape.',
    icon: Layers,
  },
  {
    step: '03',
    title: 'Precision Cutting & Sewing',
    desc: 'Our master tailors cut and hand-finish seams with neat lining that feels soft against your skin.',
    icon: Scissors,
  },
  {
    step: '04',
    title: 'Worldwide Express Delivery',
    desc: 'Carefully packaged and shipped via DHL or door-to-door courier across Nigeria and internationally.',
    icon: Globe2,
  },
];

const LOOKBOOK_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
    title: 'Royal Owambe Couture',
    tag: 'Bespoke Eveningwear',
  },
  {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    title: 'Contemporary Two-Piece Sets',
    tag: 'Executive Elegance',
  },
  {
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
    title: 'High-Waisted Tailored Skirts',
    tag: 'Bespoke Fit',
  },
  {
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    title: 'Bespoke Tops & Trousers',
    tag: 'Boutique Craft',
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="space-y-24 pb-20 font-sans">
      {/* 1. HERO HEADER (Yellow Background as requested) */}
      <section className="bg-[#F4C430] text-[#121212] py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E8E4DE] text-center relative overflow-hidden">
        {/* Subtle Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#121212_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/10 border border-black/20 text-[#121212] text-xs font-bold uppercase tracking-widest"
          >
            <Crown className="w-4 h-4 text-[#121212]" />
            About Ella's Fashion Concept
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#121212] max-w-4xl mx-auto leading-[1.12]"
          >
            Quality Women's Clothes <br className="hidden sm:inline" />
            <span>Made to Fit You Perfectly</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-[#262626] max-w-2xl mx-auto font-medium leading-relaxed"
          >
            We sew stylish dresses and outfits designed to help women look great, feel confident, and stand out with effortless grace.
          </motion.p>
        </div>
      </section>

      {/* 2. STATS OVERVIEW GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DE] shadow-luxury text-center space-y-3 hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DE] text-[#121212] flex items-center justify-center mx-auto shadow-sm">
                  <Icon className="w-6 h-6 text-[#F4C430]" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#121212] tracking-tight">
                  {stat.value}
                </div>
                <p className="text-xs uppercase tracking-wider font-bold text-[#8C8275]">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. FOUNDER SPOTLIGHT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E8E4DE] p-8 sm:p-12 md:p-16 shadow-luxury grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
          {/* Decorative Corner Badge */}
          <div className="absolute top-0 right-0 bg-[#F4C430] text-black text-[10px] uppercase tracking-widest font-bold px-6 py-2 rounded-bl-2xl">
            Fashion House Founder
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-[#E8E4DE] shadow-2xl relative">
              <img
                src="https://i.ibb.co/MDLfN8W9/Whats-App-Image-2026-08-10-at-11-41-58-PM.jpg"
                alt="Ella - Lead Designer & Founder"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#121212] text-white p-6 rounded-2xl border border-[#262626] shadow-2xl max-w-xs hidden sm:block">
              <div className="flex items-center gap-2 text-[#F4C430] font-bold text-xs uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4" />
                Master Stylist
              </div>
              <p className="text-xs text-[#D4CEC5] font-medium leading-snug">
                Crafting tailored silhouettes that celebrate African royalty and modern executive grace.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-7">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F4C430] block">
                Meet The Founder
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#121212] leading-tight">
                "Good clothing brings out your confidence & natural beauty."
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#524B42] leading-relaxed font-normal">
              Based in Lagos, Nigeria, <strong>Ella's Fashion Concept</strong> was built with a simple yet uncompromising standard: to empower women with expertly sewn, flawless-fitting garments. What began as a passionate tailor shop has grown into a premier fashion house dressing corporate leaders, brides, and Owambe icons across Nigeria, the UK, the USA, and worldwide.
            </p>

            <p className="text-sm sm:text-base text-[#524B42] leading-relaxed font-normal">
              Whether you are preparing for a milestone birthday, Thanksgiving service, corporate summit, or high-profile wedding, every piece that leaves our studio carries precision tailoring, rich lining, and effortless dignity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DE]">
                <CheckCircle2 className="w-5 h-5 text-[#F4C430] shrink-0" />
                <span className="text-xs font-bold text-[#121212]">Zero Alteration Needed Guarantee</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DE]">
                <CheckCircle2 className="w-5 h-5 text-[#F4C430] shrink-0" />
                <span className="text-xs font-bold text-[#121212]">Luxury Fabric Sourcing</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setCurrentPage('products')}
                className="px-8 py-4 bg-[#121212] hover:bg-[#F4C430] text-white hover:text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Shop Collections</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage('contact')}
                className="px-8 py-4 bg-[#FAF8F5] hover:bg-[#E8E4DE] text-[#121212] font-bold text-xs uppercase tracking-widest rounded-xl transition-all border border-[#E8E4DE] cursor-pointer flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[#F4C430]" />
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR CRAFTSMANSHIP PROCESS */}
      <section className="bg-[#121212] text-white py-20 px-4 sm:px-6 lg:px-8 border-y border-[#262626]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F4C430]">
              The Boutique Experience
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              How We Sew Your Outfit
            </h2>
            <p className="text-xs sm:text-sm text-[#A39B8E] font-light">
              From the initial tape measurement to the final luxury packaging, every step is executed with precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#262626] space-y-4 relative group hover:border-[#F4C430] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#262626] text-[#F4C430] flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-[#333] group-hover:text-[#F4C430] transition-colors">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-[#A39B8E] leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. BRAND VALUES & PROMISES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#E8E4DE] shadow-luxury space-y-4 hover:shadow-2xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DE] flex items-center justify-center text-[#F4C430]">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#121212]">Expert Sewing</h3>
            <p className="text-xs text-[#524B42] leading-relaxed">
              Every dress is carefully measured, cut, and neatly sewn to ensure long-lasting durability and striking elegance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8E4DE] shadow-luxury space-y-4 hover:shadow-2xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DE] flex items-center justify-center text-[#F4C430]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#121212]">Top Quality Fabrics</h3>
            <p className="text-xs text-[#524B42] leading-relaxed">
              We select soft silks, rich velvets, French lace, and durable cottons that feel smooth against skin all day.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8E4DE] shadow-luxury space-y-4 hover:shadow-2xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DE] flex items-center justify-center text-[#F4C430]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#121212]">Perfect Fit Promise</h3>
            <p className="text-xs text-[#524B42] leading-relaxed">
              Our custom size guidelines guarantee your outfit fits comfortably without needing frustrating last-minute alterations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

