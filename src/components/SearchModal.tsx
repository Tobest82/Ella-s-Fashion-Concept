import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<Props> = ({ isOpen, onClose, products, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase().trim();
      const matches = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
      setFilteredResults(matches);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-10 border border-[#E8E4DE]"
        >
          {/* Header Input */}
          <div className="relative flex items-center border-b border-[#E8E4DE] pb-4">
            <Search className="w-6 h-6 text-[#F4C430] shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gowns, blazers, jumpsuits, or custom wear..."
              className="w-full bg-transparent text-lg font-serif text-[#121212] focus:outline-none placeholder:text-[#8C8275]"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-[#8C8275] hover:text-[#121212]"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={onClose} className="p-1 text-[#8C8275] hover:text-[#121212]">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Category Tags when query is empty */}
          {!query && (
            <div className="py-6 space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#8C8275] font-semibold block">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Gowns',
                  'Tops',
                  'Skirts',
                  'Trousers',
                  'Two-Piece Sets',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#FAF8F5] text-[#524B42] hover:bg-[#121212] hover:text-[#F4C430] border border-[#E8E4DE] transition-all flex items-center gap-1.5"
                  >
                    <Tag className="w-3 h-3 text-[#F4C430]" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && (
            <div className="max-h-96 overflow-y-auto mt-4 space-y-3">
              {filteredResults.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#8C8275]">
                  No bespoke clothing matching "{query}". Try searching for gowns or suits.
                </div>
              ) : (
                filteredResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-[#FAF8F5] transition-colors cursor-pointer group border border-transparent hover:border-[#E8E4DE]"
                  >
                    <div className="w-14 h-16 bg-[#F0ECE6] rounded-lg overflow-hidden shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] uppercase font-bold text-[#F4C430] tracking-wider block">
                        {product.category}
                      </span>
                      <h4 className="font-serif text-base font-bold text-[#121212] group-hover:text-[#F4C430] transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-xs font-bold text-[#524B42]">
                        ₦{(product.discount_price ?? product.price).toLocaleString()}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8C8275] group-hover:text-[#F4C430] group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
