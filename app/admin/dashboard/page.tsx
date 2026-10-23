'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Product,
  CATEGORY_LIST,
} from '@/lib/product-types';
import {
  getLocalProducts,
  saveLocalProduct,
  deleteLocalProduct,
  resetLocalProducts,
  INITIAL_PRODUCTS,
} from '@/lib/products-store';
import { ImageDropzoneUploader } from '@/components/image-dropzone-uploader';
import {
  Order,
  Customer,
  Coupon,
  Subscriber,
  StoreSettings,
  getLocalOrders,
  saveLocalOrder,
  deleteLocalOrder,
  updateOrderStatus,
  getLocalCustomers,
  saveLocalCustomer,
  deleteLocalCustomer,
  getLocalCoupons,
  saveLocalCoupon,
  deleteLocalCoupon,
  getLocalSubscribers,
  saveLocalSubscriber,
  toggleSubscriberStatus,
  deleteLocalSubscriber,
  getLocalSettings,
  saveLocalSettings,
  REVENUE_DATA,
  CATEGORY_DISTRIBUTION,
} from '@/lib/dashboard-store';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Mail,
  Settings,
  Zap,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  Loader2,
  ExternalLink,
  Eye,
  TrendingUp,
  DollarSign,
  Download,
  Copy,
  Check,
  Bell,
  ChevronRight,
  Filter,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  Menu,
  Sparkles,
  ShoppingBag,
  Upload,
  UserPlus,
  Receipt,
  CheckCircle2,
  Globe,
  Link2,
  Heart,
  Star,
  ArrowRight,
  ImageIcon,
} from 'lucide-react';

type Tab = 'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'subscribers' | 'settings';

type EditState = {
  id?: string;
  title: string;
  type: string;
  category: string;
  price: string;
  image: string;
  description: string;
  badge: string;
  free: boolean;
  liveUrl: string;
  imageFit: 'cover' | 'contain' | 'fill';
  imageScale: number;
  imagePosition: string;
};

const emptyForm: EditState = {
  title: '',
  type: '',
  category: 'Tiles',
  price: '0',
  image: '',
  description: '',
  badge: '',
  free: false,
  liveUrl: '',
  imageFit: 'cover',
  imageScale: 100,
  imagePosition: 'center',
};

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

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  // Navigation & UI states
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [productQuery, setProductQuery] = useState('');
  const [productCategory, setProductCategory] = useState('All');
  const [editing, setEditing] = useState<EditState | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderQuery, setOrderQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [newOrderProduct, setNewOrderProduct] = useState('');
  const [newOrderCustomerName, setNewOrderCustomerName] = useState('');
  const [newOrderCustomerEmail, setNewOrderCustomerEmail] = useState('');
  const [newOrderAmount, setNewOrderAmount] = useState('35');
  const [newOrderPayment, setNewOrderPayment] = useState<'Stripe' | 'PayPal' | 'Credit Card'>('Stripe');
  const [newOrderStatus, setNewOrderStatus] = useState<Order['status']>('Completed');

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerQuery, setCustomerQuery] = useState('');
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<{ id?: string; name: string; email: string; location: string; status: 'VIP' | 'Active' | 'Inactive' } | null>(null);

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('20');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponLimit, setNewCouponLimit] = useState('100');
  const [newCouponExpiry, setNewCouponExpiry] = useState('2026-12-31');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Subscribers state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subQuery, setSubQuery] = useState('');
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [newSubEmail, setNewSubEmail] = useState('');

  // Settings state
  const [settings, setSettings] = useState<StoreSettings>(getLocalSettings());
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Notifications popup
  const [showNotifications, setShowNotifications] = useState(false);

  // Chart Metric Toggle & File Input
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders'>('revenue');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Load all initial local data
  const loadAllData = useCallback(() => {
    setProducts(getLocalProducts());
    setOrders(getLocalOrders());
    setCustomers(getLocalCustomers());
    setCoupons(getLocalCoupons());
    setSubscribers(getLocalSubscribers());
    setSettings(getLocalSettings());
  }, []);

  useEffect(() => {
    setMounted(true);
    loadAllData();

    const handleUpdate = () => loadAllData();
    window.addEventListener('products_updated', handleUpdate);
    window.addEventListener('orders_updated', handleUpdate);
    window.addEventListener('customers_updated', handleUpdate);
    window.addEventListener('coupons_updated', handleUpdate);
    window.addEventListener('subscribers_updated', handleUpdate);
    window.addEventListener('settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('products_updated', handleUpdate);
      window.removeEventListener('orders_updated', handleUpdate);
      window.removeEventListener('customers_updated', handleUpdate);
      window.removeEventListener('coupons_updated', handleUpdate);
      window.removeEventListener('subscribers_updated', handleUpdate);
      window.removeEventListener('settings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadAllData]);

  // Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  // Dynamic Overview Metrics
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'Refunded')
      .reduce((sum, o) => sum + o.amount, 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const totalCustomersCount = customers.length;
  const activeProductsCount = products.length;
  const freeProductsCount = products.filter((p) => p.free).length;

  const dynamicCategoryDistribution = useMemo(() => {
    const total = products.length || 1;
    const catMap: Record<string, { count: number; color: string }> = {
      Tiles: { count: 0, color: '#f59e0b' },
      'Real Estate': { count: 0, color: '#3b82f6' },
      Furniture: { count: 0, color: '#10b981' },
      Industrial: { count: 0, color: '#8b5cf6' },
      'Cars & Bikes': { count: 0, color: '#ec4899' },
    };
    products.forEach((p) => {
      if (catMap[p.category]) {
        catMap[p.category].count++;
      }
    });
    return Object.entries(catMap).map(([name, info]) => ({
      name,
      count: info.count,
      value: Math.round((info.count / total) * 100),
      color: info.color,
    }));
  }, [products]);

  const dynamicRevenueData = useMemo(() => {
    return REVENUE_DATA.map((item, idx) => {
      if (idx === REVENUE_DATA.length - 1) {
        return {
          ...item,
          revenue: Math.max(item.revenue, totalRevenue),
          orders: Math.max(item.orders, totalOrdersCount),
        };
      }
      return item;
    });
  }, [totalRevenue, totalOrdersCount]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchQuery =
      !productQuery.trim() ||
      `${p.title} ${p.type} ${p.category}`.toLowerCase().includes(productQuery.trim().toLowerCase());
    const matchCat = productCategory === 'All' || p.category === productCategory;
    return matchQuery && matchCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchQuery =
      !orderQuery.trim() ||
      `${o.id} ${o.customerName} ${o.customerEmail} ${o.productTitle}`
        .toLowerCase()
        .includes(orderQuery.trim().toLowerCase());
    const matchStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchQuery && matchStatus;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter(
    (c) =>
      !customerQuery.trim() ||
      `${c.name} ${c.email} ${c.location}`.toLowerCase().includes(customerQuery.trim().toLowerCase())
  );

  // Filtered Subscribers
  const filteredSubscribers = subscribers.filter(
    (s) => !subQuery.trim() || s.email.toLowerCase().includes(subQuery.trim().toLowerCase())
  );

  // Product CRUD
  function handleSaveProduct() {
    if (!editing) return;
    if (!editing.title.trim() || !editing.type.trim() || !editing.image.trim() || !editing.description.trim()) {
      showToast('Please fill all required fields');
      return;
    }
    const price = parseFloat(editing.price);
    if (isNaN(price) || price < 0) {
      showToast('Invalid price entered');
      return;
    }

    saveLocalProduct({
      id: editing.id,
      title: editing.title.trim(),
      type: editing.type.trim(),
      category: editing.category,
      price,
      image: editing.image.trim(),
      description: editing.description.trim(),
      badge: editing.badge.trim() || null,
      free: editing.free,
      liveUrl: editing.liveUrl.trim() || null,
      imageFit: editing.imageFit,
      imageScale: editing.imageScale,
      imagePosition: editing.imagePosition,
    });

    setEditing(null);
    setProducts(getLocalProducts());
    showToast(editing.id ? 'Product updated successfully' : 'New product created');
  }

  function closeEditingModal() {
    setEditing(null);
  }

  function handleDeleteProduct(product: Product) {
    deleteLocalProduct(product.id);
    setConfirmDelete(null);
    setProducts(getLocalProducts());
    showToast('Product deleted');
  }

  function handleDuplicateProduct(product: Product) {
    saveLocalProduct({
      title: `${product.title} (Copy)`,
      type: product.type,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
      badge: 'New',
      free: product.free,
      liveUrl: product.liveUrl || null,
      imageFit: product.imageFit || 'cover',
      imageScale: product.imageScale || 100,
      imagePosition: product.imagePosition || 'center',
    });
    setProducts(getLocalProducts());
    showToast('Product duplicated');
  }

  function handleResetDemoData() {
    if (confirm('Are you sure you want to reset all products to factory demo templates?')) {
      resetLocalProducts();
      loadAllData();
      showToast('Reset to demo templates completed');
    }
  }

  // Coupon Actions
  function handleCreateCoupon() {
    if (!newCouponCode.trim()) {
      showToast('Enter a coupon code');
      return;
    }
    const val = parseFloat(newCouponDiscount);
    if (isNaN(val) || val <= 0) {
      showToast('Enter a valid discount value');
      return;
    }

    const updated = saveLocalCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: val,
      usageLimit: parseInt(newCouponLimit) || 100,
      expiryDate: newCouponExpiry,
      status: 'Active',
    });
    setCoupons(updated);
    setCouponModalOpen(false);
    setNewCouponCode('');
    showToast(`Coupon ${newCouponCode.toUpperCase()} created!`);
  }

  function handleDeleteCoupon(id: string) {
    const updated = deleteLocalCoupon(id);
    setCoupons(updated);
    showToast('Coupon removed');
  }

  function handleCopyCoupon(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
    showToast(`Code "${code}" copied to clipboard`);
  }

  // Order Actions
  function handleCreateManualOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!newOrderCustomerName.trim() || !newOrderCustomerEmail.trim()) {
      showToast('Enter customer name and email');
      return;
    }
    const amount = parseFloat(newOrderAmount);
    if (isNaN(amount) || amount < 0) {
      showToast('Enter a valid amount');
      return;
    }
    const productTitle = newOrderProduct || (products[0]?.title ?? 'Custom Marketplace Item');
    const updated = saveLocalOrder({
      customerName: newOrderCustomerName.trim(),
      customerEmail: newOrderCustomerEmail.trim(),
      productTitle,
      amount,
      paymentMethod: newOrderPayment,
      status: newOrderStatus,
    });
    setOrders(updated);
    setOrderModalOpen(false);
    setNewOrderCustomerName('');
    setNewOrderCustomerEmail('');
    showToast('New order created successfully');
  }

  function handleDeleteOrder(orderId: string) {
    if (confirm('Are you sure you want to delete this order?')) {
      const updated = deleteLocalOrder(orderId);
      setOrders(updated);
      showToast('Order removed');
    }
  }

  function handleOrderStatusChange(orderId: string, status: Order['status']) {
    const updated = updateOrderStatus(orderId, status);
    setOrders(updated);
    showToast(`Order status updated to ${status}`);
  }

  // Customer Actions
  function handleSaveCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.name.trim() || !editingCustomer.email.trim()) {
      showToast('Please enter customer name and email');
      return;
    }
    const updated = saveLocalCustomer({
      id: editingCustomer.id,
      name: editingCustomer.name.trim(),
      email: editingCustomer.email.trim(),
      location: editingCustomer.location.trim() || 'Worldwide',
      status: editingCustomer.status,
    });
    setCustomers(updated);
    setCustomerModalOpen(false);
    setEditingCustomer(null);
    showToast(editingCustomer.id ? 'Customer updated' : 'Customer created');
  }

  function handleDeleteCustomer(customerId: string) {
    if (confirm('Are you sure you want to remove this customer record?')) {
      const updated = deleteLocalCustomer(customerId);
      setCustomers(updated);
      showToast('Customer removed');
    }
  }

  // Subscriber Actions
  function handleCreateSubscriber(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubEmail.trim() || !newSubEmail.includes('@')) {
      showToast('Please enter a valid email');
      return;
    }
    const updated = saveLocalSubscriber({
      email: newSubEmail.trim(),
      source: 'Admin Panel',
    });
    setSubscribers(updated);
    setSubModalOpen(false);
    setNewSubEmail('');
    showToast('Subscriber added');
  }

  function handleToggleSub(id: string) {
    const updated = toggleSubscriberStatus(id);
    setSubscribers(updated);
    showToast('Subscription status toggled');
  }

  function handleDeleteSub(id: string) {
    const updated = deleteLocalSubscriber(id);
    setSubscribers(updated);
    showToast('Subscriber removed');
  }

  // Backup Import Handler
  function handleImportBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);
        if (data.products && Array.isArray(data.products)) {
          localStorage.setItem('foundry_marketplace_products', JSON.stringify(data.products));
        }
        if (data.orders && Array.isArray(data.orders)) {
          localStorage.setItem('foundry_orders', JSON.stringify(data.orders));
        }
        if (data.customers && Array.isArray(data.customers)) {
          localStorage.setItem('foundry_customers', JSON.stringify(data.customers));
        }
        if (data.coupons && Array.isArray(data.coupons)) {
          localStorage.setItem('foundry_coupons', JSON.stringify(data.coupons));
        }
        if (data.subscribers && Array.isArray(data.subscribers)) {
          localStorage.setItem('foundry_subscribers', JSON.stringify(data.subscribers));
        }
        if (data.settings && typeof data.settings === 'object') {
          localStorage.setItem('foundry_settings', JSON.stringify(data.settings));
        }
        loadAllData();
        showToast('Backup restored successfully!');
      } catch {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // Settings Save
  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    saveLocalSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
    showToast('Settings saved successfully');
  }

  // Export Data JSON
  function handleExportData() {
    const data = {
      exportDate: new Date().toISOString(),
      products,
      orders,
      customers,
      coupons,
      subscribers,
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foundry_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Backup JSON exported');
  }

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'products', label: 'Products', icon: Package, badge: products.length },
    { id: 'orders', label: 'Orders & Sales', icon: ShoppingCart, badge: orders.length },
    { id: 'customers', label: 'Customers', icon: Users, badge: customers.length },
    { id: 'coupons', label: 'Coupons & Deals', icon: Tag, badge: coupons.filter((c) => c.status === 'Active').length },
    { id: 'subscribers', label: 'Subscribers', icon: Mail, badge: subscribers.length },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-3 font-bold text-slate-950 shadow-xl shadow-amber-400/25 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <Check className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* LEFT SIDEBAR - Dark Black matching homepage navbar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800 bg-slate-950 shadow-xl transition-all duration-300 lg:static ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
          <a href="/" className="flex items-center overflow-hidden transition hover:opacity-90" aria-label="Webnibo Home">
            <img
              src="/webnibo.png"
              alt="Webnibo Admin"
              className={sidebarOpen ? "h-9 w-auto object-contain" : "h-7 w-auto object-contain"}
            />
          </a>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:block transition"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Status Pill */}
        {sidebarOpen && (
          <div className="mx-4 mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-medium text-amber-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400"></span>
                </span>
                Local Store Active
              </span>
              <span className="rounded-md border border-amber-400/30 bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                OFFLINE READY
              </span>
            </div>
          </div>
        )}

        {/* Sidebar Nav Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setMobileMenuOpen(false);
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-normal transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-medium shadow-md shadow-amber-400/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 transition ${
                      isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'
                    }`}
                  />
                  {sidebarOpen && <span className="tracking-tight">{item.label}</span>}
                </div>
                {sidebarOpen && item.badge !== null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-normal transition ${
                      isActive
                        ? 'bg-slate-950 text-amber-400 font-semibold'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="border-t border-slate-800/80 p-3 bg-slate-950">
          <div
            className={`flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <div className="relative">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400 text-sm font-bold text-slate-950 shadow-sm">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-500" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-xs font-medium text-white">{user.email}</span>
                <span className="text-[10px] font-medium text-amber-400">Super Administrator</span>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={async () => {
                  await signOut();
                  router.push('/admin');
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
          {sidebarOpen && (
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 py-2 text-xs font-medium text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white hover:border-amber-400/40"
            >
              <span>View Storefront</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#f8fafc]">
        {/* TOP HEADER BAR - Clean White */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 capitalize">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'products' && 'Templates & Products'}
                {activeTab === 'orders' && 'Orders & Transactions'}
                {activeTab === 'customers' && 'Customer Management'}
                {activeTab === 'coupons' && 'Promotions & Coupons'}
                {activeTab === 'subscribers' && 'Newsletter Audience'}
                {activeTab === 'settings' && 'Store Settings & Backup'}
              </h1>
              <p className="text-xs font-normal text-slate-500">
                Foundry Digital Marketplace Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Add Product Button */}
            <button
              onClick={() => {
                setActiveTab('products');
                setEditing({ ...emptyForm });
              }}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-normal text-slate-950 shadow-sm shadow-amber-400/30 transition hover:bg-amber-300"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow">
                  {(orders.length > 0 ? 1 : 0) + (subscribers.length > 0 ? 1 : 0) + (coupons.length > 0 ? 1 : 0)}
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in">
                  <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Notifications
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-semibold text-amber-700 hover:underline"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {orders.length > 0 ? (
                      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-2.5">
                        <ShoppingCart className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">Latest order #{orders[0].id}</p>
                          <p className="text-[11px] text-slate-500">
                            {orders[0].customerName} bought {orders[0].productTitle} (${orders[0].amount})
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {subscribers.length > 0 ? (
                      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-2.5">
                        <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">New subscriber</p>
                          <p className="text-[11px] text-slate-500">{subscribers[0].email} joined</p>
                        </div>
                      </div>
                    ) : null}

                    {coupons.length > 0 ? (
                      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-2.5">
                        <Sparkles className="h-4 w-4 text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{coupons[0].code} coupon active</p>
                          <p className="text-[11px] text-slate-500">
                            Used {coupons[0].usageCount || 0} / {coupons[0].usageLimit} times
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* Live Storefront Link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-amber-800 sm:flex"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              <span>Storefront</span>
            </a>
          </div>
        </header>

        {/* SCROLLABLE VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards Grid - White Cards with Yellow Accents */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Revenue Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Total Revenue
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-800">
                      <DollarSign className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">${totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="flex items-center font-medium text-emerald-600">
                      <ArrowUpRight className="h-3.5 w-3.5" /> Live Orders Total
                    </span>
                    <span className="text-slate-500 font-normal">from {orders.filter(o => o.status !== 'Refunded').length} paid orders</span>
                  </div>
                </div>

                {/* Orders Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Total Orders
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                      <ShoppingCart className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">
                      {totalOrdersCount}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="flex items-center font-medium text-emerald-600">
                      <ArrowUpRight className="h-3.5 w-3.5" /> {orders.filter(o => o.status === 'Completed').length} Completed
                    </span>
                    <span className="text-slate-500 font-normal">{orders.filter(o => o.status === 'Pending').length} Pending</span>
                  </div>
                </div>

                {/* Active Templates Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Active Templates
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
                      <Package className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">
                      {activeProductsCount}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-normal">5 Categories</span>
                    <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {freeProductsCount} Free
                    </span>
                  </div>
                </div>

                {/* Customers Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Total Customers
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Users className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">{totalCustomersCount}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="flex items-center font-medium text-emerald-600">
                      <ArrowUpRight className="h-3.5 w-3.5" /> {customers.filter(c => c.status === 'VIP').length} VIP
                    </span>
                    <span className="text-slate-500 font-normal">{customers.filter(c => c.status === 'Active').length} Active</span>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Revenue Curve Chart */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm lg:col-span-2">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Performance & Growth Trend</h3>
                      <p className="text-xs text-slate-500">Monthly progression with real-time dynamic stats</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setChartMetric('revenue')}
                        className={`rounded-lg px-3 py-1 font-medium transition ${
                          chartMetric === 'revenue'
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Revenue ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartMetric('orders')}
                        className={`rounded-lg px-3 py-1 font-medium transition ${
                          chartMetric === 'orders'
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Order Volume
                      </button>
                    </div>
                  </div>
                  <div className="h-72 w-full">
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dynamicRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="revenueGradLight" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} />
                          <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              borderColor: '#e2e8f0',
                              borderRadius: '0.75rem',
                              color: '#0f172a',
                              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey={chartMetric}
                            stroke="#f59e0b"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#revenueGradLight)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Category Share Distribution */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900">Category Performance</h3>
                    <p className="text-xs text-slate-500">Live distribution by template inventory</p>
                  </div>
                  <div className="space-y-4">
                    {dynamicCategoryDistribution.map((cat) => (
                      <div key={cat.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">{cat.name} ({cat.count})</span>
                          <span className="text-slate-900 font-bold">{cat.value}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, cat.value)}%`, backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => setActiveTab('products')}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300"
                    >
                      <span>Manage All Categories</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
                    <p className="text-xs text-slate-500">Latest template purchases processed</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-amber-700 hover:underline"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Template</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-amber-50/40 transition">
                          <td className="py-3 px-3 font-mono font-bold text-amber-800">{ord.id}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{ord.customerName}</td>
                          <td className="py-3 px-3 text-slate-600">{ord.productTitle}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">${ord.amount}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                ord.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'Processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500">{ord.date}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-amber-50 hover:text-amber-900"
                            >
                              View
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

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Controls Bar */}
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    placeholder="Search templates by title, subtype, or category..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder:font-light placeholder:text-slate-400 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
                  />
                  {productQuery && (
                    <button
                      onClick={() => setProductQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Filter */}
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORY_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {/* Reset Demo Data Button */}
                  <button
                    onClick={handleResetDemoData}
                    className="flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-bold text-slate-700 transition hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300"
                    title="Reload original 20 demo templates"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Reset Demo</span>
                  </button>

                  {/* Add Product Button */}
                  <button
                    onClick={() => setEditing({ ...emptyForm })}
                    className="flex h-11 items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-normal text-slate-950 shadow-sm shadow-amber-400/30 transition hover:bg-amber-300"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Template</span>
                  </button>
                </div>
              </div>

              {/* Products Table Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">All Products</span>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
                      {filteredProducts.length}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Manage templates & inventory</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-6">Product</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Badge</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="transition hover:bg-amber-50/30">
                          {/* Image & Title */}
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="h-12 w-16 rounded-lg object-cover bg-slate-100 border border-slate-200"
                              />
                              <div>
                                <p className="font-semibold text-slate-900">{p.title}</p>
                                <p className="text-[11px] text-slate-500">{p.type}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 font-normal text-slate-700">
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700 font-medium">
                              {p.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4">
                            {p.free ? (
                              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                                FREE
                              </span>
                            ) : (
                              <span className="text-sm font-semibold text-slate-900">${p.price}</span>
                            )}
                          </td>

                          {/* Badge */}
                          <td className="py-3.5 px-4">
                            {p.badge ? (
                              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase text-amber-900">
                                {p.badge}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <a
                                href={`/preview/${p.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg p-2 text-slate-500 hover:bg-emerald-100 hover:text-emerald-900"
                                title="Live Preview (ThemeForest Style)"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                              <button
                                onClick={() => setPreviewProduct(p)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                title="Quick Preview"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setEditing({
                                    id: p.id,
                                    title: p.title,
                                    type: p.type,
                                    category: p.category,
                                    price: String(p.price),
                                    image: p.image,
                                    description: p.description,
                                    badge: p.badge ?? '',
                                    free: p.free ?? false,
                                    liveUrl: p.liveUrl ?? '',
                                    imageFit: p.imageFit ?? 'cover',
                                    imageScale: p.imageScale ?? 100,
                                    imagePosition: p.imagePosition ?? 'center',
                                  })
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-amber-100 hover:text-amber-900"
                                title="Edit Product"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDuplicateProduct(p)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-blue-100 hover:text-blue-900"
                                title="Duplicate"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setConfirmDelete(p)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-rose-100 hover:text-rose-700"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS & TRANSACTIONS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    placeholder="Search by order ID, customer name, email..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder:font-light placeholder:text-slate-400 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none focus:border-amber-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Processing">Processing</option>
                    <option value="Pending">Pending</option>
                    <option value="Refunded">Refunded</option>
                  </select>

                  <button
                    onClick={() => {
                      setNewOrderProduct(products[0]?.title ?? 'Custom Item');
                      setOrderModalOpen(true);
                    }}
                    className="flex h-11 items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-medium text-slate-950 shadow-sm shadow-amber-400/30 transition hover:bg-amber-300"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Order</span>
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-3.5 px-6">Order ID</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Template Purchased</th>
                        <th className="py-3.5 px-4">Amount</th>
                        <th className="py-3.5 px-4">Payment</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-amber-50/30 transition">
                          <td className="py-3.5 px-6 font-mono font-bold text-amber-800">{ord.id}</td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900">{ord.customerName}</p>
                            <p className="text-[11px] text-slate-500">{ord.customerEmail}</p>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">{ord.productTitle}</td>
                          <td className="py-3.5 px-4 text-sm font-bold text-slate-900">${ord.amount}</td>
                          <td className="py-3.5 px-4 text-slate-600">{ord.paymentMethod}</td>
                          <td className="py-3.5 px-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleOrderStatusChange(ord.id, e.target.value as Order['status'])}
                              className={`rounded-lg px-2.5 py-1 text-xs font-bold outline-none border border-slate-200 ${
                                ord.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : ord.status === 'Processing'
                                  ? 'bg-blue-100 text-blue-900'
                                  : ord.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-950'
                                  : 'bg-rose-100 text-rose-900'
                              }`}
                            >
                              <option value="Completed">Completed</option>
                              <option value="Processing">Processing</option>
                              <option value="Pending">Pending</option>
                              <option value="Refunded">Refunded</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300"
                              >
                                View Receipt
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(ord.id)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                title="Delete Order"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={customerQuery}
                    onChange={(e) => setCustomerQuery(e.target.value)}
                    placeholder="Search customers by name, email, location..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder:font-light placeholder:text-slate-400 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs font-medium text-slate-600 hidden sm:block">
                    Total Buyers: <span className="text-slate-900 font-bold">{customers.length}</span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCustomer({ name: '', email: '', location: '', status: 'Active' });
                      setCustomerModalOpen(true);
                    }}
                    className="flex h-11 items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-medium text-slate-950 shadow-sm shadow-amber-400/30 transition hover:bg-amber-300"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Add Customer</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredCustomers.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-amber-400"
                      />
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h4 className="truncate font-semibold text-slate-900 text-sm">{c.name}</h4>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              c.status === 'VIP' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <p className="truncate text-xs text-slate-500">{c.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-medium">Total Orders</span>
                        <p className="font-semibold text-slate-900">{c.ordersCount} purchases</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-medium">Total Spend</span>
                        <p className="font-bold text-amber-700">${c.totalSpent}</p>
                      </div>
                      <div className="col-span-2 mt-1 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-medium">Location</span>
                          <p className="text-slate-700 font-normal">{c.location}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingCustomer({
                                id: c.id,
                                name: c.name,
                                email: c.email,
                                location: c.location,
                                status: c.status,
                              });
                              setCustomerModalOpen(true);
                            }}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-100 hover:text-amber-900"
                            title="Edit Customer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(c.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete Customer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS & DISCOUNTS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Promotions & Discount Codes</h3>
                  <p className="text-xs text-slate-500">Offer percentage or flat discounts at checkout</p>
                </div>
                <button
                  onClick={() => setCouponModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-normal text-slate-950 shadow-sm shadow-amber-400/30 hover:bg-amber-300"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:border-amber-300 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-amber-100 px-2.5 py-1 font-mono text-xs font-semibold text-amber-900">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopyCoupon(coupon.code)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                        title="Copy code"
                      >
                        {copiedCoupon === coupon.code ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="mt-3">
                      <span className="text-2xl font-bold text-slate-900">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : `$${coupon.discountValue} FLAT`}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-500 font-normal">
                        <span>Usage</span>
                        <span className="font-semibold text-slate-900">
                          {coupon.usageCount} / {coupon.usageLimit}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${Math.min(100, (coupon.usageCount / coupon.usageLimit) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between pt-2 text-[11px] text-slate-500">
                        <span>Expires {coupon.expiryDate}</span>
                        <span
                          className={`font-semibold ${
                            coupon.status === 'Active' ? 'text-emerald-700' : 'text-slate-400'
                          }`}
                        >
                          {coupon.status}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Coupon</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Newsletter Audience</h3>
                  <p className="text-xs text-slate-500">Emails captured through marketplace newsletter signup</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={subQuery}
                      onChange={(e) => setSubQuery(e.target.value)}
                      placeholder="Search email..."
                      className="h-10 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 placeholder:font-light placeholder:text-slate-400 outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <button
                    onClick={() => setSubModalOpen(true)}
                    className="flex h-10 items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 text-xs font-normal text-slate-950 shadow-sm shadow-amber-400/30 hover:bg-amber-300 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Subscriber</span>
                  </button>
                  <button
                    onClick={() => {
                      const csv =
                        'Email,Date,Source,Status\n' +
                        subscribers.map((s) => `${s.email},${s.date},${s.source},${s.status}`).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
                      a.click();
                      showToast('Subscribers CSV exported');
                    }}
                    className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-6">Email Address</th>
                      <th className="py-3 px-4">Subscribed Date</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-amber-50/30 transition">
                        <td className="py-3.5 px-6 font-semibold text-slate-900">{sub.email}</td>
                        <td className="py-3.5 px-4 text-slate-600">{sub.date}</td>
                        <td className="py-3.5 px-4 text-slate-500">{sub.source}</td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleSub(sub.id)}
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition cursor-pointer ${
                              sub.status === 'Subscribed'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title="Click to toggle status"
                          >
                            {sub.status}
                          </button>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <button
                            onClick={() => handleDeleteSub(sub.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Remove subscriber"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS & BACKUP */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-8">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-5">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    General Marketplace Settings
                  </h3>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={settings.storeName}
                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Support Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="text"
                        value={settings.whatsappNumber || ''}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        placeholder="e.g. 01318560039"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Base Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                      >
                        <option value="USD ($)">USD ($)</option>
                        <option value="EUR (€)">EUR (€)</option>
                        <option value="GBP (£)">GBP (£)</option>
                        <option value="BDT (৳)">BDT (৳)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        value={settings.taxRate}
                        onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoApproveOrders}
                        onChange={(e) => setSettings({ ...settings, autoApproveOrders: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        Automatically mark incoming orders as Completed
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        Enable Maintenance Mode (Restricts public downloads)
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-normal text-slate-950 shadow-sm shadow-amber-400/30 hover:bg-amber-300"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                    {settingsSaved && (
                      <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                        <Check className="h-4 w-4" /> Settings updated successfully
                      </span>
                    )}
                  </div>
                </div>
              </form>

              {/* Data Export & Backup */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Data Backup & Factory Reset
                </h3>
                <p className="text-xs text-slate-500">
                  Export all your products, orders, coupons, and subscribers as a single portable JSON file.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Upload className="h-4 w-4 text-slate-500" />
                    <span>Import JSON Backup</span>
                  </button>
                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Download className="h-4 w-4 text-slate-500" />
                    <span>Download JSON Backup</span>
                  </button>
                  <button
                    onClick={handleResetDemoData}
                    className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Reset to 20 Default Templates</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: CREATE / EDIT PRODUCT WITH REAL-TIME LIVE CARD PREVIEW */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-4 md:p-6 backdrop-blur-sm">
          <div className="flex flex-col w-full max-w-5xl h-[92vh] max-h-[92vh] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-100 px-6 py-3.5 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900">
                  {editing.id ? 'Edit Template' : 'Add New Marketplace Template'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Real-time Card Preview
                </span>
              </div>
              <button
                onClick={closeEditingModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable internal viewport */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* LEFT COLUMN: FORM INPUTS (7 cols) */}
              <div className="space-y-4 lg:col-span-7">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Template Title *</label>
                    <input
                      type="text"
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      placeholder="e.g. Minimalist Loft 3D Pack"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Type / Subtitle *</label>
                    <input
                      type="text"
                      value={editing.type}
                      onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                      placeholder="e.g. Architectural Assets"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Category *</label>
                    <select
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                    >
                      {CATEGORY_LIST.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Price (USD) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={editing.free}
                      value={editing.free ? '0' : editing.price}
                      onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Badge (Optional)</label>
                    <select
                      value={editing.badge}
                      onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                    >
                      <option value="">None</option>
                      <option value="Bestseller">Bestseller</option>
                      <option value="New">New</option>
                      <option value="Popular">Popular</option>
                      <option value="Featured">Featured</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editing.free}
                      onChange={(e) => setEditing({ ...editing, free: e.target.checked, price: e.target.checked ? '0' : editing.price })}
                      className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-xs font-bold text-slate-700">Mark as Free Download Template</span>
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase text-slate-600">
                      Live Demo / Preview URL (Optional)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Opens inside our marketplace ThemeForest-style viewer
                    </span>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Globe className="h-4 w-4" />
                    </div>
                    <input
                      type="url"
                      value={editing.liveUrl}
                      onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })}
                      placeholder="e.g. https://your-project.vercel.app or https://my-site.com"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-24 text-xs text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                    />
                    {editing.liveUrl && (
                      <a
                        href={editing.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-y-1.5 right-1.5 flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 text-[11px] font-bold text-amber-900 transition hover:bg-amber-200"
                        title="Test live URL directly"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Test Link</span>
                      </a>
                    )}
                  </div>
                </div>

                <ImageDropzoneUploader
                  value={editing.image}
                  onChange={(newUrl) => setEditing({ ...editing, image: newUrl })}
                  label="Template Thumbnail Image"
                  required
                />

                {/* ADJUST CARD IMAGE SIZE & FIT CONTROLS */}
                {editing.image && (
                  <div className="rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-white to-slate-50/90 p-3.5 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <SlidersHorizontal className="h-4 w-4 text-amber-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                          Adjust Card Image Size & Fit
                        </span>
                      </div>
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                        Fix Cropping / Padding
                      </span>
                    </div>

                    {/* Display Mode */}
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase text-slate-600">
                        Display Mode (Fit Style)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setEditing({ ...editing, imageFit: 'contain' })}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 px-2 text-center transition text-xs ${
                            editing.imageFit === 'contain'
                              ? 'border-amber-500 bg-amber-50 text-slate-950 font-bold ring-2 ring-amber-500/20 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                          title="Show full banner without cutting any text"
                        >
                          <span>🖼️</span>
                          <span className="font-bold">Fit Full</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditing({ ...editing, imageFit: 'cover' })}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 px-2 text-center transition text-xs ${
                            editing.imageFit === 'cover'
                              ? 'border-amber-500 bg-amber-50 text-slate-950 font-bold ring-2 ring-amber-500/20 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                          title="Fill the card (crops outer edges)"
                        >
                          <span>🔲</span>
                          <span className="font-bold">Cover (Crop)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditing({ ...editing, imageFit: 'fill' })}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 px-2 text-center transition text-xs ${
                            editing.imageFit === 'fill'
                              ? 'border-amber-500 bg-amber-50 text-slate-950 font-bold ring-2 ring-amber-500/20 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                          title="Stretch image to exact bounds"
                        >
                          <span>📐</span>
                          <span className="font-bold">Stretch</span>
                        </button>
                      </div>
                    </div>

                    {/* Scale / Zoom Slider */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold uppercase text-slate-600">
                          Zoom / Scale Percentage
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                            {editing.imageScale || 100}%
                          </span>
                          {(editing.imageScale || 100) !== 100 && (
                            <button
                              type="button"
                              onClick={() => setEditing({ ...editing, imageScale: 100 })}
                              className="text-[10px] font-medium text-slate-500 hover:text-amber-800 underline transition"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-semibold">60%</span>
                        <input
                          type="range"
                          min="60"
                          max="140"
                          step="2"
                          value={editing.imageScale || 100}
                          onChange={(e) => setEditing({ ...editing, imageScale: Number(e.target.value) })}
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-amber-500"
                        />
                        <span className="text-[10px] text-slate-400 font-semibold">140%</span>
                      </div>
                    </div>

                    {/* Alignment Position */}
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase text-slate-600">
                        Focus Alignment
                      </label>
                      <div className="grid grid-cols-5 gap-1.5 text-center">
                        {[
                          { id: 'center', label: 'Center' },
                          { id: 'top', label: 'Top' },
                          { id: 'bottom', label: 'Bottom' },
                          { id: 'left', label: 'Left' },
                          { id: 'right', label: 'Right' },
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            type="button"
                            onClick={() => setEditing({ ...editing, imagePosition: pos.id })}
                            className={`rounded-lg border py-1 px-1 text-[11px] font-medium transition ${
                              (editing.imagePosition || 'center') === pos.id
                                ? 'border-amber-500 bg-amber-50 font-bold text-amber-900 ring-1 ring-amber-400'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">Description *</label>
                  <textarea
                    rows={3}
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Comprehensive description of what is included in this template pack..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: REAL-TIME LIVE CARD PREVIEW (5 cols) */}
              <div className="lg:col-span-5">
                <div className="sticky top-2 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Live Card Preview
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Sync
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">Marketplace View</span>
                  </div>

                  {/* THE REAL-TIME MARKETPLACE PRODUCT CARD (TemplateMonster Aesthetic) */}
                  <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition duration-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
                    {/* Card Thumbnail with increased height (aspect-[4/3]) */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-900 flex items-center justify-center">
                      {editing.image ? (
                        <>
                          {editing.imageFit === 'contain' && (
                            <img
                              src={editing.image}
                              alt=""
                              aria-hidden="true"
                              className="absolute inset-0 h-full w-full object-cover opacity-25 blur-md scale-110 pointer-events-none"
                            />
                          )}
                          <img
                            src={editing.image}
                            alt={editing.title || 'Template preview'}
                            style={{
                              objectFit: editing.imageFit || 'cover',
                              objectPosition: editing.imagePosition || 'center',
                              transform: editing.imageScale && editing.imageScale !== 100 ? `scale(${editing.imageScale / 100})` : undefined,
                            }}
                            className={`relative z-10 h-full w-full transition duration-300 ${
                              editing.imageFit === 'contain' ? 'p-1' : ''
                            }`}
                          />
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400">
                          <ImageIcon className="h-8 w-8 text-slate-300 mb-1" />
                          <span className="text-[11px] font-medium text-slate-400">
                            Thumbnail preview will appear here
                          </span>
                        </div>
                      )}

                      {/* Badge if selected */}
                      {editing.badge && (
                        <span className="absolute left-3 top-3 rounded-md bg-slate-950/85 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
                          {editing.badge}
                        </span>
                      )}

                      {/* Free Tag if checked */}
                      {editing.free && (
                        <span className="absolute bottom-3 left-3 rounded-md bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
                          Free
                        </span>
                      )}

                      {/* Favorite Button Mock */}
                      <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-400 shadow-sm">
                        <Heart className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Card Content (Compact & Sleek) */}
                    <div className="px-3 pt-3 pb-3">
                      {/* Title and Subtype */}
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                          {editing.title.trim() || 'Template Title'}
                        </h3>
                        <p className="mt-0.5 truncate text-xs text-slate-500 leading-tight">
                          {editing.type.trim() || 'Subtype / Asset Category'}
                        </p>
                      </div>

                      {/* Ratings & Price row (Compact) */}
                      <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="ml-1 text-[11px] font-semibold text-slate-600">4.9</span>
                        </div>
                        <span className="text-base font-black text-slate-950">
                          {editing.free ? 'Free' : `$${editing.price || '0'}`}
                        </span>
                      </div>

                      {/* Action Buttons (Wider & Bolder Live Demo) */}
                      <div className="mt-2.5 flex flex-col gap-1.5">
                        {/* Prominent Live Demo button */}
                        <div
                          className={`flex h-9.5 w-full items-center justify-center gap-2 rounded-xl border-[1.5px] text-xs sm:text-sm font-bold transition-all ${
                            editing.liveUrl
                              ? 'border-sky-500 bg-sky-50/70 text-sky-600 shadow-xs'
                              : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <ExternalLink className="h-4 w-4 stroke-[2.2]" />
                          <span>{editing.liveUrl ? 'Live Demo' : 'Live Demo (No URL)'}</span>
                        </div>

                        {/* Secondary Actions (Restored to full comfortable size) */}
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 sm:h-9.5 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-xs sm:text-sm font-semibold text-white shadow-sm">
                            <ShoppingCart className="h-4 w-4" />
                            <span className="truncate">
                              {editing.free ? 'Get free template' : 'Add to cart'}
                            </span>
                          </div>
                          <div
                            className="flex h-9 w-9 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 shadow-xs"
                            title="Quick View"
                          >
                            <Eye className="h-4 w-4" />
                          </div>
                          <div
                            className="flex h-9 w-9 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-xs"
                            title="WhatsApp Inquiry"
                          >
                            <WhatsAppIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Summary / Status Inspector */}
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Category Tag:</span>
                      <span className="font-semibold text-slate-800">{editing.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Live Demo URL:</span>
                      {editing.liveUrl ? (
                        <span className="font-semibold text-emerald-700 truncate max-w-[170px]" title={editing.liveUrl}>
                          {editing.liveUrl}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">None provided</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Image Fit & Scale:</span>
                      <span className="font-semibold text-amber-700 capitalize">
                        {editing.imageFit || 'cover'} • {editing.imageScale || 100}% • {editing.imagePosition || 'center'}
                      </span>
                    </div>
                    {editing.description && (
                      <div className="pt-1.5 border-t border-slate-200/70">
                        <span className="block text-slate-400 mb-0.5">Description snippet:</span>
                        <p className="line-clamp-2 text-slate-600 italic">
                          "{editing.description}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer (Fixed at bottom) */}
          <div className="flex-shrink-0 flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-3.5 bg-slate-50/90 z-10">
            <button
              type="button"
              onClick={closeEditingModal}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProduct}
              className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-semibold text-slate-950 shadow-sm shadow-amber-400/30 hover:bg-amber-300 transition"
            >
              {editing.id ? 'Save Changes' : 'Create Template'}
            </button>
          </div>
        </div>
      </div>
    )}

      {/* MODAL: DELETE CONFIRMATION */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Delete Product</h3>
            <p className="mt-2 text-xs text-slate-500">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">"{confirmDelete.title}"</strong>? This will immediately remove it
              from your local store.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(confirmDelete)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-medium text-white shadow-sm shadow-rose-600/30 hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE COUPON */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Coupon</h3>
              <button
                onClick={() => setCouponModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Coupon Code *</label>
                <input
                  type="text"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH30"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 font-mono uppercase outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Discount Value *</label>
                  <input
                    type="number"
                    min="1"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={newCouponLimit}
                    onChange={(e) => setNewCouponLimit(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Expiry Date</label>
                  <input
                    type="date"
                    value={newCouponExpiry}
                    onChange={(e) => setNewCouponExpiry(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => setCouponModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCoupon}
                className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-normal text-slate-950 hover:bg-amber-300"
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW RECEIPT */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-semibold text-amber-800">{selectedOrder.id}</span>
                <h3 className="text-base font-bold text-slate-900">Purchase Invoice Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-normal">Customer Name</span>
                <span className="font-semibold text-slate-900">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-normal">Email</span>
                <span className="font-semibold text-slate-900">{selectedOrder.customerEmail}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-normal">Template Item</span>
                <span className="font-semibold text-amber-800">{selectedOrder.productTitle}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-normal">Amount Paid</span>
                <span className="font-semibold text-slate-900 text-sm">${selectedOrder.amount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-normal">Payment Gateway</span>
                <span className="font-semibold text-slate-700">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-normal">Order Status</span>
                <span className="font-semibold text-emerald-700">{selectedOrder.status}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRODUCT QUICK PREVIEW */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="relative aspect-[16/9]">
              <img src={previewProduct.image} alt={previewProduct.title} className="h-full w-full object-cover" />
              <button
                onClick={() => setPreviewProduct(null)}
                className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{previewProduct.title}</h3>
                  <p className="text-xs text-slate-500 font-normal">
                    {previewProduct.type} • {previewProduct.category}
                  </p>
                </div>
                <span className="text-base font-bold text-amber-700">
                  {previewProduct.free ? 'FREE' : `$${previewProduct.price}`}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">{previewProduct.description}</p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE MANUAL ORDER */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Order</h3>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={newOrderCustomerName}
                  onChange={(e) => setNewOrderCustomerName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Customer Email *</label>
                <input
                  type="email"
                  required
                  value={newOrderCustomerEmail}
                  onChange={(e) => setNewOrderCustomerEmail(e.target.value)}
                  placeholder="e.g. sarah@example.com"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Template / Product</label>
                <select
                  value={newOrderProduct || (products[0]?.title ?? '')}
                  onChange={(e) => setNewOrderProduct(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title} (${p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Amount ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={newOrderAmount}
                    onChange={(e) => setNewOrderAmount(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Payment Gateway</label>
                  <select
                    value={newOrderPayment}
                    onChange={(e) => setNewOrderPayment(e.target.value as any)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="Stripe">Stripe</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Crypto">Crypto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Initial Status</label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value as any)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                >
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-normal text-slate-950 shadow-sm shadow-amber-400/30 hover:bg-amber-300"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT CUSTOMER */}
      {customerModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingCustomer.id ? 'Edit Customer Details' : 'Add New Customer'}
              </h3>
              <button
                onClick={() => {
                  setCustomerModalOpen(false);
                  setEditingCustomer(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  placeholder="e.g. David Miller"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  placeholder="e.g. david@example.com"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Location / Country</label>
                <input
                  type="text"
                  value={editingCustomer.location}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, location: e.target.value })}
                  placeholder="e.g. London, UK"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Tier / Status</label>
                <select
                  value={editingCustomer.status}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, status: e.target.value as any })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerModalOpen(false);
                    setEditingCustomer(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-normal text-slate-950 shadow-sm shadow-amber-400/30 hover:bg-amber-300"
                >
                  {editingCustomer.id ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUBSCRIBER */}
      {subModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Newsletter Subscriber</h3>
              <button
                onClick={() => setSubModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubscriber} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase text-slate-600">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  placeholder="subscriber@example.com"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSubModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-normal text-slate-950 shadow-sm shadow-amber-400/30 hover:bg-amber-300"
                >
                  Add Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
