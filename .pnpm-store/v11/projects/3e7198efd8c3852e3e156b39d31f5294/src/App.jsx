import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserLayout from './components/layout/UserLayout';
import { ShoppingBag, ChevronRight, Loader2 } from 'lucide-react';
import { useCart } from './context/cart';
import HeroSlider from './components/home/HeroSlider';
import ScrollReveal from './components/layout/ScrollReveal';
import { categories as fallbackCategories, featuredProducts as fallbackFeatured, features } from './data/constants';
import { SkeletonGrid } from './components/ui/Skeleton';
import api from './services/api';

// Pages
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import CartPage from './pages/CartPage';
import DealsPage from './pages/DealsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Route Guards & Error Boundary
import { ProtectedRoute, AdminRoute } from './components/layout/RouteGuards';
import ErrorBoundary from './components/layout/ErrorBoundary';


/* ─── Home Page Component ─── */
function HomePage() {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState(fallbackCategories);
  const [featuredProducts, setFeaturedProducts] = useState(fallbackFeatured);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=8')
        ]);
        if (catsRes.data?.data?.length > 0) {
          setCategories(catsRes.data.data.map(c => ({
            name: c.name,
            desc: c.description || '',
            img: c.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
            color: c.color || '#1f8044',
            count: 'Explore'
          })));
        }
        if (prodsRes.data?.data?.length > 0) {
          setFeaturedProducts(prodsRes.data.data.map(p => ({
            id: p._id,
            name: p.name,
            cat: p.categoryName || 'Organic',
            price: p.price,
            discountedPrice: p.discountedPrice,
            discountPercentage: p.discountPercentage,
            hasDiscount: p.hasDiscount,
            img: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=600',
            rating: p.rating ?? 0,
            reviews: p.numReviews ?? 0,
            badge: p.badge || ''
          })));
        }
      } catch (err) {
        console.error('Failed to load live home data, using fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div>
      <HeroSlider />
      
      {/* Categories Section */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-heading-row" style={{ marginBottom: '48px' }}>
              <div className="flex items-center" style={{ gap: '12px' }}>
                <div>
                  <span className="section-label">Categories</span>
                  <h2 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800 }}>Browse by Category</h2>
                </div>
                {loading && <Loader2 className="pulse-anim" size={20} color="var(--primary)" />}
              </div>
              <Link to="/products" className="btn-outline" style={{ textDecoration: 'none' }}>
                All Categories <ChevronRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

          {loading ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="grid-4" style={{ gap: '20px' }}>
              {categories.slice(0, 8).map((cat, i) => (
                <ScrollReveal key={cat.name} delay={i * 0.05}>
                  <Link to={`/products?category=${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none' }}>
                    <div className="category-card" style={{ position: 'relative', height: '220px', borderRadius: '20px', overflow: 'hidden' }}>
                      <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px' }}>
                        <h4 style={{ color: 'white', margin: 0 }}>{cat.name}</h4>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{cat.count}</span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section" style={{ background: 'var(--bg-section-alt)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="flex items-center" style={{ marginBottom: '48px', gap: '12px' }}>
              <div>
                <span className="section-label">Fresh Picks</span>
                <h2 style={{ fontSize: '32px', fontWeight: 800 }}>Today's Best Deals</h2>
              </div>
              {loading && <Loader2 className="pulse-anim" size={20} color="var(--primary)" />}
            </div>
          </ScrollReveal>

          {loading ? (
            <SkeletonGrid count={4} />
          ) : (
            <div className="grid-4" style={{ gap: '24px' }}>
              {featuredProducts.map((prod, i) => (
                <ScrollReveal key={prod.id} delay={i * 0.1}>
                  <div className="product-card" style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '24px', border: '1px solid var(--border-soft)', position: 'relative' }}>
                    {prod.hasDiscount && (
                      <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 5 }}>
                        <span style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, background: 'var(--secondary)', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                          🔥 {prod.discountPercentage}% OFF
                        </span>
                      </div>
                    )}
                    <img src={prod.img} alt={prod.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '16px' }} />
                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 800 }}>{prod.cat}</span>
                    <h4 style={{ margin: '8px 0', fontSize: '18px' }}>{prod.name}</h4>
                    <div className="flex justify-between items-center">
                      <div>
                        {prod.hasDiscount ? (
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--primary)' }}>${prod.discountedPrice.toFixed(2)}</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${prod.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--primary)' }}>${prod.price.toFixed(2)}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => addToCart(prod)}
                        className="btn-primary" 
                        style={{ width: '40px', height: '40px', borderRadius: '10px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="section" style={{ borderTop: '1px solid var(--border-soft)' }}>
        <div className="container">
          <div className="grid-4" style={{ gap: '40px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <f.icon size={32} color="var(--primary)" style={{ marginBottom: '16px' }} />
                <h4 style={{ margin: '0 0 8px 0' }}>{f.title}</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Main Application Component ─── */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
          <Route path="/products" element={<UserLayout><ProductsPage /></UserLayout>} />
          <Route path="/products/:id" element={<UserLayout><ProductsPage /></UserLayout>} />
          <Route path="/categories" element={<UserLayout><CategoriesPage /></UserLayout>} />
          <Route path="/cart" element={<UserLayout><CartPage /></UserLayout>} />
          <Route path="/deals" element={<UserLayout><DealsPage /></UserLayout>} />
          <Route path="/about" element={<UserLayout><AboutPage /></UserLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProtectedRoute><UserLayout><UserProfilePage /></UserLayout></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

      </Router>
    </ErrorBoundary>
  );
}

export default App;
