'use client';

import Link from 'next/link';
import { ShoppingBag, Search } from 'lucide-react';
import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  // Funkcija, ki pridobi število izdelkov iz Sanity (za prijavljenega uporabnika)
  async function fetchCartCount() {
    try {
      const res = await fetch('/api/cart-count', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.count || 0);
      }
    } catch (error) {
      console.error('Napaka pri pridobivanju košarice:', error);
    }
  }

  // Posodobi košarico ob mount-u in ko se spremeni uporabnik (Clerk)
  useEffect(() => {
    fetchCartCount();

    // Posodobi tudi vsakič, ko se spremeni route (npr. po dodajanju v košarico)
    const handleRouteChange = () => fetchCartCount();
    window.addEventListener('focus', fetchCartCount); // ko se vrneš na zavihek
    window.addEventListener('cart-updated', fetchCartCount); // custom event

    return () => {
      window.removeEventListener('focus', fetchCartCount);
      window.removeEventListener('cart-updated', fetchCartCount);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="OblačilaShop logo"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </Link>

          <nav className="flex items-center gap-10">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium text-lg transition">
              Domov
            </Link>
          </nav>

          <nav className="flex items-center gap-10">
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium text-lg transition">
              O Nas
            </Link>
          </nav>

          <div className="flex items-center gap-6">
           {/* <div className="relative">
              <input
                type="text"
                placeholder="Poišči oblačilo..."
                className="w-80 pl-12 pr-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
              <Search className="absolute left-4 top-3.5 w-6 h-6 text-gray-400" />
            </div>
            */}
            {/* Košarica z live badge-om */}
            <Link href="/cart" className="relative">
              <ShoppingBag className="w-8 h-8 text-gray-700 hover:text-indigo-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Vstopi
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}