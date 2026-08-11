import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, Heart, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenSearch: () => void;
  isAdmin?: boolean;
  categories?: Category[];
  onFilterByCategory?: (categoryName: string) => void;
}

const DEFAULT_CATEGORIES = [
  'Gowns',
  'Tops',
  'Skirts',
  'Trousers',
  'Two-Piece Sets',
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  onOpenSearch,
  categories,
  onFilterByCategory,
}) => {
  const { totalItems, setIsCartOpen, wishlist } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isDrawerCategoryExpanded, setIsDrawerCategoryExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryName: string) => {
    if (onFilterByCategory) {
      onFilterByCategory(categoryName);
    } else {
      setCurrentPage('products');
    }
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compile list of categories (merging defaults with props)
  const categoryNames = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...(categories || []).map((c) => c.name),
    ])
  );

  return (
    <header
      className={`sticky top-0 z-40 bg-[#FAF8F5] border-b border-[#E8E4DE] transition-all duration-300 ${
        isScrolled ? 'shadow-luxury py-3' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Menu Drawer Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-[#121212] hover:text-[#F4C430] cursor-pointer transition-colors flex items-center gap-2 group"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
              <span className="hidden sm:inline-block text-xs uppercase font-bold tracking-widest text-[#121212] group-hover:text-[#F4C430]">
                Menu
              </span>
            </button>
          </div>

          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <img
              src="https://i.ibb.co/R44hvCjc/Chat-GPT-Image-Aug-5-2026-11-41-48-PM.png"
              alt="Ella's Fashion Concept Logo"
              referrerPolicy="no-referrer"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 rounded-md"
            />
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#F4C430] transition-colors duration-300 block leading-none">
                Ella's
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C8275] group-hover:text-[#121212] transition-colors duration-300 block mt-0.5 font-sans font-medium">
                Fashion Concept
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links including Category Dropdown */}
          <nav className="hidden lg:flex items-center space-x-7">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors ${
                currentPage === 'home' ? 'text-[#F4C430]' : 'text-[#121212] hover:text-[#F4C430]'
              }`}
            >
              Home
            </button>

            {/* CATEGORIES DROPDOWN MENU */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                className={`text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors flex items-center gap-1 py-1 ${
                  isCategoryDropdownOpen ? 'text-[#F4C430]' : 'text-[#121212] hover:text-[#F4C430]'
                }`}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCategoryDropdownOpen ? 'rotate-180 text-[#F4C430]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-60 bg-[#FAF8F5] rounded-2xl border border-[#E8E4DE] shadow-2xl py-3 z-50 overflow-hidden backdrop-blur-md"
                  >
                    <div className="px-4 py-1.5 border-b border-[#E8E4DE] text-[10px] uppercase tracking-widest text-[#8C8275] font-bold">
                      Shop By Clothing Type
                    </div>

                    <div className="py-1">
                      {categoryNames.map((catName) => (
                        <button
                          key={catName}
                          onClick={() => handleCategorySelect(catName)}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#121212] hover:bg-[#E8E4DE]/50 hover:text-[#F4C430] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <span>{catName}</span>
                          <span className="text-[10px] text-[#8C8275] group-hover:text-[#F4C430] uppercase">
                            View
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-[#E8E4DE] pt-1 mt-1 px-4 py-1.5">
                      <button
                        onClick={() => handleNavClick('products')}
                        className="w-full text-center py-2 bg-[#121212] hover:bg-[#F4C430] text-white hover:text-black font-bold text-[10px] uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                      >
                        All Clothes ({categoryNames.length})
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleNavClick('products')}
              className={`text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors ${
                currentPage === 'products' ? 'text-[#F4C430]' : 'text-[#121212] hover:text-[#F4C430]'
              }`}
            >
              Products
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors ${
                currentPage === 'about' ? 'text-[#F4C430]' : 'text-[#121212] hover:text-[#F4C430]'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors ${
                currentPage === 'contact' ? 'text-[#F4C430]' : 'text-[#121212] hover:text-[#F4C430]'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#121212] hover:text-[#F4C430] cursor-pointer transition-colors duration-200 rounded-full"
              title="Search Collections"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleNavClick('products')}
              className="hidden sm:flex p-2 text-[#121212] hover:text-[#F4C430] cursor-pointer transition-colors duration-200 rounded-full relative"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#F4C430] rounded-full" />
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-[#121212] hover:text-[#F4C430] cursor-pointer transition-colors duration-200 rounded-full relative flex items-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F4C430] text-black font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF8F5] shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Out Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#FAF8F5] text-[#121212] z-50 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto border-r border-[#E8E4DE]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#E8E4DE] pb-5 mb-6">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://i.ibb.co/R44hvCjc/Chat-GPT-Image-Aug-5-2026-11-41-48-PM.png"
                      alt="Ella's Fashion Concept Logo"
                      referrerPolicy="no-referrer"
                      className="h-10 w-auto object-contain rounded-md"
                    />
                    <div>
                      <span className="font-serif text-lg font-bold text-[#F4C430] block leading-none">
                        Ella's
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-[#121212] font-bold block mt-0.5">
                        Fashion Concept
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[#121212] hover:text-[#F4C430] transition-colors rounded-full hover:bg-[#E8E4DE]/50 cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-3">
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`block w-full text-left text-lg font-bold tracking-wide transition-colors py-2.5 px-4 rounded-xl cursor-pointer ${
                      currentPage === 'home'
                        ? 'text-[#F4C430] bg-[#121212] font-bold shadow-md'
                        : 'text-[#121212] hover:bg-[#E8E4DE]/60 hover:text-[#F4C430]'
                    }`}
                  >
                    Home
                  </button>

                  {/* Categories Accordion inside Drawer */}
                  <div className="border-y border-[#E8E4DE] py-3 my-2">
                    <button
                      onClick={() => setIsDrawerCategoryExpanded(!isDrawerCategoryExpanded)}
                      className="w-full flex items-center justify-between text-lg font-bold text-[#121212] hover:text-[#F4C430] transition-colors py-2 px-3 rounded-xl hover:bg-[#E8E4DE]/60 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        Categories
                        <span className="text-[11px] bg-[#121212] text-[#F4C430] px-2.5 py-0.5 rounded-full font-bold">
                          {categoryNames.length}
                        </span>
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#F4C430] transition-transform duration-200 ${
                          isDrawerCategoryExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isDrawerCategoryExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3 pt-2 space-y-1.5 border-l-2 border-[#F4C430] mt-2 ml-3"
                        >
                          {categoryNames.map((catName) => (
                            <button
                              key={catName}
                              onClick={() => handleCategorySelect(catName)}
                              className="block w-full text-left text-sm text-[#121212] font-semibold hover:text-[#F4C430] hover:bg-[#E8E4DE]/50 py-2 px-3 rounded-lg cursor-pointer transition-colors"
                            >
                              • {catName}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={() => handleNavClick('products')}
                    className={`block w-full text-left text-lg font-bold tracking-wide transition-colors py-2.5 px-4 rounded-xl cursor-pointer ${
                      currentPage === 'products'
                        ? 'text-[#F4C430] bg-[#121212] font-bold shadow-md'
                        : 'text-[#121212] hover:bg-[#E8E4DE]/60 hover:text-[#F4C430]'
                    }`}
                  >
                    Products
                  </button>

                  <button
                    onClick={() => handleNavClick('about')}
                    className={`block w-full text-left text-lg font-bold tracking-wide transition-colors py-2.5 px-4 rounded-xl cursor-pointer ${
                      currentPage === 'about'
                        ? 'text-[#F4C430] bg-[#121212] font-bold shadow-md'
                        : 'text-[#121212] hover:bg-[#E8E4DE]/60 hover:text-[#F4C430]'
                    }`}
                  >
                    About Us
                  </button>

                  <button
                    onClick={() => handleNavClick('contact')}
                    className={`block w-full text-left text-lg font-bold tracking-wide transition-colors py-2.5 px-4 rounded-xl cursor-pointer ${
                      currentPage === 'contact'
                        ? 'text-[#F4C430] bg-[#121212] font-bold shadow-md'
                        : 'text-[#121212] hover:bg-[#E8E4DE]/60 hover:text-[#F4C430]'
                    }`}
                  >
                    Contact Us
                  </button>

                  <button
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-lg font-bold text-[#121212] hover:text-[#F4C430] hover:bg-[#E8E4DE]/60 transition-colors py-2.5 px-4 rounded-xl cursor-pointer"
                  >
                    Cart ({totalItems})
                  </button>
                </nav>
              </div>

              <div className="border-t border-[#E8E4DE] pt-6 space-y-2 text-xs text-[#555555] mt-8">
                <p className="text-sm text-[#121212] font-bold">Ella's Fashion Concept</p>
                <p>Leventis Bus Stop Army Contonment Maryland, Ikeja, Lagos State.</p>
                <p className="text-[#121212] font-semibold">09121252258</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
