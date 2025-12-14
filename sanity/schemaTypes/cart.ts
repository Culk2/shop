// sanity/schema/cart.ts
export default {
  name: 'cart',
  title: 'Košarica',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'Clerk User ID',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
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
              validation: (Rule: any) => Rule.min(1),
            },
            { name: 'imageUrl', type: 'string', title: 'Image URL' },

            // DODANO: velikost in barva
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
    prepare({ title, subtitle }: any) {
      return {
        title: `Košarica uporabnika ${title}`,
        subtitle: `${subtitle || 0} izdelkov`,
      }
    },
  },
}
