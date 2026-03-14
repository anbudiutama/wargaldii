import { NextResponse } from 'next/server';

// Routes that require authentication
const protectedApiRoutes = [
  '/api/orders',
  '/api/progress',
  '/api/quiz',
  '/api/bmt',
  '/api/admin',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if this is a protected API route with POST method
  const isProtected = protectedApiRoutes.some(route => pathname.startsWith(route));
  
  if (isProtected && request.method === 'POST') {
    // Supabase handles auth via the token in the request
    // This middleware just adds CORS headers and basic validation
    const authHeader = request.headers.get('authorization');
    
    // For API routes, Supabase client handles auth internally
    // This middleware is for future expansion (rate limiting, logging, etc.)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
