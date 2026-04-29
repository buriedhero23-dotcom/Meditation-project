const SUPABASE_URL = "https://fxznwobjtttsqyokzdex.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4em53b2JqdHR0c3F5b2t6ZGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTYzODksImV4cCI6MjA5MTg5MjM4OX0.11ytaKEDjWCzHf0Cg7yVhlF6mWxHLoj5t9TnpBphNoc";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);