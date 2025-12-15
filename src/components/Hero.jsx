import React from 'react';

const Hero = () => {
    return (
        <div className="hero-section" style={{
            padding: '100px 0 60px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Background Floating Elements */}
            <div className="floating-icon" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🎒</div>
            <div className="floating-icon" style={{ top: '20%', right: '10%', animationDelay: '1s' }}>📓</div>
            <div className="floating-icon" style={{ bottom: '10%', left: '15%', animationDelay: '2s' }}>🥪</div>
            <div className="floating-icon" style={{ top: '40%', right: '5%', animationDelay: '3s' }}>✈️</div>
            <div className="floating-icon" style={{ bottom: '20%', right: '20%', animationDelay: '1.5s' }}>😴</div>

            <style>{`
        .floating-icon {
          position: absolute;
          font-size: 3rem;
          opacity: 0.15;
          animation: float 6s ease-in-out infinite;
          z-index: 0;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .hero-gradient-text {
          background: linear-gradient(45deg, #FF416C, #FF4B2B);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.1));
        }
        .school-badge {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 3px solid #000;
          box-shadow: 6px 6px 0px #000;
          transition: transform 0.3s;
        }
        .school-badge:hover {
          transform: scale(1.05) rotate(-1deg);
        }
      `}</style>

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Premium School Badge */}
                <div className="school-badge" style={{
                    display: 'inline-block',
                    padding: '12px 35px',
                    borderRadius: '50px',
                    marginBottom: '30px',
                    cursor: 'default'
                }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#2d3436' }}>
                        Welcome to
                    </span>
                    <br />
                    <span style={{ fontSize: '2rem', fontWeight: '900', color: '#6C5CE7', fontFamily: 'var(--font-hand)' }}>
                        MDRS School Shahapur 🏫
                    </span>
                </div>

                {/* Main Title */}
                <h1 style={{
                    fontSize: '5rem',
                    margin: '10px 0',
                    lineHeight: '1',
                    transform: 'rotate(-2deg)'
                }} className="hero-gradient-text">
                    BACKBENCHERS HQ
                </h1>

                {/* Tagline */}
                <h2 style={{
                    fontSize: '1.8rem',
                    margin: '30px auto',
                    color: '#2d3436',
                    maxWidth: '800px',
                    lineHeight: '1.6'
                }}>
                    Where Homework Was <span style={{ textDecoration: 'line-through', color: '#B2BEC3' }}>Mandatory</span> Optional & <br />
                    <span style={{
                        backgroundColor: '#00b894',
                        color: 'white',
                        padding: '5px 15px',
                        border: '2px solid #000',
                        borderRadius: '8px',
                        boxShadow: '4px 4px 0px #000',
                        display: 'inline-block',
                        marginTop: '5px',
                        transform: 'rotate(1deg)'
                    }}>Punishment Was Guaranteed 🤣</span>
                </h2>

                <p style={{ marginTop: '20px', fontSize: '1.3rem', color: '#636e72', fontStyle: 'italic' }}>
                    "Official headquarters of the last bench legends."
                </p>
            </div>
        </div>
    );
};

export default Hero;
