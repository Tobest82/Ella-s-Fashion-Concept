import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { store } from './services/store';
import { Product, Category, SiteSettings } from './types';

// Components
import { PromotionalBar } from './components/PromotionalBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ScrollToTop } from './components/ScrollToTop';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

const getPageFromPath = (path: string): string => {
  const cleanPath = path.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
  if (cleanPath === 'admin') return 'admin';
  if (cleanPath === 'products') return 'products';
  if (cleanPath === 'about') return 'about';
  if (cleanPath === 'contact') return 'contact';
  if (cleanPath === 'cart') return 'cart';
  if (cleanPath === 'checkout') return 'checkout';
  if (!cleanPath || cleanPath === 'home') return 'home';
  return 'home';
};

export function MainApp() {
  const [currentPage, setCurrentPage] = useState<string>(() =>
    getPageFromPath(window.location.pathname)
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [initialCategoryFilter, setInitialCategoryFilter] = useState('');

  // Store State
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [categories, setCategories] = useState<Category[]>(store.getCategories());
  const [settings, setSettings] = useState<SiteSettings>(store.getSettings());

  const refreshStoreData = () => {
    setProducts(store.getProducts());
    setCategories(store.getCategories());
    setSettings(store.getSettings());
  };

  useEffect(() => {
    refreshStoreData();
  }, [currentPage]);

  // Sync browser URL with currentPage state
  useEffect(() => {
    const targetPath = currentPage === 'home' ? '/' : `/${currentPage}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page: currentPage }, '', targetPath);
    }
  }, [currentPage]);

  // Handle browser back/forward navigation or manual URL changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterByCategory = (catName: string) => {
    setInitialCategoryFilter(catName);
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121212] flex flex-col justify-between selection:bg-[#F4C430] selection:text-black">
      <div>
        {/* Promotional Top Bar */}
        <PromotionalBar settings={settings} />

        {/* Sticky Luxury Navbar */}
        <Navbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onOpenSearch={() => setIsSearchOpen(true)}
          categories={categories}
          onFilterByCategory={handleFilterByCategory}
        />

        {/* Main Content Area */}
        <main className="min-h-[70vh]">
          {currentPage === 'home' && (
            <HomePage
              products={products}
              categories={categories}
              settings={settings}
              setCurrentPage={setCurrentPage}
              onSelectProduct={handleSelectProduct}
              onFilterByCategory={handleFilterByCategory}
            />
          )}

          {currentPage === 'products' && (
            <ProductsPage
              products={products}
              categories={categories}
              onSelectProduct={handleSelectProduct}
              initialCategory={initialCategoryFilter}
            />
          )}

          {currentPage === 'product-details' && selectedProduct && (
            <ProductDetailsPage
              product={selectedProduct}
              allProducts={products}
              onSelectProduct={handleSelectProduct}
              onBack={() => setCurrentPage('products')}
              setCurrentPage={setCurrentPage}
            />
          )}

          {currentPage === 'cart' && <CartPage setCurrentPage={setCurrentPage} />}

          {currentPage === 'checkout' && (
            <CheckoutPage settings={settings} setCurrentPage={setCurrentPage} />
          )}

          {currentPage === 'about' && (
            <AboutPage settings={settings} setCurrentPage={setCurrentPage} />
          )}

          {currentPage === 'contact' && <ContactPage settings={settings} />}

          {currentPage === 'admin' && (
            <AdminDashboard onRefreshStore={refreshStoreData} />
          )}

          {currentPage === '404' && <NotFoundPage setCurrentPage={setCurrentPage} />}
        </main>
      </div>

      {/* Luxury Footer */}
      <Footer
        settings={settings}
        setCurrentPage={setCurrentPage}
        onFilterByCategory={handleFilterByCategory}
      />

      {/* Floating Pulse WhatsApp Button & Scroll to Top */}
      <FloatingWhatsApp settings={settings} />
      <ScrollToTop />

      {/* Global Quick View Modal */}
      <QuickViewModal />

      {/* Global Cart Slide-over Drawer */}
      <CartDrawer setCurrentPage={setCurrentPage} />

      {/* Global Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
