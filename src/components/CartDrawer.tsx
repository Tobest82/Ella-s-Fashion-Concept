import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  setCurrentPage: (page: string) => void;
}

export const CartDrawer: React.FC<Props> = ({ setCurrentPage }) => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
  };

  const handleViewCartPage = () => {
    setIsCartOpen(false);
    setCurrentPage('cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FAF8F5] z-50 shadow-2xl flex flex-col justify-between border-l border-[#E8E4DE]"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#E8E4DE] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#F4C430]" />
                <h3 className="font-serif text-xl font-bold text-[#121212]">
                  Your Bag ({totalItems})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#8C8275] hover:text-[#121212] transition-colors rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white border border-[#E8E4DE] flex items-center justify-center text-[#8C8275]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#121212]">Your shopping bag is empty</h4>
                  <p className="text-xs text-[#8C8275] max-w-xs leading-relaxed">
                    Explore our dresses, outfits, and beautiful clothing made just for you.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setCurrentPage('products');
                    }}
                    className="px-6 py-3 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-black transition-all"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                cart.map((item, index) => {
                  const price = item.product.discount_price ?? item.product.price;
                  return (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${index}`}
                      className="bg-white p-3.5 rounded-xl border border-[#E8E4DE] flex gap-3 shadow-sm relative group"
                    >
                      <div className="w-20 h-24 bg-[#FAF8F5] rounded-lg overflow-hidden shrink-0 border border-[#F0ECE6]">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="font-serif text-sm font-bold text-[#121212] line-clamp-1 pr-4">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(index)}
                              className="text-[#8C8275] hover:text-red-600 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[11px] text-[#8C8275] space-x-2 mt-0.5">
                            <span>Size: <strong className="text-[#121212]">{item.selectedSize}</strong></span>
                            <span>•</span>
                            <span>Color: <strong className="text-[#121212]">{item.selectedColor.name}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-[#E8E4DE] rounded-md bg-[#FAF8F5]">
                            <button
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs font-bold hover:bg-white transition-colors"
                            >
                              -
                            </button>
                            <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs font-bold hover:bg-white transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-sans font-bold text-sm text-[#121212]">
                            ₦{(price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-[#E8E4DE] bg-white space-y-4">
                <div className="space-y-1.5 text-xs text-[#524B42]">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span className="font-bold text-[#121212]">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fitting & Delivery</span>
                    <span className="text-emerald-700 font-medium">Calculated at Checkout</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#121212] pt-2 border-t border-[#F0ECE6]">
                    <span>Grand Total</span>
                    <span className="text-[#121212]">₦{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleViewCartPage}
                    className="w-full py-2.5 bg-white text-[#121212] border border-[#E8E4DE] font-semibold text-xs rounded-xl hover:bg-[#FAF8F5] transition-all"
                  >
                    View Detailed Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
