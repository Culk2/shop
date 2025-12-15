'use client'

import { Trash2 } from 'lucide-react'
import { updateCartQuantity } from '../actions/cart'
import { removeFromCart } from '../actions/removeFromCart'
import { useTransition } from 'react'
import CartItemControls from './CartItemControls'

export default function CartItemCard({ item }: { item: any }) {
  const [isPending, startTransition] = useTransition()

  const handleRemove = async () => {
    startTransition(async () => {
      await removeFromCart(item._key)
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group flex">
      {/* Slika */}
      <div className="w-48 h-48 flex-shrink-0 bg-gray-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 border-2 border-dashed flex items-center justify-center">
            <span className="text-black">Brez slike</span>
          </div>
        )}
      </div>

      {/* Podatki */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-black mb-2">{item.name}</h3>
          {item.size && <p className="text-black text-lg mb-1">Velikost: <strong>{item.size}</strong></p>}
          {item.color && <p className="text-black text-lg mb-1">Barva: <strong>{item.color}</strong></p>}
          <p className="text-3xl font-bold text-black">{item.price.toFixed(2)} €</p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <CartItemControls itemKey={item._key} initialQuantity={item.quantity} />
          <button
            onClick={handleRemove}
            className="text-black hover:text-red-600 hover:bg-red-50 p-3 rounded-lg transition-all"
            title="Odstrani iz košarice"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-black text-right">
          <p className="text-xl font-bold text-black">{(item.price * item.quantity).toFixed(2)} €</p>
        </div>
      </div>
    </div>
  )
}
