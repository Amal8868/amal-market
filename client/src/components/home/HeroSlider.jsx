import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
    {
        title: "Farm Fresh",
        subtitle: "Delivered Daily",
        description: "Premium organic groceries handpicked from local farms and delivered to your door within hours.",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
        accent: "🌿 New Season Collection",
        gradient: "linear-gradient(135deg, rgba(13, 59, 30, 0.85) 0%, rgba(31, 128, 68, 0.6) 50%, rgba(13, 59, 30, 0.75) 100%)",
    },
    {
        title: "Pure Organic",
        subtitle: "Harvest",
        description: "Bio-verified vegetables ensuring the highest quality and nutritional value for your family.",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop",
        accent: "✨ Best Sellers",
        gradient: "linear-gradient(135deg, rgba(20, 50, 20, 0.85) 0%, rgba(39, 100, 50, 0.6) 50%, rgba(15, 40, 25, 0.8) 100%)",
    },
    {
        title: "Fresh Baked",
        subtitle: "Every Morning",
        description: "Handcrafted artisanal breads and pastries baked fresh using traditional methods since 1987.",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop",
        accent: "🥖 Artisan Bakery",
        gradient: "linear-gradient(135deg, rgba(40, 25, 10, 0.85) 0%, rgba(80, 50, 20, 0.6) 50%, rgba(30, 20, 10, 0.8) 100%)",
    }
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const slideVariants = {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
    };

    return (
        <section 
            id="hero-section" 
            className="hero-slider"
            style={{ 
                position: 'relative', 
                width: '100%', 
                height: '100vh', 
                minHeight: '700px', 
                maxHeight: '950px', 
                overflow: 'hidden',
                background: '#0d3b1e' // Match the dark emerald theme to prevent white flash
            }}
        >
            {/* Background Image + Overlay — Using crossfade instead of wait mode */}
            <AnimatePresence custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `${slides[current].gradient}, url(${slides[current].image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </AnimatePresence>

            {/* Content */}
            <div className="hero-content" style={{
                position: 'relative',
                zIndex: 10,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 40px',
                paddingTop: '80px',
            }}>

                {/* Title */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`title-${current}`}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <h1 style={{
                            fontSize: 'clamp(48px, 7vw, 88px)',
                            fontWeight: 800,
                            color: 'white',
                            lineHeight: 1.05,
                            marginBottom: '24px',
                            letterSpacing: '-2px',
                            textShadow: '0 4px 30px rgba(0,0,0,0.2)',
                        }}>
                            {slides[current].title} <br />
                            <span style={{ opacity: 0.65, fontStyle: 'italic' }}>
                                {slides[current].subtitle}
                            </span>
                        </h1>
                    </motion.div>
                </AnimatePresence>

                {/* Description */}
                <AnimatePresence mode="wait">
                    <motion.p
                        key={`desc-${current}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        style={{
                            maxWidth: '580px',
                            fontSize: 'clamp(16px, 1.3vw, 20px)',
                            lineHeight: 1.7,
                            color: 'rgba(255,255,255,0.8)',
                            marginBottom: '48px',
                            fontWeight: 400,
                        }}
                    >
                        {slides[current].description}
                    </motion.p>
                </AnimatePresence>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                    style={{ display: 'flex', gap: '16px', marginBottom: '60px', flexWrap: 'wrap', justifyContent: 'center' }}
                >
                    <Link
                        to="/products"
                        className="btn-secondary"
                        style={{
                            padding: '18px 44px',
                            fontSize: '16px',
                            fontWeight: 700,
                            borderRadius: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            textDecoration: 'none'
                        }}
                    >
                        Shop Now <ArrowRight size={18} />
                    </Link>
                    <Link
                        to="/categories"
                        className="btn-outline"
                        style={{
                            padding: '18px 44px',
                            fontSize: '16px',
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.3)',
                            borderRadius: '50px',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.1)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                        }}
                    >
                        Explore Categories
                    </Link>
                </motion.div>

            </div>

            {/* Slide Controls */}
            <div className="hero-controls" style={{
                position: 'absolute',
                bottom: '40px',
                right: '60px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                zIndex: 20,
            }}>
                {/* Navigation Arrows */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={prevSlide}
                        aria-label="Previous slide"
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        aria-label="Next slide"
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Slide Counter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: 'white', fontFamily: "'Playfair Display', serif" }}>
                        {String(current + 1).padStart(2, '0')}
                    </span>
                    <div style={{
                        width: '40px',
                        height: '1px',
                        background: 'rgba(255,255,255,0.3)',
                    }} />
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                        {String(slides.length).padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Progress Dots — bottom left */}
            <div className="hero-dots" style={{
                position: 'absolute',
                bottom: '50px',
                left: '60px',
                display: 'flex',
                gap: '6px',
                zIndex: 20,
            }}>
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setDirection(i > current ? 1 : -1);
                            setCurrent(i);
                        }}
                        aria-label={`Go to slide ${i + 1}`}
                        style={{
                            height: '4px',
                            cursor: 'pointer',
                            borderRadius: '10px',
                            border: 'none',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            width: current === i ? '48px' : '14px',
                            background: current === i ? 'white' : 'rgba(255,255,255,0.25)',
                        }}
                    />
                ))}
            </div>

        </section>
    );
};

export default HeroSlider;
