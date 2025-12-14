// sanity/schema/category.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Kategorija',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Ime kategorije',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
});