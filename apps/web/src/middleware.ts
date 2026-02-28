export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/((?!api/auth|api/fires|login|register|verify-email|forgot-password|reset-password|two-factor|privacy|terms|docs|_next/static|_next/image|favicon.ico|logo.svg).*)'],
};
