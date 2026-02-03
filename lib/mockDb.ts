import type { SanityDocument } from '@sanity/client'

type WritableSanityDocument = Omit<
  SanityDocument,
  '_id' | '_rev' | '_createdAt' | '_updatedAt' | '_originalId'
> & {
  _type: string
}

type CartItem = {
  _key: string
  productId: string
  name: string
  price: number
  imageUrl?: string | null
  size?: string | null
  color?: string | null
  quantity?: number
}

type Cart = {
  _id: string
  _type: 'cart'
  userId: string
  items: CartItem[]
}

type Order = {
  _id: string
  _type: 'order'
  userId: string
  items: CartItem[]
  total: number
  status?: string
  createdAt: string
}

type Product = {
  _id: string
  _type: 'product'
  name: string
  price: number
  imageUrl?: string | null
  category?: string
  sizes?: string[]
  colors?: string[]
}

type MockDb = {
  products: Product[]
  carts: Cart[]
  orders: Order[]
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    _id: 'prod-shoe-1',
    _type: 'product',
    name: 'Nike AirForce 1',
    price: 129,
    imageUrl: 'https://placehold.co/800x800/png',
    category: 'Cevlji',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
    colors: ['Bela', 'Crna'],
  },
  {
    _id: 'prod-shirt-1',
    _type: 'product',
    name: 'Basic Majica',
    price: 19.9,
    imageUrl: 'https://placehold.co/800x800/png',
    category: 'Majice',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Bela', 'Crna'],
  },
]

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

declare global {
  var __E2E_MOCK_DB__: MockDb | undefined
}

export function getMockDb(): MockDb {
  if (!globalThis.__E2E_MOCK_DB__) {
    globalThis.__E2E_MOCK_DB__ = {
      products: [...DEFAULT_PRODUCTS],
      carts: [],
      orders: [],
    }
  }
  return globalThis.__E2E_MOCK_DB__
}

export function mockFetch(query: string, params?: Record<string, unknown>) {
  const db = getMockDb()

  if (query.includes('_type == "product"')) {
    return db.products.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      category: p.category,
      sizes: p.sizes,
      colors: p.colors,
    }))
  }

  if (query.includes('_type == "cart"') && query.includes('userId == $userId')) {
    const userId = params?.userId as string
    const cart = db.carts.find((c) => c.userId === userId) || null
    if (!cart) return null
    return {
      _id: cart._id,
      items: cart.items,
    }
  }

  if (query.includes('_type == "order"') && query.includes('userId == $userId')) {
    const userId = params?.userId as string
    return db.orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  return null
}

export function mockCreate(doc: WritableSanityDocument) {
  const db = getMockDb()

  if (doc._type === 'cart') {
    const cart: Cart = {
      _id: createId('cart'),
      _type: 'cart',
      userId: doc.userId as string,
      items: (doc.items as CartItem[]) || [],
    }
    db.carts.push(cart)
    return cart
  }

  if (doc._type === 'order') {
    const order: Order = {
      _id: createId('order'),
      _type: 'order',
      userId: doc.userId as string,
      items: (doc.items as CartItem[]) || [],
      total: (doc.total as number) || 0,
      status: doc.status as string | undefined,
      createdAt: (doc.createdAt as string) || new Date().toISOString(),
    }
    db.orders.push(order)
    return order
  }

  return doc
}

export function mockPatch(id: string) {
  const db = getMockDb()

  const findCart = () => db.carts.find((c) => c._id === id)

  const state: {
    setData?: Record<string, unknown>
    setIfMissingData?: Record<string, unknown>
    appendData?: { field: string; items: CartItem[] }[]
    unsetKeys?: string[]
  } = {}

  const api = {
    set(data: Record<string, unknown>) {
      state.setData = { ...(state.setData || {}), ...data }
      return api
    },
    setIfMissing(data: Record<string, unknown>) {
      state.setIfMissingData = { ...(state.setIfMissingData || {}), ...data }
      return api
    },
    append(field: string, items: CartItem[]) {
      state.appendData = [...(state.appendData || []), { field, items }]
      return api
    },
    unset(keys: string[]) {
      state.unsetKeys = [...(state.unsetKeys || []), ...keys]
      return api
    },
    async commit() {
      const cart = findCart()
      if (!cart) return null

      if (state.setIfMissingData?.items && !cart.items) {
        cart.items = []
      }

      if (state.setData) {
        for (const [key, value] of Object.entries(state.setData)) {
          if (key === 'items') {
            cart.items = value as CartItem[]
            continue
          }

          const match = key.match(/items\[_key=="(.+?)"\]\.quantity/)
          if (match) {
            const itemKey = match[1]
            const item = cart.items.find((i) => i._key === itemKey)
            if (item) item.quantity = value as number
          }
        }
      }

      if (state.appendData) {
        for (const op of state.appendData) {
          if (op.field === 'items') {
            cart.items.push(...op.items)
          }
        }
      }

      if (state.unsetKeys) {
        for (const key of state.unsetKeys) {
          if (key === 'items') {
            cart.items = []
          }

          const match = key.match(/items\[_key=="(.+?)"\]/)
          if (match) {
            const itemKey = match[1]
            cart.items = cart.items.filter((i) => i._key !== itemKey)
          }
        }
      }

      return cart
    },
  }

  return api
}
