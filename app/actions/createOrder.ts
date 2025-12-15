// app/actions/createOrder.ts
'use server'

import { createClient } from '@sanity/client'
import { currentUser } from '@clerk/nextjs/server'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN!,
})

export async function createOrder(items: any[], total: number) {
  const user = await currentUser()
  if (!user) return

  await client.create({
    _type: 'order',
    userId: user.id,
    items,
    total,
    createdAt: new Date().toISOString(),
    status: 'paid',
  })
}
