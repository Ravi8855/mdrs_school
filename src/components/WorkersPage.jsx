import React from 'react';

const WorkersPage = () => {
    const workers = [
        { name: "Raju Anna", role: "Support Staff" },
        { name: "Laxami Aunty", role: "Support Staff" },
        { name: "Laxmi N Aunty", role: "Support Staff" },
        { name: "Madhu Anna", role: "Support Staff" },
        { name: "Manjula D Aunty", role: "Support Staff" },
        { name: "Rekha Aunty", role: "Support Staff" },
        { name: "Suma Aunty", role: "Support Staff" },
        { name: "Bheembai Aunty", role: "Support Staff" },
        { name: "Roopa Aunty", role: "Support Staff" },
        { name: "Sujatha Aunty", role: "Support Staff" },
        { name: "Manjula Shapur", role: "Support Staff" },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            fontFamily: "'Poppins', sans-serif",
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            position: 'relative',
            paddingBottom: '2rem'
        }}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Poppins:wght@300;500;700&display=swap');
                
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }

                @keyframes gradientFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .worker-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 20px;
                    padding: 30px;
                    text-align: center;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
                    position: relative;
                    overflow: hidden;
                    width: 280px;
                }

                .worker-card:hover {
                    transform: translateY(-10px) scale(1.02);
                    background: rgba(255, 255, 255, 0.9);
                    box-shadow: 0 15px 45px rgba(0,0,0,0.1);
                    border-color: rgba(255, 255, 255, 0.8);
                }

                .avatar-placeholder {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    margin: 0 auto 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 2rem;
                    box-shadow: 0 5px 15px rgba(118, 75, 162, 0.3);
                }

                .card-shine {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
                    transform: skewX(-20deg) translateX(-150%);
                    transition: 0.5s;
                }

                .worker-card:hover .card-shine {
                    transform: skewX(-20deg) translateX(150%);
                }
                `}
            </style>

            {/* Decorative Background Elements */}
            <div style={{
                position: 'fixed', top: '-50px', left: '-50px', width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(118,75,162,0.2) 0%, transparent 70%)',
                borderRadius: '50%', zIndex: 0
            }} />
            <div style={{
                position: 'fixed', bottom: '50px', right: '-50px', width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(102,126,234,0.2) 0%, transparent 70%)',
                borderRadius: '50%', zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
                <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{
                        fontSize: '4rem',
                        background: 'linear-gradient(to right, #0F2027, #203A43, #2C5364)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '15px',
                        fontWeight: '800',
                        letterSpacing: '-1px',
                        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))'
                    }}>
                        The Helping Hands <span style={{ WebkitTextFillColor: 'initial', textShadow: 'none' }}>🤝</span>
                    </h1>
                    <p className="appreciation-text" style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: '1.6',
                        background: 'linear-gradient(45deg, #FF4757, #667eea, #764ba2, #FF4757)',
                        backgroundSize: '300% 300%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'gradientFlow 3s ease infinite'
                    }}>
                        The silent heroes who work tirelessly behind the scenes to keep our school running smoothly.
                        We appreciate you! ❤️
                    </p>
                </header>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '40px'
                }}>
                    {workers.map((worker, index) => (
                        <div key={index} className="worker-card" style={{ animation: `fadeIn 0.6s ease-out backwards ${index * 0.1}s` }}>
                            <div className="card-shine"></div>
                            <div className="avatar-placeholder">
                                {worker.name[0]}
                            </div>
                            <h3 style={{
                                margin: '15px 0 5px',
                                color: '#000000',
                                fontSize: '1.6rem', // Slightly larger
                                fontFamily: "'Montserrat', sans-serif", // clear and visible font
                                fontWeight: '800', // Extra bold
                                letterSpacing: '0.5px',
                                textTransform: 'capitalize'
                            }}>{worker.name}</h3>
                            <div style={{
                                height: '3px',
                                width: '40px',
                                background: 'linear-gradient(to right, #667eea, #764ba2)',
                                margin: '12px auto',
                                borderRadius: '2px'
                            }}></div>
                            <p style={{
                                color: '#444', // Darker gray for role
                                fontSize: '1.1rem',
                                fontWeight: '600', // Bolder role
                                margin: 0
                            }}>{worker.role}</p>
                        </div>
                    ))}
                </div>

                <footer style={{
                    textAlign: 'center',
                    marginTop: '80px',
                    color: '#a0aec0',
                    fontSize: '0.9rem'
                }}>

                </footer>
            </div>
        </div>
    );
};

export default WorkersPage;
