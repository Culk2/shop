import { getCurrentUser } from '@/lib/auth'
import { dataClient } from '@/lib/dataClient'
import { redirect } from 'next/navigation'

type OrderItem = {
  _key: string
  name: string
  price: number
  quantity: number
}

type Order = {
  _id: string
  createdAt: string
  total: number
  items: OrderItem[]
}

async function getOrders(userId: string) {
  return dataClient.fetch(
    `*[_type == "order" && userId == $userId] | order(createdAt desc)` ,
    { userId }
  ) as Promise<Order[]>
}

export default async function OrdersPage() {
  const user = await getCurrentUser()
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
            {orders.map((order) => (
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
                  {order.items.map((item) => (
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
