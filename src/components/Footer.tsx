import React, { useState } from 'react';
import { Crown, Send, Instagram, Facebook, MessageCircle, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  setCurrentPage: (page: string) => void;
  onFilterByCategory?: (categoryName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setCurrentPage, onFilterByCategory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#121212] text-white pt-16 pb-12 border-t border-[#262626] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-[#262626]">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="https://i.ibb.co/R44hvCjc/Chat-GPT-Image-Aug-5-2026-11-41-48-PM.png"
                alt="Ella's Fashion Concept Logo"
                referrerPolicy="no-referrer"
                className="h-12 w-auto object-contain rounded-md"
              />
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                  Ella's
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#F4C430] font-sans font-semibold">
                  Fashion Concept
                </span>
              </div>
            </div>

            <p className="text-[#A39B8E] text-sm leading-relaxed max-w-sm">
              We make beautiful women's clothes and dresses. Sewn with care to fit you comfortably and make you look great.
            </p>

            <div className="space-y-3 text-xs text-[#D4CEC5]">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#F4C430] shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F4C430] shrink-0" />
                <span>{settings.phone_number}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F4C430] shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1F1F1F] border border-[#333] flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1F1F1F] border border-[#333] flex items-center justify-center text-white hover:bg-[#E1306C] transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1F1F1F] border border-[#333] flex items-center justify-center text-white hover:bg-[#1877F2] transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#F4C430] mb-5 tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm text-[#A39B8E]">
              <li>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="bg-transparent cursor-pointer hover:text-[#F4C430] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('products')}
                  className="bg-transparent cursor-pointer hover:text-[#F4C430] transition-colors"
                >
                  Shop Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('about')}
                  className="bg-transparent cursor-pointer hover:text-[#F4C430] transition-colors"
                >
                  About Ella's Concept
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="bg-transparent cursor-pointer hover:text-[#F4C430] transition-colors"
                >
                  Client Services & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Collections */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#F4C430] mb-5 tracking-wide">
              Collections
            </h4>
            <ul className="space-y-3 text-sm text-[#A39B8E]">
              {['Gowns', 'Tops', 'Skirts', 'Trousers', 'Two-Piece Sets'].map((catName) => (
                <li key={catName}>
                  <button
                    onClick={() => {
                      if (onFilterByCategory) onFilterByCategory(catName);
                      else setCurrentPage('products');
                    }}
                    className="bg-transparent cursor-pointer hover:text-[#F4C430] transition-colors"
                  >
                    {catName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-serif text-lg font-semibold text-[#F4C430] mb-3 tracking-wide">
              The Private Club
            </h4>
            <p className="text-xs text-[#A39B8E] leading-relaxed">
              Subscribe to receive updates on new dress releases, fitting tips, and special offers.
            </p>

            {subscribed ? (
              <div className="bg-[#1F2E23] text-[#4ADE80] border border-[#2E5E3A] rounded-lg p-3 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You are now subscribed to Ella's VIP Private List.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-[#1F1F1F] text-white border border-[#333] rounded-md px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F4C430] placeholder:text-[#666]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#F4C430] text-black font-semibold rounded text-xs hover:bg-[#d8a81d] transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C8275] gap-4">
          <p>© {new Date().getFullYear()} Ella's Fashion Concept. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#F4C430] cursor-pointer transition-colors">Terms of Elegance</span>
            <span className="hover:text-[#F4C430] cursor-pointer transition-colors">Privacy Guarantee</span>
            <span className="hover:text-[#F4C430] cursor-pointer transition-colors">Bespoke Fitting Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
