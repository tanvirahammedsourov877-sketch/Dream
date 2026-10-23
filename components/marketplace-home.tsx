'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
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
  Palette,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Sofa,
  Grid3x3,
  User,
  UserCog,
  X,
  Zap,
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

const categories = [
  { label: 'Tiles', icon: Grid3x3, count: '1,240 templates' },
  { label: 'Real Estate', icon: Home, count: '2,180 templates' },
  { label: 'Furniture', icon: Sofa, count: '960 templates' },
  { label: 'Industrial', icon: Factory, count: '1,430 templates' },
  { label: 'Cars & Bikes', icon: Car, count: '870 templates' },
];

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'A Better Place To Begin',
    title: 'Bring your next idea to life.',
    description: 'Tiles, real estate, furniture, industrial, and automotive templates — the right starting point for whatever you are building next.',
    category: 'All products',
    image: 'https://images.pexels.com/photos/5065808/pexels-photo-5065808.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920',
    accent: 'from-amber-500/20 via-sky-500/10 to-transparent',
    btnText: 'Explore all templates',
    badge: 'Trending Collection',
  },
  {
    id: 2,
    tag: 'Architectural & Surface Design',
    title: 'Curated Mosaic & Tile Layouts.',
    description: 'Vibrant geometric tile kits, modern backsplashes, and ceramic surface showcases designed to transform physical spaces into digital showcases.',
    category: 'Tiles',
    image: 'https://images.pexels.com/photos/38319945/pexels-photo-38319945.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920',
    accent: 'from-amber-600/20 via-orange-500/10 to-transparent',
    btnText: 'Browse Tiles collection',
    badge: '1,240+ Templates',
  },
  {
    id: 3,
    tag: 'Luxury Properties & Living',
    title: 'Next-Gen Real Estate Showcases.',
    description: 'Photo-forward property listings, residential brochures, and penthouse portfolio templates engineered for high conversion.',
    category: 'Real Estate',
    image: 'https://images.pexels.com/photos/8482510/pexels-photo-8482510.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920',
    accent: 'from-blue-600/20 via-cyan-500/10 to-transparent',
    btnText: 'View Real Estate templates',
    badge: '2,180+ Properties',
  },
  {
    id: 4,
    tag: 'Interior & Studio Decor',
    title: 'Distinctive Furniture & Space Staging.',
    description: 'Minimalist living spaces, velvet upholstery lookbooks, and Scandinavian catalog templates crafted for premium design brands.',
    category: 'Furniture',
    image: 'https://images.pexels.com/photos/11295890/pexels-photo-11295890.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920',
    accent: 'from-emerald-600/20 via-teal-500/10 to-transparent',
    btnText: 'Browse Furniture styles',
    badge: '960+ Designs',
  },
  {
    id: 5,
    tag: 'Performance & Velocity',
    title: 'Precision Automotive & Tech Displays.',
    description: 'High-octane car exhibitions, motorcycle deal catalogs, and industrial machinery showrooms built to command immediate attention.',
    category: 'Cars & Bikes',
    image: 'https://images.pexels.com/photos/11931440/pexels-photo-11931440.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920',
    accent: 'from-rose-600/20 via-purple-500/10 to-transparent',
    btnText: 'Explore Automotive drops',
    badge: '870+ Showcases',
  },
];

const categoryFilters = ['All products', 'Tiles', 'Real Estate', 'Furniture', 'Industrial', 'Cars & Bikes'];

function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* WhatsApp Official Digital Brand Green Bubble */}
      <path
        fill="#25D366"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2z"
      />
      {/* Crisp White Phone Handset */}
      <path
        fill="#FFFFFF"
        fillRule="evenodd"
        d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.78-1.48-1.76-1.65-2.06-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.6-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"
      />
    </svg>
  );
}

function ProductCard({ product, onPreview, onAdd }: { product: Product; onPreview: (product: Product) => void; onAdd: (product: Product) => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)] hover:border-slate-300">
      {/* Thumbnail with increased height (aspect-[4/3]) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-900 flex items-center justify-center">
        {product.imageFit === 'contain' && (
          <img
            src={product.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-25 blur-md scale-110 pointer-events-none"
          />
        )}
        <img
          src={product.image}
          alt={`${product.title} template preview`}
          style={{
            objectFit: product.imageFit || 'cover',
            objectPosition: product.imagePosition || 'center',
            transform: product.imageScale && product.imageScale !== 100 ? `scale(${product.imageScale / 100})` : undefined,
          }}
          className={`relative z-10 h-full w-full transition duration-500 group-hover:scale-105 ${
            product.imageFit === 'contain' ? 'p-1' : ''
          }`}
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-md bg-slate-950/85 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
            {product.badge}
          </span>
        )}
        {product.free && (
          <span className="absolute bottom-3 left-3 rounded-md bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
            Free
          </span>
        )}
        <button
          type="button"
          onClick={() => setLiked(!liked)}
          aria-label={`${liked ? 'Remove' : 'Add'} ${product.title} ${liked ? 'from' : 'to'} favorites`}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:scale-110 hover:text-rose-500"
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Card Content (Compact & Sleek) */}
      <div className="flex flex-1 flex-col px-2.5 sm:px-3 pt-2.5 sm:pt-3 pb-2.5 sm:pb-3">
        {/* Title and Subtype */}
        <div>
          <h3
            onClick={() => onPreview(product)}
            className="text-xs sm:text-sm font-bold leading-snug text-slate-900 line-clamp-2 hover:text-amber-600 transition cursor-pointer"
            title={product.title}
          >
            {product.title}
          </h3>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate leading-tight">{product.type}</p>
        </div>

        {/* Rating and Price row (Compact) */}
        <div className="mt-2 sm:mt-2.5 flex items-center justify-between border-t border-slate-100 pt-1.5 sm:pt-2">
          <div className="flex items-center gap-0.5" title="5 star rating (28 reviews)">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-[11px] font-semibold text-slate-600">4.9</span>
          </div>
          <span className="text-sm sm:text-base font-black text-slate-950">
            {product.free ? 'Free' : `$${product.price}`}
          </span>
        </div>

        {/* Action Buttons (Wider & Bolder Live Demo) */}
        <div className="mt-2 sm:mt-2.5 flex flex-col gap-1.5">
          {/* Prominent Live Demo Button (Expanded Width & Prominence) */}
          <a
            href={`/preview/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 sm:h-9.5 w-full items-center justify-center gap-1.5 sm:gap-2 rounded-xl border-[1.5px] border-sky-500 bg-sky-50/70 text-[11px] sm:text-sm font-bold text-sky-600 shadow-xs transition-all duration-200 hover:bg-sky-500 hover:text-white hover:border-sky-500 hover:shadow active:scale-[0.99]"
            title="Open live preview in new tab"
          >
            <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.2]" />
            <span>Live Demo</span>
          </a>

          {/* Secondary Actions: Cart + Quick View */}
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
              aria-label={`Quick view ${product.title}`}
              title="Quick view"
              className="flex h-8 w-8 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 shadow-xs transition-all duration-200 hover:border-slate-300 hover:bg-white hover:text-slate-900 active:scale-95"
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action = 'View More',
  actionHref = '/templates',
  onActionClick,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: string;
  actionHref?: string;
  onActionClick?: () => void;
  center?: boolean;
}) {
  return (
    <div
      className={`mb-7 ${
        center
          ? 'relative flex flex-col items-center justify-center text-center'
          : 'flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'
      }`}
    >
      <div className={center ? 'max-w-3xl mx-auto' : ''}>
        {eyebrow && <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">{eyebrow}</p>}
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm sm:text-base text-slate-500 font-normal max-w-2xl mx-auto">{subtitle}</p>}
      </div>
      {action && (
        <div className={center ? 'mt-3 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:mt-0' : ''}>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 transition hover:translate-x-0.5"
            >
              <span>{action}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onActionClick}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 transition hover:translate-x-0.5"
            >
              <span>{action}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function MarketplaceHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All products');
  const [sortBy, setSortBy] = useState('Featured');
  const [freeOnly, setFreeOnly] = useState(false);
  const [email, setEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [isCarouselPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const topBarRef = useRef<HTMLDivElement | null>(null);
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [topBarHeight, setTopBarHeight] = useState(69);
  const [isFilterSticky, setIsFilterSticky] = useState(false);

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

  useEffect(() => {
    const updateTopBarHeight = () => {
      if (topBarRef.current) {
        setTopBarHeight(topBarRef.current.offsetHeight);
      }
    };
    updateTopBarHeight();
    window.addEventListener('resize', updateTopBarHeight);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && topBarRef.current) {
      ro = new ResizeObserver(updateTopBarHeight);
      ro.observe(topBarRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateTopBarHeight);
      if (ro) ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sentinelRef.current) {
        const rect = sentinelRef.current.getBoundingClientRect();
        setIsFilterSticky(rect.top <= topBarHeight + 35);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [topBarHeight]);

  const filteredProducts = useMemo(() => {
    const currentProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;
    const normalizedQuery = query.trim().toLowerCase();
    const matches = currentProducts.filter((product) => {
      const matchesQuery = !normalizedQuery || `${product.title} ${product.type} ${product.category}`.toLowerCase().includes(normalizedQuery);
      const matchesCategory = activeCategory === 'All products' || product.category === activeCategory;
      return matchesCategory && (!freeOnly || Boolean(product.free)) && matchesQuery;
    });
    return [...matches].sort((a, b) => sortBy === 'Price: low to high' ? a.price - b.price : sortBy === 'Price: high to low' ? b.price - a.price : 0);
  }, [products, activeCategory, freeOnly, query, sortBy]);

  // Curated 5 featured templates across diverse categories for top section
  const featuredMarketplaceProducts = useMemo(() => {
    const currentProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;
    const categoryOrder = ['Tiles', 'Real Estate', 'Furniture', 'Industrial', 'Cars & Bikes'];
    const picked: Product[] = [];
    for (const cat of categoryOrder) {
      const found = currentProducts.find((p) => p.category === cat && !picked.some((x) => x.id === p.id));
      if (found) picked.push(found);
    }
    for (const p of currentProducts) {
      if (picked.length >= 5) break;
      if (!picked.some((x) => x.id === p.id)) picked.push(p);
    }
    return picked.slice(0, 5);
  }, [products]);

  // 5 Most recently added products
  const recentlyAddedProducts = useMemo(() => {
    const currentProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;
    return [...currentProducts].slice(0, 5);
  }, [products]);

  // 5 Bestseller products
  const bestsellerProducts = useMemo(() => {
    const currentProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;
    return [...currentProducts].sort((a, b) => b.price - a.price).slice(0, 5);
  }, [products]);

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
    setCart((current) => current.flatMap((item) => item.product.id === productId ? (item.quantity + amount > 0 ? [{ ...item, quantity: item.quantity + amount }] : []) : [item]));
  }

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
      return Math.round((cartTotal * appliedCoupon.discountValue) / 100);
    }
    return Math.min(cartTotal, appliedCoupon.discountValue);
  }, [appliedCoupon, cartTotal]);

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  function handleApplyCoupon() {
    if (!couponCodeInput.trim()) {
      setCouponFeedback({ msg: 'Please enter a coupon code', type: 'error' });
      return;
    }
    const coupons = getLocalCoupons();
    const found = coupons.find((c) => c.code.toUpperCase() === couponCodeInput.trim().toUpperCase());
    if (!found) {
      setCouponFeedback({ msg: 'Invalid promo code', type: 'error' });
      return;
    }
    if (found.status !== 'Active') {
      setCouponFeedback({ msg: 'This coupon has expired', type: 'error' });
      return;
    }
    if (found.usageCount >= found.usageLimit) {
      setCouponFeedback({ msg: 'Usage limit reached for this coupon', type: 'error' });
      return;
    }
    setAppliedCoupon(found);
    setCouponFeedback({
      msg: `Promo code ${found.code} applied: ${found.discountType === 'percentage' ? found.discountValue + '%' : '$' + found.discountValue} OFF!`,
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

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) { setNewsletterState('error'); return; }
    setNewsletterState('loading');
    try {
      saveLocalSubscriber({ email: normalizedEmail, source: 'Homepage Footer' });
      const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: normalizedEmail }) });
      if (!response.ok) { setNewsletterState('error'); return; }
      setNewsletterState('success'); setEmail('');
    } catch { setNewsletterState('error'); }
  }

  return (
    <main className="min-h-screen bg-[#f1f9fc]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white shadow-sm">
        <div ref={topBarRef} className="mx-auto flex max-w-[1720px] items-center justify-between gap-2.5 sm:gap-4 lg:gap-6 xl:gap-8 px-4 sm:px-6 lg:px-8 py-1 sm:py-1.5">
          {/* 1. Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-slate-900 lg:hidden p-1 -ml-1 rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <a href="#top" className="flex shrink-0 items-center p-0 m-0 transition hover:opacity-95" aria-label="Webnibo Homepage">
              <img
                src="/webnibo.png"
                alt="Webnibo"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
              />
            </a>
          </div>

          {/* 2. Category Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {[
              { label: 'Home', value: 'All products', icon: Home, href: '#top', isHome: true },
              { label: 'Tiles', value: 'Tiles', icon: Grid3x3, href: '/templates?category=Tiles' },
              { label: 'Real Estate', value: 'Real Estate', icon: Home, href: '/templates?category=Real+Estate' },
              { label: 'Furniture', value: 'Furniture', icon: Sofa, href: '/templates?category=Furniture' },
              { label: 'Industrial', value: 'Industrial', icon: Factory, href: '/templates?category=Industrial' },
              { label: 'Cars & Bikes', value: 'Cars & Bikes', icon: Car, href: '/templates?category=Cars+%26+Bikes' },
            ].map((item) => {
              const isActive = activeCategory === item.value;
              const IconComponent = item.icon;
              return item.isHome ? (
                <a
                  key={item.label}
                  href="#top"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative flex flex-col items-center justify-center rounded-2xl px-3 xl:px-3.5 py-1.5 transition-all duration-200 text-slate-700 hover:text-[#f97316] hover:bg-slate-50/80"
                >
                  <IconComponent className="h-5 w-5 transition-transform duration-200 group-hover:scale-105 stroke-[1.8] text-slate-700 group-hover:text-[#f97316]" />
                  <span className="mt-0.5 text-xs font-medium text-slate-700 transition-colors duration-200 group-hover:text-[#f97316]">
                    {item.label}
                  </span>
                  <span className="mt-1 h-[2.5px] w-7 rounded-full transition-all duration-200 bg-transparent" />
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative flex flex-col items-center justify-center rounded-2xl px-3 xl:px-3.5 py-1.5 transition-all duration-200 text-slate-700 hover:text-[#f97316] hover:bg-slate-50/80"
                >
                  <IconComponent className="h-5 w-5 transition-transform duration-200 group-hover:scale-105 stroke-[1.8] text-slate-700 group-hover:text-[#f97316]" />
                  <span className="mt-0.5 text-xs font-medium text-slate-700 transition-colors duration-200 group-hover:text-[#f97316]">
                    {item.label}
                  </span>
                  <span className="mt-1 h-[2.5px] w-7 rounded-full transition-all duration-200 bg-transparent" />
                </Link>
              );
            })}
          </nav>

          {/* 3. Search Bar (Equally spaced between Category Links and Right Actions) */}
          <div className="flex-1 max-w-xs sm:max-w-sm lg:flex-none lg:w-[330px] xl:w-[410px] shrink-0 min-w-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) {
                  window.location.href = `/templates?q=${encodeURIComponent(query.trim())}`;
                } else {
                  window.location.href = '/templates';
                }
              }}
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
            {/* Vertical Divider Line */}
            <div className="hidden sm:block h-6 w-[1px] bg-slate-200 mx-0.5" />

            {/* Cart Button with Orange Count Badge */}
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

            {/* Admin / Account Button */}
            <a
              href="/admin"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f0f4f9] text-slate-700 transition hover:bg-slate-200/80 hover:text-slate-900 active:scale-95"
              aria-label="Admin / User Account"
              title="Admin Panel & Account"
            >
              <User className="h-5 w-5 stroke-[1.8]" />
            </a>
          </div>
        </div>


        {/* Mobile Drawer (When hamburger menu is open) */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Home', value: 'All products', icon: Home, href: '#top', isHome: true },
                { label: 'Tiles', value: 'Tiles', icon: Grid3x3, href: '/templates?category=Tiles' },
                { label: 'Real Estate', value: 'Real Estate', icon: Home, href: '/templates?category=Real+Estate' },
                { label: 'Furniture', value: 'Furniture', icon: Sofa, href: '/templates?category=Furniture' },
                { label: 'Industrial', value: 'Industrial', icon: Factory, href: '/templates?category=Industrial' },
                { label: 'Cars & Bikes', value: 'Cars & Bikes', icon: Car, href: '/templates?category=Cars+%26+Bikes' },
              ].map((item) => {
                const IconComponent = item.icon;
                return item.isHome ? (
                  <a
                    key={item.label}
                    href="#top"
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex flex-col items-center justify-center rounded-xl p-3 text-center transition bg-slate-50 text-slate-700 hover:bg-slate-100"
                  >
                    <IconComponent className="h-5 w-5 mb-1 text-slate-700" />
                    <span className="text-xs">{item.label}</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col items-center justify-center rounded-xl p-3 text-center transition bg-slate-50 text-slate-700 hover:bg-slate-100"
                  >
                    <IconComponent className="h-5 w-5 mb-1 text-slate-700" />
                    <span className="text-xs">{item.label}</span>
                  </Link>
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

      <section
        id="top"
        className="relative isolate z-0 min-h-[560px] sm:min-h-[620px] lg:min-h-[660px] overflow-hidden bg-slate-950 text-white flex items-center"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        {/* Background Images with Crossfade */}
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`h-full w-full object-cover transition-transform duration-1000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Cinematic Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
              <div className={`absolute inset-0 bg-gradient-to-tr ${slide.accent}`} />
            </div>
          );
        })}

        {/* Floating Glowing Digital Light Orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl z-10" />
        <div className="pointer-events-none absolute right-10 bottom-1/4 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl z-10" />

        {/* Content Container */}
        <div className="relative z-20 mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="mx-auto max-w-3xl text-center">
            {/* Headline with Fade Up effect */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-sm">
              {HERO_SLIDES[currentSlide].title}
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8 drop-shadow">
              {HERO_SLIDES[currentSlide].description}
            </p>
          </div>
        </div>

        {/* Carousel Navigation Arrow Controls */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur-md shadow-lg transition-all hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 hover:scale-110 active:scale-95 sm:left-6"
        >
          <ChevronLeft className="h-6 w-6 stroke-[2]" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur-md shadow-lg transition-all hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 hover:scale-110 active:scale-95 sm:right-6"
        >
          <ChevronRight className="h-6 w-6 stroke-[2]" />
        </button>

        {/* Carousel Slide Indicators / Bottom Navigation Bar */}
        <div className="absolute bottom-5 inset-x-0 z-20 flex items-center justify-center gap-2 sm:bottom-7">
          {HERO_SLIDES.map((slide, idx) => {
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.tag}`}
                className={`group relative h-2 rounded-full transition-all duration-300 ${
                  isCurrent ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70 hover:w-4'
                }`}
              >
                <span className="sr-only">Slide {idx + 1}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Section: Website Templates for Digital Marketplace */}
      <section className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 pt-12 pb-2">
        <SectionHeading
          center={true}
          eyebrow="Digital Marketplace"
          title="Website Templates for Digital Marketplace"
          subtitle="Explore high-converting, premium website templates crafted for modern web creators."
          action="View More"
          actionHref="/templates"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
          {featuredMarketplaceProducts.map((product) => (
            <ProductCard
              key={`featured-${product.id}`}
              product={product}
              onPreview={setPreviewProduct}
              onAdd={addToCart}
            />
          ))}
        </div>
      </section>

      {/* Recently Added Section - 5 Recent Cards (Center Aligned like previous section) */}
      <section className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <SectionHeading
          center={true}
          eyebrow="Fresh Releases"
          title="Recently Added"
          subtitle="Discover the newest templates and digital designs recently added to our marketplace."
          action="View More"
          actionHref="/templates"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
          {recentlyAddedProducts.map((product) => (
            <ProductCard
              key={`recent-${product.id}`}
              product={product}
              onPreview={setPreviewProduct}
              onAdd={addToCart}
            />
          ))}
        </div>
      </section>

      {/* Bestsellers Section (Moved right below Recently Added) */}
      <section className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <SectionHeading
          center={true}
          eyebrow="Popular Choices"
          title="Bestsellers"
          subtitle="Top website templates with the highest sales volume."
          action="View More"
          actionHref="/templates"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
          {bestsellerProducts.map((product) => (
            <ProductCard
              key={`bestseller-${product.id}`}
              product={product}
              onPreview={setPreviewProduct}
              onAdd={addToCart}
            />
          ))}
        </div>

        {/* Prominent "See All" Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/templates"
            className="group inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-9 py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-slate-950/15 transition-all duration-200 hover:bg-amber-400 hover:text-slate-950 hover:shadow-xl hover:shadow-amber-400/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          >
            <span>See All Templates</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Made for Momentum Section */}
      <section className="border-y border-slate-200/80 bg-gradient-to-b from-white via-[#fcfdff] to-[#f7fafe] py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1720px] gap-10 px-4 sm:px-6 lg:px-8 lg:grid-cols-[1.05fr_1.95fr] lg:items-center">
          {/* Left Column Text Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 leading-[1.18]">
              A starting point for every kind of work.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
              Skip the blank canvas. Start with a thoughtful foundation, then shape it into something unmistakably yours.
            </p>
            <div className="mt-7">
              <Link
                href="/templates?category=Furniture"
                className="group inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-md shadow-amber-400/20 transition-all duration-200 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Browse furniture collections</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: 2 Redesigned Theme-Matching Feature Cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Card 1: Built to convert */}
            <div className="group relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-white via-amber-50/40 to-orange-50/30 p-7 sm:p-8 shadow-[0_4px_24px_rgba(245,158,11,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(245,158,11,0.14)] hover:border-amber-400">
              {/* Subtle Ambient Radial Glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-amber-400/25 to-orange-400/15 blur-2xl transition-all duration-500 group-hover:scale-150" />

              {/* Top Row: Icon Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="grid h-13 w-13 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-md shadow-amber-400/35 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
                  <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.3]" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 mt-6">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-amber-900 transition-colors">
                  Built to convert
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Thoughtful layouts that turn attention into action. Engineered with strategic visual hierarchy and tested checkout flows.
                </p>
              </div>

              {/* Card Footer Feature Line */}
              <div className="relative z-10 mt-7 flex items-center justify-between border-t border-amber-200/60 pt-4 text-xs font-bold text-amber-900">
                <span>Optimized for real revenue</span>
                <div className="grid h-6 w-6 place-items-center rounded-full bg-amber-200/60 text-slate-950 transition-all duration-200 group-hover:bg-amber-400 group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Card 2: Designed to stand out */}
            <div className="group relative overflow-hidden rounded-3xl border border-sky-200/80 bg-gradient-to-br from-white via-sky-50/40 to-blue-50/30 p-7 sm:p-8 shadow-[0_4px_24px_rgba(14,165,233,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(14,165,233,0.14)] hover:border-sky-400">
              {/* Subtle Ambient Radial Glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-sky-400/25 to-blue-500/15 blur-2xl transition-all duration-500 group-hover:scale-150" />

              {/* Top Row: Icon Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="grid h-13 w-13 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-600 text-white shadow-md shadow-sky-500/35 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1">
                  <Palette className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.2]" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 mt-6">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-sky-900 transition-colors">
                  Designed to stand out
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Distinctive visual systems for brands with a point of view. Premium typography, bespoke palettes, and tailored details.
                </p>
              </div>

              {/* Card Footer Feature Line */}
              <div className="relative z-10 mt-7 flex items-center justify-between border-t border-sky-200/60 pt-4 text-xs font-bold text-sky-900">
                <span>Unique brand personality</span>
                <div className="grid h-6 w-6 place-items-center rounded-full bg-sky-200/60 text-slate-950 transition-all duration-200 group-hover:bg-sky-400 group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1949c6] px-5 py-14 text-white"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">The good stuff, weekly</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">New products, fresh inspiration.</h2><p className="mx-auto mt-3 max-w-lg text-blue-100">A short, useful email with our newest finds. No noise, just the good stuff.</p><form onSubmit={handleNewsletterSubmit} className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" aria-label="Your email address" className="h-11 flex-1 rounded-lg border-0 px-4 text-sm text-slate-900 outline-none ring-2 ring-transparent focus:ring-white/50" /><button type="submit" disabled={newsletterState === 'loading'} className="h-11 rounded-lg bg-amber-300 px-5 text-sm font-normal text-slate-900 transition hover:bg-amber-200 disabled:opacity-60">{newsletterState === 'loading' ? 'Joining...' : 'Subscribe'}</button></form>{newsletterState === 'success' && <p className="mt-3 flex items-center justify-center gap-1 text-sm text-green-200"><Check className="h-4 w-4" /> You are on the list.</p>}{newsletterState === 'error' && <p className="mt-3 text-sm text-amber-200">Please enter a valid email and try again.</p>}<label className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-100"><input type="checkbox" className="h-3.5 w-3.5 rounded border-white/50" required /> I agree to receive occasional product updates.</label></div></section>

      <footer className="bg-[#102c3b] px-4 sm:px-6 lg:px-8 py-12 text-slate-300">
        <div className="mx-auto max-w-[1720px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div>
              <a href="#top" className="inline-flex items-center transition hover:opacity-90" aria-label="Webnibo Homepage">
                <img src="/webnibo.png" alt="Webnibo" className="h-10 w-auto object-contain" />
              </a>
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
                        <Link href="/templates" className="transition hover:text-white">
                          {link}
                        </Link>
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

      {previewProduct && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={`${previewProduct.title} preview`}><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"><div className="relative aspect-[2/1] overflow-hidden bg-slate-900 sm:rounded-t-2xl flex items-center justify-center">{previewProduct.imageFit === 'contain' && <img src={previewProduct.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25 blur-md scale-110 pointer-events-none" />}<img src={previewProduct.image} alt="" style={{ objectFit: previewProduct.imageFit || 'cover', objectPosition: previewProduct.imagePosition || 'center', transform: previewProduct.imageScale && previewProduct.imageScale !== 100 ? `scale(${previewProduct.imageScale / 100})` : undefined }} className="relative z-10 h-full w-full" /><button type="button" onClick={() => setPreviewProduct(null)} aria-label="Close product preview" className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow"><X className="h-4 w-4" /></button></div><div className="p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">{previewProduct.category} template</p><div className="mt-2 flex items-start justify-between gap-4"><div><h2 className="text-2xl font-bold text-slate-900">{previewProduct.title}</h2><p className="mt-1 text-sm text-slate-500">{previewProduct.type}</p></div><span className="text-xl font-bold text-slate-900">{previewProduct.free ? 'Free' : `$${previewProduct.price}`}</span></div><p className="mt-5 leading-7 text-slate-600">{previewProduct.description}</p>              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => addToCart(previewProduct)} className="group/modal-btn inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 text-sm font-medium text-slate-950 shadow-sm transition-all duration-200 hover:bg-amber-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]">
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
                  <ExternalLink className="h-4 w-4 text-amber-600" />
                  <span>Live preview</span>
                </a>
              </div></div></div></div>}

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40" onClick={() => setCartOpen(false)}>
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Your selection</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Shopping cart</h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping cart"
                className="text-slate-400 hover:text-slate-700"
              >
                <X />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length ? (
                <div className="space-y-4">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3">
                      <img src={product.image} alt="" className="h-16 w-20 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <p className="truncate font-semibold text-slate-900">{product.title}</p>
                          <p className="font-semibold text-slate-900">${product.price * quantity}</p>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{product.type}</p>
                        <div className="mt-2 inline-flex items-center gap-2 rounded border border-slate-200">
                          <button
                            type="button"
                            onClick={() => changeQuantity(product.id, -1)}
                            className="p-1.5 text-slate-500 hover:text-amber-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-normal">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(product.id, 1)}
                            className="p-1.5 text-slate-500 hover:text-amber-700"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingCart className="h-10 w-10 text-slate-300" />
                  <h3 className="mt-4 font-semibold text-slate-900">Your cart is empty</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    Add a template to keep it ready while you explore.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="mt-5 text-sm font-normal text-amber-700"
                  >
                    Continue browsing
                  </button>
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-slate-200 p-5">
                <div className="flex justify-between text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span>${cartTotal}</span>
                </div>
                <a
                  href={`https://wa.me/8801318560039?text=${encodeURIComponent(
                    `Hello Webnibo! I want to order the following items from my cart:\n\n` +
                      cart
                        .map(
                          (item) => `• ${item.product.title} (x${item.quantity}) - $${item.product.price * item.quantity}`
                        )
                        .join('\n') +
                      `\n\nTotal: $${cartTotal}\n\nPlease confirm availability!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-amber-400 text-sm font-bold text-slate-950 shadow-sm transition-all duration-200 hover:bg-amber-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>Send message in WhatsApp</span>
                </a>
                <p className="mt-3 text-center text-xs text-slate-400">Secure checkout for digital products.</p>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="my-8 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Secure Purchase</span>
                <h3 className="text-lg font-bold text-slate-900">Checkout & Instant Access</h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProcessCheckout} className="mt-4 space-y-4">
              {/* Order Items Summary */}
              <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between text-xs">
                    <span className="truncate font-medium text-slate-800">
                      {product.title} <span className="text-slate-400">x{quantity}</span>
                    </span>
                    <span className="font-semibold text-slate-900">${product.price * quantity}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Have a promo code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Try FOUNDRY20 or TILES15"
                    className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-mono uppercase text-slate-900 outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-amber-300 transition"
                  >
                    Apply
                  </button>
                </div>
                {couponFeedback && (
                  <p className={`mt-1.5 text-xs font-medium ${couponFeedback.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {couponFeedback.msg}
                  </p>
                )}
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    placeholder="Alex Morrison"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email (For Downloads) *</label>
                  <input
                    type="email"
                    required
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Payment Gateway</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Credit Card', 'Stripe', 'PayPal'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setCheckoutPayment(method)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-medium transition ${
                        checkoutPayment === method
                          ? 'border-amber-500 bg-amber-50 text-slate-950 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span className="text-amber-600 text-base">${finalTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-2.5 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-amber-300 disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{checkoutLoading ? 'Processing...' : `Pay $${finalTotal} & Download`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER CONFIRMATION / RECEIPT MODAL */}
      {orderReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-center animate-in fade-in zoom-in-95">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 mb-3">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Purchase Completed!</h3>
            <p className="mt-1 text-xs text-slate-500">
              Receipt <span className="font-mono font-bold text-amber-700">#{orderReceipt.id}</span> sent to{' '}
              <strong className="text-slate-800">{orderReceipt.customerEmail}</strong>
            </p>

            <div className="my-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-900">{orderReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-slate-900">${orderReceipt.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="text-slate-800">{orderReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600">{orderReceipt.status}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  alert('Template files downloaded to your device!');
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-2.5 text-xs font-medium text-slate-950 shadow-sm hover:bg-amber-300"
              >
                <Download className="h-4 w-4" />
                <span>Download Template Assets (.ZIP)</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderReceipt(null)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
