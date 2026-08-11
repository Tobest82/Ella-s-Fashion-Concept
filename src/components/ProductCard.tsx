import React, { useState } from 'react';
import { Eye, ShoppingBag, Heart, Star, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useCart();
  const [added, setAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0] || { name: 'Gold', hex: '#F4C430' };
    addToCart(product, defaultSize, defaultColor, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-xl border border-[#E8E4DE] overflow-hidden shadow-luxury shadow-luxury-hover cursor-pointer flex flex-col justify-between relative"
    >
      {/* Top Image Box */}
      <div className="relative aspect-[3/4] bg-[#FAF8F5] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_bestseller && (
            <span className="bg-[#121212] text-[#F4C430] font-sans text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border border-[#F4C430]/30 shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#F4C430]" />
              Best Seller
            </span>
          )}
          {product.is_new_arrival && (
            <span className="bg-[#F4C430] text-black font-sans text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-md">
              New Arrival
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-700 text-white font-sans text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-md">
              Offer
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md cursor-pointer transition-all z-10 ${
            inWishlist
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 text-[#121212] hover:bg-[#121212] hover:text-[#F4C430]'
          }`}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Permanently Attached Action Overlay */}
        <div className="absolute inset-x-2.5 bottom-2.5 flex items-center gap-1.5 z-10">
          <button
            onClick={handleQuickView}
            className="flex-1 bg-white/95 text-[#121212] hover:bg-[#121212] hover:text-[#F4C430] font-bold text-[11px] py-2 px-1.5 rounded-lg backdrop-blur-md cursor-pointer transition-all shadow-md flex items-center justify-center gap-1 border border-[#E8E4DE]"
          >
            <Eye className="w-3.5 h-3.5 text-[#121212]" />
            Quick View
          </button>
          <button
            onClick={handleQuickAdd}
            className={`flex-1 font-bold text-[11px] py-2 px-1.5 rounded-lg backdrop-blur-md cursor-pointer transition-all shadow-md flex items-center justify-center gap-1 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#121212] text-[#F4C430] hover:bg-black hover:text-[#F4C430]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#F4C430]" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#8C8275] font-semibold block mb-1">
            {product.category}
          </span>
          <h3 className="font-serif text-lg font-bold text-[#121212] group-hover:text-[#F4C430] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 pt-3 border-t border-[#F0ECE6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="font-sans font-bold text-base text-[#121212]">
                  ₦{product.discount_price?.toLocaleString()}
                </span>
                <span className="font-sans text-xs text-[#8C8275] line-through">
                  ₦{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-sans font-bold text-base text-[#121212]">
                ₦{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center text-xs text-[#524B42] gap-1">
            <Star className="w-3.5 h-3.5 text-[#F4C430] fill-current" />
            <span className="font-semibold text-xs">{product.rating.toFixed(1)}</span>
            <span className="text-[#8C8275]">({product.review_count})</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
