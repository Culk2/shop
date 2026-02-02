// app/cart/page.tsx – Server Component (brez 'use client')
import Link from 'next/link'  // ← DODAJ TO za navigacijo
import { getCart } from '@/lib/cart'
import CartItemControls from './CartItemControls'

export default async function CartPage() {
  const { items, cartId } = await getCart()

  const pageBg = '#f6f7f9'
  const cardBg = '#ffffff'
  const border = '#e8eaee'
  const text = '#111827'
  const muted = '#6b7280'
  const subtle = '#9ca3af'

  if (!items || items.length === 0) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'grid',
          placeItems: 'center',
          background: pageBg,
          padding: '2rem 1rem',
          color: text,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 720,
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 18,
            boxShadow: '0 18px 40px rgba(17,24,39,0.06)',
            padding: '2.5rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.6rem', letterSpacing: '-0.02em' }}>
            Tvoja košarica
          </h1>
          <p style={{ marginTop: '0.75rem', marginBottom: 0, color: muted }}>
            Košarica je prazna
          </p>
        </div>
      </div>
    )
  }

  const total = items.reduce(
    (sum: number, item: any) => sum + item.price * (Number(item.quantity) || 1),
    0
  )

  return (
    <div style={{ background: pageBg, minHeight: '100vh', padding: '2.5rem 1rem', color: text }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.25rem', padding: '0 0.25rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.9rem', letterSpacing: '-0.03em' }}>
            Tvoja košarica
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', color: muted }}>
            Preglej izdelke in nadaljuj na plačilo.
          </p>
        </div>

        {/* Main card */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 20,
            boxShadow: '0 18px 40px rgba(17,24,39,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Items */}
          <div style={{ padding: '1.25rem' }}>
            {items.map((item: any) => {
              const qty = Number(item.quantity) || 1
              const lineTotal = item.price * qty

              return (
                <div
                  key={item._key}
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'center',
                    padding: '1rem',
                    border: `1px solid ${border}`,
                    borderRadius: 16,
                    background: '#fff',
                    marginBottom: '0.9rem',
                  }}
                >
                  {/* Image */}
                  <div style={{ flexShrink: 0 }}>
                    {item.imageUrl ? (
                      <img
                        src={`${item.imageUrl}?w=120&h=120&fit=crop`}
                        alt={item.name}
                        style={{
                          width: 110,
                          height: 110,
                          borderRadius: 14,
                          objectFit: 'cover',
                          border: `1px solid ${border}`,
                          background: '#fff',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 110,
                          height: 110,
                          borderRadius: 14,
                          background: '#f1f3f5',
                          border: `1px solid ${border}`,
                        }}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1.05rem',
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.name}
                      </h3>

                      <div style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {item.price.toFixed(2)} €
                      </div>
                    </div>

                    <div style={{ marginTop: '0.4rem', color: muted, fontSize: '0.92rem' }}>
                      Velikost: <span style={{ color: text, fontWeight: 600 }}>{item.size || 'Ni izbrana'}</span>
                      <span style={{ color: subtle }}> • </span>
                      Barva: <span style={{ color: text, fontWeight: 600 }}>{item.color || 'Ni izbrana'}</span>
                    </div>

                    <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.45rem 0.6rem',
                          borderRadius: 999,
                          border: `1px solid ${border}`,
                          background: '#fbfbfc',
                        }}
                      >
                        <CartItemControls cartId={cartId} itemKey={item._key} quantity={qty} />
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '1rem', whiteSpace: 'nowrap' }}>
                        {lineTotal.toFixed(2)} €
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Total */}
          <div
            style={{
              borderTop: `1px solid ${border}`,
              padding: '1.25rem 1.25rem',
              background: '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ color: muted, fontSize: '0.95rem' }}>Skupaj</div>
                <div style={{ color: subtle, fontSize: '0.85rem', marginTop: '0.15rem' }}>
                </div>
              </div>

              <div style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                {total.toFixed(2)} €
              </div>
            </div>

            {/* GUMB – zdaj kot Link (brez onClick, brez JS) */}
            <Link
              href="/checkout/success"  // ← PELJE NA USPEŠNO PLAČILO
              style={{
                display: 'block',
                marginTop: '1rem',
                width: '100%',
                padding: '1rem',
                borderRadius: 14,
                border: '1px solid #000',
                background: '#000',
                color: '#fff',
                fontSize: '1.05rem',
                fontWeight: 700,
                textAlign: 'center',
                textDecoration: 'none',
                boxShadow: '0 14px 30px rgba(0,0,0,0.18)',
              }}
            >
              Plačaj
            </Link>

            <div style={{ marginTop: '0.75rem', textAlign: 'center', color: muted, fontSize: '0.9rem' }}>
              Varno plačilo • Hitro naročilo
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}