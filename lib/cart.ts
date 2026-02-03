// lib/cart.ts
import { dataClient } from '@/lib/dataClient'
import { getUserId } from '@/lib/auth'

type CartItem = {
  _key: string
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string | null
  size?: string | null
  color?: string | null
}

type CartDoc = {
  _id: string
  items?: CartItem[]
}

export async function getCart() {
  const userId = await getUserId()
  console.log('[getCart] User ID iz Clerk:', userId || 'ni prijavljen')

  if (!userId) {
    console.log('[getCart] Ni prijavljenega uporabnika -> vracam prazen cart')
    return { items: [], cartId: null }
  }

  try {
    const cart = (await dataClient.fetch(
      `*[_type == "cart" && userId == $userId][0] {
        _id,
        items[] {
          _key,
          productId,
          name,
          price,
          quantity,
          size,
          color,
          imageUrl
        }
      }`,
      { userId }
    )) as CartDoc | null

    console.log('[getCart] Najden cart document:', cart ? 'DA' : 'NE')
    if (cart) {
      console.log('[getCart] Cart ID:', cart._id)
      console.log('[getCart] Stevilo itemov:', cart.items?.length || 0)
    }

    return {
      items: cart?.items || [],
      cartId: cart?._id || null,
    }
  } catch (err) {
    console.error('[getCart] NAPAKA pri fetchu:', err)
    return { items: [], cartId: null }
  }
}
