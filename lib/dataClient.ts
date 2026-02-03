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

const realClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

export const dataClient = {
  fetch: (query: string, params?: Record<string, unknown>) => {
    if (isE2E) return mockFetch(query, params)
    return realClient.fetch(query, params)
  },
  create: (doc: WritableSanityDocument) => {
    if (isE2E) return mockCreate(doc)
    return realClient.create(doc as SanityDocument)
  },
  patch: (id: string) => {
    if (isE2E) return mockPatch(id)
    return realClient.patch(id)
  },
}
