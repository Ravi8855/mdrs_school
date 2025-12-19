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
        "Shweta", "Shweta H", "Suvarna", "Umashree", "Mahesh", "Praveen",
        "Suchitra", "Shreedevi", "Mamtha", "Archana",
    ];

    const generateBffRoast = () => {
        if (!yourName || !friendName) return;

        const normalize = (name) => name.trim().toLowerCase();

        const isYourNameValid = classmates.some(
            c => normalize(c) === normalize(yourName)
        );

        const isFriendNameValid = classmates.some(
            c => normalize(c) === normalize(friendName)
        );

        // ✅ FIX: popup if ANY ONE name is wrong
        if (!isYourNameValid || !isFriendNameValid) {
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
            "No matter how much we fight, {me} knows {friend} is the first person I'll call looking for a body bag... or a hug. 🫂💀",
            "{friend} has seen {me} ugly cry, laugh until my stomach hurts, and fail exams. If that's not love, I don't know what is. ❤️",
            "School ends, colleges change, but {me} promises to annoy {friend} until we are in wheelchairs racing each other. 👵🦼",
            "Everyone has a best friend, but {me} has a soulmate in {friend}. 🤫❤️"
        ];

        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * templates.length);
        } while (newIndex === lastIndex && templates.length > 1);

        setLastIndex(newIndex);

        const msg = templates[newIndex]
            .replace(/{me}/g, yourName)
            .replace(/{friend}/g, friendName);

        setRoastResult(msg);
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    };

    return (
        <div style={{
            background: '#fff',
            backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            minHeight: '100vh',
            paddingBottom: '50px',
            fontFamily: 'Arial, system-ui, sans-serif'
        }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    color: '#FF4757',
                    textShadow: '3px 3px 0px #000',
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: '1.2',
                    letterSpacing: '0.5px'
                }}>
                    Best Friends Forever (BFFs)
                </h1>

                <div style={{
                    fontSize: '1.6rem',
                    marginTop: '20px',
                    minHeight: '1.5em',
                    fontWeight: 'bold',
                    padding: '0 15px',
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: '1.4',
                    letterSpacing: '0.3px'
                }}>
                    {subtitles[subtitle]}
                </div>

                <div style={{ marginTop: '30px', fontSize: '3rem', lineHeight: '1' }}>
                    👫 👬 👭
                </div>
            </div>

            {/* Form */}
            <section style={{
                maxWidth: '600px',
                margin: '40px auto',
                padding: '30px',
                background: '#FFF9C4',
                borderRadius: '20px',
                border: '3px solid #000',
                boxShadow: '8px 8px 0px rgba(0,0,0,0.1)',
                textAlign: 'center',
                width: '90%',
                boxSizing: 'border-box'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#E91E63', fontFamily: 'Poppins, sans-serif', lineHeight: '1.3' }}>
                    🔥 Friendship Reality Check 🔥
                </h2>

                <p style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'Poppins, sans-serif', lineHeight: '1.4' }}>
                    Enter names to see the truth:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                        style={{ padding: '15px', fontSize: '1.2rem', borderRadius: '10px', border: '2px solid #000', width: '100%', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }}
                    />

                    <div style={{ fontSize: '1.5rem' }}>➕</div>

                    <input
                        type="text"
                        placeholder="Friend Name"
                        value={friendName}
                        onChange={(e) => setFriendName(e.target.value)}
                        style={{ padding: '15px', fontSize: '1.2rem', borderRadius: '10px', border: '2px solid #000', width: '100%', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }}
                    />
                </div>

                <button
                    onClick={generateBffRoast}
                    style={{
                        marginTop: '20px',
                        background: '#000',
                        color: '#fff',
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        width: '100%',
                        maxWidth: '300px',
                        margin: '20px auto 0'
                    }}
                    className="button-responsive"
                >
                    Generate Truth! 💣
                </button>

                {roastResult && (
                    <div style={{ marginTop: '30px' }}>
                        <h3 style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '15px',
                            border: '2px dashed #000'
                        }}>
                            {roastResult}
                        </h3>
                    </div>
                )}
            </section>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#FF0000',
                    color: '#fff',
                    padding: '15px 30px',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    zIndex: 2000
                }}>
                    ⚠️ {toast}
                </div>
            )}
        </div>
    );
};

export default BestFriendsPage;
