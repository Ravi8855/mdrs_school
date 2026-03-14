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
        "From first bench to last bench — together always",
        "Not by blood, but by attendance shortage"
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

        if (!isYourNameValid || !isFriendNameValid) {
            setToast("Select your classmates only");
            setTimeout(() => setToast(''), 3000);
            return;
        }

        const templates = [
            "{friend} is the reason {me} gets into trouble, but honestly, {me} wouldn't have it any other way.",
            "I swear {friend} has zero brain cells, but {me} still loves them more than my own siblings.",
            "{friend} eats all of {me}'s tiffin every single day. If that's not sacrifice, I don't know what is.",
            "Even if we fail together, {me} knows {friend} will still be there to blame the teacher with me.",
            "{friend} is the most annoying human {me} has met, but life is boring without their drama.",
            "One day {me} will be rich and {friend} will still be asking me for 10 rupees. And I'll give it.",
            "God made us best friends because He knew our moms couldn't handle us as sisters/brothers.",
            "No matter how much we fight, {me} knows {friend} is the first person I'll call looking for a body bag... or a hug.",
            "{friend} has seen {me} ugly cry, laugh until my stomach hurts, and fail exams. If that's not love, I don't know what is.",
            "School ends, colleges change, but {me} promises to annoy {friend} until we are in wheelchairs racing each other.",
            "Everyone has a best friend, but {me} has a soulmate in {friend}."
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
        <div className="bff-page">
            <style>{`
                .bff-page { background: var(--bg-section, #f1f5f9); min-height: auto; padding-bottom: 24px; font-family: var(--font-body, 'Poppins', sans-serif); }
                .bff-hero { text-align: center; padding: 24px 20px; }
                .bff-title { font-size: clamp(1.5rem, 3.5vw, 1.8rem); color: #dc2626; font-family: 'Poppins', sans-serif; line-height: 1.2; letter-spacing: 0.03em; margin: 0 0 8px; font-weight: 700; }
                .bff-subtitle-line { font-size: clamp(1.1rem, 2.5vw, 1.5rem); margin-top: 16px; min-height: 1.5em; font-weight: 700; padding: 0 15px; line-height: 1.4; letter-spacing: 0.02em; color: #1f2937; }
                .bff-emoji { margin-top: 24px; font-size: 2.5rem; line-height: 1; }
                .bff-form-card { max-width: 560px; margin: 24px auto; padding: 28px 24px; background: #ffffff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04); text-align: center; width: 100%; box-sizing: border-box; }
                .bff-form-title { font-size: clamp(1.4rem, 3vw, 1.75rem); margin: 0 0 12px; color: #be185d; font-family: 'Poppins', sans-serif; line-height: 1.3; font-weight: 700; }
                .bff-form-desc { margin: 0 0 20px; font-weight: 600; font-size: 1.1rem; line-height: 1.4; color: #374151; }
                .bff-inputs { display: flex; flex-direction: column; gap: 12px; }
                .bff-input { padding: 14px 16px; font-size: 1.1rem; border-radius: 12px; border: 1px solid rgba(0,0,0,0.12); width: 100%; box-sizing: border-box; font-family: 'Poppins', sans-serif; transition: border-color 0.2s, box-shadow 0.2s; }
                .bff-input:focus { outline: none; border-color: #db2777; box-shadow: 0 0 0 3px rgba(219,39,119,0.15); }
                .bff-plus { font-size: 1.4rem; }
                .bff-submit { margin: 20px auto 0; background: #1f2937; color: #fff; padding: 14px 28px; font-size: 1rem; border-radius: 999px; cursor: pointer; font-weight: 700; width: 100%; max-width: 260px; display: block; border: none; transition: transform 0.2s, box-shadow 0.2s; }
                .bff-submit:hover { background: #111827; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
                .bff-result-wrap { margin-top: 28px; }
                .bff-result { background: #fdf2f8; padding: 20px; border-radius: 14px; border: 1px solid rgba(219,39,119,0.2); font-size: 1.05rem; line-height: 1.5; color: #1f2937; }
                .bff-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #dc2626; color: #fff; padding: 14px 24px; border-radius: 999px; font-weight: 700; font-size: 0.95rem; z-index: 2000; box-shadow: 0 4px 20px rgba(220,38,38,0.4); }
            `}</style>
            <div className="section-inner">
            <div className="bff-hero">
                <h1 className="bff-title">Best Friends Forever (BFFs)</h1>
                <div className="bff-subtitle-line">{subtitles[subtitle]}</div>
                <div className="bff-emoji" aria-hidden="true" />
            </div>

            <section className="bff-form-card">
                <h2 className="bff-form-title">Friendship Reality Check</h2>
                <p className="bff-form-desc">Enter names to see the truth:</p>
                <div className="bff-inputs">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                        className="bff-input"
                    />
                    <div className="bff-plus">+</div>
                    <input
                        type="text"
                        placeholder="Friend Name"
                        value={friendName}
                        onChange={(e) => setFriendName(e.target.value)}
                        className="bff-input"
                    />
                </div>
                <button onClick={generateBffRoast} type="button" className="bff-submit button-responsive">
                    Generate Truth!
                </button>
                {roastResult && (
                    <div className="bff-result-wrap">
                        <div className="bff-result">{roastResult}</div>
                    </div>
                )}
            </section>

            {toast && (
                <div className="bff-toast" role="alert">⚠️ {toast}</div>
            )}
            </div>
        </div>
    );
};

export default BestFriendsPage;
