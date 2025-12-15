'use client';

import { useState, useEffect } from "react";
import { getProducts } from "@/lib/getProducts";
import ProductCard from './components/ProductCard';

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  category?: {
    _id: string;
    title: string;
  };
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Na mount naloži izdelke
  useEffect(() => {
    async function fetchProducts() {
      const prods = await getProducts();
      setAllProducts(prods || []);
    }
    fetchProducts();
  }, []);

  // Dobi seznam vseh kategorij iz izdelkov (uporablja name iz populated reference)
  const categories = Array.from(
    new Set(
      allProducts
        .map((p: Product) => p.category?.title)
        .filter((c): c is string => Boolean(c))
    )
  );

  // Filtriranje po search, ceni in kategoriji
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrice = true;
    if (priceFilter === "under20") matchesPrice = product.price < 20;
    else if (priceFilter === "20to50") matchesPrice = product.price >= 20 && product.price <= 50;
    else if (priceFilter === "over50") matchesPrice = product.price > 50;

    let matchesCategory =
    categoryFilter === "all" ||
    product.category?.title === categoryFilter;

    return matchesSearch && matchesPrice && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Naši izdelki
          </h1>

          <div className="flex gap-2 flex-wrap">
            {/* Search bar */}
            <input
              type="text"
              placeholder="Išči izdelek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 w-64 bg-black text-white"
            />

            {/* Filter po ceni */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-black text-white"
            >
              <option value="all">Vse cene</option>
              <option value="under20">Pod 20€</option>
              <option value="20to50">20€ - 50€</option>
              <option value="over50">Nad 50€</option>
            </select>

            {/* Filter po kategorijah */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-black text-white"
            >
              <option value="all">Vse kategorije</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">Ni najdenih izdelkov.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
