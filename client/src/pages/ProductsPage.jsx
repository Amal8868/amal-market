import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, SlidersHorizontal, ChevronDown, 
  Star, ShoppingBag, Heart, ArrowRight, Grid, List,
  X, Check, Loader2, Plus, Minus, ShieldCheck, Truck, RotateCcw
} from 'lucide-react';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import ScrollReveal from '../components/layout/ScrollReveal';
import { categoryNames } from '../data/constants';
import { SkeletonGrid } from '../components/ui/Skeleton';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const { addToCart, toggleWishlist, inWishlist } = useCart();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { id: routeProductId } = useParams();
  const initialCategory = searchParams.get('category') || 'All';
  const searchInputRef = useRef(null);
  
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50]);

  // Debounced search and price states for server filtering
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Quick View / Product Details Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch reviews when product is selected in quick view
  useEffect(() => {
    const fetchReviews = async () => {
      if (!selectedProduct) return;
      setLoadingReviews(true);
      try {
        const { data } = await api.get(`/products/${selectedProduct.id}/reviews`);
        if (data.success) {
          setReviews(data.data);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [selectedProduct]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const { data } = await api.post(`/products/${selectedProduct.id}/reviews`, {
        rating: newRating,
        comment: newComment
      });

      if (data.success) {
        toast.success('Thank you! Review added successfully.');
        setReviews([data.data, ...reviews]);
        setNewComment('');
        setNewRating(5);
        
        // Dynamically update the overall rating and reviews count locally
        setAllProducts(allProducts.map(p => {
          if (p.id === selectedProduct.id) {
            const newCount = p.reviews + 1;
            const newScore = ((p.rating * p.reviews) + newRating) / newCount;
            return {
              ...p,
              rating: parseFloat(newScore.toFixed(1)),
              reviews: newCount
            };
          }
          return p;
        }));

        // Update selected product's indicators inside the modal
        setSelectedProduct(prev => {
          const newCount = prev.reviews + 1;
          const newScore = ((prev.rating * prev.reviews) + newRating) / newCount;
          return {
            ...prev,
            rating: parseFloat(newScore.toFixed(1)),
            reviews: newCount
          };
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    } finally {
      setIsSubmittingReview(false);
    }
  };


  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Debounce price range
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [priceRange]);

  // Reset page when category or sort changes
  useEffect(() => {
    setPage(1);
  }, [selectedCat, sortBy]);

  // Server-side fetching
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const sortMap = {
          'Price: Low to High': 'price_asc',
          'Price: High to Low': 'price_desc',
          'Rating': 'rating',
          'Newest': 'newest'
        };

        const params = {
          page,
          limit: 9,
          sort: sortMap[sortBy] || 'newest',
          category: selectedCat !== 'All' ? selectedCat : undefined,
          minPrice: debouncedPriceRange[0] || undefined,
          maxPrice: debouncedPriceRange[1] || undefined,
          search: debouncedSearchQuery || undefined
        };

        const { data } = await api.get('/products', { params });
        if (data?.success) {
          setAllProducts(data.data.map(p => ({
            id: p._id,
            _id: p._id,
            name: p.name,
            cat: p.categoryName || 'Organic Specials',
            price: p.price,
            discountedPrice: p.discountedPrice,
            discountPercentage: p.discountPercentage,
            hasDiscount: p.hasDiscount,
            img: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=600',
            rating: p.rating ?? 0,
            reviews: p.numReviews ?? 0,
            badge: p.badge || '',
            stock: p.stock
          })));
          setTotalPages(data.pages || 1);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, selectedCat, sortBy, debouncedSearchQuery, debouncedPriceRange]);

  // Sync state if URL param changes
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCat(catParam);
    }
    const focusParam = searchParams.get('focus');
    if (focusParam && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchParams]);

  // Fetch and open single product modal if accessed via /products/:id
  useEffect(() => {
    if (!routeProductId) return;
    const fetchSingleProduct = async () => {
      try {
        const { data } = await api.get(`/products/${routeProductId}`);
        if (data?.success && data?.data) {
          const p = data.data;
          setSelectedProduct({
            id: p._id,
            _id: p._id,
            name: p.name,
            cat: p.categoryName || 'Organic Specials',
            price: p.price,
            discountedPrice: p.discountedPrice,
            discountPercentage: p.discountPercentage,
            hasDiscount: p.hasDiscount,
            img: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=600',
            rating: p.rating ?? 0,
            reviews: p.numReviews ?? 0,
            badge: p.badge || '',
            stock: p.stock,
            description: p.description
          });
        }
      } catch (err) {
        console.error('Failed to load product by ID:', err);
      }
    };
    fetchSingleProduct();
  }, [routeProductId]);


  // Since filtering is done server-side, sortedProducts is just allProducts
  const sortedProducts = allProducts;

  const handleReset = () => {
    setSelectedCat('All');
    setSearchQuery('');
    setSortBy('Newest');
    setPriceRange([0, 50]);
    setPage(1);
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingTop: '100px' }}>
      {/* ─── Hero Header (Big Image) ─── */}
      <section style={{ 
        position: 'relative',
        height: '450px',
        width: '100%',
        marginBottom: '60px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}>
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000" 
            alt="Amal Market Catalog" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Immersive Overlays */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(13, 59, 30, 0.8), rgba(6, 33, 17, 0.9))',
            mixBlendMode: 'multiply'
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent, rgba(0,0,0,0.4))'
          }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
          >
            <span style={{ 
              color: 'var(--accent-gold)', 
              fontWeight: 700, 
              letterSpacing: '3px', 
              textTransform: 'uppercase', 
              fontSize: '14px',
              display: 'block',
              marginBottom: '16px'
            }}>
              Curated Selection
            </span>
            <h1 style={{ 
              color: 'white', 
              fontSize: 'clamp(40px, 6vw, 64px)', 
              fontWeight: 800, 
              marginBottom: '20px', 
              fontFamily: "'Playfair Display', serif",
              lineHeight: 1.1
            }}>
              The Full <span style={{ fontStyle: 'italic', color: 'var(--hero-accent)' }}>Amal</span> Collection
            </h1>
            <div style={{ width: '80px', height: '4px', background: 'var(--primary)', margin: '0 auto 24px' }} />
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '20px', lineHeight: 1.6 }}>
              Explore our complete range of premium organic produce, artisanal bakery items, and sustainable pantry essentials.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container">
        <div className="products-layout-wrapper">
          
          {/* ─── Sidebar Filters ─── */}
          <aside className="products-sidebar">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Filters</h3>
                {loading && <Loader2 className="pulse-anim" size={16} color="var(--primary)" />}
              </div>
              <button onClick={handleReset} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Reset</button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'block' }}>Search Product</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Apples, Milk..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-soft)',
                    background: 'var(--bg-main)',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Categories */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'block' }}>Categories</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {categoryNames.map(cat => (
                  <label key={cat} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    fontSize: '14px', 
                    color: selectedCat === cat ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: selectedCat === cat ? 700 : 500,
                    cursor: 'pointer',
                    padding: '4px 0'
                  }}>
                    <input 
                      type="radio" 
                      name="cat" 
                      checked={selectedCat === cat}
                      onChange={() => setSelectedCat(cat)}
                      style={{ display: 'none' }}
                    />
                    <div style={{ 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '50%', 
                      border: `2px solid ${selectedCat === cat ? 'var(--primary)' : 'var(--border-soft)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}>
                      {selectedCat === cat && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
                    </div>
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Price Range</label>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>$0 - ${priceRange[1]}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                style={{
                  width: '100%',
                  accentColor: 'var(--primary)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Availability */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'block' }}>Availability</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                  In Stock
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                  On Sale
                </label>
              </div>
            </div>
          </aside>

          {/* ─── Main Content ─── */}
          <main>
            {/* Toolbar */}
            <div className="products-toolbar">
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{sortedProducts.length}</strong> products
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Sort by:</span>
                  <div style={{ position: 'relative' }}>
                    <div 
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '14px', 
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        background: showSortDropdown ? 'var(--bg-main)' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {sortBy} <ChevronDown size={14} style={{ transform: showSortDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                    </div>

                    <AnimatePresence>
                      {showSortDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            right: 0,
                            background: 'var(--bg-surface)',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-lg)',
                            border: '1px solid var(--border-soft)',
                            padding: '8px',
                            zIndex: 100,
                            minWidth: '180px'
                          }}
                        >
                          {['Newest', 'Price: Low to High', 'Price: High to Low', 'Rating'].map(option => (
                            <div
                              key={option}
                              onClick={() => {
                                setSortBy(option);
                                setShowSortDropdown(false);
                              }}
                              style={{
                                padding: '10px 12px',
                                fontSize: '14px',
                                fontWeight: sortBy === option ? 700 : 500,
                                color: sortBy === option ? 'var(--primary)' : 'var(--text-primary)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                background: sortBy === option ? 'var(--primary-light)' : 'transparent'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = sortBy === option ? 'var(--primary-light)' : 'var(--bg-main)'}
                              onMouseOut={(e) => e.currentTarget.style.background = sortBy === option ? 'var(--primary-light)' : 'transparent'}
                            >
                              {option}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div style={{ width: '1px', height: '20px', background: 'var(--border-soft)' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setViewMode('grid')}
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      border: `1px solid ${viewMode === 'grid' ? 'var(--primary)' : 'var(--border-soft)'}`, 
                      background: viewMode === 'grid' ? 'var(--primary-light)' : 'transparent', 
                      color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Grid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      border: `1px solid ${viewMode === 'list' ? 'var(--primary)' : 'var(--border-soft)'}`, 
                      background: viewMode === 'list' ? 'var(--primary-light)' : 'transparent', 
                      color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid/List Content */}
            {loading ? (
              <SkeletonGrid count={9} viewMode={viewMode} />
            ) : sortedProducts.length > 0 ? (
              <>
                <div 
                  className={viewMode === 'grid' ? "grid-3" : "list-view"} 
                style={{ 
                  display: viewMode === 'grid' ? 'grid' : 'flex',
                  flexDirection: viewMode === 'grid' ? 'unset' : 'column',
                  gap: '24px' 
                }}
              >
                <AnimatePresence mode="popLayout">
                  {sortedProducts.map((prod) => (
                    <motion.div
                      layout
                      key={prod.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="product-card"
                      style={{ 
                        padding: '16px',
                        display: viewMode === 'list' ? 'flex' : 'block',
                        gap: viewMode === 'list' ? '24px' : '0',
                        alignItems: viewMode === 'list' ? 'center' : 'unset'
                      }}
                    >
                      <div 
                        onClick={() => { setSelectedProduct(prod); setQuickViewQty(1); }}
                        style={{ 
                        position: 'relative', 
                        height: viewMode === 'grid' ? '200px' : '120px', 
                        width: viewMode === 'grid' ? '100%' : '180px',
                        borderRadius: '16px', 
                        overflow: 'hidden', 
                        marginBottom: viewMode === 'grid' ? '16px' : '0',
                        flexShrink: 0,
                        cursor: 'pointer'
                      }}>
                        <img src={prod.img} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} onMouseEnter={e => e.target.style.transform='scale(1.05)'} onMouseLeave={e => e.target.style.transform='scale(1)'} />
                        {prod.stock <= 0 ? (
                          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5 }}>
                            <span style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', boxShadow: '0 4px 12px rgba(239,68,68,0.2)' }}>
                              🚨 Sold Out
                            </span>
                          </div>
                        ) : prod.hasDiscount ? (
                          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5 }}>
                            <span style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, background: 'var(--secondary)', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                              🔥 {prod.discountPercentage}% OFF
                            </span>
                          </div>
                        ) : prod.badge ? (
                          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5 }}>
                            <span className="badge badge-primary">{prod.badge}</span>
                          </div>
                        ) : null}
                        <button 
                          className="wishlist-btn" 
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(prod); }}
                          style={{ 
                            position: 'absolute', top: '12px', right: '12px', 
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'white', border: 'none', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            cursor: 'pointer', transition: 'all 0.2s ease', zIndex: 5
                          }}
                          title={inWishlist(prod.id) ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart size={18} fill={inWishlist(prod.id) ? "#ef4444" : "none"} color={inWishlist(prod.id) ? "#ef4444" : "#333333"} />
                        </button>
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{prod.cat}</div>
                        <h3 
                          onClick={() => { setSelectedProduct(prod); setQuickViewQty(1); }}
                          style={{ fontSize: viewMode === 'grid' ? '18px' : '22px', fontWeight: 800, marginBottom: '8px', cursor: 'pointer', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                          onMouseLeave={e => e.target.style.color = 'var(--text-primary)'}
                        >
                          {prod.name}
                        </h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: viewMode === 'grid' ? '16px' : '8px' }}>
                          <Star size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />
                          <span style={{ fontSize: '14px', fontWeight: 700 }}>{prod.rating}</span>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>({prod.reviews})</span>
                        </div>

                        {viewMode === 'list' && (
                          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px', maxWidth: '500px' }}>
                            Premium quality {prod.name.toLowerCase()} sourced directly from our sustainable farms. Freshness guaranteed for your family's health.
                          </p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {prod.hasDiscount ? (
                              <>
                                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>${prod.discountedPrice.toFixed(2)}</span>
                                <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${prod.price.toFixed(2)}</span>
                              </>
                            ) : (
                              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>${prod.price.toFixed(2)}</span>
                            )}
                          </div>
                          <button 
                            className="btn-primary" 
                            disabled={prod.stock <= 0}
                            onClick={() => addToCart(prod)}
                            style={{ 
                              width: viewMode === 'grid' ? '40px' : 'auto', 
                              height: '40px', 
                              padding: viewMode === 'grid' ? 0 : '0 20px', 
                              borderRadius: '12px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              gap: '10px',
                              background: prod.stock <= 0 ? '#cbd5e1' : 'var(--primary)',
                              cursor: prod.stock <= 0 ? 'not-allowed' : 'pointer'
                            }}
                            title={prod.stock <= 0 ? "Sold Out" : "Add to Cart"}
                          >
                            <ShoppingBag size={18} />
                            {viewMode === 'list' && (prod.stock <= 0 ? "Sold Out" : "Add to Cart")}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '48px', marginBottom: '24px' }}>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    className="btn-outline"
                    style={{
                      padding: '10px 18px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      opacity: page === 1 ? 0.5 : 1
                    }}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    const isCurrent = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={isCurrent ? "btn-primary" : "btn-outline"}
                        style={{
                          width: '40px',
                          height: '40px',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: isCurrent ? 'var(--shadow-xs)' : 'none',
                          background: isCurrent ? 'var(--primary)' : 'transparent',
                          color: isCurrent ? 'white' : 'var(--text-primary)',
                          border: isCurrent ? 'none' : '1px solid var(--border-soft)'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    className="btn-outline"
                    style={{
                      padding: '10px 18px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: page === totalPages ? 'not-allowed' : 'pointer',
                      opacity: page === totalPages ? 0.5 : 1
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛒</div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>No products found</h2>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search query.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View / Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: 'var(--bg-surface)',
                borderRadius: '32px',
                overflow: 'hidden',
                maxWidth: '860px',
                width: '100%',
                height: '85vh',
                maxHeight: '750px',
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-2xl)',
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '1.1fr 1.3fr'
              }}
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-main)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 10 }}
              >
                <X size={18} />
              </button>

              {/* Modal Image */}
              <div style={{ position: 'relative', background: '#000', overflow: 'hidden', height: '100%' }}>
                <img src={selectedProduct.img} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
                  <span className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>{selectedProduct.cat}</span>
                </div>
              </div>

              {/* Modal Info */}
              <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
                {/* Scrollable details and reviews */}
                <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-gold)' }}>
                    <Star size={16} fill={reviews.length > 0 ? "var(--accent-gold)" : "none"} color={reviews.length > 0 ? "var(--accent-gold)" : "var(--text-muted)"} />
                    <span style={{ fontWeight: 800, fontSize: '15px', color: reviews.length > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'No rating yet'}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      ({reviews.length} customer review{reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>

                  <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>
                    {selectedProduct.name}
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
                    {selectedProduct.hasDiscount ? (
                      <>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>${selectedProduct.discountedPrice.toFixed(2)}</span>
                        <span style={{ fontSize: '16px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${selectedProduct.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>${selectedProduct.price.toFixed(2)}</span>
                    )}
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--border-soft)' }}>
                    {selectedProduct.description || `Premium quality ${selectedProduct.name.toLowerCase()} sourced from sustainable farms. Freshness guaranteed.`}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><ShieldCheck size={18} color="var(--primary)" /> 100% Certified Organic & Non-GMO Verified</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Truck size={18} color="var(--primary)" /> Same-Day Farm Delivery Available</div>
                    
                    {/* Inventory Status Indicator */}
                    <div style={{ marginTop: '8px', padding: '12px 16px', borderRadius: '14px', background: selectedProduct.stock <= 0 ? '#fee2e2' : '#f0fdf4', border: `1px solid ${selectedProduct.stock <= 0 ? '#fca5a5' : '#bbf7d0'}`, display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, color: selectedProduct.stock <= 0 ? '#ef4444' : '#16a34a' }}>
                      <span style={{ fontSize: '18px' }}>{selectedProduct.stock <= 0 ? '🚨' : '📦'}</span>
                      {selectedProduct.stock <= 0 ? (
                        <span>Sold Out</span>
                      ) : (
                        <span>In Stock — Available for immediate dispatch.</span>
                      )}
                    </div>
                  </div>

                  {/* Reviews & Ratings Section */}
                  <div style={{ borderTop: '1px solid var(--border-soft)', marginTop: '28px', paddingTop: '24px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                      Customer Reviews ({reviews.length})
                    </h3>

                    {/* Review List */}
                    {loadingReviews ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', margin: '16px 0' }}>
                        <Loader2 className="pulse-anim" size={16} color="var(--primary)" /> Loading reviews...
                      </div>
                    ) : reviews.length === 0 ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic', marginBottom: '20px' }}>
                        No reviews yet. Be the first to share your thoughts on this product!
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '250px', overflowY: 'auto', paddingRight: '6px' }}>
                        {reviews.map((rev) => (
                          <div key={rev._id} style={{ background: 'var(--bg-main)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-soft)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                              <div>
                                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{rev.user?.name || 'Anonymous User'}</span>
                                <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      size={12} 
                                      fill={i < rev.rating ? 'var(--accent-gold)' : 'none'} 
                                      color={i < rev.rating ? 'var(--accent-gold)' : 'var(--border-soft)'} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                              {rev.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Write Review Form */}
                    <div style={{ borderTop: '1px dashed var(--border-soft)', paddingTop: '20px', marginTop: '20px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        Write a Review
                      </h4>
                      {user ? (
                        <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Your Rating:</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => setNewRating(val)}
                                  style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer' }}
                                >
                                  <Star 
                                    size={18} 
                                    fill={val <= newRating ? 'var(--accent-gold)' : 'none'} 
                                    color={val <= newRating ? 'var(--accent-gold)' : 'var(--border-soft)'} 
                                    style={{ transition: 'all 0.15s ease' }}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <textarea
                              rows={3}
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Share your thoughts about this product's quality, freshness, and packaging..."
                              style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '1px solid var(--border-soft)',
                                background: 'var(--bg-main)',
                                color: 'var(--text-primary)',
                                fontSize: '13px',
                                outline: 'none',
                                resize: 'none'
                              }}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmittingReview}
                            className="btn-primary"
                            style={{
                              padding: '10px 20px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: 700,
                              alignSelf: 'flex-start',
                              cursor: 'pointer'
                            }}
                          >
                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                          </button>
                        </form>
                      ) : (
                        <div style={{
                          padding: '16px',
                          borderRadius: '14px',
                          background: 'var(--bg-main)',
                          border: '1px solid var(--border-soft)',
                          textAlign: 'center',
                          fontSize: '13px',
                          color: 'var(--text-muted)'
                        }}>
                          Please <a href="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>log in</a> to write a review.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fixed Action Bar at Bottom */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-soft)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: selectedProduct.stock <= 0 ? '#f1f5f9' : 'var(--bg-main)', border: '1px solid var(--border-soft)', padding: '8px 14px', borderRadius: '12px', opacity: selectedProduct.stock <= 0 ? 0.5 : 1 }}>
                    <button disabled={selectedProduct.stock <= 0} onClick={() => setQuickViewQty(Math.max(1, quickViewQty - 1))} style={{ background: 'none', border: 'none', cursor: selectedProduct.stock <= 0 ? 'not-allowed' : 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                      <Minus size={16} />
                    </button>
                    <span style={{ fontSize: '15px', fontWeight: 800, minWidth: '24px', textAlign: 'center', color: 'var(--text-primary)' }}>{quickViewQty}</span>
                    <button disabled={selectedProduct.stock <= 0} onClick={() => {
                      if (selectedProduct.stock !== undefined && quickViewQty >= selectedProduct.stock) {
                        toast.error(`⚠️ Maximum available stock reached (${selectedProduct.stock} units)`);
                      } else {
                        setQuickViewQty(quickViewQty + 1);
                      }
                    }} style={{ background: 'none', border: 'none', cursor: selectedProduct.stock <= 0 ? 'not-allowed' : 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                      <Plus size={16} />
                    </button>
                  </div>

                  <button 
                    disabled={selectedProduct.stock <= 0}
                    onClick={() => {
                      if (selectedProduct.stock <= 0) return;
                      const success = addToCart(selectedProduct, quickViewQty);
                      if (success !== false) {
                        setSelectedProduct(null);
                      }
                    }}
                    className="btn-primary"
                    style={{ 
                      flex: 1, 
                      padding: '12px 20px', 
                      borderRadius: '12px', 
                      fontSize: '14px', 
                      fontWeight: 700, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px',
                      background: selectedProduct.stock <= 0 ? '#cbd5e1' : 'var(--primary)',
                      cursor: selectedProduct.stock <= 0 ? 'not-allowed' : 'pointer',
                      boxShadow: selectedProduct.stock <= 0 ? 'none' : '0 6px 18px rgba(22, 163, 74, 0.2)'
                    }}
                  >
                    <ShoppingBag size={18} /> {selectedProduct.stock <= 0 ? "Sold Out" : `Add to Basket ($${((selectedProduct.hasDiscount ? selectedProduct.discountedPrice : selectedProduct.price) * quickViewQty).toFixed(2)})`}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
