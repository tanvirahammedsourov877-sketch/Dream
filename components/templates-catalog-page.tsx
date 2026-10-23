'use client';

import { FormEvent, useEffect, useMemo, useRef, useState, Suspense } from 'react';
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
  Star,
  Sofa,
  Grid3x3,
  User,
  X,
  CreditCard,
  ShieldCheck,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { getLocalProducts, INITIAL_PRODUCTS } from '@/lib/products-store';
import {
  saveLocalOrder,
  getLocalCoupons,
  saveLocalCoupon,
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
  const [isHovered, setIsHovered] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const previewUrl = `/preview/${product.id}`;
  const liveUrl = product.liveUrl ? product.liveUrl : previewUrl;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
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
            transform:
              product.imageScale && product.imageScale !== 100
                ? `scale(${product.imageScale / 100})`
                : undefined,
          }}
          className={`relative z-10 h-full w-full transition duration-500 group-hover:scale-105 ${
            isHovered ? 'opacity-95' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 z-20 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white backdrop-blur-md">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => setFavorite(!favorite)}
          aria-label={favorite ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full transition ${
            favorite
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-slate-700 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-2.5 sm:px-4 pt-2.5 sm:pt-4 pb-2.5 sm:pb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-amber-600 transition text-xs sm:text-sm">
              {product.title}
            </h3>
          </div>
          <p className="mt-0.5 line-clamp-1 text-[11px] sm:text-xs text-slate-500">{product.type}</p>
        </div>

        <div className="mt-2 sm:mt-2.5 flex items-center justify-between border-t border-slate-100 pt-1.5 sm:pt-2.5">
          <div className="flex items-center gap-0.5 sm:gap-1 text-xs text-amber-500">
            <Star className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 fill-current" />
            <span className="font-semibold text-slate-700 text-[10px] sm:text-xs">4.9</span>
          </div>
          <span className="text-sm sm:text-base font-extrabold text-slate-900">
            {product.free ? (
              <span className="text-emerald-700">Free</span>
            ) : (
              `$${product.price}`
            )}
          </span>
        </div>

        <div className="mt-2.5 sm:mt-3 flex flex-col gap-1.5 sm:gap-2">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 sm:h-9.5 w-full items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-sky-500 bg-sky-50/70 text-[11px] sm:text-sm font-bold text-sky-700 shadow-xs transition-all duration-200 hover:border-sky-600 hover:bg-sky-600 hover:text-white hover:shadow-sm active:scale-98"
            title="Open live preview demo in new tab"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Live Demo</span>
          </a>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onAdd(product)}
              className="group/btn flex h-8 sm:h-9.5 flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-amber-400 px-2 sm:px-3 text-xs sm:text-sm font-bold text-slate-950 shadow-sm shadow-amber-400/20 transition-all duration-200 hover:bg-amber-300 hover:shadow-md hover:shadow-amber-400/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
            >
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform duration-200 group-hover/btn:scale-110" />
              <span className="truncate">{product.free ? 'Get free template' : 'Add to cart'}</span>
            </button>

            <button
              type="button"
              onClick={() => onPreview(product)}
              title="Quick View"
              aria-label={`Quick view ${product.title}`}
              className="flex h-8 w-8 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-all duration-200 hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-800 active:scale-95"
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

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

  // Sync category param if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const loaded = getLocalProducts();
    if (loaded && loaded.length > 0) {
      setProducts(loaded);
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
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
      const matchesQuery =
        !normalizedQuery ||
        `${product.title} ${product.type} ${product.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory =
        activeCategory === 'All products' || product.category === activeCategory;
      return matchesCategory && (!freeOnly || Boolean(product.free)) && matchesQuery;
    });
    return [...matches].sort((a, b) =>
      sortBy === 'Price: low to high'
        ? a.price - b.price
        : sortBy === 'Price: high to low'
        ? b.price - a.price
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
      if (existing)
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      return [...current, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(productId: string, amount: number) {
    setCart((current) =>
      current.flatMap((item) =>
        item.product.id === productId
          ? item.quantity + amount > 0
            ? [{ ...item, quantity: item.quantity + amount }]
            : []
          : [item]
      )
    );
  }

  // Checkout states
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState('Alex Morrison');
  const [checkoutEmail, setCheckoutEmail] = useState('alex.m@designstudio.io');
  const [checkoutPayment, setCheckoutPayment] = useState<'Credit Card' | 'Stripe' | 'PayPal'>('Credit Card');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [orderReceipt, setOrderReceipt] = useState<Order | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return (cartTotal * appliedCoupon.discountValue) / 100;
    }
    return Math.min(appliedCoupon.discountValue, cartTotal);
  }, [appliedCoupon, cartTotal]);

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  function handleApplyCoupon(e: FormEvent) {
    e.preventDefault();
    const cleanCode = couponCodeInput.trim().toUpperCase();
    if (!cleanCode) return;
    const availableCoupons = getLocalCoupons();
    const found = availableCoupons.find((c) => c.code.toUpperCase() === cleanCode);
    if (!found) {
      setCouponFeedback({ msg: 'Invalid coupon code.', type: 'error' });
      return;
    }
    setAppliedCoupon(found);
    setCouponFeedback({
      msg: `Coupon "${found.code}" applied! (${found.discountType === 'percentage' ? `${found.discountValue}% off` : `$${found.discountValue} off`})`,
      type: 'success',
    });
  }

  function handleProcessCheckout(e: FormEvent) {
    e.preventDefault();
    if (!checkoutName.trim() || !checkoutEmail.trim() || !checkoutEmail.includes('@')) {
      alert('Please enter a valid customer name and email.');
      return;
    }
    setCheckoutLoading(true);
    setTimeout(() => {
      const orderTitle = cart.map((i) => `${i.product.title} (x${i.quantity})`).join(', ');
      const newOrders = saveLocalOrder({
        customerName: checkoutName.trim(),
        customerEmail: checkoutEmail.trim(),
        productTitle: orderTitle,
        amount: finalTotal,
        status: 'Completed',
        paymentMethod: checkoutPayment,
      });

      if (appliedCoupon) {
        saveLocalCoupon({
          ...appliedCoupon,
          usageCount: appliedCoupon.usageCount + 1,
        });
      }

      const placedOrder = newOrders[0];
      setCart([]);
      setCheckoutOpen(false);
      setAppliedCoupon(null);
      setCouponCodeInput('');
      setCouponFeedback(null);
      setCheckoutLoading(false);
      setOrderReceipt(placedOrder);
    }, 500);
  }

  // Newsletter
  const [email, setEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setNewsletterState('error');
      return;
    }
    setNewsletterState('loading');
    try {
      saveLocalSubscriber({ email: normalizedEmail, source: 'Catalog Page' });
      setNewsletterState('success');
      setEmail('');
    } catch {
      setNewsletterState('error');
    }
  }

  return (
    <main className="min-h-screen bg-[#f1f9fc]">
      {/* Redesigned 4-Div Balanced Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1720px] items-center justify-between gap-2.5 sm:gap-4 lg:gap-6 xl:gap-8 px-4 sm:px-6 lg:px-8 py-1 sm:py-1.5">
          {/* 1. Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-slate-900 lg:hidden p-1 -ml-1 rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/" className="flex shrink-0 items-center p-0 m-0 transition hover:opacity-95" aria-label="Webnibo Homepage">
              <img
                src="/webnibo.png"
                alt="Webnibo"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
              />
            </Link>
          </div>

          {/* 2. Category Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {[
              { label: 'Home', value: 'All products', icon: Home, isHome: true },
              { label: 'Tiles', value: 'Tiles', icon: Grid3x3 },
              { label: 'Real Estate', value: 'Real Estate', icon: Home },
              { label: 'Furniture', value: 'Furniture', icon: Sofa },
              { label: 'Industrial', value: 'Industrial', icon: Factory },
              { label: 'Cars & Bikes', value: 'Cars & Bikes', icon: Car },
            ].map((item) => {
              const isActive = activeCategory === item.value;
              const IconComponent = item.icon;
              return item.isHome ? (
                <Link
                  key={item.label}
                  href="/"
                  className="group relative flex flex-col items-center justify-center rounded-2xl px-3 xl:px-3.5 py-1.5 transition-all duration-200 text-slate-700 hover:text-[#f97316] hover:bg-slate-50/80"
                >
                  <IconComponent className="h-5 w-5 transition-transform duration-200 group-hover:scale-105 stroke-[1.8] text-slate-700 group-hover:text-[#f97316]" />
                  <span className="mt-0.5 text-xs font-medium text-slate-700 transition-colors duration-200 group-hover:text-[#f97316]">
                    {item.label}
                  </span>
                  <span className="mt-1 h-[2.5px] w-7 rounded-full bg-transparent" />
                </Link>
              ) : (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => {
                    setActiveCategory(item.value);
                  }}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl px-3 xl:px-3.5 py-1.5 transition-all duration-200 ${
                    isActive
                      ? 'bg-[#fff5ee]'
                      : 'text-slate-700 hover:text-[#f97316] hover:bg-slate-50/80'
                  }`}
                >
                  <IconComponent
                    className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 stroke-[1.8] ${
                      isActive ? 'text-[#f97316]' : 'text-slate-700 group-hover:text-[#f97316]'
                    }`}
                  />
                  <span
                    className={`mt-0.5 text-xs transition-colors duration-200 ${
                      isActive
                        ? 'font-semibold text-[#f97316]'
                        : 'font-medium text-slate-700 group-hover:text-[#f97316]'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`mt-1 h-[2.5px] w-7 rounded-full transition-all duration-200 ${
                      isActive ? 'bg-[#f97316]' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* 3. Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-sm lg:flex-none lg:w-[330px] xl:w-[410px] shrink-0 min-w-0">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex w-full items-center rounded-full border border-slate-200/80 bg-[#f4f7fb] p-1 pl-3.5 sm:pl-4 transition-all focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search templates, graphics, and more..."
                className="h-8 sm:h-9 w-full min-w-0 bg-transparent px-1 sm:px-1.5 text-xs sm:text-sm font-normal text-slate-900 placeholder:text-slate-400 outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-[#ff6200] text-white shadow-sm shadow-orange-500/25 transition hover:scale-105 active:scale-95"
              >
                <Search className="h-4 w-4 stroke-[2.3]" />
              </button>
            </form>
          </div>

          {/* 4. Actions: Divider + Cart + Admin/Account Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 shrink-0">
            <div className="hidden sm:block h-6 w-[1px] bg-slate-200 mx-0.5" />

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f0f4f9] text-slate-700 transition hover:bg-slate-200/80 hover:text-slate-900 active:scale-95"
              aria-label="Open shopping cart"
            >
              <ShoppingCart className="h-5 w-5 stroke-[1.8]" />
              <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[#ff5500] text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
                {cartCount}
              </span>
            </button>

            <Link
              href="/admin"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f0f4f9] text-slate-700 transition hover:bg-slate-200/80 hover:text-slate-900 active:scale-95"
              aria-label="Admin / User Account"
              title="Admin Panel & Account"
            >
              <User className="h-5 w-5 stroke-[1.8]" />
            </Link>
          </div>
        </div>


        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Home', value: 'All products', icon: Home, isHome: true },
                { label: 'Tiles', value: 'Tiles', icon: Grid3x3 },
                { label: 'Real Estate', value: 'Real Estate', icon: Home },
                { label: 'Furniture', value: 'Furniture', icon: Sofa },
                { label: 'Industrial', value: 'Industrial', icon: Factory },
                { label: 'Cars & Bikes', value: 'Cars & Bikes', icon: Car },
              ].map((item) => {
                const isActive = activeCategory === item.value;
                const IconComponent = item.icon;
                return item.isHome ? (
                  <Link
                    key={item.label}
                    href="/"
                    className="flex flex-col items-center justify-center rounded-xl p-3 text-center transition bg-slate-50 text-slate-700 hover:bg-slate-100"
                  >
                    <IconComponent className="h-5 w-5 mb-1 text-slate-700" />
                    <span className="text-xs">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => {
                      setActiveCategory(item.value);
                      setMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition ${
                      isActive
                        ? 'bg-[#fff5ee] text-[#f97316] font-semibold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 mb-1 ${isActive ? 'text-[#f97316]' : 'text-slate-700'}`} />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
            {/* Quick Contact Support in Mobile Drawer */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col gap-2 text-xs">
              <a
                href="mailto:support.webnibo@gmail.com"
                className="flex items-center gap-2 text-slate-700 hover:text-amber-600 transition"
              >
                <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="truncate">support.webnibo@gmail.com</span>
              </a>
              <a
                href="https://wa.me/8801318560039"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                <span>WhatsApp: 01318560039</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Catalog Page Content */}
      <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb Navigation & Template Count */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-900 transition flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">Templates</span>
          </div>
          <div className="font-medium">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> templates
          </div>
        </div>

        <h1 className="sr-only">All Website Templates & Digital Assets</h1>

        {/* Sticky Filter Bar */}
        <div className="mb-8 sticky top-16 sm:top-[68px] z-20 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md p-3 shadow-sm transition-shadow duration-200 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('All products')}
              className={`whitespace-nowrap px-3.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeCategory === 'All products'
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              All products
            </button>
            {activeCategory !== 'All products' && (
              <>
                <span className="text-slate-300">/</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                  <span>{activeCategory}</span>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('All products')}
                    className="rounded p-0.5 hover:bg-amber-100 transition text-amber-800"
                    title="Clear category filter"
                    aria-label="Clear category filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFreeOnly(!freeOnly)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-normal transition ${
                freeOnly
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
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
                className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-8 pr-7 text-xs font-medium text-slate-800 outline-none transition focus:border-amber-500"
              >
                <option>Featured</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            </label>
          </div>
        </div>

        {/* 5-Column Responsive Product Grid */}
        {filteredProducts.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
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
              onClick={() => {
                setActiveCategory('All products');
                setFreeOnly(false);
                setQuery('');
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-400 hover:text-slate-950"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Newsletter */}
      <section className="bg-[#1949c6] px-5 py-14 text-white mt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">The good stuff, weekly</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">New products, fresh inspiration.</h2>
          <p className="mx-auto mt-3 max-w-lg text-blue-100">A short, useful email with our newest finds. No noise, just the good stuff.</p>
          <form onSubmit={handleNewsletterSubmit} className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              aria-label="Your email address"
              className="h-11 flex-1 rounded-lg border-0 px-4 text-sm text-slate-900 outline-none ring-2 ring-transparent focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={newsletterState === 'loading'}
              className="h-11 rounded-lg bg-amber-300 px-5 text-sm font-normal text-slate-900 transition hover:bg-amber-200 disabled:opacity-60"
            >
              {newsletterState === 'loading' ? 'Joining...' : 'Subscribe'}
            </button>
          </form>
          {newsletterState === 'success' && (
            <p className="mt-3 flex items-center justify-center gap-1 text-sm text-green-200">
              <Check className="h-4 w-4" /> You are on the list.
            </p>
          )}
          {newsletterState === 'error' && (
            <p className="mt-3 text-sm text-amber-200">Please enter a valid email and try again.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#102c3b] px-4 sm:px-6 lg:px-8 py-12 text-slate-300">
        <div className="mx-auto max-w-[1720px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div>
              <Link href="/" className="inline-flex items-center transition hover:opacity-90" aria-label="Webnibo Homepage">
                <img src="/webnibo.png" alt="Webnibo" className="h-10 w-auto object-contain" />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
                A carefully curated marketplace for the people building what comes next.
              </p>
              {/* Official Contact Details */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-300">
                <a
                  href="mailto:support.webnibo@gmail.com"
                  className="flex items-center gap-2 transition hover:text-amber-400"
                >
                  <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>support.webnibo@gmail.com</span>
                </a>
                <a
                  href="https://wa.me/8801318560039"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-emerald-400"
                >
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
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">{heading}</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {links.map((link) => {
                    if (link.includes('@')) {
                      return (
                        <li key={link}>
                          <a href={`mailto:${link}`} className="transition hover:text-amber-400 truncate block">
                            {link}
                          </a>
                        </li>
                      );
                    }
                    if (link.includes('WhatsApp')) {
                      return (
                        <li key={link}>
                          <a
                            href="https://wa.me/8801318560039"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition hover:text-emerald-400 block"
                          >
                            {link}
                          </a>
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

      {/* Quick View Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={`${previewProduct.title} preview`}>
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="relative aspect-[2/1] overflow-hidden bg-slate-900 sm:rounded-t-2xl flex items-center justify-center">
              {previewProduct.imageFit === 'contain' && (
                <img src={previewProduct.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25 blur-md scale-110 pointer-events-none" />
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
              <button type="button" onClick={() => setPreviewProduct(null)} aria-label="Close product preview" className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">{previewProduct.category} template</p>
              <div className="mt-2 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{previewProduct.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{previewProduct.type}</p>
                </div>
                <span className="text-xl font-bold text-slate-900">{previewProduct.free ? 'Free' : `$${previewProduct.price}`}</span>
              </div>
              <p className="mt-5 leading-7 text-slate-600">{previewProduct.description}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => addToCart(previewProduct)}
                  className="group/modal-btn inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 text-sm font-medium text-slate-950 shadow-sm transition-all duration-200 hover:bg-amber-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <ShoppingCart className="h-4 w-4 transition-transform duration-200 group-hover/modal-btn:scale-110" />
                  {previewProduct.free ? 'Get free template' : 'Add to cart'}
                </button>
                <a
                  href={`https://wa.me/8801318560039?text=${encodeURIComponent(`Hello! I am interested in "${previewProduct.title}" (${previewProduct.type}) - ${previewProduct.free ? 'Free' : `$${previewProduct.price}`}. Could you provide more details?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Inquire on WhatsApp"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-50 px-4 text-sm font-medium text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`/preview/${previewProduct.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 hover:text-amber-700 shadow-sm active:scale-[0.99]"
                  title="Open live preview in new tab"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer & Checkout */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40" onClick={() => setCartOpen(false)}>
          <aside onClick={(e) => e.stopPropagation()} className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-slate-900" />
                <h2 className="text-lg font-bold text-slate-900">Your Cart ({cartCount})</h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition" aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-500">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">Your cart is empty</h3>
                <p className="mt-1 text-sm text-slate-500">Discover handpicked website templates to get started.</p>
                <button type="button" onClick={() => setCartOpen(false)} className="mt-6 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300 shadow-sm">
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
                          <span className="text-sm font-black text-slate-900">${item.product.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 bg-slate-50/80 p-6 space-y-4">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="Coupon code (e.g. SAVE20)"
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none uppercase tracking-wider focus:border-amber-500"
                    />
                    <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800">
                      Apply
                    </button>
                  </form>
                  {couponFeedback && (
                    <p className={`text-xs ${couponFeedback.type === 'success' ? 'text-emerald-700 font-semibold' : 'text-rose-600'}`}>
                      {couponFeedback.msg}
                    </p>
                  )}
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">${cartTotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Coupon ({appliedCoupon.code})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/8801318560039?text=${encodeURIComponent(
                      `Hello Webnibo! I want to order the following items from my cart:\n\n` +
                        cart
                          .map(
                            (item) => `• ${item.product.title} (x${item.quantity}) - $${item.product.price * item.quantity}`
                          )
                          .join('\n') +
                        `\n\nTotal: $${finalTotal.toFixed(2)}\n\nPlease confirm availability!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 text-center text-sm font-bold text-slate-950 shadow-md shadow-amber-400/20 transition hover:bg-amber-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
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

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Complete Purchase</h3>
                <p className="text-xs text-slate-500">Instant digital download after payment</p>
              </div>
              <button type="button" onClick={() => setCheckoutOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleProcessCheckout} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Email Address (Downloads sent here)</label>
                <input
                  type="email"
                  required
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Payment Method</label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {(['Credit Card', 'Stripe', 'PayPal'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setCheckoutPayment(method)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs font-bold transition ${
                        checkoutPayment === method
                          ? 'border-amber-500 bg-amber-50/50 text-amber-900 ring-2 ring-amber-400/20'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="h-4 w-4 mb-1" />
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items:</span>
                  <span>{cartCount} templates</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-200">
                  <span>Amount to pay:</span>
                  <span className="text-emerald-700">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={checkoutLoading}
                className="w-full rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-slate-950 shadow-md shadow-amber-400/30 transition hover:bg-amber-300 disabled:opacity-50"
              >
                {checkoutLoading ? 'Processing Order...' : `Pay $${finalTotal.toFixed(2)} & Download`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Success Receipt */}
      {orderReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 text-center shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-black text-slate-900">Order Completed!</h3>
            <p className="mt-1 text-xs text-slate-500">Thank you for your purchase.</p>
            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-900">{orderReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-slate-900">{orderReceipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-extrabold text-emerald-700">${orderReceipt.amount}</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  alert('Thank you! Your template files are downloading.');
                  setOrderReceipt(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Download className="h-4 w-4" />
                <span>Download Template Assets</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderReceipt(null)}
                className="rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function TemplatesCatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f1f9fc] flex items-center justify-center text-slate-500 text-sm">Loading templates catalog...</div>}>
      <TemplatesCatalogContent />
    </Suspense>
  );
}
