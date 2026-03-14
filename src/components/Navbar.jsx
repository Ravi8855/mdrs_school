import React, { useState, useEffect } from 'react';

const Navbar = ({ onNavigate, onLogout }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const handleNavClick = (page) => {
        onNavigate(page);
        setMobileMenuOpen(false);
    };

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'classmates', label: 'Classmates' },
        { id: 'teachers', label: 'Teachers' },
        { id: 'alumni', label: 'Alumni' },
        { id: 'gallery', label: 'Gallery' },
        { id: 'bell-game', label: 'Bell Game' },
    ];

    return (
        <>
            <style>{`
                .mdrs-nav {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    width: 100%;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 2px solid rgba(251, 191, 36, 0.35);
                    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
                    transition: box-shadow 0.25s ease, border-color 0.25s ease;
                }
                .mdrs-nav.scrolled {
                    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
                    border-bottom-color: rgba(251, 191, 36, 0.5);
                }
                .mdrs-nav-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .mdrs-nav-brand {
                    font-family: 'Poppins', sans-serif;
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: #fbbf24;
                    letter-spacing: 0.02em;
                    cursor: pointer;
                    flex-shrink: 0;
                    transition: color 0.2s ease, text-shadow 0.2s ease;
                }
                .mdrs-nav-brand:hover {
                    color: #fcd34d;
                    text-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
                }
                .mdrs-nav-links {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 4px;
                    flex-wrap: wrap;
                }
                .mdrs-nav-item {
                    padding: 8px 14px;
                    font-family: 'Poppins', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: rgba(248, 250, 252, 0.9);
                    cursor: pointer;
                    border-radius: 8px;
                    transition: color 0.2s, background 0.2s;
                    white-space: nowrap;
                    background: transparent;
                    border: none;
                }
                .mdrs-nav-item:hover {
                    background: rgba(251, 191, 36, 0.15);
                    color: #fbbf24;
                }
                .mdrs-nav-item:focus-visible {
                    outline: 2px solid #fbbf24;
                    outline-offset: 2px;
                }
                .mdrs-nav-hamburger {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    padding: 0;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    color: #f8fafc;
                    font-size: 1.5rem;
                    border-radius: 8px;
                    flex-shrink: 0;
                    transition: background 0.2s, color 0.2s;
                }
                .mdrs-nav-hamburger:hover {
                    background: rgba(251, 191, 36, 0.2);
                    color: #fbbf24;
                }
                .mdrs-nav-spacer { flex: 1; min-width: 0; }

                /* Mobile menu overlay */
                .mdrs-nav-dropdown {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
                    border-bottom: 2px solid rgba(251, 191, 36, 0.35);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.35);
                    padding: 12px 16px 20px;
                    max-height: calc(100vh - 70px);
                    overflow-y: auto;
                    z-index: 999;
                }
                .mdrs-nav-dropdown.open {
                    display: block;
                }
                .mdrs-nav-dropdown .mdrs-nav-item {
                    display: block;
                    width: 100%;
                    padding: 14px 16px;
                    text-align: left;
                    font-size: 1rem;
                    border-radius: 10px;
                    margin-bottom: 4px;
                    color: rgba(248, 250, 252, 0.95);
                }
                .mdrs-nav-dropdown .mdrs-nav-item:hover {
                    background: rgba(251, 191, 36, 0.15);
                    color: #fbbf24;
                }
                .mdrs-nav-logout {
                    margin-left: 8px;
                    padding: 8px 14px;
                    background: transparent;
                    border: 1px solid rgba(248, 250, 252, 0.5);
                    color: rgba(248, 250, 252, 0.9);
                }
                .mdrs-nav-logout:hover {
                    background: rgba(220, 53, 69, 0.2);
                    border-color: rgba(220, 53, 69, 0.5);
                    color: #f87171;
                }

                @media (max-width: 1024px) {
                    .mdrs-nav-inner { padding: 12px 16px; }
                    .mdrs-nav-links { gap: 4px; }
                    .mdrs-nav-item { padding: 6px 10px; font-size: 0.85rem; }
                }

                @media (max-width: 768px) {
                    .mdrs-nav-inner { padding: 10px 16px; }
                    .mdrs-nav-links { display: none; }
                    .mdrs-nav-hamburger { display: flex; }
                }

                @media (max-width: 480px) {
                    .mdrs-nav-inner { padding: 10px 12px; }
                }

            `}</style>
            <nav className={`mdrs-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="mdrs-nav-inner">
                    <div
                        className="mdrs-nav-brand"
                        onClick={() => handleNavClick('home')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavClick('home'); }}
                    >
                        MDRS School
                    </div>
                    <span className="mdrs-nav-spacer" aria-hidden="true" />
                    <button
                        type="button"
                        className="mdrs-nav-hamburger"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>

                    <div className="mdrs-nav-links">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className="mdrs-nav-item"
                                onClick={() => handleNavClick(item.id)}
                            >
                                {item.label}
                            </button>
                        ))}
                        {onLogout && (
                            <button
                                type="button"
                                className="mdrs-nav-item mdrs-nav-logout"
                                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>

                <div className={`mdrs-nav-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className="mdrs-nav-item"
                            onClick={() => handleNavClick(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                    {onLogout && (
                        <button
                            type="button"
                            className="mdrs-nav-item mdrs-nav-logout"
                            onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
