'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  ShoppingCart,
  Zap,
  Check,
  AlertCircle,
  Loader2,
  X,
  Share2,
} from 'lucide-react';
import { Product } from '@/lib/product-types';
import { getProductById, getLocalProducts, INITIAL_PRODUCTS } from '@/lib/products-store';

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export default function LivePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const productId = typeof params?.id === 'string' ? params.id : '';

  const [product, setProduct] = useState<Product | null>(null);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [frameBlockedWarning, setFrameBlockedWarning] = useState(false);

  useEffect(() => {
    if (!productId) return;

    // Try finding product from local store or initial products
    let p = getProductById(productId);
    if (!p) {
      const all = getLocalProducts();
      p = all.find((item) => item.id === productId);
    }
    if (!p) {
      p = INITIAL_PRODUCTS.find((item) => item.id === productId);
    }

    if (p) {
      setProduct(p);
      const url = p.liveUrl || (p.free ? 'https://nextjs.org' : 'https://vercel.com/templates');
      setActiveUrl(url);
      setCustomUrlInput(url);
    }
  }, [productId]);

  // Fallback demo URL if product has none
  const effectiveUrl = activeUrl || product?.liveUrl || 'https://vercel.com/templates';

  function handleRefresh() {
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  }

  function handleAddToCart() {
    if (!product) return;
    try {
      const raw = localStorage.getItem('foundry_marketplace_cart');
      const cart = raw ? JSON.parse(raw) : [];
      const exists = cart.find((item: any) => item.product?.id === product.id);
      let updated;
      if (exists) {
        updated = cart.map((item: any) =>
          item.product?.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...cart, { product, quantity: 1 }];
      }
      localStorage.setItem('foundry_marketplace_cart', JSON.stringify(updated));
      window.dispatchEvent(new Event('cart_updated'));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch (e) {
      console.error('Error adding to cart:', e);
    }
  }

  function handleCopyShare() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Detect if iframe takes too long (common if X-Frame-Options blocks it)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeLoading) {
        setFrameBlockedWarning(true);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [iframeLoading, iframeKey]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* THEMEFOREST STYLE TOP CONTROL BAR */}
      <header className="relative z-50 flex h-14 shrink-0 items-center justify-between border-b border-slate-800/90 bg-slate-950/95 px-3 backdrop-blur-md sm:h-16 sm:px-5 shadow-lg">
        {/* Left Section: Back link, Brand & Product Title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            title="Return to Marketplace"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Back to Market</span>
          </Link>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <Link href="/" className="inline-flex items-center transition hover:opacity-90" aria-label="Webnibo Home">
            <img src="/webnibo.png" alt="Webnibo" className="h-7 w-auto object-contain" />
          </Link>

          {product && (
            <div className="min-w-0 border-l border-slate-800 pl-3 sm:pl-4">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xs font-bold text-white sm:text-sm max-w-[140px] sm:max-w-[220px] md:max-w-[320px]">
                  {product.title}
                </h1>
                <span className="hidden sm:inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-slate-700/60">
                  {product.type}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center Section: Responsive Device Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800/80 bg-slate-900/90 p-1 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setViewport('desktop');
              setIframeLoading(true);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              viewport === 'desktop'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
            title="Desktop View (100% Full Width)"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewport('tablet');
              setIframeLoading(true);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              viewport === 'tablet'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
            title="Tablet View (768px Width)"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Tablet (768px)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewport('mobile');
              setIframeLoading(true);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              viewport === 'mobile'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
            title="Mobile View (375px Width)"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Mobile (375px)</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            title="Reload Frame"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right Section: Price, Buy Now & ThemeForest 'Remove Frame' button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {product && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</span>
              <span className="text-sm font-extrabold text-amber-400">
                {product.free ? 'Free' : `$${product.price}`}
              </span>
            </div>
          )}

          {/* Add to Cart / Purchase Button */}
          {product && (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-sm ${
                addedToCart
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-400/20'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    {product.free ? 'Get Template' : 'Purchase Now'}
                  </span>
                </>
              )}
            </button>
          )}

          {/* Share Preview Link */}
          <button
            type="button"
            onClick={handleCopyShare}
            className="hidden sm:flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition"
            title="Copy Preview Link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
          </button>

          {/* ThemeForest 'Remove Frame' Button */}
          <a
            href={effectiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white hover:border-slate-600 shadow-sm"
            title="View direct live site without frame"
          >
            <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Remove Frame</span>
          </a>
        </div>
      </header>

      {/* WARNING BANNER IF SITE BLOCKS IFRAMES */}
      {frameBlockedWarning && (
        <div className="z-40 flex items-center justify-between border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-200 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>
              If this live preview is blocked by the target site&apos;s security header (X-Frame-Options), click{' '}
              <strong>Remove Frame</strong> to view the live website directly.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={effectiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Open Direct Demo
            </a>
            <button
              onClick={() => setFrameBlockedWarning(false)}
              className="text-amber-400 hover:text-amber-200 p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW CONTAINER / VIEWPORT STAGING */}
      <main className="relative flex-1 overflow-auto bg-[#0a0f1d] flex items-center justify-center p-0">
        {/* Background Grid Accent */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

        {/* LOADING INDICATOR */}
        {iframeLoading && (
          <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl">
              <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
              <div className="text-center">
                <p className="text-sm font-bold text-white">Loading Live Preview...</p>
                <p className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{effectiveUrl}</p>
              </div>
            </div>
          </div>
        )}

        {/* IFRAME FRAME CONTAINER */}
        <div
          className={`relative transition-all duration-300 flex items-center justify-center ${
            viewport === 'desktop'
              ? 'h-full w-full'
              : viewport === 'tablet'
              ? 'h-[92%] w-[768px] max-w-[95%] rounded-[24px] border-[10px] border-slate-800 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-slate-700/60 overflow-hidden'
              : 'h-[86%] w-[375px] max-w-[95%] rounded-[38px] border-[12px] border-slate-800 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-slate-700/60 overflow-hidden'
          }`}
        >
          {/* Mobile / Tablet simulated camera notch */}
          {viewport === 'mobile' && (
            <div className="pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 z-40 h-4 w-24 rounded-full bg-slate-800/90 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-slate-950" />
            </div>
          )}

          <iframe
            key={`${iframeKey}-${viewport}-${effectiveUrl}`}
            src={effectiveUrl}
            title={product ? `${product.title} Live Demo` : 'Marketplace Live Preview'}
            className="h-full w-full border-0 bg-white"
            onLoad={() => setIframeLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </main>
    </div>
  );
}
