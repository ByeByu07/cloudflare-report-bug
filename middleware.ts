import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { getCloudflareContext } from "@opennextjs/cloudflare";

const allowOrigin = ["*"];

interface Env {
  JWT_SECRET: string;
}

export async function middleware(request: NextRequest) {

  const { env } = await getCloudflareContext({ async: true });

  let JWT_SECRET: string;

  if(env?.JWT_SECRET) {
    JWT_SECRET = env.JWT_SECRET;
  } else {
    JWT_SECRET = process.env.JWT_SECRET!;
  }

  console.log(JWT_SECRET);

  // const origin = request.headers.get('origin') ?? "not found";

  // console.log(origin);
  // // // Optional CORS origin check
  // if (!allowOrigin.includes(origin)) {
  //   return NextResponse.json({ success: false, message: 'Unauthorized origin' });
  // }


  const url = new URL(request.url);

  if (url.pathname === "/api/register-user") {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

    const exp = payload.exp;
    const email = payload.email;

    const isExpired = exp && Date.now() > exp * 1000;

    if (isExpired) {
      const newToken = await new SignJWT({ email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30d')
        .setIssuedAt()
        .sign(new TextEncoder().encode(JWT_SECRET));

      return NextResponse.json({ success: false, message: 'Token expired', data: { token: newToken } });
    }

    // Optional: inject user into headers
    const headers = new Headers(request.headers);
    headers.set('x-user-email', String(email));

    return NextResponse.next({ request: { headers } });

  } catch (err) {
    return NextResponse.json({ success: false, message: "Invalid token", error: err }, { status: 401 });
  }
}

export const config = {
  matcher: '/api/:path*',
};
