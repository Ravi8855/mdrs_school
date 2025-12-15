import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const BestFriendsPage = () => {
    const [subtitle, setSubtitle] = useState(0);
    const [yourName, setYourName] = useState('');
    const [friendName, setFriendName] = useState('');
    const [roastResult, setRoastResult] = useState('');
    const [lastIndex, setLastIndex] = useState(-1);
    const [toast, setToast] = useState('');

    const subtitles = [
        "From first bench to last bench — together always 😎",
        "Not by blood, but by attendance shortage 😂"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setSubtitle(prev => (prev + 1) % subtitles.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const classmates = [
        "Ambadas", "Arun", "Bhimu", "Bhimashankar",
        "Hrutik", "Jattappa", "Ningappa", "Mallikarjun", "Marilinga",
        "Ravi", "Vinod", "Viresh", "Chandrashekar", "Gollalappa", "Sunil",
        "Ambika", "Bhimbai", "Chaitra", "Ganga", "Mallamma", "Ningamma",
        "Parvati", "Prema", "Roopa", "Savita", "Sharanamma",
        "Shweta", "Shweta H", "Suvarna", "Umashree", "Mahesh", "Praveen", "Suchitra", "Shreedevi",
        "Mamtha", "Archana",
    ];

    const generateBffRoast = () => {
        if (!yourName || !friendName) return;

        const normalize = (name) => name.trim().toLowerCase();
        const isValidName = (name) => classmates.some(c => normalize(c) === normalize(name));

        if (!isValidName(yourName) || !isValidName(friendName)) {
            setToast("Select your classmates only");
            setTimeout(() => setToast(''), 3000);
            return;
        }

        const templates = [
            "{friend} is the reason {me} gets into trouble, but honestly, {me} wouldn't have it any other way. ❤️😂",
            "I swear {friend} has zero brain cells, but {me} still loves them more than my own siblings. 💀❤️",
            "{friend} eats all of {me}'s tiffin every single day. If that's not sacrifice, I don't know what is. 🍱😤",
            "Even if we fail together, {me} knows {friend} will still be there to blame the teacher with me. 🤝💯",
            "{friend} is the most annoying human {me} has met, but life is boring without their drama. 🤡✨",
            "One day {me} will be rich and {friend} will still be asking me for 10 rupees. And I'll give it. 💸❤️",
            "God made us best friends because He knew our moms couldn't handle us as sisters/brothers. 🙌😈",
            // New Emotional Lines
            "No matter how much we fight, {me} knows {friend} is the first person I'll call looking for a body bag... or a hug. 🫂💀",
            "{friend} has seen {me} ugly cry, laugh until my stomach hurts, and fail exams. If that's not love, I don't know what is. ❤️",
            "School ends, colleges change, but {me} promises to annoy {friend} until we are in wheelchairs racing each other. 👵🦼",
            "Everyone has a best friend, but {me} has a soulmate in {friend}. (Don't tell anyone I said this, ew). 🤫❤️"
        ];

        let content = "";
        let newIndex = -1;

        // Ensure we don't repeats the same roast twice
        do {
            newIndex = Math.floor(Math.random() * templates.length);
        } while (newIndex === lastIndex && templates.length > 1);

        setLastIndex(newIndex);
        const template = templates[newIndex];

        const msg = template.replace(/{me}/g, yourName).replace(/{friend}/g, friendName);

        setRoastResult(msg);
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    };

    return (
        <div style={{
            background: '#fff',
            backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            minHeight: '100vh',
            paddingBottom: '50px'
        }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-hand)', color: '#FF4757', textShadow: '3px 3px 0px #000' }}>
                    Best Friends Forever (BFFs) 💫
                </h1>
                <div style={{ fontSize: '1.5rem', marginTop: '20px', minHeight: '1.5em', fontWeight: 'bold' }}>
                    {subtitles[subtitle]}
                </div>
                <div style={{ marginTop: '30px', fontSize: '3rem' }}>
                    👫 👬 👭 😂 📚
                </div>
            </div>

            {/* BFF Roast Form */}
            <section style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', background: '#FFF9C4', borderRadius: '20px', border: '3px solid #000', boxShadow: '8px 8px 0px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#E91E63' }}>🔥 Friendship Reality Check 🔥</h2>
                <p style={{ marginBottom: '20px', fontWeight: 'bold' }}>Enter names to see the  truth (with love):</p>

                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Your Name "
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                        style={{ padding: '15px', fontSize: '1.2rem', borderRadius: '10px', border: '2px solid #000', outline: 'none' }}
                    />
                    <div style={{ fontSize: '1.5rem' }}>➕</div>
                    <input
                        type="text"
                        placeholder="Friend Name "
                        value={friendName}
                        onChange={(e) => setFriendName(e.target.value)}
                        style={{ padding: '15px', fontSize: '1.2rem', borderRadius: '10px', border: '2px solid #000', outline: 'none' }}
                    />
                </div>

                <button
                    onClick={generateBffRoast}
                    style={{
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '4px 4px 0px #888'
                    }}
                >
                    Generate Truth! 💣
                </button>

                {roastResult && (
                    <div style={{ marginTop: '30px', animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                        <h3 style={{ fontSize: '1.5rem', lineHeight: '1.5', background: 'white', padding: '20px', borderRadius: '15px', border: '2px dashed #000' }}>
                            {roastResult}
                        </h3>
                    </div>
                )}
            </section>

            <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideDown {
          0% { transform: translate(-50%, -20px); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#FF0000', // Brighter red for visibility
                    color: '#fff',
                    padding: '15px 30px', // Larger padding
                    borderRadius: '50px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)', // Stronger shadow
                    zIndex: 2000,
                    fontSize: '1.3rem', // Larger font
                    fontWeight: 'bold',
                    fontFamily: 'sans-serif', // Ensure readability
                    animation: 'slideDown 0.3s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '3px solid #fff',
                    minWidth: '300px',
                    justifyContent: 'center'
                }}>
                    ⚠️ <span style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>{toast}</span>
                </div>
            )}
        </div>
    );
};

export default BestFriendsPage;
