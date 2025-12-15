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

  let cart: Cart | null = null
  try {
    cart = (await client.getDocument<Cart>(user.id)) as Cart | null
  } catch {
    cart = null
  }

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

  // Poišči obstoječi izdelek z enakim _id, size in color
  const existingIndex = cart.items.findIndex(
    (item) =>
      item.productId === product._id &&
      item.size === product.size &&
      item.color === product.color
  )

  if (existingIndex !== -1) {
    cart.items[existingIndex].quantity += product.quantity || 1
  } else {
    cart.items.push({
      _key: product._id + '-' + Date.now(),
      _type: 'object',
      productId: product._id,
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

  let cart: Cart | null = null
  try {
    cart = (await client.getDocument<Cart>(user.id)) as Cart | null
  } catch {
    cart = null
  }

  return cart ?? ({
    _id: '',
    _type: 'cart',
    userId: user.id,
    items: [],
  } as unknown as Cart)
}

export async function clearCart() {
  const user = await currentUser()
  if (!user) return

  await client.patch(user.id).set({ items: [] }).commit()
}
