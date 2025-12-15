import React, { useState } from 'react';

const roastsTemplates = [
    "{name}, you were present in class but absent in life 🤡",
    "{name}'s handwriting looks like a doctor having a stroke ✍️",
    "{name} is the reason the teacher decided to retire early 👴",
    "Legend says {name} is still completing homework from 2015 📚",
    "{name} only came to school for the lunch break 🍱",
    "Even the calculator gives up on {name}'s math skills 🧮",
    "Teacher: 'Is this a fish market?' {name}: *Selling fish* 🐟",
    "{name} has a PhD in sleeping with eyes open 😴",
    "{name}'s attendance was lower than their grades 📉",
    "{name} borrowed a pen in 1st grade and never returned it 🖊️"
];

const RoastSection = () => {
    const [roast, setRoast] = useState("Enter a name to start roasting! 🔥");
    const [animating, setAnimating] = useState(false);
    const [nameInput, setNameInput] = useState("");

    const generateRoast = (e) => {
        e.preventDefault(); // prevent form submit refresh if used in form

        if (!nameInput.trim()) {
            setRoast("Please enter a name first! 🙄");
            return;
        }

        setAnimating(true);
        setTimeout(() => {
            const template = roastsTemplates[Math.floor(Math.random() * roastsTemplates.length)];
            const personalizedRoast = template.replace(/{name}/g, nameInput.trim());
            setRoast(personalizedRoast);
            setAnimating(false);
        }, 300);
    };

    return (
        <div className="card" style={{ backgroundColor: '#FFCCBC' }}>
            <div style={{ position: 'absolute', top: '-15px', right: '-15px', background: '#FF6B6B', color: 'white', padding: '5px 15px', border: '2px solid black', borderRadius: '20px', fontWeight: 'bold', transform: 'rotate(5deg)' }}>
                HOT 🔥
            </div>
            <h2>🔥 Classmates Roast Generator 🔥</h2>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <input
                    type="text"
                    placeholder="Enter friend's name..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    style={{
                        padding: '10px 15px',
                        fontSize: '1.2rem',
                        border: '3px solid black',
                        borderRadius: '10px',
                        fontFamily: 'var(--font-hand)',
                        width: '200px',
                        outline: 'none'
                    }}
                />
                <button
                    onClick={generateRoast}
                    style={{ backgroundColor: '#FF6B6B', color: 'white' }}
                >
                    Roast 'Em! 🔥
                </button>
            </div>

            <div style={{
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '20px 0',
                padding: '20px',
                background: 'rgba(255,255,255,0.5)',
                borderRadius: '15px',
                border: '2px dashed #000',
                transform: animating ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 0.1s'
            }}>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                    "{roast}"
                </p>
            </div>
        </div>
    );
};

export default RoastSection;
