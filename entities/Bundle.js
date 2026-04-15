// src/entities/Bundle.js
import { base44 } from '@/api/base44Client';

export const Bundle = {
  create: (data) => base44.request('/bundles', { method: 'POST', body: data }),
  update: (id, data) => base44.request(`/bundles/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => base44.request(`/bundles/${id}`, { method: 'DELETE' }),
  get: (id) => base44.request(`/bundles/${id}`),
  list: (order = '-created_at', limit = 100) => base44.request(`/bundles?order=${order}&limit=${limit}`),
  filter: (filters, order = '-created_at', limit = 100) => base44.request('/bundles/filter', { method: 'POST', body: { filters, order, limit } }),
};

export const BundleProduct = {
  add: (bundleId, productId) => base44.request('/bundle-products', { method: 'POST', body: { bundle_id: bundleId, product_id: productId } }),
  remove: (bundleId, productId) => base44.request(`/bundle-products/${bundleId}/${productId}`, { method: 'DELETE' }),
  listByBundle: (bundleId) => base44.request(`/bundle-products/bundle/${bundleId}`),
  listByProduct: (productId) => base44.request(`/bundle-products/product/${productId}`),
};