import React, { useState } from 'react';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Star, ShieldCheck, Truck, Scissors, ShoppingBag, Heart, ArrowLeft, MessageSquare, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { store } from '../services/store';

interface ProductDetailsPageProps {
  product: Product;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onBack: () => void;
  setCurrentPage: (page: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  allProducts,
  onSelectProduct,
  onBack,
  setCurrentPage,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    product.colors[0] || { name: 'Gold', hex: '#F4C430' }
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(() => store.getReviews().filter(r => r.product_id === product.id && r.is_approved));
  const [newReviewer, setNewReviewer] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const activePrice = hasDiscount ? product.discount_price! : product.price;

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setCurrentPage('checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewer || !newComment) return;

    const res = await store.addReview({
      product_id: product.id,
      product_name: product.name,
      customer_name: newReviewer,
      rating: newRating,
      comment: newComment,
    });

    const addedRev = res.review;

    setReviews(prev => [addedRev, ...prev]);
    setNewReviewer('');
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8C8275] hover:text-[#121212] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </button>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <div className="space-y-4 sticky top-24">
          <div className="aspect-[3/4] bg-white rounded-2xl overflow-hidden border border-[#E8E4DE] shadow-luxury relative img-zoom">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {product.is_bestseller && (
              <span className="absolute top-4 left-4 bg-[#121212] text-[#F4C430] text-xs font-bold uppercase px-3 py-1 rounded-md shadow-lg border border-[#F4C430]/30">
                Best Seller
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-[#F4C430] scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Options */}
        <div className="space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F4C430] block mb-1">
              {product.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#121212]">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-sm text-[#524B42]">
                <Star className="w-4 h-4 text-[#F4C430] fill-current" />
                <span className="font-bold">{product.rating.toFixed(1)}</span>
                <span className="text-[#8C8275]">({reviews.length} reviews)</span>
              </div>
              <span className="text-[#E8E4DE]">|</span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                Stock Available ({product.stock} left)
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-4">
              {hasDiscount ? (
                <>
                  <span className="font-sans font-bold text-3xl sm:text-4xl text-[#121212]">
                    ₦{product.discount_price?.toLocaleString()}
                  </span>
                  <span className="font-sans text-lg text-[#8C8275] line-through">
                    ₦{product.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="font-sans font-bold text-3xl sm:text-4xl text-[#121212]">
                  ₦{product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-[#E8E4DE] pt-6 space-y-6">
            <p className="text-sm text-[#524B42] leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#121212]">
                <span>Select Dress Size: <span className="text-[#F4C430]">{selectedSize}</span></span>
                <span className="text-[#8C8275] hover:underline cursor-pointer">Bespoke Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                      selectedSize === size
                        ? 'bg-[#121212] text-[#F4C430] border-[#121212] shadow-md'
                        : 'bg-white text-[#121212] border-[#E8E4DE] hover:border-[#F4C430]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#121212] block">
                Select Color Variant: <span className="text-[#F4C430]">{selectedColor.name}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col)}
                    className={`p-1 rounded-full border-2 transition-all ${
                      selectedColor.name === col.name
                        ? 'border-[#F4C430] scale-110 shadow-md'
                        : 'border-transparent hover:scale-105'
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-full block border border-black/10"
                      style={{ backgroundColor: col.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#E8E4DE] rounded-xl bg-[#FAF8F5] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 text-base font-bold hover:bg-white rounded-lg transition-colors flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 text-base font-bold hover:bg-white rounded-lg transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition-colors ${
                  inWishlist
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-[#E8E4DE] text-[#121212] hover:bg-[#FAF8F5]'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`py-4 rounded-xl font-bold text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-xl ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#121212] text-[#F4C430] hover:bg-black'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added To Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Add to Bag — ₦{(activePrice * quantity).toLocaleString()}
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-4 bg-[#F4C430] text-black font-bold text-xs uppercase tracking-[0.15em] rounded-xl hover:bg-[#d8a81d] transition-all shadow-xl flex items-center justify-center gap-2"
              >
                Buy Now (WhatsApp Order)
              </button>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-3 gap-2 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E4DE] text-center text-[11px] text-[#524B42]">
              <div className="space-y-1">
                <Scissors className="w-4 h-4 text-[#F4C430] mx-auto" />
                <span className="block font-semibold">Custom Sewn</span>
              </div>
              <div className="space-y-1 border-x border-[#E8E4DE]">
                <Truck className="w-4 h-4 text-[#F4C430] mx-auto" />
                <span className="block font-semibold">Fast Delivery</span>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#F4C430] mx-auto" />
                <span className="block font-semibold">Fit Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Client Feedback Section */}
      <section className="bg-white rounded-3xl p-8 border border-[#E8E4DE] shadow-luxury space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0ECE6] pb-6">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#121212]">
              Client Reviews & Testimonials
            </h3>
            <p className="text-xs text-[#8C8275] mt-1">
              Read feedback from ladies who have worn this bespoke design
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FAF8F5] px-4 py-2 rounded-xl border border-[#E8E4DE]">
            <Star className="w-5 h-5 text-[#F4C430] fill-current" />
            <span className="font-serif text-2xl font-bold text-[#121212]">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-[#8C8275]">/ 5.0 Rating</span>
          </div>
        </div>

        {/* Review list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length === 0 ? (
            <p className="text-xs text-[#8C8275] col-span-2 italic">Be the first to leave a review for this dress!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E4DE] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-bold text-[#121212]">{rev.customer_name}</span>
                  <div className="flex items-center text-[#F4C430]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#524B42] leading-relaxed font-sans">{rev.comment}</p>
                <span className="text-[10px] text-[#8C8275] block">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8E4DE] space-y-4">
          <h4 className="font-serif text-xl font-bold text-[#121212] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#F4C430]" />
            Write a Client Review
          </h4>

          {reviewSubmitted && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Thank you! Your review has been added.
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#121212] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReviewer}
                  onChange={(e) => setNewReviewer(e.target.value)}
                  placeholder="e.g. Lady Cynthia E."
                  className="w-full bg-white border border-[#E8E4DE] rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#F4C430]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#121212] mb-1">Rating</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full bg-white border border-[#E8E4DE] rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#F4C430]"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">Your Feedback / Fitting Experience</label>
              <textarea
                required
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="How did the fabric feel? How was the fitting and stitching?"
                className="w-full bg-white border border-[#E8E4DE] rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#F4C430]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-all"
            >
              Submit Client Review
            </button>
          </form>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#F4C430]">
              You May Also Like
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#121212]">You May Also Adore</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
