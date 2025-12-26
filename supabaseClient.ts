
import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURAÇÃO DO SUPABASE:
 * Você pode configurar via variáveis de ambiente (SUPABASE_URL e SUPABASE_ANON_KEY)
 * ou colando as chaves diretamente nas strings abaixo se estiver testando localmente.
 */

// 1. Tenta pegar do ambiente, senão usa string vazia (ou cole sua URL aqui para teste)
const envUrl = process.env.SUPABASE_URL || 'https://pvzkjvlniygrrfseelvj.supabase.co';
const envKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2emtqdmxuaXlncnJmc2VlbHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NTQ1MzcsImV4cCI6MjA4MjMzMDUzN30.1grgi1p2oeGWPNIzu-L5Bh40xDabXRPQSmTKP6KBp0c';

// 2. Verifica se os valores são válidos e não são apenas os placeholders de exemplo
// Uma URL válida do Supabase deve começar com https:// e ter um domínio .supabase.co
export const isConfigured = Boolean(
  envUrl && 
  envKey && 
  envUrl.startsWith('https://') && 
  !envUrl.includes('seu-projeto') // Verifica se não é a string de exemplo
);

// 3. Cria o cliente com as chaves definidas
export const supabase = createClient(envUrl, envKey);
