import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingBag, FolderTree, ShoppingCart, MessageSquare,
  Star, Settings, BarChart2, Plus, Edit, Trash2, Check, X, Shield, RefreshCw,
  Eye, CheckCircle2, AlertCircle, FileText, Download, Phone, Image, ArrowUpRight, Upload,
  Database, Copy, ExternalLink
} from 'lucide-react';
import { store } from '../services/store';
import { getSupabaseCredentials, saveSupabaseCredentials, clearSupabaseCredentials } from '../lib/supabase';
import { Product, Category, Order, ContactMessage, Review, SiteSettings } from '../types';

interface Props {
  onRefreshStore: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onRefreshStore }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ella_admin_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string; details?: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const initialSupabaseCreds = getSupabaseCredentials();
  const [supaUrlInput, setSupaUrlInput] = useState(initialSupabaseCreds.url);
  const [supaKeyInput, setSupaKeyInput] = useState(initialSupabaseCreds.key);
  const [supaSaveSuccess, setSupaSaveSuccess] = useState(false);

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(supaUrlInput, supaKeyInput);
    setSupaSaveSuccess(true);
    setTimeout(() => {
      setSupaSaveSuccess(false);
      window.location.reload();
    }, 1200);
  };

  const handleClearSupabaseConfig = () => {
    clearSupabaseCredentials();
    setSupaUrlInput('');
    setSupaKeyInput('');
    window.location.reload();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'tobest52';
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('ella_admin_authenticated', 'true');
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Incorrect password. Please enter the correct admin password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ella_admin_authenticated');
  };

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'orders' | 'messages' | 'reviews' | 'settings' | 'analytics'
  >('overview');

  // Local state sourced from store
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(store.getSettings());

  // Settings & Sync feedback
  const [settingsFeedback, setSettingsFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Product Form state
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pCategory, setPCategory] = useState('Gowns');
  const [pPrice, setPPrice] = useState('');
  const [pDiscountPrice, setPDiscountPrice] = useState('');
  const [pStock, setPStock] = useState('10');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pIsBestseller, setPIsBestseller] = useState(false);
  const [pIsNewArrival, setPIsNewArrival] = useState(false);

  // Device File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setUploadedImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset input value so same file can be re-uploaded if needed
    e.target.value = '';
  };

  const handleAddCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setUploadedImages((prev) => [...prev, customUrlInput.trim()]);
    setCustomUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Load state on mount & tab change
  const refreshAll = () => {
    setProducts(store.getProducts());
    setCategories(store.getCategories());
    setOrders(store.getOrders());
    setMessages(store.getMessages());
    setReviews(store.getReviews());
    setSettings(store.getSettings());
    onRefreshStore();
  };

  useEffect(() => {
    refreshAll();
  }, [activeTab]);

  // Open product modal for add or edit
  const handleOpenProductModal = (productToEdit?: Product) => {
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setPName(productToEdit.name);
      setPDesc(productToEdit.description);
      setPCategory(productToEdit.category);
      setPPrice(String(productToEdit.price));
      setPDiscountPrice(productToEdit.discount_price ? String(productToEdit.discount_price) : '');
      setPStock(String(productToEdit.stock));
      setUploadedImages(productToEdit.images || []);
      setPIsFeatured(productToEdit.is_featured);
      setPIsBestseller(productToEdit.is_bestseller);
      setPIsNewArrival(productToEdit.is_new_arrival);
    } else {
      setEditingProduct(null);
      setPName('');
      setPDesc('');
      setPCategory(categories[0]?.name || 'Gowns');
      setPPrice('95000');
      setPDiscountPrice('');
      setPStock('10');
      setUploadedImages([
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80"
      ]);
      setPIsFeatured(true);
      setPIsBestseller(false);
      setPIsNewArrival(true);
    }
    setCustomUrlInput('');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalImages = uploadedImages.length > 0 ? uploadedImages : [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
    ];

    await store.saveProduct({
      id: editingProduct ? editingProduct.id : undefined,
      name: pName,
      description: pDesc,
      category: pCategory,
      price: Number(pPrice),
      discount_price: pDiscountPrice ? Number(pDiscountPrice) : undefined,
      stock: Number(pStock),
      images: finalImages,
      sizes: ["XS", "S", "M", "L", "XL", "Custom Tailored"],
      colors: [
        { name: "Sovereign Gold", hex: "#F4C430" },
        { name: "Midnight Black", hex: "#000000" }
      ],
      is_featured: pIsFeatured,
      is_bestseller: pIsBestseller,
      is_new_arrival: pIsNewArrival,
    });

    setIsProductModalOpen(false);
    refreshAll();
  };

  const handlePushAllToSupabase = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    const res = await store.pushAllDataToSupabase();
    setIsSyncing(false);
    if (res.success) {
      setSyncFeedback({
        type: 'success',
        message: `Successfully synced all store tables to Supabase! (${res.counts.products} Products, ${res.counts.categories} Categories, ${res.counts.orders} Orders, ${res.counts.messages} Messages, ${res.counts.reviews} Reviews, ${res.counts.settings} Settings)`
      });
    } else {
      setSyncFeedback({
        type: 'error',
        message: 'Some tables failed to sync to Supabase. Make sure you run the SQL script in your Supabase SQL Editor.',
        details: res.errors.join(' | ')
      });
    }
  };


  // Custom Delete Modal State
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'product' | 'category' | 'order' | 'message' | 'review';
    id: string;
    title: string;
  } | null>(null);

  const handleConfirmDelete = (
    type: 'product' | 'category' | 'order' | 'message' | 'review',
    id: string,
    title: string
  ) => {
    setItemToDelete({ type, id, title });
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    const { type, id } = itemToDelete;
    const targetId = String(id).trim();

    setItemToDelete(null);

    if (type === 'product') {
      setProducts(prev => prev.filter(p => String(p.id).trim() !== targetId));
      const res = await store.deleteProduct(targetId);
      if (res.supabaseError) {
        setSettingsFeedback({
          type: 'error',
          message: `Product removed locally! (Supabase status: ${res.supabaseError})`
        });
      } else {
        setSettingsFeedback({
          type: 'success',
          message: 'Product deleted successfully from store inventory & database!'
        });
      }
    } else if (type === 'category') {
      setCategories(prev => prev.filter(c => String(c.id).trim() !== targetId));
      const res = await store.deleteCategory(targetId);
      if (res.supabaseError) {
        setSettingsFeedback({
          type: 'error',
          message: `Category removed locally! (Supabase status: ${res.supabaseError})`
        });
      }
    } else if (type === 'order') {
      setOrders(prev => prev.filter(o => String(o.id).trim() !== targetId));
      const res = await store.deleteOrder(targetId);
      if (res.supabaseError) {
        setSettingsFeedback({
          type: 'error',
          message: `Order removed locally! (Supabase status: ${res.supabaseError})`
        });
      }
    } else if (type === 'message') {
      setMessages(prev => prev.filter(m => String(m.id).trim() !== targetId));
      const res = await store.deleteMessage(targetId);
      if (res.supabaseError) {
        setSettingsFeedback({
          type: 'error',
          message: `Message removed locally! (Supabase status: ${res.supabaseError})`
        });
      }
    } else if (type === 'review') {
      setReviews(prev => prev.filter(r => String(r.id).trim() !== targetId));
      const res = await store.deleteReview(targetId);
      if (res.supabaseError) {
        setSettingsFeedback({
          type: 'error',
          message: `Review removed locally! (Supabase status: ${res.supabaseError})`
        });
      }
    }

    refreshAll();
  };

  const handleOpenCategoryModal = (catToEdit?: Category) => {
    if (catToEdit) {
      setEditingCategory(catToEdit);
      setNewCatName(catToEdit.name);
      setNewCatDesc(catToEdit.description || '');
    } else {
      setEditingCategory(null);
      setNewCatName('');
      setNewCatDesc('');
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await store.saveCategory({
      id: editingCategory ? editingCategory.id : undefined,
      name: newCatName.trim(),
      description: newCatDesc.trim(),
    });
    setNewCatName('');
    setNewCatDesc('');
    setEditingCategory(null);
    setIsCategoryModalOpen(false);
    refreshAll();
  };

  const handleDeleteCategory = (id: string, name: string) => {
    handleConfirmDelete('category', id, name);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    await store.updateOrderStatus(orderId, status);
    refreshAll();
  };

  const handleDeleteOrder = (id: string, orderNum: string) => {
    handleConfirmDelete('order', id, `Order ${orderNum}`);
  };

  const handleToggleMessageRead = async (id: string) => {
    await store.markMessageRead(id);
    refreshAll();
  };

  const handleDeleteMessage = (id: string, name: string) => {
    handleConfirmDelete('message', id, `Message from ${name}`);
  };

  const handleToggleReview = async (id: string) => {
    await store.toggleReviewApproval(id);
    refreshAll();
  };

  const handleDeleteReview = (id: string, name: string) => {
    handleConfirmDelete('review', id, `Review by ${name}`);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsFeedback(null);
    const res = await store.saveSettings(settings);
    refreshAll();
    if (res.supabaseError) {
      setSettingsFeedback({
        type: 'error',
        message: `Saved locally! (Note: Supabase sync response: ${res.supabaseError})`
      });
    } else {
      setSettingsFeedback({
        type: 'success',
        message: 'Store settings saved and updated successfully!'
      });
    }
  };

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 font-sans py-12">
        <div className="max-w-md w-full bg-white border border-[#E8E4DE] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#121212] border-2 border-[#F4C430] flex items-center justify-center text-[#F4C430] mx-auto shadow-md">
            <Shield className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#F4C430] block mb-1">
              Protected Portal
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#121212]">
              Admin Login
            </h2>
            <p className="text-xs text-[#8C8275] mt-1">
              Please enter the admin password to access store management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#121212] uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError('');
                }}
                placeholder="Enter admin password..."
                className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-3 text-sm text-[#121212] focus:outline-none focus:border-[#F4C430] shadow-sm"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#121212] text-[#F4C430] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-[#F4C430]" />
              Unlock Admin Dashboard
            </button>
          </form>

          <p className="text-[11px] text-[#A39B8E]">
            Authorized store admins only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-[#121212] text-white p-6 rounded-3xl border border-[#262626] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#F4C430]">
            <Shield className="w-5 h-5" />
            <span className="text-xs uppercase font-bold tracking-widest">Store Management Portal</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">
            Ella's Executive Admin Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePushAllToSupabase}
            disabled={isSyncing}
            className="px-4 py-2 bg-[#F4C430] hover:bg-[#e0b228] text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5 text-black" />
            {isSyncing ? 'Syncing to Supabase...' : 'Push All Tables to Supabase'}
          </button>

          <button
            onClick={refreshAll}
            className="px-4 py-2 bg-[#262626] hover:bg-[#333] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#F4C430]" />
            Refresh Data
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-red-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Supabase Sync Feedback Banner */}
      {syncFeedback && (
        <div className={`p-5 rounded-2xl border ${
          syncFeedback.type === 'error' 
            ? 'bg-red-950/80 border-red-500/50 text-red-100' 
            : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100'
        } space-y-3 shadow-xl`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              {syncFeedback.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <span>{syncFeedback.message}</span>
            </div>
            <button onClick={() => setSyncFeedback(null)} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>

          {syncFeedback.details && (
            <div className="text-xs bg-black/60 p-3.5 rounded-xl border border-white/10 font-mono text-red-200 overflow-x-auto space-y-1">
              <div className="font-semibold text-amber-300">Supabase Response Details:</div>
              <div>{syncFeedback.details}</div>
            </div>
          )}

          {syncFeedback.type === 'error' && syncFeedback.details?.includes('Failed to fetch') && (
            <div className="p-4 bg-amber-950/80 border border-amber-500/50 rounded-xl space-y-2 text-xs text-amber-100">
              <div className="font-bold text-amber-300 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                Why are you seeing "TypeError: Failed to fetch"?
              </div>
              <p className="text-amber-200/90 leading-relaxed">
                This network error happens when the browser cannot reach your Supabase endpoint. Common causes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-amber-200/80">
                <li>
                  <strong className="text-white">Invalid Anon Key format:</strong> The key currently set (<code className="font-mono bg-black/40 px-1 rounded text-amber-300">sb_publishable_...</code>) is not a valid Supabase Anon key. Supabase keys are long JWT strings starting with <code className="font-mono bg-black/40 px-1 rounded text-amber-300">eyJhbGci...</code>.
                </li>
                <li>
                  <strong className="text-white">Incorrect or Paused Project URL:</strong> Ensure your project is active in Supabase and the URL matches <code className="font-mono bg-black/40 px-1 rounded text-amber-300">https://your-project.supabase.co</code>.
                </li>
              </ul>
              <div className="pt-2 font-semibold text-white">
                👉 Fix step: Go to your Supabase Dashboard &rarr; Project Settings &rarr; API &rarr; Copy the long <code>anon public</code> key (starts with <code>eyJhbGci...</code>) and paste it into the Settings tab below!
              </div>
            </div>
          )}

          {syncFeedback.type === 'error' && (
            <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-400" />
                Run SQL Script in Supabase SQL Editor:
              </div>
              <p className="text-gray-300">
                If Supabase returns table or permission errors, copy and run this full SQL script in your Supabase SQL Editor:
              </p>
              <div className="relative bg-black/80 p-3 rounded-lg border border-amber-500/30 text-[11px] font-mono text-amber-200">
                <pre className="whitespace-pre-wrap">{`-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]'::jsonb',
  stock INT DEFAULT 10,
  rating NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on products" ON public.products;
CREATE POLICY "Allow public full access on products" ON public.products FOR ALL TO public USING (true) WITH CHECK (true);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  image TEXT,
  description TEXT,
  product_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on categories" ON public.categories;
CREATE POLICY "Allow public full access on categories" ON public.categories FOR ALL TO public USING (true) WITH CHECK (true);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending',
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on orders" ON public.orders;
CREATE POLICY "Allow public full access on orders" ON public.orders FOR ALL TO public USING (true) WITH CHECK (true);

-- 4. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public full access on contact_messages" ON public.contact_messages FOR ALL TO public USING (true) WITH CHECK (true);

-- 5. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  product_name TEXT,
  customer_name TEXT NOT NULL,
  rating NUMERIC DEFAULT 5,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on reviews" ON public.reviews;
CREATE POLICY "Allow public full access on reviews" ON public.reviews FOR ALL TO public USING (true) WITH CHECK (true);

-- 6. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  store_name TEXT,
  currency TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  whatsapp_number TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on site_settings" ON public.site_settings;
CREATE POLICY "Allow public full access on site_settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);`}</pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]'::jsonb',
  stock INT DEFAULT 10,
  rating NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on products" ON public.products;
CREATE POLICY "Allow public full access on products" ON public.products FOR ALL TO public USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  image TEXT,
  description TEXT,
  product_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on categories" ON public.categories;
CREATE POLICY "Allow public full access on categories" ON public.categories FOR ALL TO public USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending',
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on orders" ON public.orders;
CREATE POLICY "Allow public full access on orders" ON public.orders FOR ALL TO public USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public full access on contact_messages" ON public.contact_messages FOR ALL TO public USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  product_name TEXT,
  customer_name TEXT NOT NULL,
  rating NUMERIC DEFAULT 5,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on reviews" ON public.reviews;
CREATE POLICY "Allow public full access on reviews" ON public.reviews FOR ALL TO public USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  store_name TEXT,
  currency TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  whatsapp_number TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public full access on site_settings" ON public.site_settings;
CREATE POLICY "Allow public full access on site_settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);`);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-amber-500 text-black font-bold text-[10px] rounded flex items-center gap-1 hover:bg-amber-400 transition-all"
                >
                  {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}


      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#E8E4DE] pb-3">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'products', label: 'Products', icon: ShoppingBag, count: products.length },
          { id: 'categories', label: 'Categories', icon: FolderTree, count: categories.length },
          { id: 'orders', label: 'Orders', icon: ShoppingCart, count: orders.length },
          { id: 'messages', label: 'Messages', icon: MessageSquare, count: messages.filter(m => m.status === 'unread').length },
          { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
          { id: 'settings', label: 'Site Settings', icon: Settings },
          { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-[#121212] text-[#F4C430] shadow-md'
                  : 'bg-white text-[#524B42] hover:bg-[#FAF8F5] border border-[#E8E4DE]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4C430]' : 'text-[#8C8275]'}`} />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-sans ${
                    isActive ? 'bg-[#F4C430] text-black font-extrabold' : 'bg-[#E8E4DE] text-black'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E4DE] shadow-luxury space-y-2">
              <span className="text-xs text-[#8C8275] uppercase font-bold tracking-wider">Total Sales Revenue</span>
              <div className="font-serif text-3xl font-bold text-[#121212]">₦{totalRevenue.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-700 font-semibold">From {orders.length} placed orders</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E4DE] shadow-luxury space-y-2">
              <span className="text-xs text-[#8C8275] uppercase font-bold tracking-wider">Total Products</span>
              <div className="font-serif text-3xl font-bold text-[#121212]">{products.length}</div>
              <span className="text-[11px] text-[#8C8275]">Active in catalog</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E4DE] shadow-luxury space-y-2">
              <span className="text-xs text-[#8C8275] uppercase font-bold tracking-wider">Pending Orders</span>
              <div className="font-serif text-3xl font-bold text-[#F4C430]">
                {orders.filter((o) => o.status === 'Pending').length}
              </div>
              <span className="text-[11px] text-[#8C8275]">Requires WhatsApp response</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E4DE] shadow-luxury space-y-2">
              <span className="text-xs text-[#8C8275] uppercase font-bold tracking-wider">Unread Messages</span>
              <div className="font-serif text-3xl font-bold text-red-600">
                {messages.filter((m) => m.status === 'unread').length}
              </div>
              <span className="text-[11px] text-[#8C8275]">Client inquiries</span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E4DE] shadow-luxury space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#121212]">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E4DE] text-[#8C8275] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-2">Order #</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Phone</th>
                    <th className="py-3 px-2">Total Amount</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE6]">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3 px-2 font-bold text-[#121212]">{o.order_number}</td>
                      <td className="py-3 px-2">{o.customer_name}</td>
                      <td className="py-3 px-2 font-mono text-[#8C8275]">{o.customer_phone}</td>
                      <td className="py-3 px-2 font-bold text-[#121212]">₦{o.total_amount.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <span className="px-2.5 py-1 rounded-full font-bold text-[10px] uppercase bg-amber-100 text-amber-800">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-[#8C8275]">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#121212]">Product Inventory Management</h2>
            <button
              onClick={() => handleOpenProductModal()}
              className="px-5 py-2.5 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E4DE] shadow-luxury overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E4DE] text-[#8C8275] uppercase tracking-wider font-semibold">
                    <th className="py-4 px-4">Item</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Stock</th>
                    <th className="py-4 px-4">Badges</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE6]">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={prod.images[0]} alt="" className="w-12 h-14 object-cover object-top rounded-lg bg-[#FAF8F5]" />
                        <div>
                          <span className="font-serif font-bold text-sm text-[#121212] block">{prod.name}</span>
                          <span className="text-[10px] text-[#8C8275]">ID: {prod.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#524B42] font-semibold">{prod.category}</td>
                      <td className="py-3 px-4 font-bold text-[#121212]">
                        {prod.discount_price ? (
                          <span>₦{prod.discount_price.toLocaleString()} <s className="text-[#8C8275] text-[10px]">₦{prod.price.toLocaleString()}</s></span>
                        ) : (
                          <span>₦{prod.price.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#121212]">{prod.stock} units</td>
                      <td className="py-3 px-4 space-x-1">
                        {prod.is_featured && <span className="bg-[#F4C430] text-black px-2 py-0.5 rounded text-[9px] font-bold">Featured</span>}
                        {prod.is_bestseller && <span className="bg-black text-[#F4C430] px-2 py-0.5 rounded text-[9px] font-bold">Bestseller</span>}
                        {prod.is_new_arrival && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[9px] font-bold">New</span>}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenProductModal(prod)}
                          className="p-2 text-[#524B42] hover:text-[#121212] bg-[#FAF8F5] rounded-lg border border-[#E8E4DE]"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleConfirmDelete('product', prod.id, prod.name)}
                          className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGER */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#121212]">Collection Categories</h2>
            <button
              onClick={() => handleOpenCategoryModal()}
              className="px-5 py-2.5 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-6 rounded-2xl border border-[#E8E4DE] shadow-luxury flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-[#121212]">{cat.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenCategoryModal(cat)}
                        className="p-1.5 text-[#524B42] hover:text-[#121212] bg-[#FAF8F5] rounded-lg border border-[#E8E4DE]"
                        title="Edit Category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#524B42]">{cat.description}</p>
                </div>
                <div className="text-[10px] text-[#8C8275] uppercase tracking-wider font-bold">
                  Slug: {cat.slug}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#121212]">Customer Orders & Statuses</h2>

          <div className="bg-white rounded-3xl border border-[#E8E4DE] shadow-luxury overflow-hidden">
            <div className="divide-y divide-[#E8E4DE]">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8C8275]">No customer orders recorded yet.</div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-6 space-y-4 hover:bg-[#FAF8F5] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0ECE6] pb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-xl font-bold text-[#121212]">{o.order_number}</span>
                          <span className="text-xs text-[#8C8275] font-mono">
                            {new Date(o.created_at).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#121212] block mt-0.5">
                          Client: {o.customer_name} ({o.customer_phone})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-xs font-bold text-[#8C8275]">Status:</label>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                          className="bg-white border border-[#E8E4DE] rounded-xl px-3 py-1.5 text-xs font-bold text-[#121212] focus:outline-none focus:border-[#F4C430]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Ready">Ready</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => handleDeleteOrder(o.id, o.order_number)}
                          className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors cursor-pointer"
                          title="Delete Order Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#524B42]">
                      <div>
                        <strong className="block text-[#121212] mb-1">Delivery Address:</strong>
                        <p>{o.delivery_address}</p>
                        {o.notes && <p className="mt-1 italic text-[#8C8275]">Notes: "{o.notes}"</p>}
                      </div>

                      <div>
                        <strong className="block text-[#121212] mb-1">Ordered Items:</strong>
                        <ul className="space-y-1">
                          {o.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between border-b border-dashed border-[#E8E4DE] pb-1">
                              <span>{it.product_name} ({it.size}, {it.color}) × {it.quantity}</span>
                              <span className="font-bold text-[#121212]">₦{(it.price * it.quantity).toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-between font-bold text-sm text-[#121212] pt-2">
                          <span>Total Paid/Payable:</span>
                          <span>₦{o.total_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MESSAGES MANAGER */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#121212]">Client Contact Form Submissions</h2>

          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-xs text-[#8C8275]">No messages received yet.</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="bg-white p-6 rounded-2xl border border-[#E8E4DE] shadow-luxury space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F0ECE6] pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-lg font-bold text-[#121212]">{m.name}</h4>
                        {m.status === 'unread' && (
                          <span className="bg-red-100 text-red-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                            New Unread
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#8C8275]">{m.email} • {m.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#8C8275] font-mono mr-2">
                        {new Date(m.created_at).toLocaleDateString()}
                      </span>

                      {m.phone && (
                        <a
                          href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                          title="Reply on WhatsApp"
                        >
                          <Phone className="w-3 h-3" />
                          WhatsApp
                        </a>
                      )}

                      <a
                        href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Inquiry')}`}
                        className="px-2.5 py-1 bg-[#121212] hover:bg-black text-[#F4C430] rounded-lg text-[11px] font-bold flex items-center gap-1"
                        title="Reply via Email"
                      >
                        Email
                      </a>

                      {m.status === 'unread' && (
                        <button
                          onClick={() => handleToggleMessageRead(m.id)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-bold"
                          title="Mark as read"
                        >
                          Mark Read
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteMessage(m.id, m.name)}
                        className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition-colors cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#524B42] font-semibold">Subject: {m.subject}</p>
                  <p className="text-xs text-[#524B42] leading-relaxed bg-[#FAF8F5] p-3 rounded-xl">{m.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 6: REVIEWS MANAGER */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#121212]">Client Reviews Management</h2>

          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white p-6 rounded-2xl border border-[#E8E4DE] shadow-luxury flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-[#121212]">{r.customer_name}</span>
                    <span className="text-xs text-[#F4C430]">{'★'.repeat(r.rating)}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#8C8275]">Product: {r.product_name}</span>
                  <p className="text-xs text-[#524B42]">{r.comment}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleReview(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      r.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {r.is_approved ? 'Approved' : 'Pending'}
                  </button>
                  <button
                    onClick={() => handleDeleteReview(r.id, r.customer_name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SITE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-8 max-w-3xl">
          {/* Supabase Cloud Database Settings */}
          <div className="bg-[#121212] text-white p-8 rounded-3xl border border-[#262626] shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4C430]/20 border border-[#F4C430]/40 flex items-center justify-center text-[#F4C430]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Supabase Database Connection
                  </h2>
                  <p className="text-xs text-[#8C8275]">
                    Connect your store to Supabase PostgreSQL database for persistent cloud data.
                  </p>
                </div>
              </div>

              {initialSupabaseCreds.isConfigured ? (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold rounded-full flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Connected
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold rounded-full flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Not Connected
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#F4C430] uppercase tracking-wider mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://your-project-id.supabase.co"
                  value={supaUrlInput}
                  onChange={(e) => setSupaUrlInput(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#F4C430]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F4C430] uppercase tracking-wider mb-1">
                  Supabase Anon / Public Key
                </label>
                <input
                  type="password"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supaKeyInput}
                  onChange={(e) => setSupaKeyInput(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#F4C430]"
                />
              </div>

              {supaSaveSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Supabase credentials saved successfully! Reloading connection...
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#F4C430] hover:bg-[#e0b228] text-black font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  Save Database Credentials
                </button>

                {initialSupabaseCreds.isCustom && (
                  <button
                    type="button"
                    onClick={handleClearSupabaseConfig}
                    className="px-4 py-3 bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-500/30 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Disconnect Supabase
                  </button>
                )}
              </div>
            </form>

            {/* SQL Script info */}
            <div className="pt-4 border-t border-[#262626] text-xs text-[#8C8275] space-y-2">
              <span className="font-bold text-white block">Need the SQL setup script?</span>
              <p>
                The database tables, RLS policies, and seed data script is saved in your project at <code className="text-[#F4C430] font-mono">/src/data/supabase-schema.sql</code> or available in the Sync banner above.
              </p>
            </div>
          </div>

          {/* Business & Store Settings */}
          <div className="bg-white p-8 rounded-3xl border border-[#E8E4DE] shadow-luxury space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#121212] border-b border-[#F0ECE6] pb-4">
              Business & Store Settings
            </h2>

            {settingsFeedback && (
              <div className={`p-4 rounded-xl text-xs font-semibold ${
                settingsFeedback.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {settingsFeedback.message}
              </div>
            )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">Business Name</label>
              <input
                type="text"
                value={settings.business_name || ''}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-2.5 text-xs text-[#121212]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">WhatsApp Number (For Direct Wa.me Orders - Numbers only)</label>
              <input
                type="text"
                value={settings.whatsapp_number || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-2.5 text-xs text-[#121212]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">Phone Number Display</label>
              <input
                type="text"
                value={settings.phone_number || ''}
                onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-2.5 text-xs text-[#121212]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">Announcement Bar Text</label>
              <input
                type="text"
                value={settings.announcement_bar_text || ''}
                onChange={(e) => setSettings({ ...settings, announcement_bar_text: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-2.5 text-xs text-[#121212]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">Hero Title</label>
              <input
                type="text"
                value={settings.hero_title || ''}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-4 py-2.5 text-xs text-[#121212]"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-[#121212] text-[#F4C430] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black shadow-lg"
            >
              Save Settings
            </button>
          </form>
        </div>
      </div>
      )}

      {/* TAB 8: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-white p-8 rounded-3xl border border-[#E8E4DE] shadow-luxury space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#121212]">Performance & Sales Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8E4DE] space-y-3">
              <span className="text-xs font-bold uppercase text-[#8C8275]">Conversion Channel</span>
              <div className="font-serif text-3xl font-bold text-[#121212]">100% WhatsApp Direct</div>
              <p className="text-xs text-[#524B42]">Highest conversion efficiency with zero payment gateway friction.</p>
            </div>
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8E4DE] space-y-3">
              <span className="text-xs font-bold uppercase text-[#8C8275]">Top Category</span>
              <div className="font-serif text-3xl font-bold text-[#F4C430]">Gowns</div>
              <p className="text-xs text-[#524B42]">Generates 58% of total boutique order volume.</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 border border-[#E8E4DE] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F0ECE6] pb-4">
              <h3 className="font-serif text-2xl font-bold text-[#121212]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-[#8C8275]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#121212] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-3.5 py-2.5 text-xs text-[#121212]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#121212] mb-1">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-3.5 py-2.5 text-xs text-[#121212]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#121212] mb-1">Available Stock *</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-3.5 py-2.5 text-xs text-[#121212]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#121212] mb-1">Original Price (₦) *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-3.5 py-2.5 text-xs text-[#121212]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#121212] mb-1">Discount Price (₦) (Optional)</label>
                  <input
                    type="number"
                    value={pDiscountPrice}
                    onChange={(e) => setPDiscountPrice(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-3.5 py-2.5 text-xs text-[#121212]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#121212] mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-3.5 py-2.5 text-xs text-[#121212]"
                />
              </div>

              {/* Product Images: Device Upload + URL Options */}
              <div className="space-y-3 pt-2 border-t border-[#F0ECE6]">
                <label className="block font-bold text-[#121212] text-xs uppercase tracking-wider">
                  Product Images ({uploadedImages.length})
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Device File Upload */}
                  <label className="border-2 border-dashed border-[#F4C430]/60 bg-[#FAF8F5] hover:bg-white transition-all rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer text-center group">
                    <Upload className="w-6 h-6 text-[#F4C430] group-hover:scale-110 transition-transform mb-1" />
                    <span className="font-bold text-xs text-[#121212]">Upload From Device</span>
                    <span className="text-[10px] text-[#8C8275]">Select photos from phone / PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Option 2: Add Image Web URL */}
                  <div className="bg-[#FAF8F5] border border-[#E8E4DE] rounded-2xl p-3 flex flex-col justify-between space-y-2">
                    <span className="font-bold text-[11px] text-[#121212]">Or Add Image Web URL</span>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://example.com/dress.jpg"
                        className="flex-1 bg-white border border-[#E8E4DE] rounded-xl px-2.5 py-1.5 text-xs text-[#121212] focus:outline-none focus:border-[#F4C430]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomUrl}
                        className="px-3 py-1.5 bg-[#121212] text-[#F4C430] text-xs font-bold rounded-xl hover:bg-black shrink-0"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selected Images Thumbnail Grid */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-[#8C8275] font-semibold">Attached Image Gallery (First image is Cover Photo):</span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-h-44 overflow-y-auto p-1 bg-[#FAF8F5] rounded-xl border border-[#E8E4DE]">
                      {uploadedImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#E8E4DE] group bg-white">
                          <img src={imgUrl} alt="" className="w-full h-full object-cover object-top" />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-[#121212] text-[#F4C430] text-[8px] font-bold px-1.5 py-0.5 rounded">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition-all"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsFeatured}
                    onChange={(e) => setPIsFeatured(e.target.checked)}
                    className="accent-[#F4C430]"
                  />
                  Featured Item
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsBestseller}
                    onChange={(e) => setPIsBestseller(e.target.checked)}
                    className="accent-[#F4C430]"
                  />
                  Best Seller
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pIsNewArrival}
                    onChange={(e) => setPIsNewArrival(e.target.checked)}
                    className="accent-[#F4C430]"
                  />
                  New Arrival
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#121212] text-[#F4C430] font-bold uppercase rounded-xl hover:bg-black flex items-center justify-center gap-2"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-6 py-3 bg-[#E8E4DE] text-[#121212] font-bold uppercase rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#E8E4DE] shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-[#121212]">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#121212] text-[#F4C430] font-bold rounded-xl hover:bg-black">
                  Save Category
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2.5 bg-gray-200 text-[#121212] font-bold rounded-xl hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: DELETE CONFIRMATION */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#E8E4DE] shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center font-bold">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#121212]">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-[#8C8275]">Action cannot be undone</p>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DE] text-xs text-[#524B42] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#121212]">"{itemToDelete.title}"</strong>?
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-6 py-3 bg-[#E8E4DE] hover:bg-[#D8D4CE] text-[#121212] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
