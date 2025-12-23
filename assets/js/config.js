// assets/js/config.js
const SB_URL = "https://glqrpsyjwozvislyxapj.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscXJwc3lqd296dmlzbHl4YXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTQyOTgsImV4cCI6MjA4MTgzMDI5OH0.etzcmIHgPcGC12HwZPTU2u0DLtJdF3XTBSYW38O7S-w";

// Inicializa o cliente Supabase globalmente
const _supabase = supabase.createClient(SB_URL, SB_KEY);
