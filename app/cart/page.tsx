
import { getCart } from '@/lib/cart'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { removeFromCart } from '@/app/actions/removeFromCart'

export default async function CartPage() {
  const cart = await getCart()

  const totalPrice = cart?.items?.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  ) || 0

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-12">
          Tvoja košarica
        </h1>

        <SignedIn>
          {cart?.items?.length ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Seznam izdelkov */}
              <div className="lg:col-span-2 space-y-6">
                {cart.items.map((item: any) => (
                  <div
                    key={item._key}
                    className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group flex"
                  >
                    {/* Slika */}
                    <div className="w-48 h-48 flex-shrink-0 bg-gray-100 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                        src={item.imageUrl 
                            ? `${item.imageUrl}?w=600&h=600&fit=crop&auto=format`
                            : '/placeholder.jpg'
                        }
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 border-2 border-dashed flex items-center justify-center">
                          <span className="text-gray-500">Brez slike</span>
                        </div>
                      )}
                    </div>

                    {/* Podatki + gumb za brisanje */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.name}
                        </h3>

                        {/* Velikost in barva */}
                        {item.size && (
                          <p className="text-black text-lg mb-1">
                            Velikost: <strong>{item.size}</strong>
                          </p>
                        )}
                        {item.color && (
                          <p className="text-black text-lg mb-1">
                            Barva: <strong>{item.color}</strong>
                          </p>
                        )}

                        <p className="text-3xl font-bold text-indigo-600">
                          {item.price.toFixed(2)} €
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <span className="text-gray-600">
                          Količina: <strong className="text-gray-900">{item.quantity}</strong>
                        </span>

                        <form action={async () => {
                                'use server'
                                await removeFromCart(item._key)
                            }}>
                                <button
                                type="submit"
                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-3 rounded-lg transition-all"
                                title="Odstrani iz košarice"
                                >
                                <Trash2 className="w-6 h-6" />
                                </button>
                            </form>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Povzetek */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-8 sticky top-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Povzetek naročila</h2>

                  <div className="space-y-4 text-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Izdelki ({cart.items.length})</span>
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

                  <Link href="/checkout">
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


      </div>
    </main>
  )
}