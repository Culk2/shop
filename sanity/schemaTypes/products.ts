import { defineType, defineField } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",

  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Product Name",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "price",
      type: "number",
      title: "Price",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      type: "image",
      title: "Image",
      options: { hotspot: true },
    }),

    defineField({
      name: "category",
      title: "Kategorija",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),

    /* 🔢 VELIKOST / ŠTEVILKA */
    defineField({
      name: "sizes",
      title: "Velikosti / Številke",
      type: "array",
      of: [{ type: "string" }],
      description: "Primer: 36, 38, 40 ali S, M, L",
      options: {
        layout: "tags",
      },
    }),

    /* 🎨 BARVE */
    defineField({
      name: "colors",
      title: "Barve",
      type: "array",
      of: [{ type: "string" }],
      description: "Primer: Črna, Bela, Rdeča",
      options: {
        layout: "tags",
      },
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle || "Brez kategorije",
        media,
      };
    },
  },
});
