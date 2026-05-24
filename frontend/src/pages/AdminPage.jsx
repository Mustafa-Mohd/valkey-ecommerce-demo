import React, { useState, useEffect } from 'react';
import HeaderTwo from '../components/HeaderTwo';
import FooterTwo from '../components/FooterTwo';
import Preloader from '../helper/Preloader';

// ── Mock analytics data ──────────────────────────────────────────────────────
const dailyOrders = [
  { day: 'May 15', orders: 34, revenue: 12400 },
  { day: 'May 16', orders: 48, revenue: 18700 },
  { day: 'May 17', orders: 29, revenue: 9800 },
  { day: 'May 18', orders: 63, revenue: 27100 },
  { day: 'May 19', orders: 55, revenue: 21300 },
  { day: 'May 20', orders: 71, revenue: 31500 },
  { day: 'May 21', orders: 82, revenue: 38200 },
  { day: 'May 22', orders: 44, revenue: 16900 },
  { day: 'May 23', orders: 91, revenue: 42600 },
  { day: 'May 24', orders: 67, revenue: 29400 },
];

const categoryBreakdown = [
  { name: 'Electronics', value: 42, color: '#FF6B2C' },
  { name: 'Groceries',   value: 28, color: '#22c55e' },
  { name: 'Clothing',    value: 18, color: '#3b82f6' },
  { name: 'Books',       value: 12, color: '#f59e0b' },
];

const totalRevenue = dailyOrders.reduce((s, d) => s + d.revenue, 0);
const totalOrders  = dailyOrders.reduce((s, d) => s + d.orders,  0);
const avgOrderVal  = Math.round(totalRevenue / totalOrders);
// ─────────────────────────────────────────────────────────────────────────────

// ── Pure SVG Bar Chart ───────────────────────────────────────────────────────
function SvgBarChart({ data, dataKey, labelKey, color = '#FF6B2C', height = 200 }) {
  const W = 700, H = height, pad = { top: 16, right: 16, bottom: 36, left: 48 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top  - pad.bottom;
  const maxVal = Math.max(...data.map(d => d[dataKey]));
  const barW   = innerW / data.length * 0.55;
  const gap    = innerW / data.length;
  const yTicks = 5;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      {/* Y axis ticks */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const v = Math.round((maxVal / yTicks) * (yTicks - i));
        const y = pad.top + (innerH / yTicks) * i;
        return (
          <g key={i}>
            <line x1={pad.left} x2={pad.left + innerW} y1={y} y2={y} stroke="#f0f0f0" strokeWidth="1" />
            <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{v}</text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const barH  = (d[dataKey] / maxVal) * innerH;
        const x     = pad.left + gap * i + (gap - barW) / 2;
        const y     = pad.top + innerH - barH;
        const isLast = i === data.length - 1;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH}
              fill={isLast ? color : color + 'AA'} rx="4" ry="4" />
            <text x={x + barW / 2} y={H - pad.bottom + 14} textAnchor="middle" fontSize="9" fill="#6b7280">{d[labelKey]}</text>
          </g>
        );
      })}
      {/* Y axis line */}
      <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top + innerH} stroke="#e5e7eb" />
    </svg>
  );
}

// ── Pure SVG Area Chart ──────────────────────────────────────────────────────
function SvgAreaChart({ data, dataKey, labelKey, color = '#FF6B2C', height = 200 }) {
  const W = 700, H = height, pad = { top: 16, right: 16, bottom: 36, left: 56 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top  - pad.bottom;
  const maxVal = Math.max(...data.map(d => d[dataKey]));
  const yTicks = 5;

  const points = data.map((d, i) => ({
    x: pad.left + (innerW / (data.length - 1)) * i,
    y: pad.top  + innerH - (d[dataKey] / maxVal) * innerH,
    label: d[labelKey],
    val: d[dataKey],
  }));

  const linePath  = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath  = `${linePath} L${points[points.length-1].x},${pad.top+innerH} L${points[0].x},${pad.top+innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      {/* Grid */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const v = Math.round((maxVal / yTicks) * (yTicks - i));
        const y = pad.top + (innerH / yTicks) * i;
        return (
          <g key={i}>
            <line x1={pad.left} x2={pad.left + innerW} y1={y} y2={y} stroke="#f0f0f0" />
            <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
              ${(v/1000).toFixed(0)}k
            </text>
          </g>
        );
      })}
      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots + labels */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill={color} stroke="#fff" strokeWidth="2" />
          <text x={p.x} y={H - pad.bottom + 14} textAnchor="middle" fontSize="9" fill="#6b7280">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Pure SVG Donut Chart ─────────────────────────────────────────────────────
function SvgDonutChart({ data, size = 200 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.35, stroke = size * 0.18;
  const total = data.reduce((s, d) => s + d.value, 0);
  let angle = -Math.PI / 2;

  const slices = data.map(d => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    return { ...d, x1, y1, x2, y2, sweep, large: sweep > Math.PI ? 1 : 0 };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={`M${s.x1},${s.y1} A${r},${r} 0 ${s.large},1 ${s.x2},${s.y2}`}
            fill="none" stroke={s.color} strokeWidth={stroke}
          />
        ))}
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1f2937">{total}%</text>
      </svg>
      <div style={{ flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{d.name}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub, color }) => (
  <div className="p-24 rounded-16 flex-grow-1 border" style={{ background: color + '18', borderColor: color + '40' }}>
    <h3 className="mb-4 fw-bold" style={{ color }}>{value}</h3>
    <p className="text-gray-700 mb-0 fw-semibold">{label}</p>
    {sub && <p className="text-gray-500 text-xs mb-0 mt-4">{sub}</p>}
  </div>
);


const AdminPage = () => {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors]       = useState([]);
  const [ads, setAds]               = useState([]);
  const [loading, setLoading]       = useState(true);

  // CMS State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm]             = useState({ name: '', price: '', image: '' });

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm]             = useState({ username: '', password: '' });

  const fetchData = async () => {
    try {
      const [prodRes, catRes, vendRes, adRes] = await Promise.all([
        fetch('http://localhost:5000/api/products?limit=100').then(r => r.json()),
        fetch('http://localhost:5000/api/categories').then(r => r.json()),
        fetch('http://localhost:5000/api/vendors').then(r => r.json()),
        fetch('http://localhost:5000/api/ads/all').then(r => r.json()),
      ]);
      setProducts(prodRes.products || prodRes.results || []);
      setCategories(catRes || []);
      setVendors(vendRes || []);
      setAds(adRes || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (p) => {
    setEditingProduct(p.id);
    setEditForm({
      name:  p.name || '',
      price: p.price?.amount || p.price?.current || 0,
      image: (p.images && p.images[0]) || '',
    });
  };

  const handleSave = async (id) => {
    try {
      const updates = {
        '$.name':          editForm.name,
        '$.price.amount':  parseFloat(editForm.price),
        '$.price.current': parseFloat(editForm.price),
        '$.images':        [editForm.image],
      };
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(updates),
      });
      if (res.ok) { setEditingProduct(null); fetchData(); }
      else alert('Failed to save product.');
    } catch (err) {
      console.error(err);
      alert('Error saving product.');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Try admin / admin123');
    }
  };

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <>
        <HeaderTwo category={false} />
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
          <div className="bg-white p-40 rounded-16 border border-gray-100 shadow-sm" style={{ width: '420px' }}>
            <div className="text-center mb-32">
              <div className="w-64 h-64 rounded-circle bg-main-50 flex-center mx-auto mb-16" style={{ fontSize: 28 }}>🛒</div>
              <h3 className="mb-4">Admin Dashboard</h3>
              <p className="text-gray-500 text-sm mb-0">Sign in to manage your store</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-16">
                <label className="text-sm fw-medium mb-8 d-block">Username</label>
                <input
                  type="text" className="form-control py-12"
                  value={loginForm.username}
                  onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="admin"
                />
              </div>
              <div className="mb-24">
                <label className="text-sm fw-medium mb-8 d-block">Password</label>
                <input
                  type="password" className="form-control py-12"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn btn-main w-100 rounded-8 py-14 fw-semibold">
                Sign In →
              </button>
            </form>
          </div>
        </div>
        <FooterTwo />
      </>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <>
      <Preloader />
      <HeaderTwo category={false} />

      <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container py-40">

          {/* Header bar */}
          <div className="flex-between align-items-center mb-32">
            <div>
              <h2 className="mb-4 fw-bold">Admin Dashboard</h2>
              <p className="text-gray-500 mb-0 text-sm">Welcome back, Admin 👋</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="btn btn-outline-danger rounded-8 py-8 px-20 text-sm"
            >
              Logout
            </button>
          </div>

          {loading ? (
            <div className="py-80 text-center text-gray-500">Loading dashboard data…</div>
          ) : (
            <>
              {/* ── KPI Stat Cards ── */}
              <div className="d-flex gap-16 mb-32 flex-wrap">
                <StatCard label="Total Revenue (10 days)"  value={`$${totalRevenue.toLocaleString()}`} sub="+12.4% vs last period" color="#FF6B2C" />
                <StatCard label="Total Orders (10 days)"   value={totalOrders} sub={`${dailyOrders[dailyOrders.length-1].orders} orders today`} color="#22c55e" />
                <StatCard label="Avg Order Value"          value={`$${avgOrderVal}`} sub="per transaction" color="#3b82f6" />
                <StatCard label="Total Products"           value={products.length} sub={`${categories.length} categories`} color="#f59e0b" />
                <StatCard label="Active Vendors"           value={vendors.length} sub={`${ads.length} ads running`} color="#8b5cf6" />
              </div>

              {/* ── Charts Row ── */}
              <div className="row g-24 mb-32">
                {/* Daily Revenue – Area Chart */}
                <div className="col-lg-8">
                  <div className="bg-white rounded-16 border border-gray-100 shadow-sm p-24 h-100">
                    <h5 className="mb-4 fw-semibold">Daily Revenue</h5>
                    <p className="text-gray-500 text-xs mb-16">Last 10 days · USD</p>
                    <SvgAreaChart data={dailyOrders} dataKey="revenue" labelKey="day" color="#FF6B2C" height={240} />
                  </div>
                </div>
                {/* Category Breakdown – Donut Chart */}
                <div className="col-lg-4">
                  <div className="bg-white rounded-16 border border-gray-100 shadow-sm p-24 h-100">
                    <h5 className="mb-4 fw-semibold">Orders by Category</h5>
                    <p className="text-gray-500 text-xs mb-16">Share of total orders</p>
                    <SvgDonutChart data={categoryBreakdown} size={180} />
                  </div>
                </div>
              </div>

              {/* Daily Orders – Bar Chart */}
              <div className="bg-white rounded-16 border border-gray-100 shadow-sm p-24 mb-32">
                <h5 className="mb-4 fw-semibold">Daily Orders</h5>
                <p className="text-gray-500 text-xs mb-16">Number of orders placed per day</p>
                <SvgBarChart data={dailyOrders} dataKey="orders" labelKey="day" color="#FF6B2C" height={220} />
              </div>

              {/* ── Product CMS Section ── */}
              <div className="bg-white rounded-16 border border-gray-100 shadow-sm mb-32">
                <div className="p-24 border-bottom border-gray-100">
                  <h5 className="mb-4 fw-semibold" style={{ color: '#FF6B2C' }}>Product CMS Section</h5>
                  <p className="text-gray-500 text-sm mb-0">
                    Click <strong>Edit</strong> on any row to update product name, price, or image instantly.
                  </p>
                </div>
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-16">Product Name</th>
                        <th className="p-16">Price</th>
                        <th className="p-16">Image</th>
                        <th className="p-16">Status</th>
                        <th className="p-16 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, i) => (
                        <tr key={i} className="border-top border-gray-100 align-middle">
                          {editingProduct === p.id ? (
                            <>
                              <td className="p-16">
                                <input type="text" className="form-control" value={editForm.name}
                                  onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                              </td>
                              <td className="p-16">
                                <input type="number" className="form-control" style={{ width: 110 }} value={editForm.price}
                                  onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                              </td>
                              <td className="p-16">
                                <input type="text" className="form-control" placeholder="Image URL" value={editForm.image}
                                  onChange={e => setEditForm({ ...editForm, image: e.target.value })} />
                              </td>
                              <td className="p-16">
                                <span className={`px-8 py-4 rounded-4 text-xs ${p.status === 'active' ? 'bg-success-50 text-success-600' : 'bg-gray-50 text-gray-600'}`}>
                                  {p.status || 'active'}
                                </span>
                              </td>
                              <td className="p-16 text-end">
                                <button onClick={() => handleSave(p.id)} className="btn btn-sm btn-main me-8 py-6 px-16 text-xs">Save</button>
                                <button onClick={() => setEditingProduct(null)} className="btn btn-sm py-6 px-16 text-xs border border-gray-200">Cancel</button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-16 fw-medium">{p.name}</td>
                              <td className="p-16">${p.price?.amount || p.price?.current || 0}</td>
                              <td className="p-16">
                                {p.images?.[0]
                                  ? <img src={p.images[0]} alt={p.name} className="rounded-8" style={{ width: 44, height: 44, objectFit: 'cover' }} />
                                  : <span className="text-gray-400 text-xs">No image</span>}
                              </td>
                              <td className="p-16">
                                <span className={`px-8 py-4 rounded-4 text-xs ${p.status === 'active' ? 'bg-success-50 text-success-600' : 'bg-gray-50 text-gray-600'}`}>
                                  {p.status || 'active'}
                                </span>
                              </td>
                              <td className="p-16 text-end">
                                <button onClick={() => handleEditClick(p)} className="btn btn-sm py-6 px-16 text-xs border border-main-200 text-main-600 hover-bg-main-600 hover-text-white">Edit</button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Vendors Table ── */}
              <div className="bg-white rounded-16 border border-gray-100 shadow-sm">
                <div className="p-24 border-bottom border-gray-100">
                  <h5 className="mb-0 fw-semibold">Registered Vendors</h5>
                </div>
                <table className="table mb-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-16">Vendor ID</th>
                      <th className="p-16">Vendor Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((v, i) => (
                      <tr key={i} className="border-top border-gray-100">
                        <td className="p-16 text-xs text-gray-400">{v.id}</td>
                        <td className="p-16 fw-medium">{v.name}</td>
                      </tr>
                    ))}
                    {vendors.length === 0 && (
                      <tr><td colSpan="2" className="p-16 text-center text-gray-400">No vendors found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <FooterTwo />
    </>
  );
};

export default AdminPage;
