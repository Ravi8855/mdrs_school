import React from 'react';

const SchoolHome = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '85vh',
            textAlign: 'center',
            padding: '20px',
            background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
            backgroundSize: '400% 400%',
            animation: 'gradientBG 15s ease infinite',
            fontFamily: "'Montserrat', sans-serif",
            color: 'white'
        }}>
            {/* Google Fonts Import for Professional Typography */}
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;600&display=swap');`}
            </style>

            <div style={{
                maxWidth: '1000px',
                padding: '60px 40px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)',
                borderRadius: '30px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                animation: 'slideUp 1s ease-out',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px',
                    background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)'
                }}></div>
                <div style={{
                    position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px',
                    background: 'rgba(255,215,0,0.2)', borderRadius: '50%', filter: 'blur(50px)'
                }}></div>

                <div style={{ animation: 'fadeIn 1.5s ease-out' }}>
                    <span style={{ fontSize: '4rem', display: 'block', marginBottom: '10px', animation: 'float 3s ease-in-out infinite' }}>🏫</span>
                    <h2 style={{
                        textTransform: 'uppercase',
                        letterSpacing: '8px',
                        fontSize: '1rem',
                        marginBottom: '15px',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,0.9)'
                    }}>Welcome To</h2>
                </div>

                <h1 style={{
                    fontFamily: "'Cinzel', serif", // Professional, monumental font
                    fontSize: '3rem',
                    fontWeight: '700',
                    lineHeight: '1.4',
                    marginBottom: '30px',
                    background: 'linear-gradient(to right, #fff, #ffd700, #fff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0px 4px 10px rgba(0,0,0,0.3)',
                    animation: 'shimmer 3s infinite linear'
                }}>
                    MORARJI DESAI RESIDENTIAL SCHOOL DORIGUDDA UKKENALA SHAHAPUR, YADGIR DIST - 585309
                </h1>

                <div style={{
                    display: 'inline-block',
                    padding: '12px 35px',
                    border: '1px solid rgba(255,255,255,0.4)',
                    borderRadius: '50px',
                    background: 'rgba(0,0,0,0.3)',
                    fontSize: '1.2rem',
                    letterSpacing: '2px',
                    fontFamily: "'Cinzel', serif",
                    fontWeight: '600'
                }}>
                    Excellence in Education ✨
                </div>
            </div>

            <style>{`
                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SchoolHome;
