import React from 'react';
import { Link } from 'react-router-dom';
import HeaderTwo from '../components/HeaderTwo';
import FooterTwo from '../components/FooterTwo';
import Preloader from '../helper/Preloader';
import { useCompare } from '../helper/CompareContext';
import { useCart } from '../helper/CartContext';

const COMPARE_FIELDS = [
  { label: 'Price',          render: p => `$${p.price?.amount || p.price?.current || '—'}` },
  { label: 'Brand',          render: p => p.brand || '—' },
  { label: 'Rating',         render: p => p.ratings?.average ? `⭐ ${p.ratings.average} / 5 (${p.ratings.count || 0} reviews)` : '—' },
  { label: 'In Stock',       render: p => (p.inventory?.quantity > 0 ? `✅ ${p.inventory.quantity} units` : '❌ Out of stock') },
  { label: 'Color',          render: p => p.attributes?.color || '—' },
  { label: 'Tags',           render: p => (p.tags?.length ? p.tags.join(', ') : '—') },
  { label: 'Description',    render: p => p.description || '—' },
];

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart, cartItems } = useCart();
  const getQty = id => cartItems.find(i => i.id === id)?.qty || 0;

  return (
    <>
      <Preloader />
      <HeaderTwo category={false} />

      {/* ── Hero banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '48px 0 32px',
        marginBottom: 0,
      }}>
        <div className="container">
          <div className="d-flex align-items-center gap-16 mb-8">
            <Link to="/shop" className="text-white text-sm opacity-75" style={{ textDecoration: 'none' }}>
              ← Back to Shop
            </Link>
          </div>
          <h1 className="text-white fw-bold mb-8" style={{ fontSize: 32 }}>
            Product Comparison
          </h1>
          <p className="mb-0" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Side-by-side comparison · Up to 4 products
          </p>
        </div>
      </div>

      <div style={{ background: '#f8f9fa', minHeight: '60vh' }}>
        <div className="container py-40">

          {compareList.length === 0 ? (
            /* ── Empty state ── */
            <div className="bg-white rounded-16 border border-gray-100 shadow-sm p-80 text-center">
              <div style={{ fontSize: 64, marginBottom: 16 }}>⚖️</div>
              <h3 className="mb-12 fw-bold">Nothing to compare yet</h3>
              <p className="text-gray-500 mb-32">
                Go to the shop and click <strong>"+ Compare"</strong> on any product card to add it here.
              </p>
              <Link to="/shop" className="btn btn-main rounded-pill px-32 py-14 fw-semibold">
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              {/* Clear button */}
              <div className="d-flex justify-content-end mb-16">
                <button
                  onClick={clearCompare}
                  className="btn border border-danger-200 text-danger rounded-8 py-8 px-20 text-sm"
                >
                  Clear All
                </button>
              </div>

              {/* ── Comparison table ── */}
              <div className="bg-white rounded-16 border border-gray-100 shadow-sm overflow-hidden">
                <div className="table-responsive">
                  <table className="table mb-0" style={{ minWidth: 700 }}>

                    {/* Product Header Row */}
                    <thead>
                      <tr style={{ background: '#f8f9fa' }}>
                        <th className="p-24 fw-semibold text-gray-600" style={{ width: 160, minWidth: 140 }}>
                          Feature
                        </th>
                        {compareList.map(p => (
                          <th key={p.id} className="p-24 text-center" style={{ minWidth: 220 }}>
                            {/* Product Card */}
                            <div className="position-relative">
                              <button
                                onClick={() => removeFromCompare(p.id)}
                                style={{
                                  position: 'absolute', top: -8, right: -8,
                                  background: '#ff4d4f', border: 'none', borderRadius: '50%',
                                  width: 24, height: 24, color: '#fff', fontSize: 14,
                                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  lineHeight: 1, zIndex: 2,
                                }}
                                title="Remove"
                              >×</button>
                              <div
                                className="rounded-12 overflow-hidden mb-12 mx-auto"
                                style={{ width: 100, height: 100, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                {p.images?.[0]
                                  ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  : <span style={{ fontSize: 36 }}>📦</span>
                                }
                              </div>
                              <Link
                                to={`/product-details-two?id=${p.id}`}
                                className="fw-semibold text-heading d-block mb-4"
                                style={{ fontSize: 14, textDecoration: 'none' }}
                              >
                                {p.name}
                              </Link>
                              <div className="fw-bold mb-12" style={{ color: '#FF6B2C', fontSize: 16 }}>
                                ${p.price?.amount || p.price?.current || 0}
                              </div>
                              <button
                                onClick={() => addToCart(p)}
                                className="btn btn-main rounded-8 py-8 px-20 text-sm fw-semibold w-100"
                              >
                                {getQty(p.id) > 0 ? `In Cart (${getQty(p.id)})` : 'Add to Cart'}
                              </button>
                            </div>
                          </th>
                        ))}
                        {/* Empty slot placeholders */}
                        {Array.from({ length: Math.max(0, 2 - compareList.length) }).map((_, i) => (
                          <th key={`empty-${i}`} className="p-24 text-center" style={{ minWidth: 220 }}>
                            <div
                              className="rounded-12 border-2 border-dashed border-gray-200 d-flex flex-column align-items-center justify-content-center mx-auto"
                              style={{ width: 100, height: 100, borderStyle: 'dashed', borderWidth: 2, borderColor: '#ddd', marginBottom: 12 }}
                            >
                              <span style={{ fontSize: 28, color: '#ccc' }}>+</span>
                            </div>
                            <Link to="/shop" className="text-main-600 text-sm fw-medium" style={{ textDecoration: 'none' }}>
                              Add a product
                            </Link>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* Field Rows */}
                    <tbody>
                      {COMPARE_FIELDS.map((field, fi) => {
                        // Highlight best price
                        const isBestPrice = field.label === 'Price';
                        const prices = compareList.map(p => p.price?.amount || p.price?.current || 0);
                        const minPrice = Math.min(...prices);

                        return (
                          <tr
                            key={fi}
                            style={{ background: fi % 2 === 0 ? '#fff' : '#fafafa' }}
                          >
                            <td className="p-20 fw-semibold text-gray-600 text-sm" style={{ verticalAlign: 'middle' }}>
                              {field.label}
                            </td>
                            {compareList.map(p => {
                              const isBest = isBestPrice && (p.price?.amount || p.price?.current || 0) === minPrice;
                              return (
                                <td
                                  key={p.id}
                                  className="p-20 text-center text-sm"
                                  style={{
                                    verticalAlign: 'middle',
                                    background: isBest ? '#fff7f0' : undefined,
                                    fontWeight: isBest ? 700 : 400,
                                    color: isBest ? '#FF6B2C' : '#374151',
                                    maxWidth: 220,
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  {isBest && <span style={{ fontSize: 10, display: 'block', color: '#FF6B2C', marginBottom: 2 }}>BEST PRICE</span>}
                                  {field.render(p)}
                                </td>
                              );
                            })}
                            {/* Empty slot cells */}
                            {Array.from({ length: Math.max(0, 2 - compareList.length) }).map((_, i) => (
                              <td key={`empty-${i}`} className="p-20 text-center text-gray-300">—</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add more products hint */}
              {compareList.length < 4 && (
                <div className="text-center mt-24">
                  <p className="text-gray-500 text-sm mb-12">
                    You can add up to {4 - compareList.length} more product{4 - compareList.length !== 1 ? 's' : ''}.
                  </p>
                  <Link to="/shop" className="btn border border-main-600 text-main-600 rounded-pill px-24 py-10 text-sm fw-semibold">
                    + Add More Products
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <FooterTwo />
    </>
  );
}
