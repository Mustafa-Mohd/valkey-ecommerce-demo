import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../helper/CartContext';

const HomeFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, decrementFromCart, cartItems } = useCart();
  const getQty = (id) => cartItems.find(i => i.id === id)?.qty || 0;

  useEffect(() => {
    fetch('http://localhost:5000/api/products?limit=8')
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="py-80" style={{ background: '#f8f9fa' }}>
      <div className="container">
        {/* Section header */}
        <div className="d-flex align-items-center justify-content-between mb-40">
          <div>
            <span
              className="d-inline-block px-16 py-6 rounded-pill text-xs fw-semibold mb-12"
              style={{ background: '#FF6B2C22', color: '#FF6B2C' }}
            >
              Live from Store
            </span>
            <h3 className="mb-0 fw-bold" style={{ fontSize: 28 }}>Featured Products</h3>
          </div>
          <Link
            to="/shop"
            className="btn rounded-pill px-24 py-12 fw-semibold text-sm"
            style={{ border: '2px solid #FF6B2C', color: '#FF6B2C', background: 'transparent' }}
          >
            View All <i className="ph ph-arrow-right ms-4" />
          </Link>
        </div>

        {/* Product grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 24,
          }}
        >
          {products.map((p) => {
            const img = p.images?.[0];
            const price = p.price?.amount || p.price?.current || 0;
            const qty = getQty(p.id);

            return (
              <div
                key={p.id}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,107,44,0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Image */}
                <Link to={`/product-details-two?id=${p.id}`} style={{ display: 'block', aspectRatio: '1', overflow: 'hidden', background: '#f5f5f5' }}>
                  {img ? (
                    <img
                      src={img}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                      🛍️
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Rating */}
                  {p.ratings?.average > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                      <span style={{ color: '#f59e0b', fontSize: 12 }}>{'★'.repeat(Math.round(p.ratings.average))}</span>
                      <span style={{ color: '#9ca3af', fontSize: 11 }}>({p.ratings.count})</span>
                    </div>
                  )}

                  {/* Name */}
                  <Link
                    to={`/product-details-two?id=${p.id}`}
                    style={{ textDecoration: 'none', color: '#1f2937', fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {p.name}
                  </Link>

                  {/* Price */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 18, color: '#FF6B2C' }}>${price}</span>
                      {p.price?.discount > 0 && (
                        <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>
                          ${(price + p.price.discount).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Cart button / stepper */}
                    {qty > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #FF6B2C', borderRadius: 10, overflow: 'hidden' }}>
                        <button
                          onClick={() => decrementFromCart(p.id)}
                          style={{ background: '#FF6B2C', color: '#fff', border: 'none', padding: '8px 14px', fontSize: 16, cursor: 'pointer', fontWeight: 700 }}
                        >−</button>
                        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, color: '#1f2937' }}>{qty}</span>
                        <button
                          onClick={() => addToCart(p)}
                          style={{ background: '#FF6B2C', color: '#fff', border: 'none', padding: '8px 14px', fontSize: 16, cursor: 'pointer', fontWeight: 700 }}
                        >+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(p)}
                        style={{
                          width: '100%', padding: '10px 0', borderRadius: 10, border: 'none',
                          background: '#FF6B2C', color: '#fff', fontWeight: 600, fontSize: 13,
                          cursor: 'pointer', transition: 'background 0.2s',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e55a1c'}
                        onMouseLeave={e => e.currentTarget.style.background = '#FF6B2C'}
                      >
                        <i className="ph ph-shopping-cart" /> Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturedProducts;
