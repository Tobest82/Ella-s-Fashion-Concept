import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Crown,
  ShieldCheck,
  Award,
  Star,
  Scissors,
  Truck,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  Send,
  Mail,
  ShoppingBag
} from 'lucide-react';
import { Product, Category, SiteSettings } from '../types';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import heroFabricsImg from '../assets/images/african_fabrics_hero_1785971052971.jpg';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
  setCurrentPage: (page: string) => void;
  onSelectProduct: (product: Product) => void;
  onFilterByCategory: (categoryName: string) => void;
}

const TESTIMONIALS = [
  {
    id: 1,
    name: "Chief Mrs. Folake Adeleke",
    location: "Victoria Island, Lagos",
    role: "Verified Owambe Client",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    outfit: "Royal Emerald Velvet Corset Gown",
    quote: "I ordered my Thanksgiving Owambe gown from Ella’s Fashion Concept and was blown away by the fit! Not a single pinch or adjustment was needed. The corset detail and finishings are pure couture excellence.",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Dr. Amara Okonkwo",
    location: "Kensington, London, UK",
    role: "Verified International Buyer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    outfit: "Ankara Peplum Executive Suit",
    quote: "Shipping to London took less than 4 days via DHL! The pattern matching across the seams is world-class. I received endless compliments at my medical summit in Mayfair.",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Hajia Khadijah Bello",
    location: "Maitama, Abuja",
    role: "Verified VIP Member",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    outfit: "Hand-Beaded Silk Boubou Kaftan",
    quote: "The silk boubou kaftan is lightweight, modest, and commands immediate respect in any room. Ella personally messaged me on WhatsApp to confirm my height before cutting the hem. Top notch service!",
    date: "2 weeks ago"
  },
  {
    id: 4,
    name: "Bisi Adenuga",
    location: "Houston, Texas, USA",
    role: "Verified Bridal Order",
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    outfit: "Custom Asoebi Ensemble (6 Pieces)",
    quote: "We ordered dresses for 6 bridesmaids living across different US cities. Every single piece fitted like a glove without seeing us in person! Unbelievable precision and craftsmanship.",
    date: "3 weeks ago"
  },
  {
    id: 5,
    name: "Zainab Mohammed",
    location: "GRA Phase 2, Port Harcourt",
    role: "Verified Repeat Customer",
    avatar: "https://images.unsplash.com/photo-1523825036634-aab3cce05919?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    outfit: "Luxe Chiffon Floral Maxi Dress",
    quote: "I love how soft and comfortable the inner lining feels against the skin. The vibrant colors retain their pop even after multiple delicate washes. Ella's Fashion Concept is my go-to designer!",
    date: "1 month ago"
  },
  {
    id: 6,
    name: "Engr. Sandra Eze",
    location: "Lekki Phase 1, Lagos",
    role: "Verified Corporate Client",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    outfit: "Contemporary Two-Piece Crepe Set",
    quote: "Clean, crisp tailoring that exudes executive elegance. The trousers drape effortlessly and the blazer collar stays sharp all day. Highly recommended for modern professional women!",
    date: "1 month ago"
  }
];

export const HomePage: React.FC<HomePageProps> = ({
  products,
  settings,
  setCurrentPage,
  onSelectProduct,
}) => {
  // Extract New Arrivals & Best Sellers
  const newArrivals = products.filter((p) => p.is_new_arrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.is_bestseller).slice(0, 4);

  // Fallbacks if tags are sparse
  const displayNewArrivals = newArrivals.length > 0 ? newArrivals : products.slice(0, 4);
  const displayBestSellers = bestSellers.length > 0 ? bestSellers : products.slice(2, 6);

  // Testimonials Carousel State
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handlePrevTestimonial = () => {
    setIsAutoPlay(false);
    setTestimonialIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setIsAutoPlay(false);
    setTestimonialIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 6000);
    }
  };

  const currentTestimonial = TESTIMONIALS[testimonialIndex];

  return (
    <div className="space-y-24 pb-16 font-sans overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#121212] text-white px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={heroFabricsImg}
            alt="Ella's Fashion Concept Wardrobe"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-[12000ms] ease-out hover:scale-100 opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/85 z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/60 z-0" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#F4C430]/40 backdrop-blur-md text-[#F4C430] text-xs font-semibold uppercase tracking-[0.25em]"
          >
            <Crown className="w-4 h-4 text-[#F4C430]" />
            Ella's Fashion Concept • Custom Women's Tailoring
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]"
          >
            {settings.hero_title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg text-[#D4CEC5] font-light max-w-2xl mx-auto leading-relaxed"
          >
            {settings.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => setCurrentPage('products')}
              className="w-full sm:w-auto px-9 py-4 bg-[#F4C430] text-black font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#d8a81d] cursor-pointer transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage('about')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/30 font-semibold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-white/20 hover:text-[#F4C430] hover:border-[#F4C430] cursor-pointer backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              Read About Us
            </button>
          </motion.div>
        </div>
      </section>

      {/* ==================== 1. NEW ARRIVALS ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E4DE] pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F4C430] block mb-1">
              Fresh Off The Studio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#121212]">
              New Arrivals
            </h2>
            <p className="text-xs text-[#8C8275] mt-1">
              Showcase the latest pieces from Ella’s Fashion Concept.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('products')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#121212] hover:text-[#F4C430] transition-colors cursor-pointer self-start sm:self-auto"
          >
            View All New Clothes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayNewArrivals.map((product) => (
            <ProductCard
              key={`new-${product.id}`}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* ==================== 2. OUR BEST SELLERS ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E4DE] pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F4C430] block mb-1">
              Most Loved By Clients
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#121212]">
              Our Best Sellers
            </h2>
            <p className="text-xs text-[#8C8275] mt-1">
              Show customers some of the most popular products.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('products')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#121212] hover:text-[#F4C430] transition-colors cursor-pointer self-start sm:self-auto"
          >
            Shop Best Sellers
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayBestSellers.map((product) => (
            <ProductCard
              key={`bestseller-${product.id}`}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* ==================== 3. ABOUT ELLA'S FASHION CONCEPT ==================== */}
      <section className="bg-[#121212] text-white py-20 px-4 sm:px-6 lg:px-8 border-y border-[#262626] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4C430]/10 border border-[#F4C430]/30 text-[#F4C430] text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              Brand Story & Philosophy
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              About Ella’s Fashion Concept
            </h2>

            <p className="text-sm sm:text-base text-[#D4CEC5] leading-relaxed font-light">
              At <strong>Ella’s Fashion Concept</strong>, we believe every woman deserves clothes that fit comfortably, feel luxurious, and command respect in any room. Founded on the principles of precision tailoring, hand-selected luxury fabrics, and contemporary African flair, our boutique creates bespoke dresses, suits, kaftans, and co-ords tailored specifically to your figure.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#262626]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#F4C430] font-bold text-sm">
                  <Scissors className="w-4 h-4" />
                  Tailored Sizing
                </div>
                <p className="text-xs text-[#A39B8E]">Made to your exact bust, waist, and length specs.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#F4C430] font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  Premium Fabrics
                </div>
                <p className="text-xs text-[#A39B8E]">Authentic Ankara, Velvet, Silk Chiffon & Crepe.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#F4C430] font-bold text-sm">
                  <Truck className="w-4 h-4" />
                  Worldwide Shipping
                </div>
                <p className="text-xs text-[#A39B8E]">Express delivery across Nigeria & globally.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentPage('about')}
                className="px-8 py-3.5 bg-[#F4C430] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#d8a81d] cursor-pointer transition-all flex items-center gap-2"
              >
                Read About Us
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Image: Authentic Nigerian Fashion Model */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-[#333] shadow-2xl relative">
              <img
                src="https://i.ibb.co/Zpv91Tsf/Whats-App-Image-2026-08-10-at-11-44-16-PM.jpg"
                alt="Ella's Fashion Concept Fitting Studio"
                className="w-full h-full object-cover object-top"
              />
            </div>
            
          </div>
        </div>
      </section>

      {/* ==================== 4. CUSTOMER REVIEWS ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121212] text-white rounded-3xl p-8 sm:p-12 md:p-16 border border-[#262626] shadow-2xl relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4C430]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-10">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#262626] pb-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-[#F4C430] text-xs font-bold uppercase tracking-[0.25em]">
                  <Quote className="w-4 h-4" />
                  Verified Feedback
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
                  Customer Reviews
                </h2>
                <p className="text-xs text-[#A39B8E] font-light">
                  Build trust with real testimonials from stylish women across Lagos, Abuja, London, Houston & beyond.
                </p>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevTestimonial}
                  className="p-3 bg-white/10 hover:bg-[#F4C430] text-white hover:text-black border border-white/20 rounded-xl transition-all cursor-pointer"
                  aria-label="Previous Review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextTestimonial}
                  className="p-3 bg-white/10 hover:bg-[#F4C430] text-white hover:text-black border border-white/20 rounded-xl transition-all cursor-pointer"
                  aria-label="Next Review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Testimonial Active Slide */}
            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  {/* Buyer Avatar & Info */}
                  <div className="lg:col-span-4 flex items-center gap-5 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#F4C430] shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[#F4C430]">
                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <h4 className="font-serif text-lg font-bold text-white">
                        {currentTestimonial.name}
                      </h4>
                      <p className="text-xs text-[#A39B8E]">{currentTestimonial.location}</p>
                      <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#F4C430] bg-[#F4C430]/10 px-2.5 py-0.5 rounded-md border border-[#F4C430]/20 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {currentTestimonial.role}
                      </div>
                    </div>
                  </div>

                  {/* Quote & Product */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="text-xs text-[#F4C430] font-semibold flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Outfit Purchased: <span className="text-white font-serif text-sm">{currentTestimonial.outfit}</span>
                    </div>

                    <p className="font-serif text-xl sm:text-2xl italic text-[#FAF8F5] leading-relaxed font-normal">
                      "{currentTestimonial.quote}"
                    </p>

                    <div className="text-[11px] text-[#A39B8E] flex items-center gap-2 pt-1">
                      <span>Posted {currentTestimonial.date}</span>
                      <span>•</span>
                      <span className="text-[#F4C430]">100% Verified Purchase</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setIsAutoPlay(false);
                    setTestimonialIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === testimonialIndex
                      ? 'w-10 bg-[#F4C430]'
                      : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. NEWSLETTER ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#E8E4DE] shadow-luxury text-center space-y-6 max-w-4xl mx-auto relative overflow-hidden">
          <div className="w-12 h-12 bg-[#121212] text-[#F4C430] rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Mail className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F4C430]">
              Exclusive Fashion Club
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#121212]">
              Subscribe To Our Newsletter
            </h2>
            <p className="text-xs sm:text-sm text-[#8C8275] max-w-md mx-auto font-light">
              Join our VIP list to receive first notifications on new arrival drops, bespoke style lookbooks, and private discount codes.
            </p>
          </div>

          {newsletterSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl max-w-md mx-auto text-xs font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you for subscribing! Check your inbox soon for VIP style updates.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-white border border-[#E8E4DE] rounded-xl px-4 py-3 text-xs text-[#121212] focus:outline-none focus:border-[#F4C430] shadow-sm"
              />
              <button
                type="submit"
                className="px-7 py-3 bg-[#121212] hover:bg-[#F4C430] text-white hover:text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <p className="text-[10px] text-[#A39B8E]">
            We respect your privacy. Unsubscribe at any time with one click.
          </p>
        </div>
      </section>
    </div>
  );
};
