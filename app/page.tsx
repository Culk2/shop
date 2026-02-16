import { getProducts } from "@/lib/getProducts";
import ProductsClient from "./ProductsClient";

export default async function HomePage() {
  // Server komponenta naloži produkte in jih preda client filtru/UI komponenti.
  const products = await getProducts();

  return <ProductsClient products={products || []} />;
}
