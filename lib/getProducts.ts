import { dataClient } from "@/lib/dataClient";

export async function getProducts() {
  return await dataClient.fetch(`
    *[_type == "product"]{
      _id,
      name,
      price,
      "imageUrl": image.asset->url,
      "category": category->title
    }
  `);
}