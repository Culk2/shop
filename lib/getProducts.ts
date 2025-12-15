// lib/getProducts.ts
import { client } from "../sanity/lib/client";

export async function getProducts() {
  return await client.fetch(`
    *[_type == "product"]{
      _id,
      name,
      price,
      "imageUrl": image.asset->url,
      sizes,
      colors,

      // ⬇⬇⬇ TO JE MANJKALO
      "category": category->{
        _id,
        title
      }
    }
  `);
}
