import React, { useState } from 'react';

const ExamMemories = () => {
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const handleSelect = (option) => {
        setSelected(option);
        setShowResult(true);
    };

    return (
        <div className="card" style={{ backgroundColor: '#FFF9C4', transform: 'rotate(1deg)' }}>
            <h2>📝 Exam Hall Memories 📝</h2>

            <div style={{ textAlign: 'left', margin: '30px auto', maxWidth: '500px', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ borderBottom: '2px dashed #ccc', paddingBottom: '10px' }}>Q. Best cheating method?</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    {['A) Water bottle notes', 'B) Bench signals (Tap for A, Cough for B)', 'C) Whispering answers to the topper'].map((opt, idx) => {
                        const key = opt.charAt(0);
                        const isSelected = selected === key;
                        return (
                            <button
                                key={key}
                                onClick={() => handleSelect(key)}
                                style={{
                                    textAlign: 'left',
                                    backgroundColor: isSelected ? (key === 'C' ? '#66BB6A' : '#FF6B6B') : 'white',
                                    color: isSelected ? 'white' : 'black',
                                    transform: isSelected ? 'scale(1.02)' : 'none',
                                    boxShadow: isSelected ? 'inset 3px 3px 0 rgba(0,0,0,0.2)' : 'var(--shadow-hover)'
                                }}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {showResult && (
                    <div style={{ marginTop: '25px', padding: '15px', border: '3px solid #000', backgroundColor: '#E0F7FA', borderRadius: '10px', animation: 'bounce 0.5s' }}>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                            {selected === 'C'
                                ? "Correct! But the topper ignores you. 😭"
                                : "Wrong! Teacher caught you. Principal's office, NOW! 😡"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamMemories;
