import { type SchemaTypeDefinition } from 'sanity'
import product from './products'
import category from './category';
import cart from './cart'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, cart, category],
}