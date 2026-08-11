import React from 'react';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  setCurrentPage: (page: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ setCurrentPage }) => {
  const { cart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-white border border-[#E8E4DE] rounded-full flex items-center justify-center text-[#8C8275] mx-auto shadow-luxury">
          <ShoppingBag className="w-10 h-10 text-[#F4C430]" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#121212]">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-[#8C8275] max-w-sm mx-auto leading-relaxed">
          Discover our bespoke dresses, gowns, and tailored suits crafted specifically for high-class occasions.
        </p>
        <button
          onClick={() => setCurrentPage('products')}
          className="px-8 py-3.5 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl"
        >
          Explore Collections
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#E8E4DE] pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F4C430]">
            Your Selected Pieces
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#121212] mt-1">
            Shopping Bag ({totalItems})
          </h1>
        </div>

        <button
          onClick={() => setCurrentPage('products')}
          className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8C8275] hover:text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => {
            const price = item.product.discount_price ?? item.product.price;
            return (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${index}`}
                className="bg-white p-5 rounded-2xl border border-[#E8E4DE] shadow-luxury flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-28 bg-[#FAF8F5] rounded-xl overflow-hidden shrink-0 border border-[#F0ECE6]">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#F4C430] tracking-wider block">
                      {item.product.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#121212]">
                      {item.product.name}
                    </h3>
                    <div className="text-xs text-[#8C8275] space-x-3">
                      <span>Size: <strong className="text-[#121212]">{item.selectedSize}</strong></span>
                      <span>Color: <strong className="text-[#121212]">{item.selectedColor.name}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-[#F0ECE6]">
                  <span className="font-sans font-bold text-lg text-[#121212]">
                    ₦{(price * item.quantity).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#E8E4DE] rounded-lg bg-[#FAF8F5]">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs font-bold hover:bg-white transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs font-bold hover:bg-white transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="p-2 text-[#8C8275] hover:text-red-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Box */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DE] shadow-luxury space-y-6 h-fit">
          <h3 className="font-serif text-xl font-bold text-[#121212] border-b border-[#F0ECE6] pb-4">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs text-[#524B42]">
            <div className="flex justify-between">
              <span>Bag Subtotal</span>
              <span className="font-bold text-[#121212]">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Bespoke Fitting & Delivery</span>
              <span className="text-emerald-700 font-semibold">Calculated at Checkout</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#121212] pt-4 border-t border-[#F0ECE6]">
              <span>Grand Total</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('checkout')}
            className="w-full py-4 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-[#8C8275] justify-center pt-2">
            <ShieldCheck className="w-4 h-4 text-[#F4C430]" />
            Direct WhatsApp Order Confirmation
          </div>
        </div>
      </div>
    </div>
  );
};
