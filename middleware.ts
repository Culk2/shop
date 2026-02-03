// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isE2E =
  process.env.E2E_MOCKS === '1' || process.env.NEXT_PUBLIC_E2E_MOCKS === '1'

export default isE2E
  ? function middleware() {
      return NextResponse.next()
    }
  : clerkMiddleware()

export const config = {
  matcher: [
    // Preskoči Next.js interne datoteke in statične datoteke
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Vedno zaženi za API rute
    '/(api|trpc)(.*)',
  ],
}
