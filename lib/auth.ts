import { auth, currentUser } from '@clerk/nextjs/server'

type ClerkUser = {
  id: string
  firstName?: string | null
  lastName?: string | null
  emailAddresses?: { emailAddress: string }[]
}

const isE2E =
  process.env.E2E_MOCKS === '1' || process.env.NEXT_PUBLIC_E2E_MOCKS === '1'

export async function getUserId() {
  if (isE2E) return 'e2e-user'
  const { userId } = await auth()
  return userId
}

export async function getCurrentUser(): Promise<ClerkUser | null> {
  if (isE2E) {
    return {
      id: 'e2e-user',
      firstName: 'E2E',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'e2e@example.com' }],
    }
  }
  return currentUser()
}
