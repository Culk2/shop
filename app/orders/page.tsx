import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@sanity/client'
import { redirect } from 'next/navigation'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function getOrders(userId: string) {
  return client.fetch(
    `*[_type == "order" && userId == $userId] | order(createdAt desc)` ,
    { userId }
  )
}

export default async function OrdersPage() {
  const user = await currentUser()
  if (!user) redirect('/')

  const orders = await getOrders(user.id)

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-black">Moja naročila</h1>

        {orders.length === 0 ? (
          <p className="text-black">Še nimaš naročil.</p>
        ) : (
          <div className="space-y-8">
            {orders.map((order: any) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md p-6 space-y-4"
              >
                <div className="flex justify-between text-sm text-black">
                  <span className="text-black">Naročilo #{order._id.slice(-6)}</span>
                  <span className="text-black">
                    {new Date(order.createdAt).toLocaleDateString('sl-SI')}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item._key} className="flex justify-between">
                      <span className="text-black">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-indigo-600">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span className="text-black">Skupaj</span>
                  <span className="text-indigo-600">
                    {order.total.toFixed(2)} €
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}