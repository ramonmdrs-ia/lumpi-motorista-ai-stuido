/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURAÇÃO DO SUPABASE:
 * As chaves são carregadas do arquivo .env (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY).
 */

// 1. Tenta pegar do ambiente (Vite environment variables)
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Verifica se os valores são válidos
export const isConfigured = Boolean(
  envUrl &&
  envKey &&
  envUrl.startsWith('https://') &&
  !envUrl.includes('seu-projeto')
);

// 3. Cria o cliente
// @ts-ignore - createClient expects string, handling empty string at runtime or check isConfigured
export const supabase = createClient(envUrl || '', envKey || '');
