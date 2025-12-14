'use client';

import { useState } from 'react';
import { addToCartAction } from '@/app/actions/cart';

type Product = {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const [showModal, setShowModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  
  const form = new FormData(event.currentTarget);
  const productData = JSON.parse(form.get('product') as string)
  
  const size = form.get('size') as string
  const color = form.get('color') as string
  await addToCartAction({ ...productData, size, color }); // pošlje formData namesto objekta

  setAddedToCart(true);
  setTimeout(() => setAddedToCart(false), 2000);
};

  return (
    <>
      {/* KARTICA – klikabilna */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full text-left group block"
      >
        <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
          {product.imageUrl ? (
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <img
                src={`${product.imageUrl}?w=800&h=800&fit=crop&auto=format`}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full aspect-square flex items-center justify-center">
              <span className="text-gray-500 text-lg font-medium">Brez slike</span>
            </div>
          )}

          <div className="p-6 pb-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h2>
            <span className="text-3xl font-bold text-indigo-600">
              {product.price.toFixed(2)} €
            </span>
          </div>
        </div>
      </button>
      
      {/* MODAL */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-lg z-10 text-3xl font-bold hover:bg-gray-100"
            >
              ×
            </button>

            <div className="grid md:grid-cols-2 gap-10 p-10">
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
                {product.imageUrl ? (
                  <img 
                    src={`${product.imageUrl}?w=1400&h=1400&fit=crop&auto=format`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                    Brez slike
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center space-y-8">
                <h1 className="text-5xl font-bold text-gray-900">{product.name}</h1>
                <div className="text-6xl font-bold text-indigo-600">
                  {product.price.toFixed(2)} €
                </div>

                <form onSubmit={handleAddToCart} className="w-full">

                  <input type="hidden" name="product" value={JSON.stringify(product)} />

                  {/* Izbira velikosti */}
                  <div className="flex flex-col">
                    <label htmlFor="size" className="text-black font-medium mb-1">
                      Velikost
                    </label>
                    <select
                      id="size"
                      name="size"
                      className="border border-gray-300 rounded-lg p-3 text-black text-lg"
                      required
                    >
                      <option value="">Izberi velikost</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>

                  {/* Izbira barve */}
                  <div className="flex flex-col">
                    <label htmlFor="color" className="text-black font-medium mb-1">
                      Barva
                    </label>
                    <select
                      id="color"
                      name="color"
                      className="border border-gray-300 rounded-lg p-3 text-black text-lg"
                      required
                    >
                      <option value="">Izberi barvo</option>
                      <option value="Črna">Črna</option>
                      <option value="Bela">Bela</option>
                      <option value="Rdeča">Rdeča</option>
                      <option value="Modra">Modra</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className={`w-full text-2xl font-bold py-6 rounded-2xl transition transform hover:scale-105 shadow-xl
                      ${addedToCart 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                  >
                    {addedToCart ? 'Dodano v košarico' : 'Dodaj v košarico'}
                  </button>
                </form>

                <button 
                  onClick={() => setShowModal(false)}
                  className="text-center text-gray-500 hover:text-gray-700 font-medium text-lg"
                >
                  Zapri
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
