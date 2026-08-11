import React, { useState } from 'react';
import { X, ShoppingBag, Heart, Star, Check, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const currentSize = selectedSize || product.sizes[0] || 'M';
  const currentColor = selectedColor || product.colors[0] || { name: 'Gold', hex: '#F4C430' };
  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  const handleAddToCart = () => {
    addToCart(product, currentSize, currentColor, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 border border-[#E8E4DE]"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#121212] shadow-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-[#FAF8F5] rounded-xl overflow-hidden border border-[#E8E4DE] relative">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === idx ? 'border-[#F4C430] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8C8275] font-semibold block mb-1">
                  {product.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#121212]">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs text-[#524B42]">
                    <Star className="w-4 h-4 text-[#F4C430] fill-current" />
                    <span className="font-bold">{product.rating.toFixed(1)}</span>
                    <span className="text-[#8C8275]">({product.review_count} client reviews)</span>
                  </div>
                  <span className="text-[#E8E4DE]">|</span>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    In Stock ({product.stock} left)
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="font-sans font-bold text-2xl text-[#121212]">
                        ₦{product.discount_price?.toLocaleString()}
                      </span>
                      <span className="font-sans text-base text-[#8C8275] line-through">
                        ₦{product.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="font-sans font-bold text-2xl text-[#121212]">
                      ₦{product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm text-[#524B42] leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-5 pt-4 border-t border-[#F0ECE6]">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#E8E4DE] rounded-lg bg-[#FAF8F5]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-sm font-bold hover:bg-white transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-sm font-bold hover:bg-white transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-lg border transition-colors ${
                      inWishlist ? 'bg-red-50 border-red-200 text-red-600' : 'border-[#E8E4DE] text-[#121212] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-xl ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#121212] text-[#F4C430] hover:bg-black hover:shadow-gold/20'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Shopping Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to Bag — ₦{((hasDiscount ? product.discount_price! : product.price) * quantity).toLocaleString()}
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#524B42] pt-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#F4C430]" />
                    Guaranteed Custom Fit
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#F4C430]" />
                    Express Nationwide Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
