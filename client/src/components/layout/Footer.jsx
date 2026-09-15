import React from 'react';
import { ShoppingBag, ArrowRight, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerColumns = [
        {
            title: 'Shop',
            items: [
                { name: 'All Products', path: '/products' },
                { name: 'Fresh Fruits', path: '/products?category=Fresh%20Fruits' },
                { name: 'Vegetables', path: '/products?category=Vegetables' },
                { name: 'Bakery Goods', path: '/products?category=Bakery' },
                { name: 'Daily Deals', path: '/deals' }
            ]
        },
        {
            title: 'Company',
            items: [
                { name: 'About Amal', path: '/about' },
                { name: 'Our Partner Farms', path: '/about' },
                { name: 'Sustainability', path: '/about' },
                { name: 'Careers', path: '/about' },
                { name: 'Press Releases', path: '/about' }
            ]
        },
        {
            title: 'Support',
            items: [
                { name: 'Help & FAQ', path: '/about' },
                { name: 'Delivery Information', path: '/about' },
                { name: 'Return Policy', path: '/about' },
                { name: 'Contact Support', path: '/about' },
                { name: 'Store Locations', path: '/about' }
            ]
        }
    ];

    const bottomLinks = [
        { name: 'Privacy Policy', path: '/about' },
        { name: 'Terms of Service', path: '/about' },
        { name: 'Cookie Policy', path: '/about' }
    ];

    return (
        <footer style={{
            background: 'var(--primary-900)',
            padding: '80px 0 0',
            color: 'white',
        }}>
            <div className="container">
                {/* Main Grid */}
                <div className="footer-grid" style={{
                    paddingBottom: '60px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                    {/* Brand */}
                    <div>
                        <Link to="/" onClick={handleScrollTop} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', textDecoration: 'none' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, var(--primary), #1a6b38)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <ShoppingBag size={20} color="white" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{
                                    fontSize: '22px',
                                    fontWeight: 800,
                                    color: 'white',
                                    letterSpacing: '-0.5px',
                                    fontFamily: "'Playfair Display', serif",
                                    lineHeight: 1.1,
                                }}>
                                    Amal
                                </span>
                                <span style={{
                                    fontSize: '8px',
                                    fontWeight: 700,
                                    color: 'rgba(255,255,255,0.4)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '3px',
                                }}>
                                    Market
                                </span>
                            </div>
                        </Link>
                        <p style={{
                            color: 'rgba(255,255,255,0.45)',
                            fontSize: '14px',
                            lineHeight: 1.8,
                            marginBottom: '28px',
                            maxWidth: '300px',
                        }}>
                            Your daily source for fresh organic produce. We connect local farms to your kitchen with care and quality.
                        </p>

                        {/* Contact Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { icon: MapPin, text: '123 Market Street, Downtown' },
                                { icon: Phone, text: '+1 (555) 234-5678' },
                                { icon: Mail, text: 'hello@amalmarket.com' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <item.icon size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {footerColumns.map(col => (
                        <div key={col.title}>
                            <h5 style={{
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: 700,
                                marginBottom: '24px',
                                letterSpacing: '0.5px',
                            }}>
                                {col.title}
                            </h5>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', padding: 0, margin: 0 }}>
                                {col.items.map(item => (
                                    <li key={item.name}>
                                        <Link
                                            to={item.path}
                                            onClick={handleScrollTop}
                                            style={{
                                                color: 'rgba(255,255,255,0.45)',
                                                fontSize: '14px',
                                                textDecoration: 'none',
                                                transition: 'color 0.3s',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}
                                            onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                                            onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.45)'}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '28px 0',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}>
                    <p style={{
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '13px',
                        fontWeight: 500,
                        margin: 0
                    }}>
                        © 2026 Amal Market. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        {bottomLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={handleScrollTop}
                                style={{
                                    color: 'rgba(255,255,255,0.3)',
                                    fontSize: '13px',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s',
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
                                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.3)'}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
