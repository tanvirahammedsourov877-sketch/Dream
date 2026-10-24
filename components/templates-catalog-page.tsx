'use client';

import { FormEvent, useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  Factory,
  Heart,
  Home,
  Mail,
  Menu,
  Minus,
  PackageOpen,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sofa,
  Grid3x3,
  User,
  X,
  CheckCircle2,
} from 'lucide-react';
import { getLocalProducts, INITIAL_PRODUCTS } from '@/lib/products-store';
import {
  saveLocalSubscriber,
  type Coupon,
  type Order,
} from '@/lib/dashboard-store';
import type { Product, CartItem } from '@/lib/product-types';

function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#25D366"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2z"
      />
      <path
        fill="#FFFFFF"
        fillRule="evenodd"
        d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.78-1.48-1.76-1.65-2.06-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.6-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"
      />
    </svg>
  );
}

function ProductCard({
  product,
  onPreview,
  onAdd,
}: {
  product: Product;
  onPreview: (product: Product) => void;
  onAdd: (product: Product) => void;
}) {
  const [favorite, setFavorite] = useState(false);

  const previewUrl = `/preview/${product.id}`;
  const liveUrl = product.liveUrl ? product.liveUrl : previewUrl;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-orange-200">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {product.imageFit === 'contain' && (
          <img
            src={product.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-20 blur-md scale-110 pointer-events-none"
          />
        )}
        <img
          src={product.image}
          alt={product.title}
          style={{
            objectFit: product.imageFit || 'cover',
            objectPosition: product.imagePosition || 'center',
            transform: product.imageScale && product.imageScale !== 100 ? `scale(${product.imageScale / 100})` : undefined,
          }}
          className="relative z-10 h-full w-full transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1.5">
            {product.badge && (
              <span className="rounded-lg bg-slate-900/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                {product.badge}
              </span>
            )}
            {product.free && (
              <span className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
                Free
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setFavorite(!favorite)}
            aria-label={favorite ? 'Remove from wishlist' : 'Add to wishlist'}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110"
          >
            <Heart className={`h-4 w-4 transition-colors ${favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-full items-center bg-gradient-to-t from-slate-900/80 to-transparent px-3 pb-3 pt-8 transition-transform duration-300 group-hover:translate-y-0">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-full items-center justify-center gap-1.5 text-xs font-semibold text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Live Demo
          </a>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div>
          <h3
            className="line-clamp-2 cursor-pointer text-sm font-semibold text-slate-900 transition hover:text-orange-600"
            onClick={() => onPreview(product)}
          >
            {product.title}
          </h3>
          <p className="mt-1 truncate text-xs text-slate-500">{product.type}</p>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 text-[11px] font-semibold text-slate-600">4.9</span>
          </div>
          <span className="text-base font-bold text-slate-900">
            {product.free ? <span className="text-emerald-600">Free</span> : `$${product.price}`}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="group/btn flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-orange-500 text-xs font-semibold text-white shadow-sm shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-md active:scale-[0.98]"
          >
            <ShoppingCart className="h-3.5 w-3.5 transition-transform group-hover/btn:scale-110" />
            {product.free ? 'Get Free' : 'Add to Cart'}
          </button>
          <button
            type="button"
            onClick={() => onPreview(product)}
            aria-label={`Quick view ${product.title}`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

const CATEGORY_LABELS = ['All products', 'Tiles', 'Real Estate', 'Furniture', 'Industrial', 'Cars & Bikes'];

function TemplatesCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All products';
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [freeOnly, setFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Featured');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const loaded = getLocalProducts();
    if (loaded && loaded.length > 0) setProducts(loaded);
    else setProducts(INITIAL_PRODUCTS);
    const onUpdate = () => {
      const up = getLocalProducts();
      setProducts(up && up.length > 0 ? up : INITIAL_PRODUCTS);
    };
    window.addEventListener('products_updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('products_updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const currentProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;
    const normalizedQuery = query.trim().toLowerCase();
    const matches = currentProducts.filter((product) => {
      const matchesQuery = !normalizedQuery || `${product.title} ${product.type} ${product.category}`.toLowerCase().includes(normalizedQuery);
      const matchesCategory = activeCategory === 'All products' || product.category === activeCategory;
      return matchesCategory && (!freeOnly || Boolean(product.free)) && matchesQuery;
    });
    return [...matches].sort((a, b) =>
      sortBy === 'Price: low to high' ? a.price - b.price
      : sortBy === 'Price: high to low' ? b.price - a.price
      : 0
    );
  }, [products, activeCategory, freeOnly, query, sortBy]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  function addToCart(product: Product) {
    if (product.free) {
      setPreviewProduct(product);
      return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) return current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(productId: string, amount: number) {
    setCart((current) =>
      current.flatMap((item) =>
        item.product.id === productId ? (item.quantity + amount > 0 ? [{ ...item, quantity: item.quantity + amount }] : []) : [item]
      )
    );
  }

  const [email, setEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) { setNewsletterState('error'); return; }
    setNewsletterState('loading');
    try {
      saveLocalSubscriber({ email: normalizedEmail, source: 'Catalog Page' });
      setNewsletterState('success');
      setEmail('');
    } catch { setNewsletterState('error'); }
  }

  const navLinks = [
    { label: 'Home', value: 'All products', icon: Home, isHome: true },
    { label: 'Tiles', value: 'Tiles', icon: Grid3x3 },
    { label: 'Real Estate', value: 'Real Estate', icon: Home },
    { label: 'Furniture', value: 'Furniture', icon: Sofa },
    { label: 'Industrial', value: 'Industrial', icon: Factory },
    { label: 'Cars & Bikes', value: 'Cars & Bikes', icon: Car },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60 shadow-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-slate-900 lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="flex shrink-0 items-center transition hover:opacity-90" aria-label="Webnibo Homepage">
              <img src="/webnibo.png" alt="Webnibo" className="h-11 sm:h-12 md:h-14 w-auto object-contain" />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {navLinks.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeCategory === item.value;
              return item.isHome ? (
                <Link
                  key={item.label}
                  href="/"
                  className="group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-orange-600"
                >
                  <IconComponent className="h-4 w-4 transition-colors group-hover:text-orange-600" />
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => setActiveCategory(item.value)}
                  className={`group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-orange-600'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 ${isActive ? 'text-orange-600' : ''} transition-colors group-hover:text-orange-600`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex-1 max-w-xs sm:max-w-sm lg:flex-none lg:w-[340px] xl:w-[400px] shrink-0 min-w-0">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex w-full items-center rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-4 pr-1.5 transition-all focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100"
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search templates..."
                className="h-7 w-full min-w-0 bg-transparent pr-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800 active:scale-95"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:block h-6 w-px bg-slate-200" />
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 hover:text-slate-900 active:scale-95"
              aria-label="Open shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
            <Link
              href="/admin"
              className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 hover:text-slate-900 active:scale-95"
              aria-label="Admin / User Account"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-2">
              {navLinks.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeCategory === item.value;
                return item.isHome ? (
                  <Link
                    key={item.label}
                    href="/"
                    className="flex flex-col items-center justify-center rounded-xl p-3 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
                  >
                    <IconComponent className="h-5 w-5 mb-1" />
                    <span className="text-xs">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => { setActiveCategory(item.value); setMenuOpen(false); }}
                    className={`flex flex-col items-center justify-center rounded-xl p-3 transition ${
                      isActive ? 'bg-orange-50 text-orange-600 font-semibold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 mb-1 ${isActive ? 'text-orange-600' : ''}`} />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col gap-2 text-xs">
              <a href="mailto:support.webnibo@gmail.com" className="flex items-center gap-2 text-slate-700 hover:text-orange-600 transition">
                <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                <span className="truncate">support.webnibo@gmail.com</span>
              </a>
              <a href="https://wa.me/8801318560039" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition">
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                <span>WhatsApp: 01318560039</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ===== CATALOG CONTENT ===== */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-900 transition flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-slate-900">Templates</span>
          </div>
          <div className="font-medium">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> templates
          </div>
        </div>

        <h1 className="sr-only">All Website Templates &amp; Digital Assets</h1>

        {/* Page Title */}
        <div className="mb-8">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-600">
            <Sparkles className="h-3 w-3" />
            Template Catalog
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            All Templates
          </h2>
          <p className="mt-2 text-sm text-slate-500">Browse our complete collection of premium website templates and digital assets.</p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="mb-8 sticky top-[64px] z-30 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORY_LABELS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setFreeOnly(!freeOnly)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                freeOnly
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Check className={`h-3.5 w-3.5 ${freeOnly ? '' : 'opacity-30'}`} /> Free only
            </button>

            <label className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-8 pr-7 text-xs font-medium text-slate-800 outline-none transition focus:border-orange-500"
              >
                <option>Featured</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            </label>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPreview={setPreviewProduct}
                onAdd={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
            <PackageOpen className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-base font-medium text-slate-700">No products match your current filters.</p>
            <p className="mt-1 text-sm text-slate-500">Try choosing another category or clearing your search term.</p>
            <button
              type="button"
              onClick={() => { setActiveCategory('All products'); setFreeOnly(false); setQuery(''); }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-500"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ===== NEWSLETTER ===== */}
      <section className="relative overflow-hidden bg-slate-900 py-14">
        <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-300 backdrop-blur-md">
            <Mail className="h-3 w-3" />
            The good stuff, weekly
          </p>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">New products, fresh inspiration.</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-300">A short, useful email with our newest finds. No noise, just the good stuff.</p>
          <form onSubmit={handleNewsletterSubmit} className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              aria-label="Your email address"
              className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-slate-400 outline-none ring-2 ring-transparent backdrop-blur-md focus:ring-orange-500/50 focus:border-orange-500/50"
            />
            <button
              type="submit"
              disabled={newsletterState === 'loading'}
              className="h-12 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 disabled:opacity-60"
            >
              {newsletterState === 'loading' ? 'Joining...' : 'Subscribe'}
            </button>
          </form>
          {newsletterState === 'success' && (
            <p className="mt-3 flex items-center justify-center gap-1 text-sm text-emerald-400">
              <Check className="h-4 w-4" /> You are on the list.
            </p>
          )}
          {newsletterState === 'error' && (
            <p className="mt-3 text-sm text-amber-300">Please enter a valid email and try again.</p>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-950 px-4 sm:px-6 lg:px-8 py-14 text-slate-400">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
            <div>
              <Link href="/" className="inline-flex items-center transition hover:opacity-90" aria-label="Webnibo Homepage">
                <img src="/webnibo.png" alt="Webnibo" className="h-10 w-auto object-contain" />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
                A carefully curated marketplace for the people building what comes next.
              </p>
              <div className="mt-5 space-y-2.5 text-xs text-slate-400">
                <a href="mailto:support.webnibo@gmail.com" className="flex items-center gap-2 transition hover:text-orange-400">
                  <Mail className="h-4 w-4 text-orange-400 shrink-0" />
                  <span>support.webnibo@gmail.com</span>
                </a>
                <a href="https://wa.me/8801318560039" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-emerald-400">
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  <span>WhatsApp: 01318560039</span>
                </a>
              </div>
            </div>
            {[
              ['Explore', 'Tiles', 'Real Estate', 'Furniture'],
              ['Categories', 'Industrial', 'Cars & Bikes', 'Collections'],
              ['Company', 'About us', 'Become a creator', 'Journal'],
              ['Support', 'Help center', 'WhatsApp: 01318560039', 'support.webnibo@gmail.com'],
            ].map(([heading, ...links]) => (
              <div key={heading}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white">{heading}</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {links.map((link) => {
                    if (link.includes('@')) {
                      return (
                        <li key={link}>
                          <a href={`mailto:${link}`} className="transition hover:text-white truncate block">{link}</a>
                        </li>
                      );
                    }
                    if (link.includes('WhatsApp')) {
                      return (
                        <li key={link}>
                          <a href="https://wa.me/8801318560039" target="_blank" rel="noopener noreferrer" className="transition hover:text-emerald-400 block">{link}</a>
                        </li>
                      );
                    }
                    return (
                      <li key={link}>
                        <button
                          type="button"
                          onClick={() => {
                            if (['Tiles', 'Real Estate', 'Furniture', 'Industrial', 'Cars & Bikes'].includes(link)) {
                              setActiveCategory(link);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="transition hover:text-white text-left"
                        >
                          {link}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Webnibo. Built for good ideas.</p>
            <p>Made with care for independent creators.</p>
          </div>
        </div>
      </footer>

      {/* ===== QUICK VIEW MODAL ===== */}
      {previewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`${previewProduct.title} preview`}
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl animate-scale-in">
            <div className="relative aspect-[2/1] overflow-hidden bg-slate-100 sm:rounded-t-2xl flex items-center justify-center">
              {previewProduct.imageFit === 'contain' && (
                <img src={previewProduct.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20 blur-md scale-110 pointer-events-none" />
              )}
              <img
                src={previewProduct.image}
                alt=""
                style={{
                  objectFit: previewProduct.imageFit || 'cover',
                  objectPosition: previewProduct.imagePosition || 'center',
                  transform: previewProduct.imageScale && previewProduct.imageScale !== 100 ? `scale(${previewProduct.imageScale / 100})` : undefined,
                }}
                className="relative z-10 h-full w-full"
              />
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                aria-label="Close product preview"
                className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white"
              >
                <X className="h-4 w-4 text-slate-700" />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">{previewProduct.category} template</p>
              <div className="mt-2 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-slate-900">{previewProduct.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{previewProduct.type}</p>
                </div>
                <span className="text-xl font-bold text-slate-900">{previewProduct.free ? 'Free' : `$${previewProduct.price}`}</span>
              </div>
              <p className="mt-5 leading-7 text-slate-600">{previewProduct.description}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => addToCart(previewProduct)}
                  className="group/modal-btn inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md active:scale-[0.99]"
                >
                  <ShoppingCart className="h-4 w-4 transition-transform group-hover/modal-btn:scale-110" />
                  {previewProduct.free ? 'Get free template' : 'Add to cart'}
                </button>
                <a
                  href={`https://wa.me/8801318560039?text=${encodeURIComponent(`Hello! I am interested in "${previewProduct.title}" (${previewProduct.type}) - ${previewProduct.free ? 'Free' : `$${previewProduct.price}`}. Could you provide more details?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`/preview/${previewProduct.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-[0.99]"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="h-4 w-4 text-orange-500" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CART DRAWER ===== */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm animate-fade-in" onClick={() => setCartOpen(false)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-slate-900" />
                <h2 className="font-heading text-lg font-bold text-slate-900">Your Cart ({cartCount})</h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-500">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-heading font-bold text-slate-900">Your cart is empty</h3>
                <p className="mt-1 text-sm text-slate-500">Discover handpicked website templates to get started.</p>
                <button type="button" onClick={() => setCartOpen(false)} className="mt-6 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 shadow-sm">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-4 flex gap-3.5">
                      <img src={item.product.image} alt={item.product.title} className="h-16 w-20 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{item.product.title}</h4>
                        <p className="text-xs text-slate-500">{item.product.type}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50">
                            <button type="button" onClick={() => changeQuantity(item.product.id, -1)} className="p-1 hover:bg-slate-200 rounded-l transition" aria-label="Decrease quantity">
                              <Minus className="h-3.5 w-3.5 text-slate-600" />
                            </button>
                            <span className="px-2 text-xs font-semibold text-slate-900">{item.quantity}</span>
                            <button type="button" onClick={() => changeQuantity(item.product.id, 1)} className="p-1 hover:bg-slate-200 rounded-r transition" aria-label="Increase quantity">
                              <Plus className="h-3.5 w-3.5 text-slate-600" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-slate-900">${item.product.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 bg-slate-50/80 p-6 space-y-4">
                  <div className="flex justify-between text-base font-bold text-slate-900">
                    <span>Total</span>
                    <span>${cartTotal}</span>
                  </div>
                  <a
                    href={`https://wa.me/8801318560039?text=${encodeURIComponent(
                      `Hello Webnibo! I want to order the following items from my cart:\n\n` +
                        cart.map((item) => `• ${item.product.title} (x${item.quantity}) - $${item.product.price * item.quantity}`).join('\n') +
                        `\n\nTotal: $${cartTotal}\n\nPlease confirm availability!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-center text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 hover:shadow-lg active:scale-[0.99]"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    <span>Send message in WhatsApp</span>
                  </a>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}

export default function TemplatesCatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">Loading templates catalog...</div>}>
      <TemplatesCatalogContent />
    </Suspense>
  );
}