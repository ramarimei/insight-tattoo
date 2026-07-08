import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Lazily create the admin client so importing this route never constructs it
// at build time (Preview builds have no env vars). Memoised across requests.
let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabase;
}

// Verify the request is from an authenticated admin
async function verifyAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.substring(7);
  const { data } = await getSupabase().auth.getUser(token);
  return !!data.user;
}

// GET — list all users
export async function GET(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getSupabase().auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
  }));

  return NextResponse.json({ users });
}

// POST — create new user
export async function POST(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const { data, error } = await getSupabase().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      created_at: data.user.created_at,
    },
  });
}

// DELETE — remove user
export async function DELETE(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  // Prevent deleting yourself
  const authHeader = request.headers.get("authorization")!;
  const token = authHeader.substring(7);
  const { data: currentUser } = await getSupabase().auth.getUser(token);
  if (currentUser.user?.id === userId) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  const { error } = await getSupabase().auth.admin.deleteUser(userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// PATCH — reset password
export async function PATCH(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, password } = await request.json();

  if (!userId || !password) {
    return NextResponse.json(
      { error: "User ID and new password are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const { error } = await getSupabase().auth.admin.updateUserById(userId, {
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
