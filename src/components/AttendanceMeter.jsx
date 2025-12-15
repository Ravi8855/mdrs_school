import React, { useState } from 'react';

const AttendanceMeter = () => {
    const [attendance, setAttendance] = useState(75);

    const getMessage = (val) => {
        if (val < 30) return "Principal is calling your parents 📞";
        if (val < 50) return "You are a guest appearance in class 🌟";
        if (val < 75) return "Living on the edge (of detention) 😰";
        if (val < 90) return "Calculated bunking expert 🧠";
        return "Nerd alert! 🤓 (Just kidding, good job)";
    };

    const getGradient = (val) => {
        // dynamic gradient for slider
        return `linear-gradient(90deg, #FFD700 ${val}%, #eee ${val}%)`;
    }

    return (
        <div className="card" style={{ backgroundColor: '#B2EBF2' }}>
            <h2>📊 Attendance Reality Meter 📊</h2>

            <div style={{ margin: '40px 0', padding: '0 20px' }}>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    style={{
                        width: '100%',
                        height: '25px',
                        borderRadius: '15px',
                        background: getGradient(attendance),
                        border: '2px solid black',
                        appearance: 'none',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                />
                <style>{`
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: #FF6B6B;
            border: 3px solid black;
            cursor: pointer;
            box-shadow: 2px 2px 0px rgba(0,0,0,0.2);
            transition: transform 0.1s;
          }
          input[type=range]::-webkit-slider-thumb:hover {
            transform: scale(1.1);
          }
        `}</style>
            </div>

            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <div style={{ background: 'white', padding: '15px', borderRadius: '10px', border: '2px solid black', marginBottom: '10px' }}>
                    Paper: <span style={{ color: '#4CAF50' }}>{attendance}%</span>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '10px', border: '2px solid black', marginBottom: '10px' }}>
                    Real Life: <span style={{ color: '#F44336' }}>{Math.max(0, attendance - 40)}%</span> 😭
                </div>
            </div>

            <p style={{ marginTop: '25px', fontSize: '1.3rem', fontStyle: 'italic', color: '#006064', background: 'rgba(255,255,255,0.6)', padding: '10px', borderRadius: '10px' }}>
                "{getMessage(attendance)}"
            </p>
        </div>
    );
};

export default AttendanceMeter;
