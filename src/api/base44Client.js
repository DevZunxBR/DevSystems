// src/api/base44Client.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mjzrhbfrnngewtgddbvu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qenJoYmZybm5nZXd0Z2RkYnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjQ2OTEsImV4cCI6MjA5MDg0MDY5MX0.3t-uBgG7vc4JnJS4MSYJjwoTaHMzTuusr8rFnDaxM88';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
});

// Cache da sessão em memória — evita chamar getUser() repetidamente
let cachedUser = null;
let cachedProfile = null;

// Atualiza o cache quando a sessão muda
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    cachedUser = session.user;
  } else {
    cachedUser = null;
    cachedProfile = null;
  }
});

const TABLE_MAP = {
  Product: 'products',
  Order: 'orders',
  CartItem: 'cart_items',
  Coupon: 'coupons',
  Favorite: 'favorites',
  Notification: 'notifications',
  RefundRequest: 'refund_requests',
  Review: 'reviews',
  Wallet: 'wallets',
  User: 'user_profiles',
  Bundle: 'bundles',
  BundleProduct: 'bundle_products',
};

const createEntityProxy = (entityName) => {
  const table = TABLE_MAP[entityName] || entityName.toLowerCase() + 's';

  return {
    filter: async (query = {}, sort = '-created_at', limit = 100) => {
      let req = supabase.from(table).select('*');
      Object.entries(query).forEach(([key, value]) => { req = req.eq(key, value); });
      if (sort) {
        const desc = sort.startsWith('-');
        const col = sort.replace(/^-/, '').replace('created_date', 'created_at');
        req = req.order(col, { ascending: !desc });
      }
      req = req.limit(limit);
      const { data, error } = await req;
      if (error) throw error;
      return data || [];
    },

    get: async (id) => {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },

    create: async (payload) => {
      const { data, error } = await supabase.from(table).insert([payload]).select().single();
      if (error) throw error;
      return data;
    },

    update: async (id, payload) => {
      const { data, error } = await supabase
        .from(table)
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id).select().single();
      if (error) throw error;
      return data;
    },

    delete: async (id) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    },

    list: async (order = '-created_at', limit = 100) => {
      let req = supabase.from(table).select('*');
      if (order) {
        const desc = order.startsWith('-');
        const col = order.replace(/^-/, '').replace('created_date', 'created_at');
        req = req.order(col, { ascending: !desc });
      }
      req = req.limit(limit);
      const { data, error } = await req;
      if (error) throw error;
      return data || [];
    },
  };
};

// Funções específicas para Bundle e BundleProduct
const bundleEntity = {
  ...createEntityProxy('Bundle'),
  getProducts: async (bundleId) => {
    const { data, error } = await supabase
      .from('bundle_products')
      .select('product_id')
      .eq('bundle_id', bundleId);
    if (error) throw error;
    
    const productIds = data.map(bp => bp.product_id);
    if (productIds.length === 0) return [];
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
    if (productsError) throw productsError;
    
    return products || [];
  },
};

const bundleProductEntity = {
  ...createEntityProxy('BundleProduct'),
  addProduct: async (bundleId, productId) => {
    const { data, error } = await supabase
      .from('bundle_products')
      .insert([{ bundle_id: bundleId, product_id: productId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  removeProduct: async (bundleId, productId) => {
    const { error } = await supabase
      .from('bundle_products')
      .delete()
      .eq('bundle_id', bundleId)
      .eq('product_id', productId);
    if (error) throw error;
    return true;
  },
  listByBundle: async (bundleId) => {
    const { data, error } = await supabase
      .from('bundle_products')
      .select('*')
      .eq('bundle_id', bundleId);
    if (error) throw error;
    return data || [];
  },
  listByProduct: async (productId) => {
    const { data, error } = await supabase
      .from('bundle_products')
      .select('bundle_id')
      .eq('product_id', productId);
    if (error) throw error;
    
    const bundleIds = data.map(bp => bp.bundle_id);
    if (bundleIds.length === 0) return [];
    
    const { data: bundles, error: bundlesError } = await supabase
      .from('bundles')
      .select('*')
      .in('id', bundleIds);
    if (bundlesError) throw bundlesError;
    
    return bundles || [];
  },
};

const auth = {
  me: async () => {
    // Usa cache se disponível — evita rate limit
    if (cachedUser && cachedProfile) {
      return cachedProfile;
    }

    // Se tem cache do user mas não do profile, busca o profile
    if (cachedUser) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', cachedUser.email)
        .single();

      cachedProfile = {
        id: cachedUser.id,
        email: cachedUser.email,
        full_name: profile?.full_name || cachedUser.user_metadata?.full_name || '',
        display_name: profile?.display_name || profile?.full_name || '',
        bio: profile?.bio || '',
        role: profile?.role || 'user',
        avatar_url: profile?.avatar_url || '',
      };
      return cachedProfile;
    }

    // Último recurso — busca do Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw { status: 401 };

    cachedUser = session.user;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', session.user.email)
      .single();

    cachedProfile = {
      id: session.user.id,
      email: session.user.email,
      full_name: profile?.full_name || session.user.user_metadata?.full_name || '',
      display_name: profile?.display_name || profile?.full_name || '',
      bio: profile?.bio || '',
      role: profile?.role || 'user',
      avatar_url: profile?.avatar_url || '',
    };
    return cachedProfile;
  },

  login: async (email, password) => {
    cachedUser = null;
    cachedProfile = null;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  signup: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: metadata }
    });
    if (error) throw error;
    if (data.user) {
      await supabase.from('user_profiles').upsert({
        email: data.user.email,
        full_name: metadata.full_name || '',
        role: 'user',
      });
    }
    return data;
  },

  updateMe: async (data) => {
    if (!cachedUser) throw { status: 401 };
    const { error } = await supabase
      .from('user_profiles')
      .update(data)
      .eq('email', cachedUser.email);
    if (error) throw error;
    cachedProfile = null; // Limpa cache do profile
    return true;
  },

  logout: async () => {
    cachedUser = null;
    cachedProfile = null;
    await supabase.auth.signOut();
    window.location.href = '/register';
  },

  redirectToLogin: () => {
    window.location.href = '/register';
  },
};

export const base44 = {
  integrations: {},
  entities: {
    get Product() { return createEntityProxy('Product'); },
    get Order() { return createEntityProxy('Order'); },
    get CartItem() { return createEntityProxy('CartItem'); },
    get Coupon() { return createEntityProxy('Coupon'); },
    get Favorite() { return createEntityProxy('Favorite'); },
    get Notification() { return createEntityProxy('Notification'); },
    get RefundRequest() { return createEntityProxy('RefundRequest'); },
    get Review() { return createEntityProxy('Review'); },
    get Wallet() { return createEntityProxy('Wallet'); },
    get User() { return createEntityProxy('User'); },
    get Bundle() { return bundleEntity; },
    get BundleProduct() { return bundleProductEntity; },
  },
  auth,
  supabase,
};