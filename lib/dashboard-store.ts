export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  amount: number;
  status: 'Completed' | 'Processing' | 'Pending' | 'Refunded';
  date: string;
  paymentMethod: 'Stripe' | 'PayPal' | 'Credit Card';
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  ordersCount: number;
  totalSpent: number;
  status: 'VIP' | 'Active' | 'Inactive';
  joinedDate: string;
  location: string;
};

export type Coupon = {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  usageCount: number;
  usageLimit: number;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Scheduled';
};

export type Subscriber = {
  id: string;
  email: string;
  date: string;
  source: string;
  status: 'Subscribed' | 'Unsubscribed';
};

export type StoreSettings = {
  storeName: string;
  supportEmail: string;
  whatsappNumber?: string;
  currency: string;
  taxRate: number;
  autoApproveOrders: boolean;
  maintenanceMode: boolean;
};

const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-9842', customerName: 'Alex Morrison', customerEmail: 'alex.m@designstudio.io', productTitle: 'Mosaic Patterns Kit', amount: 29, status: 'Completed', date: 'Just now', paymentMethod: 'Stripe' },
  { id: 'ORD-9841', customerName: 'Sophia Chen', customerEmail: 'sophia@creativescape.com', productTitle: 'Rooftop Geometry', amount: 35, status: 'Completed', date: '15 mins ago', paymentMethod: 'PayPal' },
  { id: 'ORD-9840', customerName: 'Marcus Vance', customerEmail: 'marcus@archline.de', productTitle: 'Modern Villa 3D Kit', amount: 79, status: 'Processing', date: '1 hour ago', paymentMethod: 'Stripe' },
  { id: 'ORD-9839', customerName: 'Elena Rostova', customerEmail: 'elena@nordicspaces.se', productTitle: 'Oak & Velvet Dining Set', amount: 45, status: 'Completed', date: '3 hours ago', paymentMethod: 'Credit Card' },
  { id: 'ORD-9838', customerName: 'David Kim', customerEmail: 'dkim@automotion.kr', productTitle: 'Speedster GT Concept', amount: 89, status: 'Completed', date: 'Yesterday', paymentMethod: 'Stripe' },
  { id: 'ORD-9837', customerName: 'Chloe Bennett', customerEmail: 'chloe@urbanliv.co.uk', productTitle: 'Factory Gearbox CAD Pack', amount: 65, status: 'Refunded', date: '2 days ago', paymentMethod: 'PayPal' },
  { id: 'ORD-9836', customerName: 'Tariq Al-Mansoor', customerEmail: 'tariq@vertexbuild.ae', productTitle: 'Minimalist Loft Blueprint', amount: 55, status: 'Completed', date: '2 days ago', paymentMethod: 'Stripe' },
  { id: 'ORD-9835', customerName: 'Hannah Meyer', customerEmail: 'hannah@baukunst.ch', productTitle: 'Industrial Crane Mesh', amount: 59, status: 'Pending', date: '3 days ago', paymentMethod: 'Credit Card' },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'CUST-101', name: 'Alex Morrison', email: 'alex.m@designstudio.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', ordersCount: 8, totalSpent: 384, status: 'VIP', joinedDate: 'Jan 12, 2026', location: 'San Francisco, USA' },
  { id: 'CUST-102', name: 'Sophia Chen', email: 'sophia@creativescape.com', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', ordersCount: 5, totalSpent: 215, status: 'VIP', joinedDate: 'Feb 03, 2026', location: 'Vancouver, Canada' },
  { id: 'CUST-103', name: 'Marcus Vance', email: 'marcus@archline.de', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', ordersCount: 3, totalSpent: 169, status: 'Active', joinedDate: 'Mar 19, 2026', location: 'Berlin, Germany' },
  { id: 'CUST-104', name: 'Elena Rostova', email: 'elena@nordicspaces.se', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', ordersCount: 4, totalSpent: 198, status: 'Active', joinedDate: 'Apr 02, 2026', location: 'Stockholm, Sweden' },
  { id: 'CUST-105', name: 'David Kim', email: 'dkim@automotion.kr', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', ordersCount: 6, totalSpent: 420, status: 'VIP', joinedDate: 'May 14, 2026', location: 'Seoul, South Korea' },
  { id: 'CUST-106', name: 'Chloe Bennett', email: 'chloe@urbanliv.co.uk', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', ordersCount: 2, totalSpent: 85, status: 'Active', joinedDate: 'Jun 22, 2026', location: 'London, UK' },
  { id: 'CUST-107', name: 'Tariq Al-Mansoor', email: 'tariq@vertexbuild.ae', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', ordersCount: 1, totalSpent: 55, status: 'Active', joinedDate: 'Jul 08, 2026', location: 'Dubai, UAE' },
];

const INITIAL_COUPONS: Coupon[] = [
  { id: 'CPN-1', code: 'FOUNDRY20', discountType: 'percentage', discountValue: 20, usageCount: 64, usageLimit: 200, expiryDate: '2026-12-31', status: 'Active' },
  { id: 'CPN-2', code: 'LAUNCH50', discountType: 'percentage', discountValue: 50, usageCount: 100, usageLimit: 100, expiryDate: '2026-06-30', status: 'Expired' },
  { id: 'CPN-3', code: 'TILES15', discountType: 'fixed', discountValue: 15, usageCount: 29, usageLimit: 150, expiryDate: '2026-11-15', status: 'Active' },
  { id: 'CPN-4', code: 'FREESHIP', discountType: 'fixed', discountValue: 10, usageCount: 12, usageLimit: 500, expiryDate: '2026-12-01', status: 'Active' },
];

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: 'SUB-1', email: 'studio@apexdesign.com', date: 'Oct 20, 2026', source: 'Homepage Footer', status: 'Subscribed' },
  { id: 'SUB-2', email: 'dev@renderhub.io', date: 'Oct 19, 2026', source: 'Template Download', status: 'Subscribed' },
  { id: 'SUB-3', email: 'lisa@creativepoly.net', date: 'Oct 17, 2026', source: 'Homepage Footer', status: 'Subscribed' },
  { id: 'SUB-4', email: 'viktor@archmodels.bg', date: 'Oct 15, 2026', source: 'Checkout', status: 'Subscribed' },
  { id: 'SUB-5', email: 'contact@urbanframe.co', date: 'Oct 12, 2026', source: 'Homepage Footer', status: 'Unsubscribed' },
];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Webnibo Marketplace',
  supportEmail: 'support.webnibo@gmail.com',
  whatsappNumber: '01318560039',
  currency: 'USD ($)',
  taxRate: 5,
  autoApproveOrders: true,
  maintenanceMode: false,
};

export const REVENUE_DATA = [
  { month: 'Apr', revenue: 4200, orders: 120, views: 8400 },
  { month: 'May', revenue: 5800, orders: 165, views: 11200 },
  { month: 'Jun', revenue: 5100, orders: 142, views: 9800 },
  { month: 'Jul', revenue: 7400, orders: 210, views: 14500 },
  { month: 'Aug', revenue: 8900, orders: 260, views: 17800 },
  { month: 'Sep', revenue: 8200, orders: 235, views: 16200 },
  { month: 'Oct', revenue: 11450, orders: 320, views: 22400 },
];

export const CATEGORY_DISTRIBUTION = [
  { name: 'Tiles & Surfaces', value: 35, color: '#f59e0b', count: 1240 },
  { name: 'Real Estate', value: 28, color: '#3b82f6', count: 2180 },
  { name: 'Furniture', value: 16, color: '#10b981', count: 960 },
  { name: 'Industrial', value: 12, color: '#8b5cf6', count: 1430 },
  { name: 'Cars & Bikes', value: 9, color: '#ec4899', count: 870 },
];

// Local Storage helpers
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export function getLocalOrders(): Order[] {
  return getLocal('foundry_orders', INITIAL_ORDERS);
}

export function saveLocalOrder(data: Omit<Order, 'id' | 'date'> & { id?: string; date?: string }): Order[] {
  const orders = getLocalOrders();
  const id = data.id || 'ORD-' + Math.floor(1000 + Math.random() * 9000);
  const date = data.date || 'Just now';
  const newOrder: Order = {
    ...data,
    id,
    date,
  };

  const updated = data.id && orders.some((o) => o.id === data.id)
    ? orders.map((o) => (o.id === data.id ? newOrder : o))
    : [newOrder, ...orders];

  setLocal('foundry_orders', updated);

  // Sync with customer
  const customers = getLocalCustomers();
  const existingCustIndex = customers.findIndex(
    (c) => c.email.toLowerCase() === data.customerEmail.toLowerCase()
  );

  if (existingCustIndex !== -1) {
    const cust = customers[existingCustIndex];
    customers[existingCustIndex] = {
      ...cust,
      ordersCount: cust.ordersCount + 1,
      totalSpent: cust.totalSpent + data.amount,
      status: cust.ordersCount + 1 >= 5 ? 'VIP' : 'Active',
    };
    setLocal('foundry_customers', customers);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('customers_updated'));
  } else {
    const newCust: Customer = {
      id: 'CUST-' + Math.floor(100 + Math.random() * 900),
      name: data.customerName,
      email: data.customerEmail,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}?auto=format&fit=crop&w=150&q=80`,
      ordersCount: 1,
      totalSpent: data.amount,
      status: 'Active',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      location: 'Online Customer',
    };
    setLocal('foundry_customers', [newCust, ...customers]);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('customers_updated'));
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('orders_updated'));
  }
  return updated;
}

export function deleteLocalOrder(orderId: string): Order[] {
  const orders = getLocalOrders().filter((o) => o.id !== orderId);
  setLocal('foundry_orders', orders);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('orders_updated'));
  }
  return orders;
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order[] {
  const orders = getLocalOrders().map((o) => (o.id === orderId ? { ...o, status } : o));
  setLocal('foundry_orders', orders);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('orders_updated'));
  }
  return orders;
}

export function getLocalCustomers(): Customer[] {
  return getLocal('foundry_customers', INITIAL_CUSTOMERS);
}

export function saveLocalCustomer(
  customer: Omit<Customer, 'id' | 'ordersCount' | 'totalSpent' | 'avatar' | 'joinedDate'> & {
    id?: string;
    ordersCount?: number;
    totalSpent?: number;
    avatar?: string;
    joinedDate?: string;
  }
): Customer[] {
  const customers = getLocalCustomers();
  const id = customer.id || 'CUST-' + Math.floor(100 + Math.random() * 900);
  const existing = customer.id ? customers.find((c) => c.id === customer.id) : null;
  const newCust: Customer = {
    ...customer,
    id,
    ordersCount: customer.ordersCount ?? existing?.ordersCount ?? 0,
    totalSpent: customer.totalSpent ?? existing?.totalSpent ?? 0,
    avatar: customer.avatar || existing?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    location: customer.location || existing?.location || 'Worldwide',
    joinedDate: customer.joinedDate || existing?.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
  };

  const updated = customer.id && existing
    ? customers.map((c) => (c.id === customer.id ? newCust : c))
    : [newCust, ...customers];

  setLocal('foundry_customers', updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('customers_updated'));
  }
  return updated;
}

export function deleteLocalCustomer(id: string): Customer[] {
  const customers = getLocalCustomers().filter((c) => c.id !== id);
  setLocal('foundry_customers', customers);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('customers_updated'));
  }
  return customers;
}

export function getLocalCoupons(): Coupon[] {
  return getLocal('foundry_coupons', INITIAL_COUPONS);
}

export function saveLocalCoupon(coupon: Omit<Coupon, 'id' | 'usageCount'> & { id?: string; usageCount?: number }): Coupon[] {
  const coupons = getLocalCoupons();
  const id = coupon.id || 'CPN-' + (coupons.length + 1);
  const newCoupon: Coupon = {
    ...coupon,
    id,
    usageCount: coupon.usageCount !== undefined ? coupon.usageCount : coupon.id ? (coupons.find((c) => c.id === coupon.id)?.usageCount ?? 0) : 0,
  };
  const updated = coupon.id && coupons.some((c) => c.id === coupon.id)
    ? coupons.map((c) => (c.id === coupon.id ? newCoupon : c))
    : [newCoupon, ...coupons];
  setLocal('foundry_coupons', updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('coupons_updated'));
  }
  return updated;
}

export function deleteLocalCoupon(id: string): Coupon[] {
  const coupons = getLocalCoupons().filter((c) => c.id !== id);
  setLocal('foundry_coupons', coupons);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('coupons_updated'));
  }
  return coupons;
}

export function getLocalSubscribers(): Subscriber[] {
  return getLocal('foundry_subscribers', INITIAL_SUBSCRIBERS);
}

export function saveLocalSubscriber(data: { email: string; source?: string }): Subscriber[] {
  const subs = getLocalSubscribers();
  const normalizedEmail = data.email.trim().toLowerCase();
  const existing = subs.find((s) => s.email.toLowerCase() === normalizedEmail);

  if (existing) {
    if (existing.status === 'Unsubscribed') {
      const updated = subs.map((s) => (s.id === existing.id ? { ...s, status: 'Subscribed' as const } : s));
      setLocal('foundry_subscribers', updated);
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('subscribers_updated'));
      return updated;
    }
    return subs;
  }

  const newSub: Subscriber = {
    id: 'SUB-' + (subs.length + 1),
    email: normalizedEmail,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    source: data.source || 'Website',
    status: 'Subscribed',
  };

  const updated = [newSub, ...subs];
  setLocal('foundry_subscribers', updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('subscribers_updated'));
  }
  return updated;
}

export function toggleSubscriberStatus(id: string): Subscriber[] {
  const subs = getLocalSubscribers().map((s) =>
    s.id === id ? { ...s, status: s.status === 'Subscribed' ? ('Unsubscribed' as const) : ('Subscribed' as const) } : s
  );
  setLocal('foundry_subscribers', subs);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('subscribers_updated'));
  }
  return subs;
}

export function deleteLocalSubscriber(id: string): Subscriber[] {
  const subs = getLocalSubscribers().filter((s) => s.id !== id);
  setLocal('foundry_subscribers', subs);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('subscribers_updated'));
  }
  return subs;
}

export function getLocalSettings(): StoreSettings {
  return getLocal('foundry_settings', INITIAL_SETTINGS);
}

export function saveLocalSettings(settings: StoreSettings): StoreSettings {
  setLocal('foundry_settings', settings);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('settings_updated'));
  }
  return settings;
}
