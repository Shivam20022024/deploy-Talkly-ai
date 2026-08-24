import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('talkly_token')?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/request-access') || pathname.startsWith('/activate-account');

  // Allow access to public routes (like landing page /)
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Decode token to get role
  let role = '';
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      role = payload.role || '';
    } catch(e) {}
  }

  // Redirect to login if accessing protected routes without token
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Protect Super Admin routes
  if (pathname.startsWith('/super-admin') && role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to dashboard (or intended redirect path) if trying to access login page while authenticated
  if (token && isAuthPage) {
    const redirectUrl = request.nextUrl.searchParams.get('redirect');
    if (redirectUrl) {
      // Reconstruct the URL with all params to pass to the destination
      const url = new URL(redirectUrl, request.url);
      request.nextUrl.searchParams.forEach((value, key) => {
        if (key !== 'redirect') {
          url.searchParams.set(key, value);
        }
      });
      return NextResponse.redirect(url);
    }
    if (role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
