// app/lib/cart.ts
import { createClient, SanityDocument } from '@sanity/client'
import { currentUser } from '@clerk/nextjs/server'

interface CartItem {
  _key: string
  _type: string
  productId: string
  slug?: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
  size?: string | null
  color?: string | null
}

interface Cart extends SanityDocument {
  userId: string
  items: CartItem[]
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN!,
})

export async function addToCart(product: any) {
  const user = await currentUser()
  if (!user) return false

  let cart = (await client.fetch<Cart>(
    '*[_type == "cart" && userId == $userId][0]',
    { userId: user.id }
  )) as Cart | null

  if (!cart) {
    // ustvari prazno košarico
    const newCart = {
      _type: 'cart',
      userId: user.id,
      items: [],
    } as unknown as Cart

    cart = await client.create(newCart) as Cart
  }

  cart.items = cart.items || []

  const productId = product?._id ?? product?.productId
  if (!productId) return false

  // Poišči obstoječi izdelek z enakim _id, size in color
  const existingIndex = cart.items.findIndex(
    (item) =>
      item.productId === productId &&
      item.size === product.size &&
      item.color === product.color
  )

  if (existingIndex !== -1) {
    cart.items[existingIndex].quantity += product.quantity || 1
  } else {
    cart.items.push({
      _key: productId + '-' + Date.now(),
      _type: 'object',
      productId,
      slug: typeof product.slug === 'string' ? product.slug : product.slug?.current,
      name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
      imageUrl: product.imageUrl || '/placeholder.jpg',
      size: product.size || null,
      color: product.color || null,
    })
  }

  await client.patch(cart._id).set({ items: cart.items }).commit()
}

export async function getCart(): Promise<Cart> {
  const user = await currentUser()
  if (!user) {
    return {
      _id: '',
      _type: 'cart',
      userId: '',
      items: [],
    } as unknown as Cart
  }

  const cart = (await client.fetch<Cart>(
    '*[_type == "cart" && userId == $userId][0]',
    { userId: user.id }
  )) as Cart | null

  return cart ?? ({
    _id: '',
    _type: 'cart',
    userId: user.id,
    items: [],
  } as unknown as Cart)
}

export async function clearCart() {
  const cart = await getCart()
  if (!cart?._id) return

  await client.patch(cart._id).set({ items: [] }).commit()
}
