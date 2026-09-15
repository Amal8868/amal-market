import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, User, Heart, Sun, Moon, Menu, X, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/theme';
import { useCart } from '../../context/cart';
import { useAuth } from '../../context/auth';
import CartDrawer from '../cart/CartDrawer';
import WishlistDrawer from '../cart/WishlistDrawer';

const Navbar = () => {
    const { isDark, toggleTheme } = useTheme();
    const { cartCount, wishlist } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    // Navigation state is intentionally independent from the admin sidebar state.
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const accountRef = useRef(null);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 80);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountRef.current && !accountRef.current.contains(event.target)) {
                setAccountOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsNavigationOpen(false);
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Categories', path: '/categories' },
        { name: 'Deals', path: '/deals' },
        { name: 'About', path: '/about' },
    ];

    const textColor = scrolled ? 'var(--text-primary)' : '#ffffff';
    const mutedColor = scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.75)';
    const iconColor = scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)';

    return (
        <>
            <nav
            id="main-navbar"
            className={`main-navbar ${scrolled ? 'is-scrolled' : ''}`}
            style={{
                position: 'fixed',
                top: scrolled ? '10px' : '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '1340px',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: scrolled ? 'var(--bg-surface)' : 'rgba(0, 0, 0, 0.3)',
                backdropFilter: scrolled ? 'none' : 'blur(10px)',
                WebkitBackdropFilter: scrolled ? 'none' : 'blur(10px)',
                border: scrolled ? '1px solid var(--border-soft)' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: scrolled ? '16px' : '24px',
                padding: scrolled ? '12px 30px' : '16px 40px',
                height: scrolled ? '64px' : '76px',
                boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {/* Logo */}
            <Link to="/" onClick={() => setIsNavigationOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <div style={{
                    width: '38px',
                    height: '38px',
                    background: scrolled
                        ? 'linear-gradient(135deg, var(--primary), #1a6b38)'
                        : 'rgba(255,255,255,0.15)',
                    backdropFilter: scrolled ? 'none' : 'blur(10px)',
                    border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: scrolled ? '0 4px 12px rgba(31, 128, 68, 0.3)' : 'none',
                    transition: 'all 0.4s ease',
                }}>
                    <ShoppingBag size={20} color="white" strokeWidth={2.5} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: textColor,
                        letterSpacing: '-0.5px',
                        lineHeight: 1.1,
                        fontFamily: "'Playfair Display', serif",
                        transition: 'color 0.4s ease',
                        textShadow: scrolled ? 'none' : '0 2px 10px rgba(0,0,0,0.3)',
                    }}>
                        Amal
                    </span>
                    <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        color: scrolled ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        lineHeight: 1,
                        transition: 'color 0.4s ease',
                        textShadow: scrolled ? 'none' : '0 1px 5px rgba(0,0,0,0.3)',
                    }}>
                        Market
                    </span>
                </div>
            </Link>

            {/* Desktop Navigation */}
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="nav-desktop">
                {navLinks.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: mutedColor,
                            textDecoration: 'none',
                            transition: 'color 0.3s ease',
                            position: 'relative',
                            textShadow: scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.3)',
                        }}
                        onMouseEnter={(e) => e.target.style.color = scrolled ? 'var(--primary)' : '#ffffff'}
                        onMouseLeave={(e) => e.target.style.color = mutedColor}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* Theme Toggle */}
                <button
                    id="theme-toggle"
                    onClick={toggleTheme}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: scrolled
                            ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)')
                            : 'rgba(255,255,255,0.1)',
                        color: iconColor,
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                    aria-label="Toggle dark mode"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>



                {/* Divider */}
                <div style={{
                    width: '1px',
                    height: '24px',
                    background: scrolled ? 'var(--border-medium)' : 'rgba(255,255,255,0.2)',
                    margin: '0 6px',
                    transition: 'background 0.4s ease',
                }} />

                {/* Wishlist */}
                <button
                    id="wishlist-btn"
                    onClick={() => setWishlistOpen(true)}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: iconColor,
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'transparent',
                    }}
                    aria-label="Wishlist"
                >
                    <Heart size={19} />
                    {wishlist && wishlist.length > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            minWidth: '18px',
                            height: '18px',
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '9px',
                            fontWeight: 800,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                            border: '2px solid var(--bg-surface)'
                        }}>
                            {wishlist.length}
                        </span>
                    )}
                </button>

                {/* Cart */}
                <button
                    id="cart-btn"
                    onClick={() => setCartOpen(true)}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: iconColor,
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'transparent',
                    }}
                    aria-label="Shopping cart"
                >
                    <ShoppingBag size={19} />
                    {cartCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            minWidth: '18px',
                            height: '18px',
                            background: 'var(--primary)',
                            color: 'white',
                            fontSize: '9px',
                            fontWeight: 800,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                            border: '2px solid var(--bg-surface)'
                        }}>
                            {cartCount}
                        </span>
                    )}
                </button>

                {/* User Account */}
                <div ref={accountRef} style={{ position: 'relative' }}>
                    <button
                        id="account-btn"
                        onClick={() => {
                            if (user) {
                                setAccountOpen(!accountOpen);
                            } else {
                                navigate('/login');
                            }
                        }}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: scrolled ? 'var(--primary-light)' : 'rgba(255,255,255,0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: scrolled ? 'var(--primary)' : 'white',
                            transition: 'all 0.3s ease',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        aria-label="User account"
                    >
                        <User size={18} />
                    </button>

                    {/* Account Dropdown */}
                    {accountOpen && user && (
                        <div className="account-dropdown" style={{
                            position: 'absolute',
                            top: 'calc(100% + 12px)',
                            right: 0,
                            width: '240px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-soft)',
                            borderRadius: '20px',
                            padding: '16px',
                            boxShadow: 'var(--shadow-xl)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            zIndex: 1010
                        }}>
                            <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-soft)' }}>
                                <span style={{ display: 'block', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{user.name}</span>
                                <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</span>
                            </div>

                            <Link 
                                to="/profile" 
                                onClick={() => setAccountOpen(false)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px', 
                                    padding: '10px 12px', 
                                    borderRadius: '10px', 
                                    color: 'var(--text-primary)', 
                                    background: 'var(--bg-main)', 
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: '14px'
                                }}
                            >
                                <User size={16} /> My Profile & Orders
                            </Link>

                            {user.role === 'admin' && (
                                <Link 
                                    to="/admin" 
                                    onClick={() => setAccountOpen(false)}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '10px', 
                                        padding: '10px 12px', 
                                        borderRadius: '10px', 
                                        color: 'var(--accent-gold)', 
                                        background: 'rgba(245, 158, 11, 0.1)', 
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: '14px'
                                    }}
                                >
                                    <Shield size={16} /> Admin Dashboard
                                </Link>
                            )}

                            <button 
                                onClick={() => {
                                    logout();
                                    setAccountOpen(false);
                                    navigate('/');
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 12px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: 'var(--bg-surface-hover)',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    textAlign: 'left',
                                    width: '100%'
                                }}
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    id="mobile-menu-toggle"
                    onClick={() => setIsNavigationOpen((open) => !open)}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: textColor,
                        display: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'transparent',
                    }}
                    className="mobile-menu-btn"
                    aria-label={isNavigationOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={isNavigationOpen}
                    aria-controls="mobile-navigation"
                >
                    {isNavigationOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <div
                id="mobile-navigation"
                className={`mobile-navigation ${isNavigationOpen ? 'is-open' : ''}`}
                aria-hidden={!isNavigationOpen}
            >
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsNavigationOpen(false)}
                            style={{
                                padding: '14px 16px',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                transition: 'background 0.2s',
                                textDecoration: 'none',
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'var(--bg-surface-hover)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            {item.name}
                        </Link>
                    ))}
                    {!user ? (
                        <Link
                            to="/login"
                            onClick={() => setIsNavigationOpen(false)}
                            style={{
                                padding: '14px 16px',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: 700,
                                color: 'var(--primary)',
                                textDecoration: 'none',
                            }}
                        >
                            Log In
                        </Link>
                    ) : (
                        <button
                            onClick={() => {
                                logout();
                                setIsNavigationOpen(false);
                            }}
                            style={{
                                padding: '14px 16px',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: 700,
                                color: 'var(--error, #e53e3e)',
                                background: 'transparent',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer'
                            }}
                        >
                            Sign Out
                        </button>
                    )}
            </div>

            {/* Responsive styles */}
            <style>{`
                @media (max-width: 1024px) {
                    .nav-desktop { display: none !important; }
                    .mobile-menu-btn { display: flex !important; }
                }
            `}</style>
        </nav>
        
        {/* Drawers */}
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </>
    );
};

export default Navbar;
