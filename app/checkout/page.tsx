// app/checkout/page.tsx
import { getCart } from '@/lib/cart'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import CheckoutPayButton from './pay-button'

type CartItem = {
  _key: string
  name: string
  price: number
  quantity: number
}

export default async function CheckoutPage() {
  const isE2E = process.env.E2E_MOCKS === '1'
  const cart = await getCart()

  if (!cart || !cart.items?.length) {
    redirect('/checkout/success')
  }

  const totalPrice =
    cart.items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    ) || 0

  const content = (
    <>
      {/* Povzetek izdelkov */}
      <div className="space-y-4">
        {cart.items.map((item: CartItem) => (
          <div key={item._key} className="flex justify-between text-black">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>
              {(item.price * item.quantity).toFixed(2)} €
            </span>
          </div>
        ))}
      </div>

      {/* Skupaj */}
      <div className="border-t pt-6 flex justify-between text-2xl font-bold text-black">
        <span>Skupaj</span>
        <span className="text-indigo-600">
          {totalPrice.toFixed(2)} €
        </span>
      </div>

      {/* Gumb za plačilo */}
      <CheckoutPayButton items={cart.items} totalPrice={totalPrice} />
    </>
  )

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 text-black">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-8 text-black">
        <h1 className="text-3xl font-bold text-black">Checkout</h1>

        {isE2E ? (
          content
        ) : (
          <>
            <SignedIn>{content}</SignedIn>

            <SignedOut>
              <div className="text-center text-black">
                <p className="mb-4">Za nadaljevanje se prijavi</p>
                <SignInButton mode="modal">
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg">
                    Prijava
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
          </>
        )}
      </div>
    </main>
  )
}
