import React, { useState, useEffect } from 'react';

const ClassmatesPage = () => {
    const initialClassmates = [
        "Ambadas", "Arun", "Bhima", "Bhimashankar",
        "Hrutik", "Jattappa", "Ningappa", "Mallikarjun", "Marilinga",
        "Ravi", "Vinod", "Viresh", "Chandrashekar", "Gollalappa", "Sunil",
        "Ambika", "Bhimbai", "Chaitra", "Ganga", "Mallamma", "Ningamma",
        "Parvati", "Prema", "Roopa", "Savita", "Sharanamma",
        "Shweta", "Shweta H", "Suvarna", "Umashree", "Mahesh", "Praveen", "Suchitra", "Shreedevi",
        "Mamtha", "Archana",

    ];

    const [classmates, setClassmates] = useState(initialClassmates);
    const [isShuffling, setIsShuffling] = useState(false);

    const shuffleClassmates = () => {
        setIsShuffling(true);
        setTimeout(() => {
            const shuffled = [...classmates].sort(() => Math.random() - 0.5);
            setClassmates(shuffled);
            setIsShuffling(false);
        }, 300); // Small delay for animation effect
    };

    return (
        <div style={{
            background: '#fff',
            backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            minHeight: '100vh',
            paddingBottom: '50px',
            fontFamily: "'Verdana', sans-serif"
        }}>
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h1 style={{
                    fontSize: '2.8rem',
                    fontFamily: "'Cinzel', serif",
                    fontWeight: '800',
                    margin: '20px 0',
                    background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0px 4px 15px rgba(255, 65, 108, 0.3)',
                    letterSpacing: '1px'
                }}>
                    SSLC 2015-2016 Batch Students 🎓
                </h1>

                <button
                    onClick={shuffleClassmates}
                    style={{
                        marginTop: '20px',
                        padding: '12px 35px',
                        fontSize: '1.2rem',
                        background: '#2d3436',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50px',
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        position: 'relative',
                        zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span>🔄</span> Refresh
                </button>
            </div>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '25px',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '60px 40px',
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Soft gradient for glass effect
                borderRadius: '40px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
            }}>
                {classmates.map((name, index) => (
                    <div key={`${name}-${index}`} style={{
                        padding: '16px 30px',
                        background: isShuffling ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.65)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '20px',
                        fontSize: '1.3rem',
                        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                        fontWeight: '700',
                        color: '#2d3436',
                        transform: isShuffling ? `scale(0.9) rotate(${Math.random() * 10 - 5}deg)` : `rotate(0deg)`,
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        opacity: isShuffling ? 0.6 : 1,
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                        cursor: 'default',
                        position: 'relative',
                        animation: isShuffling ? 'none' : `float ${3 + Math.random()}s ease-in-out infinite alternate ${Math.random()}s`,
                        textAlign: 'center',
                        minWidth: '120px'
                    }}>
                        {name}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <footer style={{ textAlign: 'center', marginTop: '80px', padding: '40px 20px', background: '#000', color: 'white' }}>
                <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#FFD700',
                    animation: 'glow 1.5s ease-in-out infinite alternate',
                    textShadow: '0 0 10px rgba(255, 215, 0, 0.7)'
                }}>
                    The batch that Teachers will never forget (for wrong reasons) 😂
                </p>
            </footer>
            <style>{`
                @keyframes glow {
                    from { text-shadow: 0 0 10px #FFD700, 0 0 20px #FF4757; transform: scale(1); }
                    to { text-shadow: 0 0 20px #FFD700, 0 0 40px #FF4757; transform: scale(1.05); }
                }
                @keyframes float {
                    from { top: 0px; }
                    to { top: -10px; }
                }
            `}</style>
        </div>
    );
};

export default ClassmatesPage;
