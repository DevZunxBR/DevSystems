// src/api/base44Client.js
// SUBSTITUIÇÃO COMPLETA - Não depende mais do Base44
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mjzrhbfrnngewtgddbvu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qenJoYmZybm5nZXd0Z2RkYnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjQ2OTEsImV4cCI6MjA5MDg0MDY5MX0.3t-uBgG7vc4JnJS4MSYJjwoTaHMzTuusr8rFnDaxM88';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mapeamento de nomes de entidade para tabelas do Supabase
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
};

// Cria um proxy que imita a API do Base44: base44.entities.Product.filter(...)
const createEntityProxy = (entityName) => {
  const table = TABLE_MAP[entityName] || entityName.toLowerCase() + 's';

  return {
    filter: async (query = {}, sort = '-created_at', limit = 100) => {
      let req = supabase.from(table).select('*');

      Object.entries(query).forEach(([key, value]) => {
        req = req.eq(key, value);
      });

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
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    create: async (payload) => {
      const { data, error } = await supabase
        .from(table)
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    update: async (id, payload) => {
      const { data, error } = await supabase
        .from(table)
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    delete: async (id) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    },

    list: async () => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  };
};

// Auth substituto usando Supabase Auth
const auth = {
  me: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw { status: 401 };

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', user.email)
      .single();

    return {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || '',
      display_name: profile?.display_name || profile?.full_name || '',
      bio: profile?.bio || '',
      role: profile?.role || 'user',
      avatar_url: profile?.avatar_url || '',
    };
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  signup: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw { status: 401 };
    const { error } = await supabase
      .from('user_profiles')
      .update(data)
      .eq('email', user.email);
    if (error) throw error;
    return true;
  },

  logout: async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  },

  redirectToRegister: () => {
    window.location.href = '/Register';
  },
};

// Exporta o objeto base44 com a mesma interface de antes
export const base44 = {
  integrations: {},
  entities: new Proxy({}, {
    get: (_, entityName) => createEntityProxy(entityName),
  }),
  auth,
  supabase,
};