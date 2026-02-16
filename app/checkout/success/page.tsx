// app/checkout/success/page.tsx
'use server'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { dataClient } from '@/lib/dataClient'
import { getUserId } from '@/lib/auth'

type CartItem = {
  price: number
  quantity?: number
}

type CartDoc = {
  _id: string
  items: CartItem[]
}

async function createOrderFromCart() {
  // Iz trenutne košarice ustvari naročilo in nato košarico izprazni.
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Nisi prijavljen' }

  try {
    const cart = (await dataClient.fetch(
      `*[_type == "cart" && userId == $userId][0] { _id, items }`,
      { userId }
    )) as CartDoc | null

    if (!cart || !cart.items || cart.items.length === 0) {
      return { success: false, error: 'Košarica je prazna' }
    }

    const total = cart.items.reduce(
      (sum: number, item: CartItem) => sum + item.price * (item.quantity || 1),
      0
    )

    const order = await dataClient.create({
      _type: 'order',
      userId,
      items: cart.items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    await dataClient
      .patch(cart._id)
      .set({ items: [] })
      .commit({ returnDocuments: false })

    return { success: true, orderId: (order as { _id?: string })._id }
  } catch (err) {
    console.error('Napaka pri ustvarjanju naročila:', err)
    return { success: false, error: 'Napaka pri obdelavi naročila' }
  }
}

export default async function CheckoutSuccessPage() {
  // Success stran hkrati zaključi checkout tok in prikaže rezultat uporabniku.
  const result = await createOrderFromCart()

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-10 text-center space-y-6">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />

        <h1 className="text-3xl font-bold text-gray-900">
          {result.success ? 'Plačilo uspešno 🎉' : 'Napaka pri plačilu'}
        </h1>

        <p className="text-gray-600 text-lg">
          {result.success
            ? 'Hvala za nakup pri StyleUp. Vaše naročilo je bilo uspešno oddano.'
            : (result.error || 'Prišlo je do napake. Poskusi ponovno.')}
        </p>

        <div className="flex flex-col gap-4 pt-6">
          <Link
            href="/orders"
            className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            Ogled naročil
          </Link>

          <Link
            href="/"
            className="text-indigo-600 font-medium hover:underline"
          >
            Nadaljuj z nakupovanjem
          </Link>
        </div>
      </div>
    </main>
  )
}
