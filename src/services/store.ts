import { Product, Category, Order, ContactMessage, Review, SiteSettings } from '../types';
import heroFabricsImg from '../assets/images/african_fabrics_hero_1785971052971.jpg';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3f) | 0x80;
    return v.toString(16);
  });
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: "Bespoke Emerald Velvet Corset Gown",
    description: "Handcrafted from rich midnight velvet with an internal structured corset and cascading draped skirt. Designed for galas and high-profile evening events.",
    category: "Gowns",
    price: 125000,
    discount_price: 105000,
    images: ["https://i.ibb.co/WpPm1kWk/38210296835878190.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "Custom Tailored"],
    colors: [
      { name: "Emerald Green", hex: "#064e3b" },
      { name: "Gold", hex: "#F4C430" },
      { name: "Onyx Black", hex: "#121212" }
    ],
    stock: 8,
    rating: 4.9,
    review_count: 18,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: "Calli Two-Piece Tailored Set",
    description: "Masterclass executive two-piece tailoring. Sharp lapels, hand-stitched detailing, and feminine contour silhouette.",
    category: "Two-Piece Sets",
    price: 95000,
    images: ["https://i.ibb.co/FNWXfyZ/THEVINE-APPARELS-on-Instagram-CALLI-2-piece.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sovereign Gold", hex: "#F4C430" },
      { name: "Ivory White", hex: "#ffffff" }
    ],
    stock: 12,
    rating: 4.8,
    review_count: 14,
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: "Geometric Print Notch-Neck Maxi Gown",
    description: "Bohemian geometric printed silk chiffon maxi gown with notch neck and batwing sleeves.",
    category: "Gowns",
    price: 75000,
    images: ["https://i.ibb.co/dwZ5RS67/Plus-Size-Vakantie-Casual-Cadeau-Geometrische-Print-Notch-Neck-Vleermuismouwen-Jurk-Bohemen-Damesjur.jpg"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [{ name: "Multicolor Print", hex: "#d97706" }],
    stock: 10,
    rating: 4.7,
    review_count: 9,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: "Pink Floral & Birds Bowknot V-Neck Silk Gown",
    description: "Ethereal blush pink V-neck gown featuring romantic flora and fauna motif with front bowknot detailing.",
    category: "Gowns",
    price: 88000,
    discount_price: 78000,
    images: ["https://i.ibb.co/DHTPfhdr/PINK-FLOWERS-AND-BIRDS-BOWKNOT-V-NECK-DRESS-35-99-Only.jpg"],
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Blush Pink", hex: "#fbcfe8" }],
    stock: 7,
    rating: 5.0,
    review_count: 22,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: "Luxe Sculpted Corset Ball Gown",
    description: "High-couture sculpted corset ball gown featuring internal boning and dramatic floor-sweeping silhouette.",
    category: "Gowns",
    price: 145000,
    discount_price: 130000,
    images: ["https://i.ibb.co/0pwwRfDC/68187381856540950.jpg"],
    sizes: ["XS", "S", "M", "L", "Custom Tailored"],
    colors: [{ name: "Royal Midnight", hex: "#0f172a" }],
    stock: 5,
    rating: 4.9,
    review_count: 15,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: "Elegance Layered Silk Ensemble Set",
    description: "Sophisticated multi-layered silk co-ord ensemble tailored for red carpet receptions.",
    category: "Two-Piece Sets",
    price: 92000,
    images: ["https://i.ibb.co/xqfCrL6s/22095854416818228.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Cream Satin", hex: "#fef3c7" }],
    stock: 11,
    rating: 4.8,
    review_count: 13,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: "Cruise Essentials Favorite Two-Piece Set",
    description: "Lightweight resort pleated trouser and top two-piece set for summer vacations and cruises.",
    category: "Two-Piece Sets",
    price: 85000,
    images: ["https://i.ibb.co/wF2SGYS3/Life-Well-Cruised-Cruise-Essentials-Favorite.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Ocean Blue", hex: "#0284c7" }],
    stock: 9,
    rating: 4.7,
    review_count: 10,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: "Yellow Sunflower Halter Two-Piece Set",
    description: "Vibrant 1950s inspired sunflower floral print halter crop top and high-waisted shorts set.",
    category: "Two-Piece Sets",
    price: 68000,
    images: ["https://i.ibb.co/p6XFwbWn/Pre-Sale-Yellow-1950s-Sunflower-Halter-Romper.jpg"],
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Sunflower Yellow", hex: "#F4C430" }],
    stock: 14,
    rating: 4.9,
    review_count: 17,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-9',
    name: "Classy Short Ankara Print Couture Gown",
    description: "Authentic short Ankara print fashion gown with structured feminine waistline.",
    category: "Gowns",
    price: 65000,
    images: ["https://i.ibb.co/W4ntnTzb/Short-Ankara-Dress-Ankara-Fashion-Wears-african-Fashion-Wears-classy-Ankara-Gown-simple-Ankara-Gown.jpg"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [{ name: "Ankara Motif", hex: "#b45309" }],
    stock: 12,
    rating: 4.9,
    review_count: 24,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-10',
    name: "Summer Tropical Gradient Print V-Neck Gown",
    description: "Breathtaking white and ocean gradient tropical print V-neck holiday maxi gown.",
    category: "Gowns",
    price: 82000,
    images: ["https://i.ibb.co/RTzc2cYD/Women-s-Plus-Size-White-Summer-Tropical-Bachelorette-Party-Festa-Holiday-Gradient-Print-V-Neck-Dress.jpg"],
    sizes: ["M", "L", "XL", "2XL"],
    colors: [{ name: "Tropical Cyan", hex: "#06b6d4" }],
    stock: 8,
    rating: 4.8,
    review_count: 11,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-11',
    name: "Contemporary Tailored Peplum Top",
    description: "Sleek tailored peplum blouse with gold button trim and high structural collar.",
    category: "Tops",
    price: 55000,
    images: ["https://i.ibb.co/7xP5w5Gm/Martes-de-RENOVAR-TU-ESTILO-Desliza-y-elige-tu.jpg"],
    sizes: ["S", "M", "L"],
    colors: [{ name: "Emerald", hex: "#064e3b" }],
    stock: 15,
    rating: 4.7,
    review_count: 8,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-12',
    name: "Structured Colorblock Luxury Top",
    description: "High-contrast architectural colorblock blouse designed to empower executive presence.",
    category: "Tops",
    price: 58000,
    images: ["https://i.ibb.co/ZpbZLPnG/Color-that-speaks-before-you-do-structure-that.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Sovereign Gold & Black", hex: "#121212" }],
    stock: 10,
    rating: 4.8,
    review_count: 12,
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-13',
    name: "Couture Draped Satin Corset Gown",
    description: "Floor-length cowl neck satin dress with corset waist and thigh-high side slash.",
    category: "Gowns",
    price: 135000,
    images: ["https://i.ibb.co/gLWcVSBJ/859765385148635768.jpg"],
    sizes: ["XS", "S", "M", "L", "Custom Tailored"],
    colors: [{ name: "Bronze Gold", hex: "#b45309" }],
    stock: 6,
    rating: 5.0,
    review_count: 19,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-14',
    name: "Bespoke Royal High-Waisted Skirt",
    description: "Tailored high-waisted pencil skirt with structured waist pleats and gold accent zip.",
    category: "Skirts",
    price: 62000,
    images: ["https://i.ibb.co/Y7fbW3Nz/Instagram.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Noir Black", hex: "#000000" }],
    stock: 13,
    rating: 4.6,
    review_count: 14,
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-15',
    name: "Romantic Crimson Passion Evening Gown",
    description: "Sensual deep red evening gown with structured V neckline and delicate draped back.",
    category: "Gowns",
    price: 110000,
    discount_price: 95000,
    images: ["https://i.ibb.co/DDvd3yrj/Elegant-Romantic-and-Sexy-Red-Dress-2026-Dress-Under-50.jpg"],
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Crimson Red", hex: "#991b1b" }],
    stock: 7,
    rating: 4.9,
    review_count: 21,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-16',
    name: "Pink Vintage Plaid Off-Shoulder Gown",
    description: "Retro 1950s inspired plaid cotton off-shoulder swing dress with full A-line skirt.",
    category: "Gowns",
    price: 72000,
    images: ["https://i.ibb.co/3yT03HwC/Pink-1950s-Plaid-Cotton-Off-Shoulder-Dress.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Plaid Pink", hex: "#f472b6" }],
    stock: 9,
    rating: 4.7,
    review_count: 10,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-17',
    name: "On-The-Go Luxury Fleece Pant Set",
    description: "Ultra-plush fleece hoodie and tailored sweatpants set for casual luxury travel.",
    category: "Two-Piece Sets",
    price: 78000,
    images: ["https://i.ibb.co/MD2Qn8f8/On-The-Go-Fleece-Pant-Set-Fashion-Nova.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Oatmeal Beige", hex: "#d6d3d1" }],
    stock: 15,
    rating: 4.8,
    review_count: 16,
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-18',
    name: "Lace Embellished Nude Trousers Set",
    description: "Sheer lace overlaid long sleeve top paired with tailored nude contour trousers.",
    category: "Trousers",
    price: 85000,
    images: ["https://i.ibb.co/F4kVDgs0/ROTITA-Skin-Color-Long-Round-Neck-Lace-Jumpsuit.jpg"],
    sizes: ["S", "M", "L"],
    colors: [{ name: "Nude Skin", hex: "#fde047" }],
    stock: 8,
    rating: 4.7,
    review_count: 7,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-19',
    name: "Green Vintage Colorblock Long-Sleeve Gown",
    description: "Khaki green and olive vintage colorblock long sleeve button front midi dress.",
    category: "Gowns",
    price: 79000,
    images: ["https://i.ibb.co/XfLyWLt1/Green-1950s-Colorblock-Long-Sleeve-Button-Dress-Khaki-S-2.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Olive Khaki", hex: "#3f6212" }],
    stock: 11,
    rating: 4.8,
    review_count: 12,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-20',
    name: "Vintage Ruffle-Sleeve Peplum Gown",
    description: "Classy church and wedding guest peplum gown featuring dramatic ruffle sleeves.",
    category: "Gowns",
    price: 84000,
    images: ["https://i.ibb.co/ym7F0FLL/Memoriesea-Women-s-Vintage-Church-Ruffle-Sleeve.jpg"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [{ name: "Royal Blue", hex: "#1d4ed8" }],
    stock: 10,
    rating: 4.9,
    review_count: 18,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-21',
    name: "Valentine Statement Red Corset Gown",
    description: "Showstopping bright red corset gown designed to turn heads at formal galas.",
    category: "Gowns",
    price: 115000,
    images: ["https://i.ibb.co/QFgxhBXr/Valentine-s-Weekend-Your-Moment-Why-blend-in.jpg"],
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Passion Red", hex: "#dc2626" }],
    stock: 6,
    rating: 5.0,
    review_count: 25,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-22',
    name: "Regal Cascading Silk Maxi Gown",
    description: "Floor-sweeping silk chiffon maxi gown with pleated shoulder straps and flowing train.",
    category: "Gowns",
    price: 120000,
    images: ["https://i.ibb.co/tTzg81Vv/long-dress.jpg"],
    sizes: ["XS", "S", "M", "L", "Custom Tailored"],
    colors: [{ name: "Gold Satin", hex: "#F4C430" }],
    stock: 7,
    rating: 4.9,
    review_count: 13,
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-23',
    name: "Luxury Tailored Evening Bustier Top",
    description: "Sculpted boned bustier corset top with hand-beaded lace accents for evening wear.",
    category: "Tops",
    price: 60000,
    images: ["https://i.ibb.co/V05C4Fh3/28499410135816660.jpg"],
    sizes: ["S", "M", "L"],
    colors: [{ name: "Onyx Black", hex: "#000000" }],
    stock: 12,
    rating: 4.8,
    review_count: 9,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-24',
    name: "Asymmetric Collar Printed Two-Piece Set",
    description: "Avant-garde asymmetric collar top and wide trousers co-ord set in abstract motif.",
    category: "Two-Piece Sets",
    price: 89000,
    images: ["https://i.ibb.co/3yZ9GvNC/Plus-Size-Fashionable-Asymmetric-Collar-Printed-2-Pieces-Set.jpg"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [{ name: "Abstract Print", hex: "#7c3aed" }],
    stock: 9,
    rating: 4.7,
    review_count: 11,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-25',
    name: "Belle Vintage A-Line Flare Gown",
    description: "1950s Hepburn style vintage flared A-line cocktail dress with cinched waist belt.",
    category: "Gowns",
    price: 76000,
    images: ["https://i.ibb.co/vCFCRVYc/Belle-Poque-Vintage-Dress-for-Women-1950s.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Navy Blue", hex: "#1e3a8a" }],
    stock: 14,
    rating: 4.8,
    review_count: 15,
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-26',
    name: "Darlene Crepe Super Wide-Leg Trousers",
    description: "High-waisted olive green crepe super wide-leg trousers with deep pockets.",
    category: "Trousers",
    price: 68000,
    images: ["https://i.ibb.co/gZ5xHxkq/Women-s-Darlene-Crepe-Super-Wide-Leg-Pant-33-in-Olive-Green-Size-2-X.jpg"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [{ name: "Olive Green", hex: "#3f6212" }],
    stock: 11,
    rating: 4.9,
    review_count: 17,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-27',
    name: "Minimalist Sculpted High-Waist Skirt",
    description: "Architectural crepe pencil skirt with side split hem and hidden back zip.",
    category: "Skirts",
    price: 59000,
    images: ["https://i.ibb.co/4wqpSPsD/Nothing-added-without-purpose-Nothing-shown.jpg"],
    sizes: ["S", "M", "L"],
    colors: [{ name: "Champagne Cream", hex: "#fef3c7" }],
    stock: 10,
    rating: 4.7,
    review_count: 8,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-28',
    name: "Unapologetically Fluid Tailored Trousers",
    description: "Bespoke fluid pleat wide-leg silk mix trousers engineered for graceful movement.",
    category: "Trousers",
    price: 72000,
    images: ["https://i.ibb.co/DDNqTqym/Unapologetically-Fluid-is-a-celebration-of.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Monochrome Black", hex: "#000000" }],
    stock: 12,
    rating: 4.8,
    review_count: 14,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-29',
    name: "Off-Shoulder Ruched Split-Hem Bodycon Gown",
    description: "Glamorous bodycon ruched midi gown with off-shoulder neckline and high split.",
    category: "Gowns",
    price: 95000,
    images: ["https://i.ibb.co/0j02RZFy/Memoriesea-Women-s-Elegant-Off-Shoulder-Split-Hem-Bodycon-Ruched-Midi-Club-Party-Dress.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Burgundy Wine", hex: "#881337" }],
    stock: 8,
    rating: 4.9,
    review_count: 20,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-30',
    name: "Spaghetti Strap Floral Two-Piece Set",
    description: "Retro floral print spaghetti strap top and high-waisted shorts holiday set.",
    category: "Two-Piece Sets",
    price: 67000,
    images: ["https://i.ibb.co/Gfj6Y92p/Yellow-1950s-Spaghetti-Strap-Floral-Romper.jpg"],
    sizes: ["S", "M", "L"],
    colors: [{ name: "Floral Yellow", hex: "#F4C430" }],
    stock: 13,
    rating: 4.6,
    review_count: 9,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-31',
    name: "Casual Slim Hoodie & High-Waist Two-Piece Set",
    description: "Contemporary two-piece long hoodie top and tailored jogger trouser set.",
    category: "Two-Piece Sets",
    price: 74000,
    images: ["https://i.ibb.co/KpbkbjTD/Amazon-com-Generic-Women-Casual-Slim-Hoodie-Long.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Charcoal Grey", hex: "#374151" }],
    stock: 15,
    rating: 4.7,
    review_count: 13,
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-32',
    name: "Casual Wrap-Fit Bespoke Gown",
    description: "Versatile wrap-front dress crafted from soft breathable crepe with tie-waist sash.",
    category: "Gowns",
    price: 82000,
    images: ["https://i.ibb.co/1tkCp76L/Shop-for-womens-casual-dresses-from-wrap-to-fit.jpg"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [{ name: "Terracotta Red", hex: "#c2410c" }],
    stock: 10,
    rating: 4.8,
    review_count: 11,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    created_at: new Date().toISOString()
  }
];

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: "Gowns",
    slug: "gowns",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    description: "Elegant floor-length dresses, corset gowns, and luxury evening wear.",
    product_count: 12
  },
  {
    id: 'cat-2',
    name: "Tops",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    description: "Bespoke blouses, corset tops, blazers, and luxury tops.",
    product_count: 8
  },
  {
    id: 'cat-3',
    name: "Skirts",
    slug: "skirts",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    description: "Stylish tailored skirts, pencil skirts, and flowing midi skirts.",
    product_count: 6
  },
  {
    id: 'cat-4',
    name: "Trousers",
    slug: "trousers",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    description: "High-waisted tailored pants, pleated trousers, and wide-leg bottoms.",
    product_count: 5
  },
  {
    id: 'cat-5',
    name: "Two-Piece Sets",
    slug: "two-piece-sets",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    description: "Matching co-ords, luxury two-piece ensembles, and tailored suit sets.",
    product_count: 7
  }
];

const INITIAL_SETTINGS: SiteSettings = {
  business_name: "Ella's Fashion Concept",
  phone_number: "09121252258",
  whatsapp_number: "2349121252258", // Numbers only for wa.me redirect (09121252258)
  email: "ellafashionconcept58@gmail.com",
  address: "Leventis Bus Stop Army Contonment Maryland, Ikeja, Lagos State.",
  announcement_bar_text: "✨ Beautiful Women's Clothes • Fast Delivery Everywhere • Easy Size & Fitting Help",
  currency_symbol: "₦",
  hero_title: "Beautiful Clothes Made Just For You",
  hero_subtitle: "Quality dresses and outfits designed to make you look and feel great.",
  hero_banner_url: heroFabricsImg,
  instagram_handle: "@ellasfashionconcept"
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'EFC-9821',
    customer_name: 'Dr. Amina Bello',
    customer_phone: '+2348031112233',
    delivery_address: '42 Admiralty Way, Lekki Phase 1, Lagos State',
    notes: 'Please ensure custom fitting measurements are confirmed.',
    total_amount: 225000,
    status: 'Confirmed',
    items: [
      {
        product_id: 'prod-1',
        product_name: "The Royal Velvet Corset Gown",
        price: 105000,
        quantity: 1,
        size: "M",
        color: "Royal Midnight Blue",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80"
      },
      {
        product_id: 'prod-3',
        product_name: "Ethereal Satin Mermaid Gown",
        price: 120000,
        quantity: 1,
        size: "M",
        color: "Champagne Gold",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80"
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'ord-1002',
    order_number: 'EFC-9822',
    customer_name: 'Chief Florence Adeleke',
    customer_phone: '+2348054445566',
    delivery_address: '12 Banana Island Road, Ikoyi, Lagos',
    notes: 'Urgent delivery needed for Friday dinner.',
    total_amount: 85000,
    status: 'Processing',
    items: [
      {
        product_id: 'prod-2',
        product_name: "Bespoke Silk Blazer Dress",
        price: 85000,
        quantity: 1,
        size: "L",
        color: "Ivory White",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80"
      }
    ],
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-1',
    product_name: 'The Royal Velvet Corset Gown',
    customer_name: 'Victoria K.',
    rating: 5,
    comment: 'The sewing quality is immaculate! Received compliments all night at the charity gala. Ella is a master artisan!',
    is_approved: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'rev-2',
    product_id: 'prod-3',
    product_name: 'Ethereal Satin Mermaid Gown',
    customer_name: 'Genevieve N.',
    rating: 5,
    comment: 'Fits like a dream! The champagne satin is top tier quality and feels so soft against the skin.',
    is_approved: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Mrs. Funke Olamide',
    email: 'funke.o@gmail.com',
    phone: '+2348029998877',
    subject: 'Bridal Train Custom Orders',
    message: 'Hello Ella, I would love to order custom bridesmaid dresses for 6 ladies for a December wedding. Do you accept group fitting appointments?',
    status: 'unread',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// Local Storage Keys
const KEYS = {
  PRODUCTS: 'efc_products_v1',
  CATEGORIES: 'efc_categories_v1',
  ORDERS: 'efc_orders_v1',
  REVIEWS: 'efc_reviews_v1',
  MESSAGES: 'efc_messages_v1',
  SETTINGS: 'efc_settings_v1',
};

class StoreService {
  private get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage write error for " + key, e);
      try {
        if (Array.isArray(value)) {
          // Truncate large array or strip heavy base64 images if storage is full
          const trimmed = value.slice(0, 15).map((item: any) => {
            if (item && item.images && Array.isArray(item.images)) {
              return {
                ...item,
                images: item.images.map((img: string) =>
                  typeof img === 'string' && img.startsWith('data:') ? 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80' : img
                )
              };
            }
            if (item && item.image && typeof item.image === 'string' && item.image.startsWith('data:')) {
              return {
                ...item,
                image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80'
              };
            }
            return item;
          });
          localStorage.setItem(key, JSON.stringify(trimmed));
        }
      } catch (fallbackErr) {
        console.warn("Fallback storage write error", fallbackErr);
      }
    }
  }

  // Products
  getProducts(): Product[] {
    const raw = this.get<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (!raw || raw.length < 32 || raw.some(p => p.images && p.images[0]?.includes('unsplash.com'))) {
      this.set(KEYS.PRODUCTS, INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    const uniqueMap = new Map<string, Product>();
    raw.forEach(p => {
      if (p && p.id) {
        let cat = p.category || 'Gowns';
        if (cat === 'Evening Gowns' || cat === 'Dresses' || cat === 'Kaftans') cat = 'Gowns';
        else if (cat === 'Tailored Suits & Blazers' || cat === 'Outerwear & Capes' || cat === 'Ankara Suits') cat = 'Two-Piece Sets';
        else if (cat === 'Luxury Jumpsuits & Sets') cat = 'Two-Piece Sets';
        uniqueMap.set(p.id, { ...p, category: cat });
      }
    });
    return Array.from(uniqueMap.values());
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  async saveProduct(product: Partial<Product> & { name: string; price: number }): Promise<{ product: Product; supabaseError?: string }> {
    const products = this.getProducts();
    let saved: Product;

    if (product.id) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        saved = { ...products[idx], ...product } as Product;
        products[idx] = saved;
      } else {
        saved = { ...product, id: product.id } as Product;
        products.unshift(saved);
      }
    } else {
      saved = {
        id: generateUUID(),
        name: product.name,
        description: product.description || '',
        category: product.category || 'Gowns',
        price: Number(product.price),
        discount_price: product.discount_price ? Number(product.discount_price) : undefined,
        images: product.images && product.images.length > 0 ? product.images : [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
        ],
        sizes: product.sizes || ["S", "M", "L"],
        colors: product.colors || [{ name: "Gold", hex: "#F4C430" }],
        stock: product.stock ?? 10,
        rating: 5.0,
        review_count: 0,
        is_featured: !!product.is_featured,
        is_bestseller: !!product.is_bestseller,
        is_new_arrival: !!product.is_new_arrival,
        created_at: new Date().toISOString()
      };
      products.unshift(saved);
    }

    this.set(KEYS.PRODUCTS, products);

    let supabaseError: string | undefined = undefined;

    if (isSupabaseConfigured) {
      try {
        const dbRow = {
          id: String(saved.id),
          name: saved.name,
          description: saved.description || '',
          category: saved.category || '',
          price: Number(saved.price) || 0,
          discount_price: saved.discount_price ? Number(saved.discount_price) : null,
          images: saved.images || [],
          sizes: saved.sizes || [],
          colors: saved.colors || [],
          stock: Number(saved.stock) || 0,
          rating: Number(saved.rating) || 5.0,
          review_count: Number(saved.review_count) || 0,
          is_featured: Boolean(saved.is_featured),
          is_bestseller: Boolean(saved.is_bestseller),
          is_new_arrival: Boolean(saved.is_new_arrival),
          created_at: saved.created_at || new Date().toISOString()
        };

        const { error } = await supabase.from('products').upsert(dbRow);

        if (error) {
          console.error('[Supabase Error] Failed to save product:', error);
          supabaseError = `${error.message}${error.details ? ` (${error.details})` : ''}`;
        } else {
          console.log('[Supabase Success] Product saved to Supabase table "products":', saved.id);
        }
      } catch (err: any) {
        console.error('[Supabase Exception]:', err);
        supabaseError = err?.message || 'Exception saving to Supabase';
      }
    }

    return { product: saved, supabaseError };
  }

  async deleteProduct(id: string): Promise<{ success: boolean; supabaseError?: string }> {
    const targetId = String(id).trim();
    const products = this.getProducts().filter(p => String(p.id).trim() !== targetId);
    this.set(KEYS.PRODUCTS, products);

    let supabaseError: string | undefined = undefined;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', targetId);
        if (error) {
          console.error('[Supabase Error] Failed to delete product:', error.message);
          supabaseError = error.message;
        } else {
          console.log('[Supabase Success] Deleted product:', targetId);
        }
      } catch (err: any) {
        console.error('[Supabase Exception]:', err);
        supabaseError = err?.message || 'Delete exception';
      }
    }

    return { success: !supabaseError, supabaseError };
  }

  // Categories
  getCategories(): Category[] {
    const raw = this.get<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const validNames = new Set(["Gowns", "Tops", "Skirts", "Trousers", "Two-Piece Sets"]);
    const filtered = raw.filter(c => validNames.has(c.name));
    if (filtered.length < 5) {
      this.set(KEYS.CATEGORIES, INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    return filtered;
  }

  async saveCategory(cat: Partial<Category> & { name: string }): Promise<{ category: Category; supabaseError?: string }> {
    const categories = this.getCategories();
    let saved: Category;

    if (cat.id) {
      const idx = categories.findIndex(c => c.id === cat.id);
      if (idx !== -1) {
        saved = { ...categories[idx], ...cat } as Category;
        categories[idx] = saved;
      } else {
        saved = { ...cat, id: cat.id } as Category;
        categories.push(saved);
      }
    } else {
      saved = {
        id: generateUUID(),
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
        image: cat.image || "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
        description: cat.description || '',
        product_count: 0
      };
      categories.push(saved);
    }

    this.set(KEYS.CATEGORIES, categories);

    let supabaseError: string | undefined;
    if (isSupabaseConfigured) {
      try {
        const dbRow = {
          id: String(saved.id),
          name: saved.name,
          slug: saved.slug,
          image: saved.image,
          description: saved.description || '',
          product_count: Number(saved.product_count) || 0
        };
        const { error } = await supabase.from('categories').upsert(dbRow);
        if (error) {
          console.error('[Supabase Category Error]:', error.message);
          supabaseError = error.message;
        } else {
          console.log('[Supabase Success] Saved category to Supabase:', saved.id);
        }
      } catch (err: any) {
        console.error('[Supabase Category Exception]:', err);
        supabaseError = err?.message;
      }
    }

    return { category: saved, supabaseError };
  }

  async deleteCategory(id: string): Promise<{ success: boolean; supabaseError?: string }> {
    const targetId = String(id).trim();
    const cats = this.getCategories().filter(c => String(c.id).trim() !== targetId);
    this.set(KEYS.CATEGORIES, cats);

    let supabaseError: string | undefined;
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', targetId);
        if (error) {
          console.warn('Delete category Supabase error:', error.message);
          supabaseError = error.message;
        }
      } catch (err: any) {
        console.warn('Delete category Supabase exception:', err);
        supabaseError = err?.message;
      }
    }
    return { success: !supabaseError, supabaseError };
  }

  // Orders
  getOrders(): Order[] {
    return this.get<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  }

  async addOrder(orderData: Omit<Order, 'id' | 'order_number' | 'status' | 'created_at'>): Promise<{ order: Order; supabaseError?: string }> {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: generateUUID(),
      order_number: `EFC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    orders.unshift(newOrder);
    this.set(KEYS.ORDERS, orders);

    let supabaseError: string | undefined;
    if (isSupabaseConfigured) {
      try {
        const dbRow = {
          id: String(newOrder.id),
          order_number: newOrder.order_number,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          delivery_address: newOrder.delivery_address,
          total_amount: Number(newOrder.total_amount) || 0,
          status: newOrder.status,
          created_at: newOrder.created_at,
          items: newOrder.items || []
        };
        const { error } = await supabase.from('orders').upsert(dbRow);
        if (error) {
          console.error('[Supabase Order Error]:', error.message);
          supabaseError = error.message;
        } else {
          console.log('[Supabase Success] Order saved to Supabase:', newOrder.id);
        }
      } catch (err: any) {
        console.error('[Supabase Order Exception]:', err);
        supabaseError = err?.message;
      }
    }

    return { order: newOrder, supabaseError };
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      this.set(KEYS.ORDERS, orders);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('orders').update({ status }).eq('id', orderId);
        } catch (err) {
          console.warn('Update order status error:', err);
        }
      }
    }
  }

  async deleteOrder(id: string): Promise<{ success: boolean; supabaseError?: string }> {
    const targetId = String(id).trim();
    const orders = this.getOrders().filter(o => String(o.id).trim() !== targetId);
    this.set(KEYS.ORDERS, orders);

    let supabaseError: string | undefined = undefined;
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('orders').delete().eq('id', targetId);
        if (error) supabaseError = error.message;
      } catch (err: any) {
        console.warn('Delete order error:', err);
        supabaseError = err?.message;
      }
    }
    return { success: !supabaseError, supabaseError };
  }

  // Contact Messages
  getMessages(): ContactMessage[] {
    return this.get<ContactMessage[]>(KEYS.MESSAGES, INITIAL_MESSAGES);
  }

  async addMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<{ message: ContactMessage; supabaseError?: string }> {
    const messages = this.getMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: generateUUID(),
      status: 'unread',
      created_at: new Date().toISOString()
    };
    messages.unshift(newMsg);
    this.set(KEYS.MESSAGES, messages);

    let supabaseError: string | undefined;
    if (isSupabaseConfigured) {
      try {
        const dbRow = {
          id: String(newMsg.id),
          name: newMsg.name,
          email: newMsg.email,
          phone: newMsg.phone,
          message: newMsg.message,
          status: newMsg.status,
          created_at: newMsg.created_at
        };
        const { error } = await supabase.from('contact_messages').upsert(dbRow);
        if (error) {
          console.error('[Supabase Contact Error]:', error.message);
          supabaseError = error.message;
        } else {
          console.log('[Supabase Success] Contact message saved to Supabase:', newMsg.id);
        }
      } catch (err: any) {
        console.error('[Supabase Contact Exception]:', err);
        supabaseError = err?.message;
      }
    }

    return { message: newMsg, supabaseError };
  }

  async markMessageRead(id: string): Promise<void> {
    const messages = this.getMessages();
    const idx = messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      messages[idx].status = 'read';
      this.set(KEYS.MESSAGES, messages);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id);
        } catch (err) {
          console.warn('Mark message read error:', err);
        }
      }
    }
  }

  async deleteMessage(id: string): Promise<{ success: boolean; supabaseError?: string }> {
    const targetId = String(id).trim();
    const messages = this.getMessages().filter(m => String(m.id).trim() !== targetId);
    this.set(KEYS.MESSAGES, messages);

    let supabaseError: string | undefined = undefined;
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('contact_messages').delete().eq('id', targetId);
        if (error) supabaseError = error.message;
      } catch (err: any) {
        console.warn('Delete message error:', err);
        supabaseError = err?.message;
      }
    }
    return { success: !supabaseError, supabaseError };
  }

  // Reviews
  getReviews(): Review[] {
    return this.get<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  async addReview(rev: Omit<Review, 'id' | 'is_approved' | 'created_at'>): Promise<{ review: Review; supabaseError?: string }> {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...rev,
      id: generateUUID(),
      is_approved: true, // Auto approve
      created_at: new Date().toISOString()
    };
    reviews.unshift(newReview);
    this.set(KEYS.REVIEWS, reviews);

    let supabaseError: string | undefined;
    if (isSupabaseConfigured) {
      try {
        const dbRow = {
          id: String(newReview.id),
          product_id: newReview.product_id ? String(newReview.product_id) : null,
          product_name: newReview.product_name,
          customer_name: newReview.customer_name,
          rating: Number(newReview.rating) || 5,
          comment: newReview.comment,
          is_approved: Boolean(newReview.is_approved),
          created_at: newReview.created_at
        };
        const { error } = await supabase.from('reviews').upsert(dbRow);
        if (error) {
          console.error('[Supabase Review Error]:', error.message);
          supabaseError = error.message;
        } else {
          console.log('[Supabase Success] Review saved to Supabase:', newReview.id);
        }
      } catch (err: any) {
        console.error('[Supabase Review Exception]:', err);
        supabaseError = err?.message;
      }
    }

    return { review: newReview, supabaseError };
  }

  async toggleReviewApproval(id: string): Promise<void> {
    const reviews = this.getReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx !== -1) {
      const newStatus = !reviews[idx].is_approved;
      reviews[idx].is_approved = newStatus;
      this.set(KEYS.REVIEWS, reviews);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('reviews').update({ is_approved: newStatus }).eq('id', id);
        } catch (err) {
          console.warn('Toggle review error:', err);
        }
      }
    }
  }

  async deleteReview(id: string): Promise<{ success: boolean; supabaseError?: string }> {
    const targetId = String(id).trim();
    const reviews = this.getReviews().filter(r => String(r.id).trim() !== targetId);
    this.set(KEYS.REVIEWS, reviews);

    let supabaseError: string | undefined = undefined;
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('reviews').delete().eq('id', targetId);
        if (error) supabaseError = error.message;
      } catch (err: any) {
        console.warn('Delete review error:', err);
        supabaseError = err?.message;
      }
    }
    return { success: !supabaseError, supabaseError };
  }

  // Settings
  getSettings(): SiteSettings {
    const saved = this.get<Partial<SiteSettings>>(KEYS.SETTINGS, INITIAL_SETTINGS);
    const merged = { ...INITIAL_SETTINGS, ...saved };
    if (!saved.email || saved.email === 'contact@ellafashion.com' || saved.email === 'ellafashionconcept@gmail.com') {
      merged.email = "ellafashionconcept58@gmail.com";
    }
    if (!saved.address || saved.address.includes('Victoria Island')) {
      merged.address = "Leventis Bus Stop Army Contonment Maryland, Ikeja, Lagos State.";
    }
    if (!saved.phone_number || saved.phone_number.includes('125 2258') || saved.phone_number.includes('+234')) {
      merged.phone_number = "09121252258";
    }
    if (!saved.whatsapp_number || saved.whatsapp_number.includes('812') || saved.whatsapp_number.includes('345') || !saved.whatsapp_number.includes('9121252258')) {
      merged.whatsapp_number = "2349121252258";
    }
    return merged;
  }

  async saveSettings(settings: Partial<SiteSettings>): Promise<{ settings: SiteSettings; supabaseError?: string }> {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    this.set(KEYS.SETTINGS, updated);

    let supabaseError: string | undefined = undefined;

    if (isSupabaseConfigured) {
      try {
        const dbRow = {
          id: '1',
          store_name: updated.business_name || "Ella's Fashion Concept",
          currency: updated.currency_symbol || '₦',
          phone: updated.phone_number || '',
          email: updated.email || '',
          address: updated.address || '',
          whatsapp_number: updated.whatsapp_number || '',
          updated_at: new Date().toISOString()
        };
        const { error } = await supabase.from('site_settings').upsert(dbRow);
        if (error) {
          console.warn('Save settings Supabase error:', error.message);
          supabaseError = error.message;
        } else {
          console.log('[Supabase Success] Store settings saved to Supabase');
        }
      } catch (err: any) {
        console.warn('Save settings exception:', err);
        supabaseError = err?.message || 'Save settings exception';
      }
    }

    return { settings: updated, supabaseError };
  }

  async pushAllProductsToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
    const res = await this.pushAllDataToSupabase();
    return { success: res.success, count: res.counts.products, error: res.errors.length > 0 ? res.errors.join(' | ') : undefined };
  }

  async pushAllDataToSupabase(): Promise<{
    success: boolean;
    counts: { products: number; categories: number; orders: number; messages: number; reviews: number; settings: number };
    errors: string[];
  }> {
    const counts = { products: 0, categories: 0, orders: 0, messages: 0, reviews: 0, settings: 0 };
    const errors: string[] = [];

    if (!isSupabaseConfigured) {
      return { success: false, counts, errors: ['Supabase credentials not configured.'] };
    }

    // 1. Categories
    try {
      const cats = this.getCategories();
      if (cats.length > 0) {
        const rows = cats.map(c => ({
          id: String(c.id),
          name: c.name,
          slug: c.slug,
          image: c.image || '',
          description: c.description || '',
          product_count: Number(c.product_count) || 0
        }));
        const { error } = await supabase.from('categories').upsert(rows);
        if (error) errors.push(`categories: ${error.message}`);
        else counts.categories = rows.length;
      }
    } catch (e: any) {
      const msg = e?.message || 'Network error';
      if (msg.includes('Failed to fetch')) {
        errors.push(`categories: Failed to fetch (Check Supabase URL and Anon Key format in Admin Settings)`);
      } else {
        errors.push(`categories: ${msg}`);
      }
    }

    // 2. Products
    try {
      const localProducts = this.getProducts();
      if (localProducts.length > 0) {
        const rows = localProducts.map(saved => ({
          id: String(saved.id),
          name: saved.name,
          description: saved.description || '',
          category: saved.category || '',
          price: Number(saved.price) || 0,
          discount_price: saved.discount_price ? Number(saved.discount_price) : null,
          images: saved.images || [],
          sizes: saved.sizes || [],
          colors: saved.colors || [],
          stock: Number(saved.stock) || 0,
          rating: Number(saved.rating) || 5.0,
          review_count: Number(saved.review_count) || 0,
          is_featured: Boolean(saved.is_featured),
          is_bestseller: Boolean(saved.is_bestseller),
          is_new_arrival: Boolean(saved.is_new_arrival),
          created_at: saved.created_at || new Date().toISOString()
        }));

        const { error } = await supabase.from('products').upsert(rows);
        if (error) errors.push(`products: ${error.message}`);
        else counts.products = rows.length;
      }
    } catch (e: any) {
      const msg = e?.message || 'Error';
      errors.push(`products: ${msg.includes('Failed to fetch') ? 'Failed to fetch (Check Supabase URL and Anon Key in Settings)' : msg}`);
    }

    // 3. Orders
    try {
      const orders = this.getOrders();
      if (orders.length > 0) {
        const rows = orders.map(o => ({
          id: String(o.id),
          order_number: o.order_number,
          customer_name: o.customer_name,
          customer_phone: o.customer_phone,
          delivery_address: o.delivery_address,
          total_amount: Number(o.total_amount) || 0,
          status: o.status,
          created_at: o.created_at,
          items: o.items || []
        }));
        const { error } = await supabase.from('orders').upsert(rows);
        if (error) errors.push(`orders: ${error.message}`);
        else counts.orders = rows.length;
      }
    } catch (e: any) {
      const msg = e?.message || 'Error';
      errors.push(`orders: ${msg.includes('Failed to fetch') ? 'Failed to fetch (Check Supabase URL and Anon Key in Settings)' : msg}`);
    }

    // 4. Messages
    try {
      const msgs = this.getMessages();
      if (msgs.length > 0) {
        const rows = msgs.map(m => ({
          id: String(m.id),
          name: m.name,
          email: m.email,
          phone: m.phone,
          message: m.message,
          status: m.status,
          created_at: m.created_at
        }));
        const { error } = await supabase.from('contact_messages').upsert(rows);
        if (error) errors.push(`contact_messages: ${error.message}`);
        else counts.messages = rows.length;
      }
    } catch (e: any) {
      const msg = e?.message || 'Error';
      errors.push(`contact_messages: ${msg.includes('Failed to fetch') ? 'Failed to fetch' : msg}`);
    }

    // 5. Reviews
    try {
      const revs = this.getReviews();
      if (revs.length > 0) {
        const rows = revs.map(r => ({
          id: String(r.id),
          product_id: r.product_id ? String(r.product_id) : null,
          product_name: r.product_name,
          customer_name: r.customer_name,
          rating: Number(r.rating) || 5,
          comment: r.comment,
          is_approved: Boolean(r.is_approved),
          created_at: r.created_at
        }));
        const { error } = await supabase.from('reviews').upsert(rows);
        if (error) errors.push(`reviews: ${error.message}`);
        else counts.reviews = rows.length;
      }
    } catch (e: any) {
      const msg = e?.message || 'Error';
      errors.push(`reviews: ${msg.includes('Failed to fetch') ? 'Failed to fetch' : msg}`);
    }

    // 6. Settings
    try {
      const s = this.getSettings();
      const row = {
        id: '1',
        store_name: s.business_name,
        currency: s.currency_symbol,
        phone: s.phone_number,
        email: s.email,
        address: s.address,
        whatsapp_number: s.whatsapp_number,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('site_settings').upsert(row);
      if (error) errors.push(`site_settings: ${error.message}`);
      else counts.settings = 1;
    } catch (e: any) {
      const msg = e?.message || 'Error';
      errors.push(`site_settings: ${msg.includes('Failed to fetch') ? 'Failed to fetch' : msg}`);
    }

    return {
      success: errors.length === 0,
      counts,
      errors
    };
  }

  async syncWithSupabase(): Promise<void> {
    if (!isSupabaseConfigured) return;

    try {
      // Products
      const { data: dbProducts, error: pErr } = await supabase.from('products').select('*');
      if (!pErr && Array.isArray(dbProducts)) {
        this.set(KEYS.PRODUCTS, dbProducts);
      }

      // Categories
      const { data: dbCategories, error: cErr } = await supabase.from('categories').select('*');
      if (!cErr && Array.isArray(dbCategories)) {
        this.set(KEYS.CATEGORIES, dbCategories);
      }

      // Orders
      const { data: dbOrders, error: oErr } = await supabase.from('orders').select('*');
      if (!oErr && Array.isArray(dbOrders)) {
        this.set(KEYS.ORDERS, dbOrders);
      }

      // Messages
      const { data: dbMessages, error: mErr } = await supabase.from('contact_messages').select('*');
      if (!mErr && Array.isArray(dbMessages)) {
        this.set(KEYS.MESSAGES, dbMessages);
      }

      // Reviews
      const { data: dbReviews, error: rErr } = await supabase.from('reviews').select('*');
      if (!rErr && Array.isArray(dbReviews)) {
        this.set(KEYS.REVIEWS, dbReviews);
      }

      // Settings
      const { data: dbSettings, error: sErr } = await supabase.from('site_settings').select('*').limit(1);
      if (!sErr && dbSettings && dbSettings.length > 0) {
        const s = dbSettings[0];
        const currentSettings = this.getSettings();
        this.set(KEYS.SETTINGS, {
          ...currentSettings,
          business_name: s.store_name || currentSettings.business_name,
          currency_symbol: s.currency || currentSettings.currency_symbol,
          phone_number: s.phone || currentSettings.phone_number,
          email: s.email || currentSettings.email,
          address: s.address || currentSettings.address,
          whatsapp_number: s.whatsapp_number || currentSettings.whatsapp_number
        });
      }
    } catch (err) {
      console.warn('[Supabase Sync Exception]:', err);
    }
  }
}

export const store = new StoreService();
// Automatically trigger background sync with Supabase if configured
store.syncWithSupabase();


