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
  Code2,
  ExternalLink,
  Eye,
  Factory,
  Heart,
  Home,
  Layout,
  Mail,
  Menu,
  Minus,
  PackageOpen,
  Palette,
  Plus,
  Rocket,
  Search,
  ShoppingCart,
  ShieldCheck,
  Smartphone,
  Sofa,
  Sparkles,
  Star,
  Grid3x3,
  User,
  X,
  Zap,
  CreditCard,
  Download,
  CheckCircle2,
  Globe,
  TrendingUp,
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
  { label: 'Tiles', icon: Grid3x3, count: '1,240+ templates' },
  { label: 'Real Estate', icon: Home, count: '2,180+ templates' },
  { label: 'Furniture', icon: Sofa, count: '960+ templates' },
  { label: 'Industrial', icon: Factory, count: '1,430+ templates' },
  { label: 'Cars & Bikes', icon: Car, count: '870+ templates' },
];

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'A Better Place To Begin',
    title: 'Bring your next idea to life.',
    description: 'Tiles, real estate, furniture, industrial, and automotive templates — the right starting point for whatever you are building next.',
    category: 'All products',
    image: 'https://images.pexels.com/photos/5065808/pexels-photo-5065808.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920',
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
    btnText: 'Explore Automotive drops',
    badge: '870+ Showcases',
  },
];

const STATS = [
  { icon: PackageOpen, label: 'Templates', value: '6,680+' },
  { icon: User, label: 'Happy Buyers', value: '12,400+' },
  { icon: Star, label: 'Avg. Rating', value: '4.9/5' },
  { icon: Globe, label: 'Countries', value: '45+' },
];

const FEATURES = [
  {
    icon: Code2,
    title: 'Clean, Modern Code',
    description: 'Every template ships with semantic, well-structured HTML and CSS — easy to customize and maintain.',
  },
  {
    icon: Smartphone,
    title: 'Fully Responsive',
    description: 'Pixel-perfect on every device. Mobile-first design baked into every template we sell.',
  },
  {
    icon: Rocket,
    title: 'Lightning Fast',
    description: 'Optimized for Core Web Vitals. Your sites will load fast and rank well out of the box.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Reliable',
    description: 'Best-practice security headers, clean dependencies, and no tracking bloat included.',
  },
  {
    icon: Palette,
    title: 'Easy to Customize',
    description: 'CSS variables, clear naming, and documented sections make personalization effortless.',
  },
  {
    icon: TrendingUp,
    title: 'Built to Convert',
    description: 'Strategic CTAs, optimized layouts, and proven structures that turn visitors into customers.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Browse & Discover',
    description: 'Explore our curated collection of premium templates across multiple categories.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Preview & Test',
    description: 'Try live demos on any device before you buy. See exactly what you get.',
    icon: Eye,
  },
  {
    number: '03',
    title: 'Purchase & Download',
    description: 'Secure checkout, instant download, and start building right away.',
    icon: Download,
  },
  {
    number: '04',
    title: 'Launch Your Site',
    description: 'Customize, deploy, and go live with a professional website in record time.',
    icon: Rocket,
  },
];

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

function ProductCard({ product, onPreview, onAdd }: { product: Product; onPreview: (product: Product) => void; onAdd: (product: Product) => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] card-hover hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-orange-200">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
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
          alt={`${product.title} template preview`}
          style={{
            objectFit: product.imageFit || 'cover',
            objectPosition: product.imagePosition || 'center',
            transform: product.imageScale && product.imageScale !== 100 ? `scale(${product.imageScale / 100})` : undefined,
          }}
          className="relative z-10 h-full w-full transition-transform duration-700 group-hover:scale-105"
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
            onClick={() => setLiked(!liked)}
            aria-label={`${liked ? 'Remove' : 'Add'} ${product.title} ${liked ? 'from' : 'to'} favorites`}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
          >
            <Heart className={`h-4 w-4 transition-colors ${liked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-full items-center bg-gradient-to-t from-slate-900/80 to-transparent px-3 pb-3 pt-8 transition-transform duration-300 group-hover:translate-y-0">
          <a
            href={`/preview/${product.id}`}
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
            onClick={() => onPreview(product)}
            className="line-clamp-2 cursor-pointer text-sm font-semibold leading-snug text-slate-900 transition hover:text-orange-600"
            title={product.title}
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
            className="group/btn flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-orange-500 text-xs font-semibold text-white shadow-sm shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-md hover:shadow-orange-500/30 active:scale-[0.98]"
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
      className={`mb-8 ${
        center
          ? 'relative flex flex-col items-center justify-center text-center'
          : 'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'
      }`}
    >
      <div className={center ? 'max-w-2xl mx-auto' : ''}>
        {eyebrow && (
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-600">
            <Sparkles className="h-3 w-3" />
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[40px] lg:leading-[1.15]">
          {title}
        </h2>
        {subtitle && <p className="mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">{subtitle}</p>}
      </div>
      {action && (
        <div className={center ? 'mt-4 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2' : ''}>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
            >
              <span>{action}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onActionClick}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isCarouselPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

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

  const recentlyAddedProducts = useMemo(() => {
    const currentProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;
    return [...currentProducts].slice(0, 5);
  }, [products]);

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

  const [email, setEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

  const navLinks = [
    { label: 'Home', value: 'All products', icon: Home, href: '#top', isHome: true },
    { label: 'Tiles', value: 'Tiles', icon: Grid3x3, href: '/templates?category=Tiles' },
    { label: 'Real Estate', value: 'Real Estate', icon: Home, href: '/templates?category=Real+Estate' },
    { label: 'Furniture', value: 'Furniture', icon: Sofa, href: '/templates?category=Furniture' },
    { label: 'Industrial', value: 'Industrial', icon: Factory, href: '/templates?category=Industrial' },
    { label: 'Cars & Bikes', value: 'Cars & Bikes', icon: Car, href: '/templates?category=Cars+%26+Bikes' },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ===== HEADER ===== */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-slate-200/60 shadow-sm'
            : 'border-b border-slate-200/40 bg-white/80 backdrop-blur-md'
        }`}
      >
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
            <a href="#top" className="flex shrink-0 items-center transition hover:opacity-90" aria-label="Webnibo Homepage">
              <img src="/webnibo.png" alt="Webnibo" className="h-11 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-200 hover:scale-[1.02]" />
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {navLinks.map((item) => {
              const IconComponent = item.icon;
              return item.isHome ? (
                <a
                  key={item.label}
                  href="#top"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-orange-600"
                >
                  <IconComponent className="h-4 w-4 transition-colors group-hover:text-orange-600" />
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-orange-600"
                >
                  <IconComponent className="h-4 w-4 transition-colors group-hover:text-orange-600" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1 max-w-xs sm:max-w-sm lg:flex-none lg:w-[340px] xl:w-[400px] shrink-0 min-w-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) window.location.href = `/templates?q=${encodeURIComponent(query.trim())}`;
                else window.location.href = '/templates';
              }}
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
            <a
              href="/admin"
              className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 hover:text-slate-900 active:scale-95"
              aria-label="Admin / User Account"
              title="Admin Panel & Account"
            >
              <User className="h-5 w-5" />
            </a>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-2">
              {navLinks.map((item) => {
                const IconComponent = item.icon;
                return item.isHome ? (
                  <a
                    key={item.label}
                    href="#top"
                    onClick={(e) => { e.preventDefault(); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="flex flex-col items-center justify-center rounded-xl p-3 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
                  >
                    <IconComponent className="h-5 w-5 mb-1" />
                    <span className="text-xs">{item.label}</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col items-center justify-center rounded-xl p-3 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
                  >
                    <IconComponent className="h-5 w-5 mb-1" />
                    <span className="text-xs">{item.label}</span>
                  </Link>
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

      {/* ===== HERO ===== */}
      <section
        id="top"
        className="relative isolate z-0 min-h-[600px] sm:min-h-[640px] lg:min-h-[680px] overflow-hidden bg-slate-950 text-white flex items-center"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
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
                className={`h-full w-full object-cover transition-transform duration-[2000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
            </div>
          );
        })}

        <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl z-10 animate-pulse-glow" />
        <div className="pointer-events-none absolute right-10 bottom-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl z-10" />

        <div className="relative z-20 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" />
              {HERO_SLIDES[currentSlide].tag}
            </div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-sm animate-fade-up">
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {HERO_SLIDES[currentSlide].description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/templates"
                className="group inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                {HERO_SLIDES[currentSlide].btnText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/templates?category=All+products"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Browse All
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur-md transition-all hover:bg-orange-500 hover:border-orange-500 hover:scale-110 active:scale-95 sm:left-6"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur-md transition-all hover:bg-orange-500 hover:border-orange-500 hover:scale-110 active:scale-95 sm:right-6"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2">
          {HERO_SLIDES.map((slide, idx) => {
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.tag}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCurrent ? 'w-8 bg-orange-400' : 'w-2 bg-white/40 hover:bg-white/70 hover:w-4'
                }`}
              />
            );
          })}
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 py-8 sm:grid-cols-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-heading text-xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-16">
        <SectionHeading
          center
          eyebrow="Browse by Category"
          title="Find Your Perfect Template"
          subtitle="Explore our diverse collection of premium templates across multiple industries."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={`/templates?category=${encodeURIComponent(cat.label)}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm card-hover hover:border-orange-200 hover:shadow-lg animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-50 transition-transform duration-500 group-hover:scale-150" />
                <div className="relative z-10">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 text-orange-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-slate-900">{cat.label}</h3>
                  <p className="mt-1 text-xs text-slate-500">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-16 pb-2">
        <SectionHeading
          center
          eyebrow="Digital Marketplace"
          title="Website Templates for Digital Marketplace"
          subtitle="Explore high-converting, premium website templates crafted for modern web creators."
          action="View More"
          actionHref="/templates"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {featuredMarketplaceProducts.map((product) => (
            <ProductCard key={`featured-${product.id}`} product={product} onPreview={setPreviewProduct} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* ===== RECENTLY ADDED ===== */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-14 pb-2">
        <SectionHeading
          center
          eyebrow="Fresh Releases"
          title="Recently Added"
          subtitle="Discover the newest templates and digital designs recently added to our marketplace."
          action="View More"
          actionHref="/templates"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {recentlyAddedProducts.map((product) => (
            <ProductCard key={`recent-${product.id}`} product={product} onPreview={setPreviewProduct} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* ===== BESTSELLERS ===== */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <SectionHeading
          center
          eyebrow="Popular Choices"
          title="Bestsellers"
          subtitle="Top website templates with the highest sales volume."
          action="View More"
          actionHref="/templates"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {bestsellerProducts.map((product) => (
            <ProductCard key={`bestseller-${product.id}`} product={product} onPreview={setPreviewProduct} onAdd={addToCart} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href="/templates"
            className="group inline-flex items-center gap-2.5 rounded-xl bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
          >
            <span>See All Templates</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <SectionHeading
            center
            eyebrow="Why Webnibo"
            title="Built for Modern Web Creators"
            subtitle="Everything you need to launch professional websites — clean code, responsive design, and premium aesthetics."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm card-hover hover:shadow-xl hover:border-orange-200 animate-fade-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-50/80 blur-2xl transition-all duration-500 group-hover:scale-150" />
                  <div className="relative z-10">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading
          center
          eyebrow="How It Works"
          title="From Idea to Launch in 4 Steps"
          subtitle="A simple, streamlined process to get your next website up and running in record time."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="group relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm card-hover hover:shadow-xl hover:border-orange-200 animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-3xl font-extrabold text-slate-100 group-hover:text-orange-100 transition-colors">{step.number}</span>
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-5 font-heading text-base font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute right-[-12px] top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== CTA / NEWSLETTER ===== */}
      <section className="relative overflow-hidden bg-slate-900 py-16">
        <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-20" />
        <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-300 backdrop-blur-md">
            <Mail className="h-3 w-3" />
            The good stuff, weekly
          </p>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            New products, fresh inspiration.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-slate-300">
            A short, useful email with our newest finds. No noise, just the good stuff.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
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
              className="h-12 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 disabled:opacity-60"
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
          <label className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/30" required />
            I agree to receive occasional product updates.
          </label>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-950 px-4 sm:px-6 lg:px-8 py-14 text-slate-400">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
            <div>
              <a href="#top" className="inline-flex items-center transition hover:opacity-90" aria-label="Webnibo Homepage">
                <img src="/webnibo.png" alt="Webnibo" className="h-10 w-auto object-contain" />
              </a>
              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
                A carefully curated marketplace for the people building what comes next. Premium templates for modern web creators.
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
                        <Link href="/templates" className="transition hover:text-white">{link}</Link>
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

      {/* ===== PREVIEW MODAL ===== */}
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
                  title="Inquire on WhatsApp"
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
                  title="Open live preview in new tab"
                >
                  <ExternalLink className="h-4 w-4 text-orange-500" />
                  <span>Live preview</span>
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
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">Your selection</p>
                <h2 className="mt-1 font-heading text-xl font-bold text-slate-900">Shopping cart</h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping cart"
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length ? (
                <div className="space-y-4">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3">
                      <img src={product.image} alt="" className="h-16 w-20 rounded-lg object-cover" />
                      <div className="min-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <p className="truncate font-semibold text-slate-900">{product.title}</p>
                          <p className="font-semibold text-slate-900">${product.price * quantity}</p>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{product.type}</p>
                        <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => changeQuantity(product.id, -1)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-semibold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(product.id, 1)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 transition"
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
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-300">
                    <ShoppingCart className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-heading font-bold text-slate-900">Your cart is empty</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    Add a template to keep it ready while you explore.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="mt-5 text-sm font-semibold text-orange-600 hover:text-orange-700"
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
                      cart.map((item) => `• ${item.product.title} (x${item.quantity}) - $${item.product.price * item.quantity}`).join('\n') +
                      `\n\nTotal: $${cartTotal}\n\nPlease confirm availability!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md active:scale-[0.99]"
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
    </main>
  );
}