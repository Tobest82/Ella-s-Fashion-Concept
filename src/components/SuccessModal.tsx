import React, { useEffect } from 'react';
import { Check, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, SiteSettings } from '../types';
import { motion } from 'motion/react';

interface Props {
  order: Order;
  settings: SiteSettings;
  onClose: () => void;
}

export const SuccessModal: React.FC<Props> = ({ order, settings, onClose }) => {
  useEffect(() => {
    // Fire confetti effect
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#F4C430', '#121212', '#25D366', '#ffffff'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Format message according to exact prompt requirement:
  const itemsList = order?.items || [];
  const productLines = itemsList
    .map(
      (item) =>
        `${item.product_name} × ${item.quantity} (${item.size}, ${item.color}) — ₦${(
          (item.price || 0) * (item.quantity || 1)
        ).toLocaleString()}`
    )
    .join('\n\n');

  const formattedMessage = `Hello Ella's Fashion Concept,

I have made an order from your website.

Kindly confirm my order and get back to me.

Customer Name:
${order?.customer_name || 'Valued Customer'}

Phone Number:
${order?.customer_phone || ''}

Delivery Address:
${order?.delivery_address || ''}${order?.notes ? `\n\nOrder Notes:\n${order.notes}` : ''}

Products Ordered:

${productLines}

Grand Total:
₦${(order?.total_amount || 0).toLocaleString()}

Thank you.`;

  const [timeLeft, setTimeLeft] = React.useState(1.0);

  const targetWaNumber = '2349121252258';
  const encodedMessage = encodeURIComponent(formattedMessage);
  const whatsappUrl = `https://wa.me/${targetWaNumber}?text=${encodedMessage}`;

  useEffect(() => {
    // 100ms interval for smooth 1.0s live countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, parseFloat((prev - 0.1).toFixed(1))));
    }, 100);

    // Auto open WhatsApp in a new tab/window after 1.0 second (1000 ms)
    const redirectTimer = setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimer);
    };
  }, [whatsappUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="bg-white rounded-3xl max-w-lg w-full p-8 text-center shadow-2xl border border-[#E8E4DE] relative overflow-hidden"
      >
        {/* Animated Green Checkmark Circle */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg"
          >
            <Check className="w-9 h-9 stroke-[3]" />
          </motion.div>
          <div className="absolute -top-1 -right-1 text-[#F4C430]">
            <Sparkles className="w-6 h-6 fill-current animate-bounce" />
          </div>
        </div>

        <h2 className="font-serif text-3xl font-bold text-[#121212] mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-xs text-[#8C8275] uppercase tracking-widest font-semibold mb-4">
          Order ID: <span className="text-[#121212]">{order.order_number}</span>
        </p>

        <p className="text-sm text-[#524B42] leading-relaxed mb-4">
          Thank you, <strong>{order.customer_name}</strong>! Your order has been placed.
        </p>

        {/* Whatsapp Countdown Banner */}
        <div className="bg-[#E8F8EE] border border-[#25D366]/40 p-3.5 rounded-2xl mb-6 flex items-center justify-center gap-2.5 text-[#0f5128] text-xs font-bold shadow-sm">
          <MessageCircle className="w-5 h-5 text-[#25D366] fill-current animate-pulse shrink-0" />
          <span>
            Opening WhatsApp (09121252258) in {timeLeft.toFixed(1)}s...
          </span>
        </div>

        {/* Whatsapp Quick Action Box */}
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E4DE] mb-6 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-[#121212]">
            <span>Total Payable</span>
            <span className="text-base text-[#121212]">₦{order.total_amount.toLocaleString()}</span>
          </div>
          <p className="text-[#8C8275]">
            If WhatsApp doesn't open automatically, click the button below:
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-4 bg-[#25D366] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-[#20bd5a] cursor-pointer transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-emerald-500/20"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            Complete Order on WhatsApp
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="w-full py-3 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md"
          >
            Close 
          </button>

          <button
            onClick={onClose}
            className="text-xs text-[#8C8275] hover:text-[#121212] cursor-pointer transition-colors block mx-auto pt-2"
          >
            Return to Store
          </button>
        </div>
      </motion.div>
    </div>
  );
};
