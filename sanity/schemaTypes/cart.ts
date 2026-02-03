// sanity/schema/cart.ts
import type { Rule } from 'sanity'

type PreviewArgs = {
  title?: string
  subtitle?: number
}

const cartSchema = {
  name: 'cart',
  title: 'Košarica',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'Clerk User ID',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'items',
      title: 'Izdelki v košarici',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productId', type: 'string', title: 'Product ID' },
            { name: 'slug', type: 'string', title: 'Slug' },
            { name: 'name', type: 'string', title: 'Ime' },
            { name: 'price', type: 'number', title: 'Cena' },
            {
              name: 'quantity',
              type: 'number',
              title: 'Količina',
              validation: (rule: Rule) => rule.min(1),
            },
            { name: 'imageUrl', type: 'string', title: 'Image URL' },

            { name: 'selectedSize', type: 'string', title: 'Velikost' },
            { name: 'selectedColor', type: 'string', title: 'Barva' },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'quantity',
              media: 'imageUrl',
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'userId',
      subtitle: 'items.length',
    },
    prepare({ title, subtitle }: PreviewArgs) {
      return {
        title: `Košarica uporabnika ${title}`,
        subtitle: `${subtitle || 0} izdelkov`,
      }
    },
  },
}

export default cartSchema
