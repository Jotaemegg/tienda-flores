/* ============================================
   VOUDÚ · CONFIGURACIÓN DE SUPABASE
   ============================================ */

const SUPABASE_URL = "https://ryochkingljavknigvsh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5b2Noa2luZ2xqYXZrbmlndnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTE5OTUsImV4cCI6MjA5NjY4Nzk5NX0.vhiUyXa7E-YsY1HNu6Gyc6wDHA7SosB6FLbZEWAVfWo";

// Indica si la base de datos está activa o si usaremos fallback estático
const IS_SUPABASE_ACTIVE = !!(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes("your-"));
