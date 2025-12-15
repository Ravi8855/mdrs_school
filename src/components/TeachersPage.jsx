import React from 'react';

const TeachersPage = () => {
    const teachers = [
        "Ashwini mam",
        "Basavaraja sir",
        "Bhagamma mam",
        "Chandru sir",
        "Madivalappa sir",
        "Rajakumar sir",
        "Ramesh sir",
        "Renuka mam",
        "Shantlingappa sir",
        "Subhas sir",
        "Somangowda sir",
        "Mallappa malikeri sir",
        "Shilpa mam",
        "Yamuna mam",
        "Revan siddappa sir",
        "mamtha mam",
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Vibrant Purple-Blue Gradient
            fontFamily: "'Poppins', sans-serif",
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Font Imports */}
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&family=Poppins:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');`}
            </style>

            {/* Floating Background Orbs */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw',
                background: 'purple', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.4, animation: 'floatOrb 10s infinite alternate'
            }}></div>
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: '30vw', height: '30vw',
                background: '#4facfe', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4, animation: 'floatOrb 8s infinite alternate-reverse'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1, padding: '40px 20px 80px' }}>

                {/* Hero Section */}
                <header style={{ textAlign: 'center', marginBottom: '60px', marginTop: '40px' }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '4rem',
                        fontWeight: '700',
                        marginBottom: '10px',
                        textShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        letterSpacing: '2px'
                    }}>
                        Our Mentors
                    </h1>
                    <div style={{
                        width: '100px', height: '4px', background: '#fff', margin: '10px auto', borderRadius: '2px', opacity: 0.8
                    }}></div>
                    <p style={{
                        fontSize: '1.2rem', fontWeight: '300', opacity: 0.9, letterSpacing: '1px'
                    }}>
                        "Guiding lights of our chaotic lives"
                    </p>
                </header>

                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                    {/* Principal Card - Glassmorphism Highlighted */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(16px)',
                        borderRadius: '30px',
                        border: '2px solid rgba(255, 215, 0, 0.5)', // Gold border
                        padding: '60px', // More padding
                        textAlign: 'center',
                        marginBottom: '80px',
                        boxShadow: '0 0 40px rgba(255, 215, 0, 0.2)', // Golden Glow
                        transform: 'translateY(0)',
                        transition: 'transform 0.3s',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        {/* Shimmer effect overlay */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '5px',
                            background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
                            animation: 'shimmerBorder 2s infinite'
                        }}></div>

                        <span style={{
                            background: 'linear-gradient(45deg, #FFD700, #FDB931)', // Gold Gradient Badge
                            padding: '10px 30px', borderRadius: '50px',
                            fontSize: '1rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase',
                            color: '#1a1a2e', boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        }}>
                            Principal
                        </span>

                        <h2 style={{
                            fontSize: '4rem', fontFamily: "'Playfair Display', serif", margin: '30px 0 15px',
                            background: 'linear-gradient(to right, #fff, #FFD700)', // White to Gold Text
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        }}>
                            Eranna Arkera Sir
                        </h2>

                        <p style={{
                            fontSize: '1.4rem',
                            fontStyle: 'italic',
                            color: 'rgba(255, 255, 255, 0.95)',
                            maxWidth: '700px',
                            margin: '0 auto',
                            lineHeight: '1.6',
                            borderTop: '1px solid rgba(255,255,255,0.3)',
                            paddingTop: '20px'
                        }}>
                            “Leading with wisdom and guiding us towards excellence.”
                        </p>
                    </div>

                    {/* Teachers Grid */}
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h3 style={{
                            fontSize: '2.5rem',
                            marginBottom: '40px',
                            fontWeight: '800',
                            fontFamily: "'Playfair Display', serif",
                            color: '#FFD700', // Fallback
                            background: 'linear-gradient(to right, #FFF700, #FFD700)', // Bright Yellow to Gold
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))', // Strong Yellow Glow
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            borderBottom: '2px solid rgba(255, 215, 0, 0.5)',
                            display: 'inline-block',
                            paddingBottom: '10px'
                        }}>
                            Teaching Faculty
                        </h3>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '25px'
                    }}>
                        {teachers.map((name, index) => (
                            <div key={index} style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                padding: '25px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginRight: '15px', fontSize: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}>
                                    🎓
                                </div>
                                <div style={{
                                    fontSize: '1.4rem',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px',
                                    fontFamily: "'Montserrat', sans-serif",
                                    color: '#fff',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    {name}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Quote */}
                    <div style={{
                        marginTop: '80px',
                        textAlign: 'center',
                        padding: '50px 30px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '30px',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                    }}>
                        <p style={{
                            fontSize: '2rem',
                            fontFamily: "'Poppins', sans-serif",
                            fontStyle: 'normal',
                            marginBottom: '20px',
                            fontWeight: '700',
                            color: '#000',
                            lineHeight: '1.6',
                            letterSpacing: '0.5px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            "You saw potential in us when we saw nothing."
                        </p>
                        <div style={{
                            fontSize: '3rem',
                            animation: 'pulse 2s infinite',
                            filter: 'drop-shadow(0 5px 15px rgba(255,0,0,0.5))'
                        }}>❤️</div>
                    </div>

                </div>
            </div>

            <style>{`
                @keyframes floatOrb {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes shimmerBorder {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes gradientShift {
                    0% { background-position: 0% center; }
                    50% { background-position: 100% center; }
                    100% { background-position: 0% center; }
                }
            `}</style>
        </div>
    )
};

export default TeachersPage;
