import React, { useState } from 'react';
import confetti from 'canvas-confetti';

const SpinWheelPage = () => {
    const classmates = [
        "Ambadas", "Arun", "Bhimu", "Bhimashankar", "Hrutik", "Jattappa", "Ningappa",
        "Mallikarjun", "Marilinga", "Ravi", "Vinod", "Viresh", "Chandrashekar",
        "Gollalappa", "Sunil", "Ambika", "Bhimbai", "Chaitra", "Ganga", "Mallamma",
        "Ningamma", "Parvati", "Prema", "Roopa", "Savita", "Sharanamma", "Shweta",
        "Shweta H", "Suvarna", "Umashree", "Mahesh", "Praveen", "Suchitra",
        "Shreedevi", "Mamtha", "Archana"
    ];

    const allTitles = [
        "Attendance King 👑",
        "Mass Bunk Leader 🚀",
        "Silent Killer 😶",
        "Notes Supplier 📚",
        "Exam Topper (Once) 😂",
        "Backbench Boss 🎯",
        "Homework Dodger 🏃",
        "Class Clown 🤡",
        "Sleep Champion 😴",
        "Snack Smuggler 🍿",
        "Last Minute Hero ⏰",
        "Copy Master 📋",
        "Question Asker 🙋",
        "Late Entry Expert 🚪",
        "Bathroom Break Pro 🚽",
        "Pen Borrower 🖊️",
        "Excuse Maker 🎭",
        "Gossip Queen/King 👑",
        "Doodle Artist 🎨",
        "Calculator Wizard 🧮",
        "Canteen Regular 🍔",
        "Sports Star ⚽",
        "Drama King/Queen 🎬",
        "Tech Genius 💻",
        "Music Lover 🎵",
        "Selfie Expert 📸",
        "Meme Lord 😎",
        "Debate Champion 🗣️",
        "Handwriting Hero ✍️",
        "Uniform Rebel 👕"
    ];

    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [usedTitles, setUsedTitles] = useState([]);
    const [usedNames, setUsedNames] = useState([]);
    const [wheelRotation, setWheelRotation] = useState(0);

    const spinWheel = () => {
        if (spinning) return;

        // Reset both when all 30 titles used
        if (usedTitles.length >= allTitles.length) {
            setUsedTitles([]);
            setUsedNames([]);
        }

        setSpinning(true);
        setResult(null);

        // Random rotation (multiple spins)
        const spins = 5 + Math.random() * 5;
        const newRotation = wheelRotation + (360 * spins);
        setWheelRotation(newRotation);

        // Select random name from unused names
        setTimeout(() => {
            let randomName;
            const availableNames = classmates.filter(name => !usedNames.includes(name));

            // If we have unused names, pick from them; otherwise pick from all
            if (availableNames.length > 0) {
                randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
            } else {
                randomName = classmates[Math.floor(Math.random() * classmates.length)];
            }

            const availableTitles = allTitles.filter(title => !usedTitles.includes(title));
            const randomTitle = availableTitles[Math.floor(Math.random() * availableTitles.length)];

            setResult({ name: randomName, title: randomTitle });
            setUsedTitles([...usedTitles, randomTitle]);
            setUsedNames([...usedNames, randomName]);
            setSpinning(false);

            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
        }, 3000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '50px 20px',
            fontFamily: "'Poppins', sans-serif",
            color: '#fff'
        }}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700;800;900&display=swap');
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                @media (max-width: 768px) {
                    .spin-button {
                        padding: 20px 50px;
                        font-size: 1.5rem;
                    }
                    
                    .wheel {
                        width: 300px;
                        height: 300px;
                    }
                }
                
                @media (max-width: 480px) {
                    .spin-button {
                        padding: 18px 40px;
                        font-size: 1.3rem;
                        border-radius: 50px;
                    }
                    
                    .wheel {
                        width: 250px;
                        height: 250px;
                    }
                }
                
                @media (max-width: 360px) {
                    .spin-button {
                        padding: 15px 35px;
                        font-size: 1.2rem;
                    }
                    
                    .wheel {
                        width: 220px;
                        height: 220px;
                    }
                }

                .spin-button {
                    background: linear-gradient(45deg, #FFD700, #FFA500);
                    border: none;
                    padding: 25px 60px;
                    font-size: 1.8rem;
                    font-weight: 900;
                    border-radius: 60px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.4);
                    color: #000;
                    font-family: 'Poppins', sans-serif;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .spin-button:hover:not(:disabled) {
                    transform: scale(1.1) translateY(-5px);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }

                .spin-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .wheel {
                    width: 350px;
                    height: 350px;
                    border-radius: 50%;
                    background: conic-gradient(
                        from 0deg,
                        #FF6B6B 0deg 45deg,
                        #4ECDC4 45deg 90deg,
                        #FFE66D 90deg 135deg,
                        #95E1D3 135deg 180deg,
                        #F38181 180deg 225deg,
                        #AA96DA 225deg 270deg,
                        #FCBAD3 270deg 315deg,
                        #A8E6CF 315deg 360deg
                    );
                    border: 12px solid #fff;
                    box-shadow: 0 25px 70px rgba(0,0,0,0.5);
                    position: relative;
                    transition: transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99);
                }

                .wheel-center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80px;
                    height: 80px;
                    background: #fff;
                    border-radius: 50%;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 700;
                }

                .result-card {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(15px);
                    border: 3px solid rgba(255, 255, 255, 0.4);
                    border-radius: 35px;
                    padding: 50px;
                    animation: fadeInUp 0.5s ease;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    font-family: 'Poppins', sans-serif;
                }
                `}
            </style>

            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: '900',
                    marginBottom: '15px',
                    textShadow: '0 8px 20px rgba(0,0,0,0.4)',
                    letterSpacing: '2px',
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: '1.1'
                }}>
                    Spin the Wheel – Class Legends 
                </h1>
                <p style={{
                    fontSize: '1.6rem',
                    opacity: 0.95,
                    fontWeight: '500',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: '1.4'
                }}>
                    Who will be crowned today?
                </p>
            </header>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '50px',
                maxWidth: '700px',
                margin: '0 auto'
            }}>
                {/* Wheel */}
                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="wheel" style={{
                        transform: `rotate(${wheelRotation}deg)`
                    }}>
                        <div className="wheel-center">🎯</div>
                    </div>
                    {/* Pointer */}
                    <div style={{
                        position: 'absolute',
                        top: '-40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '4rem',
                        filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))',
                        animation: spinning ? 'bounce 0.5s infinite' : 'none'
                    }}>
                        👇
                    </div>
                </div>

                {/* Spin Button */}
                <button
                    className="spin-button"
                    onClick={spinWheel}
                    disabled={spinning}
                >
                    {spinning ? 'Spinning... 🌀' : 'SPIN THE WHEEL!'}
                </button>

                {/* Result */}
                {result && (
                    <div className="result-card" style={{ width: '100%', textAlign: 'center' }}>
                        <h2 style={{
                            fontSize: '3.5rem',
                            marginBottom: '30px',
                            fontWeight: '900',
                            textShadow: '0 5px 15px rgba(0,0,0,0.3)',
                            letterSpacing: '1px'
                        }}>
                            {result.name}
                        </h2>
                        <div style={{
                            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                            padding: '25px 40px',
                            borderRadius: '25px',
                            display: 'inline-block',
                            color: '#000',
                            fontWeight: '800',
                            fontSize: '2.2rem',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                            animation: 'pulse 2s infinite'
                        }}>
                            {result.title}
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div style={{
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '25px 40px',
                    borderRadius: '20px',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}>
                    <p style={{ marginBottom: '10px', fontSize: '1.3rem' }}>
                        🏆 Titles Awarded: <span style={{ color: '#FFD700', fontWeight: '800' }}>{usedTitles.length}</span> / {allTitles.length}
                    </p>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                        👥 Unique Winners: <span style={{ color: '#4ECDC4', fontWeight: '800' }}>{usedNames.length}</span>
                    </p>
                    {usedTitles.length >= allTitles.length && (
                        <p style={{
                            color: '#FFD700',
                            fontWeight: '800',
                            marginTop: '15px',
                            fontSize: '1.3rem',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}>
                            🎉 All titles awarded! Next spin starts fresh!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpinWheelPage;
