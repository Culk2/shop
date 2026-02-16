import { createClient, type SanityDocument } from '@sanity/client'
import { mockCreate, mockFetch, mockPatch } from './mockDb'

const isE2E =
  process.env.E2E_MOCKS === '1' || process.env.NEXT_PUBLIC_E2E_MOCKS === '1'

type WritableSanityDocument = Omit<
  SanityDocument,
  '_id' | '_rev' | '_createdAt' | '_updatedAt' | '_originalId'
> & {
  _type: string
}

const hasSanityConfig =
  Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) &&
  Boolean(process.env.NEXT_PUBLIC_SANITY_DATASET)

const realClient =
  !isE2E && hasSanityConfig
    ? createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
        apiVersion: '2024-01-01',
        useCdn: false,
        token: process.env.SANITY_WRITE_TOKEN,
      })
    : null

export const dataClient = {
  fetch: (query: string, params?: Record<string, unknown>) => {
    if (isE2E) return mockFetch(query, params)
    if (!realClient) {
      throw new Error(
        'Missing Sanity configuration: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.'
      )
    }
    return realClient.fetch(query, params)
  },
  create: (doc: WritableSanityDocument) => {
    if (isE2E) return mockCreate(doc)
    if (!realClient) {
      throw new Error(
        'Missing Sanity configuration: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.'
      )
    }
    return realClient.create(doc as SanityDocument)
  },
  patch: (id: string) => {
    if (isE2E) return mockPatch(id)
    if (!realClient) {
      throw new Error(
        'Missing Sanity configuration: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.'
      )
    }
    return realClient.patch(id)
  },
}
