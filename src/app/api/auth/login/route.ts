import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Rate limit: 5 attempts per IP per 15 minutes
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, retryAfterMs } = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again in 15 minutes." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Use the admin client to verify credentials, then return a session
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
  });
}
