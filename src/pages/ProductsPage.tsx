import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Layers } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  initialCategory?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  categories,
  onSelectProduct,
  initialCategory = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cleanly by Category and optional Search Query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory) {
        const catNorm = selectedCategory.trim().toLowerCase();
        const pCatNorm = (p.category || '').trim().toLowerCase();
        
        let matchesCategory = pCatNorm === catNorm || pCatNorm.includes(catNorm) || catNorm.includes(pCatNorm);
        
        // Handle synonyms like Dresses <-> Gowns
        if (catNorm === 'dresses' && (pCatNorm === 'gowns' || pCatNorm.includes('dress') || pCatNorm.includes('gown'))) {
          matchesCategory = true;
        }
        if (catNorm === 'two-piece sets' && (pCatNorm.includes('two-piece') || pCatNorm.includes('set') || pCatNorm.includes('suit'))) {
          matchesCategory = true;
        }

        if (!matchesCategory) return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-[#E8E4DE] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F4C430] flex items-center gap-1.5 mb-1">
            <Layers className="w-4 h-4" />
            Bespoke Fashion Collections
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#121212]">
            Women's Clothes & Dresses
          </h1>
          <p className="text-xs text-[#8C8275] mt-1">
            Showing {filteredProducts.length} beautiful items
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clothes..."
            className="w-full bg-white border border-[#E8E4DE] rounded-xl px-4 py-2.5 text-xs text-[#121212] pl-10 focus:outline-none focus:border-[#F4C430] shadow-sm"
          />
          <Search className="w-4 h-4 text-[#8C8275] absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Prominent Category Navigation Bar */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-[#8C8275] block">
          Select Collection Category:
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
              selectedCategory === ''
                ? 'bg-[#121212] text-[#F4C430] ring-2 ring-[#F4C430]/40 scale-105'
                : 'bg-white text-[#524B42] hover:text-[#F4C430] hover:border-[#F4C430] border border-[#E8E4DE]'
            }`}
          >
            All Clothes ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
                  isSelected
                    ? 'bg-[#121212] text-[#F4C430] ring-2 ring-[#F4C430]/40 scale-105'
                    : 'bg-white text-[#524B42] hover:text-[#F4C430] hover:border-[#F4C430] border border-[#E8E4DE]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid Area */}
      <div>
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E8E4DE] p-12 text-center space-y-4 shadow-luxury">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E4DE] flex items-center justify-center text-[#8C8275] mx-auto">
              <Sparkles className="w-8 h-8 text-[#F4C430]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#121212]">No clothes found in this category</h3>
            <p className="text-xs text-[#8C8275] max-w-sm mx-auto">
              Select another category above or search for different terms.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#121212] text-[#F4C430] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-all shadow-md"
            >
              Show All Clothes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
