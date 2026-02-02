'use client';

import { useState, useMemo } from "react";
import ProductCard from "./components/ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  category?: string | { title?: string };
  sizes?: string[];
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // vedno pretvori kategorijo v string
  const getCategoryName = (category?: Product["category"]) => {
    if (!category) return null;
    if (typeof category === "string") return category;
    return category.title ?? null;
  };

  // kategorije
  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((p) => getCategoryName(p.category))
          .filter((c): c is string => Boolean(c))
      )
    );
  }, [products]);

  // filtrirani izdelki
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      let matchesPrice = true;
      if (priceFilter === "under20") matchesPrice = product.price < 20;
      else if (priceFilter === "20to50")
        matchesPrice = product.price >= 20 && product.price <= 50;
      else if (priceFilter === "over50") matchesPrice = product.price > 50;

      const matchesCategory =
        categoryFilter === "all" ||
        getCategoryName(product.category) === categoryFilter;

      return matchesSearch && matchesPrice && matchesCategory;
    });
  }, [products, searchQuery, priceFilter, categoryFilter]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* NASLOV + FILTERJI */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Naši izdelki
          </h1>

          <div className="flex gap-2 flex-wrap">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Išči izdelek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />

            {/* FILTER CENA */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="all">Vse cene</option>
              <option value="under20">Pod 20€</option>
              <option value="20to50">20€ – 50€</option>
              <option value="over50">Nad 50€</option>
            </select>

            {/* FILTER KATEGORIJE */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
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

        {/* IZDELKI */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">Ni najdenih izdelkov.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
