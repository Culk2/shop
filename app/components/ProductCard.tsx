'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addToCartAction } from '@/app/actions/cart';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

type Product = {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  category?: string | { title?: string };
  sizes?: string[];
};

export default function ProductCard({ product }: { product: Product }) {
  const [showModal, setShowModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isE2E = process.env.NEXT_PUBLIC_E2E_MOCKS === '1';

  const getCategoryName = (category?: Product['category']) => {
    if (!category) return null;
    if (typeof category === 'string') return category;
    return category.title ?? null;
  };

  const categoryName = getCategoryName(product.category);
  const normalizedCategory = typeof categoryName === 'string'
    ? categoryName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    : null;
  const isShoes =
    typeof normalizedCategory === 'string' &&
    (normalizedCategory.includes('cevl') ||
      normalizedCategory.includes('obutev') ||
      normalizedCategory.includes('cevlji'));

  const sizeOptions =
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : isShoes
        ? ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
        : ['S', 'M', 'L', 'XL'];

  const handleAddToCart = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const form = new FormData(event.currentTarget);
        const productData = JSON.parse(form.get('product') as string);
        const size = form.get('size') as string;
        const color = form.get('color') as string;
        const qty = parseInt(form.get('quantity') as string, 10) || 1;

        await addToCartAction({
          ...productData,
          size,
          color,
          quantity: qty,
        });

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
        router.refresh();
      } catch (error) {
        console.error('Napaka pri dodajanju v košarico:', error);
        alert('Pri dodajanju je prišlo do napake. Poskusi ponovno.');
      }
    });
  };

  const form = (
    <form onSubmit={handleAddToCart} className="w-full space-y-4">
      <input type="hidden" name="product" value={JSON.stringify(product)} />

      <div className="flex flex-col">
        <label className="text-black mb-1">Velikost</label>
        <select name="size" required className="border p-3 rounded text-black">
          <option value="">Izberi velikost</option>
          {sizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-black mb-1">Barva</label>
        <select name="color" required className="border p-3 rounded text-black">
          <option value="">Izberi barvo</option>
          <option>Črna</option>
          <option>Bela</option>
          <option>Rdeča</option>
          <option>Modra</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-black mb-1">Količina</label>
        <input
          type="number"
          name="quantity"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          className="border p-3 rounded text-black"
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={`w-full mt-6 py-4 rounded-xl text-xl font-bold transition
          ${isPending
            ? 'bg-gray-400 cursor-not-allowed'
            : addedToCart
              ? 'bg-green-600 text-white'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
      >
        {isPending
          ? 'Dodajam...'
          : addedToCart
            ? 'Dodano v košarico ✓'
            : 'Dodaj v košarico'}
      </button>
    </form>
  );

  return (
    <>
      {/* KARTICA */}
      <button onClick={() => setShowModal(true)} className="w-full text-left group block">
        <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
          {product.imageUrl ? (
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <img
                src={`${product.imageUrl}?w=800&h=800&fit=crop&auto=format`}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full aspect-square flex items-center justify-center">
              <span className="text-black text-lg font-medium">Brez slike</span>
            </div>
          )}

          <div className="p-6 pb-2">
            <h2 className="text-xl font-semibold text-black mb-2">
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
              className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-lg text-3xl font-bold text-black"
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
                  <div className="w-full h-full flex items-center justify-center text-black text-2xl">
                    Brez slike
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center space-y-8">
                <h1 className="text-5xl font-bold text-black">{product.name}</h1>

                <div className="text-6xl font-bold text-indigo-600">
                  {product.price.toFixed(2)} €
                </div>

                {isE2E ? (
                  form
                ) : (
                  <>
                    <SignedIn>{form}</SignedIn>

                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="w-full py-4 rounded-xl bg-black text-white text-xl font-bold hover:bg-gray-800 transition">
                          Najprej se prijavi
                        </button>
                      </SignInButton>
                    </SignedOut>
                  </>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="text-center text-black font-medium text-lg"
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

