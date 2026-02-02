// app/checkout/success/page.tsx
'use server'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN!,
})

async function createOrderFromCart() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Nisi prijavljen' }

  try {
    // 1. Poišči košarico
    const cart = await client.fetch(
      `*[_type == "cart" && userId == $userId][0] { _id, items }`,
      { userId }
    )

    if (!cart || !cart.items || cart.items.length === 0) {
      return { success: false, error: 'Košarica je prazna' }
    }

    // 2. Ustvari novo naročilo
    const order = await client.create({
      _type: 'order',
      userId,
      items: cart.items,
      total: cart.items.reduce((sum: number, item: any) => sum + item.price * (item.quantity || 1), 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    // 3. Izprazni košarico
    await client
      .patch(cart._id)
      .set({ items: [] })
      .commit()

    // 4. Osveži strani

    return { success: true, orderId: order._id }
  } catch (err) {
    console.error('Napaka pri ustvarjanju naročila:', err)
    return { success: false, error: 'Napaka pri obdelavi naročila' }
  }
}

export default async function CheckoutSuccessPage() {
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
