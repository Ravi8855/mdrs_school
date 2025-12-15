import React from 'react';

const memes = [
    { color: '#FFCDD2', caption: "Me explaining why I didn't do homework", icon: "🤯" },
    { color: '#F8BBD0', caption: "Future engineer sleeping in math class", icon: "😴" },
    { color: '#E1BEE7', caption: "When the teacher says 'Get out' and you were already packing", icon: "🚶‍♂️" },
    { color: '#D1C4E9', caption: "The face you make when the topper asks for extra sheet", icon: "😒" },
    { color: '#C5CAE9', caption: "Vibe matching with the backbench gang", icon: "🤜🤛" },
    { color: '#B3E5FC', caption: "Trying to understand Physics 5 mins before exam", icon: "😵‍💫" }
];

const Gallery = () => {
    return (
        <div className="card" style={{ backgroundColor: '#F0F4C3', overflow: 'visible' }}>
            <h2>🖼️ Hall of Shame (Gallery) 🖼️</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '25px',
                marginTop: '30px'
            }}>
                {memes.map((meme, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        padding: '15px 15px 40px 15px', // Polaroid padding bottom
                        boxShadow: '4px 4px 6px rgba(0,0,0,0.2)',
                        transform: `rotate(${Math.random() * 6 - 3}deg)`,
                        transition: 'transform 0.3s',
                        cursor: 'pointer'
                    }}
                        className="polaroid-hover"
                    >
                        <div style={{ backgroundColor: meme.color, height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #eee' }}>
                            <span style={{ fontSize: '3rem' }}>{meme.icon}</span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', marginTop: '15px', lineHeight: '1.2' }}>
                            {meme.caption}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
