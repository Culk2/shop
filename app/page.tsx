import { getProducts } from "@/lib/getProducts";
import ProductsClient from "./ProductsClient";

export default async function HomePage() {
  const products = await getProducts();

  return <ProductsClient products={products || []} />;
}
