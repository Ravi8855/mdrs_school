import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onNavigate }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navStyle = {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        borderBottom: '3px solid #000',
        boxShadow: scrolled ? '0 10px 20px rgba(0,0,0,0.1)' : 'none',
        flexWrap: 'wrap',
        width: '100%'
    };

    const linkStyle = {
        margin: '0 10px',
        textDecoration: 'none',
        color: '#000',
        fontWeight: '700',
        fontFamily: "'Poppins', sans-serif",
        fontSize: '1rem',
        cursor: 'pointer',
        position: 'relative',
        transition: 'color 0.2s',
        whiteSpace: 'nowrap'
    };

    const handleNavClick = (page) => {
        onNavigate(page);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <style>
                {`
                @media (max-width: 768px) {
                    .nav-links {
                        display: ${mobileMenuOpen ? 'flex' : 'none'} !important;
                        flex-direction: column;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(10px);
                        padding: 20px;
                        border-bottom: 3px solid #000;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        max-height: 70vh;
                        overflow-y: auto;
                    }
                    
                    .nav-links .nav-item {
                        margin: 10px 0 !important;
                        font-size: 1.1rem !important;
                        padding: 15px;
                        text-align: center;
                        border-bottom: 1px solid rgba(0,0,0,0.1);
                    }
                    
                    .mobile-menu-btn {
                        display: block !important;
                        background: none;
                        border: none;
                        font-size: 1.8rem;
                        cursor: pointer;
                        padding: 5px;
                        z-index: 1001;
                    }
                    
                    .school-name {
                        font-size: 1.2rem !important;
                    }
                    
                    /* Prevent scrolling when menu is open */
                    ${mobileMenuOpen ? 'body { overflow: hidden; }' : ''}
                }
                
                @media (min-width: 769px) {
                    .mobile-menu-btn {
                        display: none !important;
                    }
                    
                    .nav-links {
                        display: flex !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .school-name {
                        font-size: 1.1rem !important;
                        letter-spacing: 1px !important;
                    }
                    
                    .nav-links .nav-item {
                        font-size: 1rem !important;
                        padding: 12px;
                    }
                    
                    .mobile-menu-btn {
                        font-size: 1.5rem;
                    }
                }
                
                @media (max-width: 360px) {
                    .school-name {
                        font-size: 1rem !important;
                    }
                    
                    .nav-links .nav-item {
                        font-size: 0.9rem !important;
                        padding: 10px;
                    }
                }
                `}
            </style>
            <nav style={navStyle}>
                <div
                    className="school-name"
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: '900',
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif",
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    onClick={() => handleNavClick('home')}
                >
                    WELCOME TO MDRS<span style={{ color: '#FFD700' }}></span>
                </div>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ display: 'none' }}
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>

                <div className="nav-links" style={{ display: 'flex' }}>
                    <span style={linkStyle} className="nav-item" onClick={() => handleNavClick('home')}>Home 🏠</span>
                    <span style={{ ...linkStyle, color: '#6C5CE7' }} className="nav-item" onClick={() => handleNavClick('classmates')}>Classmates 🎓</span>
                    <span style={{ ...linkStyle, color: '#00cec9' }} className="nav-item" onClick={() => handleNavClick('teachers')}>Teachers 🍎</span>
                    <span style={{ ...linkStyle, color: '#fd79a8' }} className="nav-item" onClick={() => handleNavClick('workers')}>Workers 🛠️</span>
                    <span style={{ ...linkStyle, color: '#FF4757' }} className="nav-item" onClick={() => handleNavClick('bff')}>BFFs ❤️</span>
                    <span style={{ ...linkStyle, color: '#e17055' }} className="nav-item" onClick={() => handleNavClick('gallery')}>Gallery 📸</span>
                    <span style={{ ...linkStyle, color: '#a29bfe' }} className="nav-item" onClick={() => handleNavClick('spin-wheel')}>Spin Wheel 🌀</span>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
