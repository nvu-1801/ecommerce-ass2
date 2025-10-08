// src/app/(auth)/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const dynamic = "force-dynamic";

function sanitizeNextParam(raw: string | null): string {
  // chỉ cho phép path nội bộ để tránh open-redirect
  if (raw && raw.startsWith("/")) return raw;
  return "/home";
}

async function handle(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  let code = searchParams.get("code"); // string | null

  // Dự phòng: một số IdP POST về
  if (!code && request.method === "POST") {
    const ct = request.headers.get("content-type") ?? "";
    if (ct.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      const v = form.get("code");
      code = typeof v === "string" ? v : null;
    } else if (ct.includes("application/json")) {
      const body: unknown = await request.json().catch(() => null);
      if (typeof body === "object" && body !== null && "code" in body) {
        const b = body as { code?: unknown };
        code = typeof b.code === "string" ? b.code : null;
      }
    }
  }

  const error = searchParams.get("error");
  const errorDesc = searchParams.get("error_description");
  const next = sanitizeNextParam(searchParams.get("next"));

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(errorDesc ?? error)}`, url.origin)
    );
  }

  // Tạo response REDIRECT trước, để Supabase set cookie trực tiếp lên response này
  const redirectResponse = NextResponse.redirect(new URL(next, url.origin));

  // Tạo Supabase server client với adapter cookies đọc từ request và ghi vào redirectResponse
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          redirectResponse.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          redirectResponse.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  try {
    if (!code) {
      return NextResponse.redirect(new URL("/auth?error=missing_code", url.origin));
    }
    // Đổi authorization code → session; SDK sẽ gọi cookies.set trên redirectResponse
    await supabase.auth.exchangeCodeForSession(code);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(msg)}`, url.origin)
    );
  }

  return redirectResponse;
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
