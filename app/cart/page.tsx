// app/cart/page.tsx
import Link from 'next/link'
import { getCart } from '@/lib/cart'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ShoppingBag } from 'lucide-react'
import CartItemCard from './CartItemCard'

type CartItem = {
  _key: string
  name: string
  price: number
  quantity: number
}

export default async function CartPage() {
  const isE2E =
    process.env.E2E_MOCKS === '1' || process.env.NEXT_PUBLIC_E2E_MOCKS === '1'
  const checkoutHref = isE2E ? '/checkout/success' : '/checkout'
  const cart = await getCart()

  const totalPrice =
    cart?.items?.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    ) || 0

  const totalQuantity =
    cart?.items?.reduce(
      (sum: number, item: CartItem) => sum + item.quantity,
      0
    ) || 0

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-12">
          Tvoja košarica
        </h1>

        {isE2E ? (
          cart?.items?.length ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Seznam izdelkov */}
              <div className="lg:col-span-2 space-y-6">
                {cart.items.map((item: CartItem) => (
                  <CartItemCard key={item._key} item={item} cartId={cart.cartId} />
                ))}
              </div>

              {/* Povzetek */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-8 sticky top-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Povzetek naročila</h2>

                  <div className="space-y-4 text-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Izdelki ({totalQuantity})</span>
                      <span>{totalPrice.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dostava</span>
                      <span className="text-green-600 font-medium">Brezplačno</span>
                    </div>

                    <div className="pt-6 border-t-2 border-gray-200">
                      <div className="flex justify-between text-2xl font-bold">
                        <span>Skupaj</span>
                        <span className="text-indigo-600">{totalPrice.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>

                  <Link href={checkoutHref} aria-label="Plačaj">
                    <button className="w-full mt-8 bg-indigo-600 text-white font-bold py-4 rounded-lg hover:bg-indigo-700 transition transform hover:scale-105">
                      Na blagajno
                    </button>
                  </Link>

                  <div className="mt-6 text-center">
                    <Link
                      href="/"
                      className="text-indigo-600 hover:underline font-medium text-sm"
                    >
                      ← Nadaljuj z nakupovanjem
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-700 mb-4">Košarica je prazna</h2>
              <p className="text-gray-600 mb-8">Dodaj izdelke iz trgovine</p>
              <Link
                href="/"
                className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-indigo-700 transition"
              >
                Pojdi v trgovino
              </Link>
            </div>
          )
        ) : (
          <>
            <SignedIn>
              {cart?.items?.length ? (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Seznam izdelkov */}
                  <div className="lg:col-span-2 space-y-6">
                    {cart.items.map((item: CartItem) => (
                      <CartItemCard key={item._key} item={item} cartId={cart.cartId} />
                    ))}
                  </div>

                  {/* Povzetek */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-8 sticky top-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-8">Povzetek naročila</h2>

                      <div className="space-y-4 text-lg">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Izdelki ({totalQuantity})</span>
                          <span>{totalPrice.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dostava</span>
                          <span className="text-green-600 font-medium">Brezplačno</span>
                        </div>

                        <div className="pt-6 border-t-2 border-gray-200">
                          <div className="flex justify-between text-2xl font-bold">
                            <span>Skupaj</span>
                            <span className="text-indigo-600">{totalPrice.toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>

                      <Link href={checkoutHref} aria-label="Plačaj">
                        <button className="w-full mt-8 bg-indigo-600 text-white font-bold py-4 rounded-lg hover:bg-indigo-700 transition transform hover:scale-105">
                          Na blagajno
                        </button>
                      </Link>

                      <div className="mt-6 text-center">
                        <Link
                          href="/"
                          className="text-indigo-600 hover:underline font-medium text-sm"
                        >
                          ← Nadaljuj z nakupovanjem
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-700 mb-4">Košarica je prazna</h2>
                  <p className="text-gray-600 mb-8">Dodaj izdelke iz trgovine</p>
                  <Link
                    href="/"
                    className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-indigo-700 transition"
                  >
                    Pojdi v trgovino
                  </Link>
                </div>
              )}
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Prijava
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </>
        )}
      </div>
    </main>
  )
}
