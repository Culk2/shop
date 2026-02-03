import { NextResponse } from 'next/server'
import { dataClient } from '@/lib/dataClient'
import { getUserId } from '@/lib/auth'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ count: 0 })

  try {
    const cart = await dataClient.fetch(
      `*[_type == "cart" && userId == $userId][0] { items }`,
      { userId }
    )

    const count = Array.isArray(cart?.items) ? cart.items.length : 0
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
