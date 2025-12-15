// app/actions/clearCart.ts
'use server'

import { createClient } from '@sanity/client'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN!,
})

export async function clearCart() {
  const user = await currentUser()
  if (!user) return

  try {
    await client
      .patch(user.id)
      .unset(['items']) // izbriše CELOTNO košarico
      .commit()

    revalidatePath('/cart')
    revalidatePath('/checkout')
  } catch (error) {
    console.error('Napaka pri brisanju košarice:', error)
  }
}
