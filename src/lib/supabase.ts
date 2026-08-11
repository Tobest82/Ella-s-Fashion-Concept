import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'tobest_supabase_url';
const STORAGE_KEY_ANON = 'tobest_supabase_key';

function sanitizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  // Strip trailing rest/v1 or rest/v1/ or slashes
  url = url.replace(/\/rest\/v1\/?$/, '');
  url = url.replace(/\/+$/, '');
  return url;
}

export function getSupabaseCredentials() {
  const defaultUrl = 'https://tyvaftxljkwmlwwmqkjp.supabase.co';
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dmFmdHhsamt3bWx3d21xa2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNjgzNjAsImV4cCI6MjEwMTg0NDM2MH0.QbS9VOsdxdzWKBTOIV0mgfrqYxYQTceLgUpUWCL9GKI';

  const envUrl = (typeof import.meta !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || defaultUrl;
  const envKey = (typeof import.meta !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || defaultKey;

  const customUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  const customKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ANON) : null;

  const url = sanitizeSupabaseUrl(customUrl || envUrl);
  const key = (customKey || envKey).trim();

  return {
    url,
    key,
    isConfigured: Boolean(url && key && url.startsWith('http')),
    isCustom: Boolean(customUrl || customKey)
  };
}

export function saveSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    const cleanUrl = sanitizeSupabaseUrl(url);
    if (cleanUrl) localStorage.setItem(STORAGE_KEY_URL, cleanUrl);
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (key) localStorage.setItem(STORAGE_KEY_ANON, key.trim());
    else localStorage.removeItem(STORAGE_KEY_ANON);
  }
}

export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_ANON);
  }
}

const creds = getSupabaseCredentials();

// Default fallback client or live client
export const supabase = createClient(
  creds.url || 'https://placeholder.supabase.co',
  creds.key || 'placeholder-key'
);

export const isSupabaseConfigured = creds.isConfigured;
