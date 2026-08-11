import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { store } from '../services/store';
import { Order, OrderItem, SiteSettings } from '../types';
import { SuccessModal } from '../components/SuccessModal';
import { ShieldCheck, MessageCircle, ArrowLeft, Lock } from 'lucide-react';

interface CheckoutPageProps {
  settings: SiteSettings;
  setCurrentPage: (page: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ settings, setCurrentPage }) => {
  const { cart, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0 && !createdOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#121212]">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-[#8C8275]">Please add products to your cart before proceeding to checkout.</p>
        <button
          onClick={() => setCurrentPage('products')}
          className="px-6 py-3 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) return;

    setIsSubmitting(true);

    try {
      // Map cart items to order items
      const orderItems: OrderItem[] = cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.discount_price ?? item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor.name,
        image: item.product.images[0] || '',
      }));

      // Save order in local store and Supabase
      const result = await store.addOrder({
        customer_name: customerName,
        customer_phone: phone,
        delivery_address: address,
        notes: notes.trim() ? notes : undefined,
        total_amount: subtotal,
        items: orderItems,
      });

      const newOrder: Order = result.order;

      // Construct WhatsApp message immediately
      const productLines = orderItems
        .map(
          (item) =>
            `• ${item.product_name} × ${item.quantity} (${item.size}, ${item.color}) — ₦${(
              item.price * item.quantity
            ).toLocaleString()}`
        )
        .join('\n');

      const formattedMessage = `Hello Ella's Fashion Concept,

I have made an order from your website (Order #${newOrder.order_number}).

Customer Name:
${newOrder.customer_name}

Phone Number:
${newOrder.customer_phone}

Delivery Address:
${newOrder.delivery_address}${newOrder.notes ? `\n\nOrder Notes:\n${newOrder.notes}` : ''}

Products Ordered:
${productLines}

Grand Total:
₦${newOrder.total_amount.toLocaleString()}

Kindly confirm my order and get back to me. Thank you!`;

      // Build WhatsApp URL with the specified number 09121252258
      const rawWa = settings.whatsapp_number || '2349121252258';
      const cleanWaNum = rawWa.replace(/[^0-9]/g, '');
      const waNum = cleanWaNum.startsWith('0') ? '234' + cleanWaNum.slice(1) : cleanWaNum;
      const whatsappUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(formattedMessage)}`;

      // Set state to trigger success message modal on website (which auto-redirects to WhatsApp in 2s)
      setCreatedOrder(newOrder);
      clearCart();
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Modal Overlay */}
      {createdOrder && (
        <SuccessModal
          order={createdOrder}
          settings={settings}
          onClose={() => {
            setCreatedOrder(null);
            setCurrentPage('home');
          }}
        />
      )}

      <div className="border-b border-[#E8E4DE] pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F4C430]">
            Final Fitting Step
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#121212] mt-1">
            Bespoke Order Checkout
          </h1>
        </div>

        <button
          onClick={() => setCurrentPage('cart')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8C8275] hover:text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Checkout Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DE] shadow-luxury space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0ECE6] pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#121212]">
              Customer & Delivery Details
            </h2>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Direct WhatsApp Payment
            </span>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Chief Mrs. Folake Alakija"
                className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-3 text-sm text-[#121212] focus:outline-none focus:border-[#F4C430]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] mb-1.5">
                Phone / WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +234 801 234 5678"
                className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-3 text-sm text-[#121212] focus:outline-none focus:border-[#F4C430]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] mb-1.5">
                Delivery / Fitting Address <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, Estate, City, State"
                className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-3 text-sm text-[#121212] focus:outline-none focus:border-[#F4C430]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] mb-1.5">
                Custom Measurement / Order Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify waist, bust, length measurements or preferred delivery dates..."
                className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-3 text-sm text-[#121212] focus:outline-none focus:border-[#F4C430]"
              />
            </div>

            <div className="pt-4 border-t border-[#F0ECE6]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#25D366] text-white font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-2xl hover:shadow-emerald-500/20"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                {isSubmitting ? 'Saving Order...' : 'Place Order via WhatsApp'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Preview Box */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8E4DE] shadow-luxury space-y-6 h-fit">
          <h3 className="font-serif text-xl font-bold text-[#121212] border-b border-[#F0ECE6] pb-4">
            Items in Order ({cart.reduce((a, c) => a + c.quantity, 0)})
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {cart.map((item, idx) => {
              const price = item.product.discount_price ?? item.product.price;
              return (
                <div key={idx} className="flex items-center gap-3 text-xs border-b border-[#F0ECE6] pb-3">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-12 h-14 object-cover object-top rounded-lg bg-[#FAF8F5] border border-[#E8E4DE]"
                  />
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-[#121212] line-clamp-1">{item.product.name}</h4>
                    <p className="text-[#8C8275]">{item.selectedSize} • {item.selectedColor.name} × {item.quantity}</p>
                  </div>
                  <span className="font-bold text-[#121212]">₦{(price * item.quantity).toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 text-xs pt-2">
            <div className="flex justify-between font-bold text-base text-[#121212]">
              <span>Grand Total</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-[#8C8275] leading-relaxed">
              * Payment is completed securely via WhatsApp after confirming your exact measurement & delivery window.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#524B42] bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E4DE]">
            <ShieldCheck className="w-4 h-4 text-[#F4C430] shrink-0" />
            <span>Guaranteed satisfaction & custom fit accuracy.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
