import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

// Supabase is not wired up yet — the admin panel and any DB-backed
// features are on hold until NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY are set
// in the environment. Placeholder values keep the client from throwing at
// import time so the rest of the (fully static) site can build normally.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
);