import React, { useState } from 'react';
import confetti from 'canvas-confetti';

const SpinWheelPage = () => {
  const classmates = [
    "Ambadas","Arun","Bhimu","Bhimashankar","Hrutik","Jattappa","Ningappa",
    "Mallikarjun","Marilinga","Ravi","Vinod","Viresh","Chandrashekar",
    "Gollalappa","Sunil","Ambika","Bheembai","Chaitra","Ganga","Mallamma",
    "Ningamma","Parvati","Prema","Roopa","Savita","Sharanamma","Shweta",
    "Shweta H","Suvarna","Umashree","Mahesh","Praveen","Suchitra",
    "Shreedevi","Mamtha","Archana"
  ];

  const allTitles = [
    "Attendance King 👑","Mass Bunk Leader 🚀","Silent Killer 😶","Notes Supplier 📚",
    "Exam Topper (Once) 😂","Backbench Boss 🎯","Homework Dodger 🏃",
    "Class Clown 🤡","Sleep Champion 😴","Snack Smuggler 🍿",
    "Last Minute Hero ⏰","Copy Master 📋","Question Asker 🙋",
    "Late Entry Expert 🚪","Bathroom Break Pro 🚽","Pen Borrower 🖊️",
    "Excuse Maker 🎭","Gossip Queen/King 👑","Doodle Artist 🎨",
    "Calculator Wizard 🧮","Canteen Regular 🍔","Sports Star ⚽",
    "Drama King/Queen 🎬","Tech Genius 💻","Music Lover 🎵",
    "Selfie Expert 📸","Meme Lord 😎","Debate Champion 🗣️",
    "Handwriting Hero ✍️","Uniform Rebel 👕"
  ];

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [usedTitles, setUsedTitles] = useState([]);
  const [usedNames, setUsedNames] = useState([]);
  const [wheelRotation, setWheelRotation] = useState(0);

  const spinWheel = () => {
    if (spinning) return;

    if (usedTitles.length >= allTitles.length) {
      setUsedTitles([]);
      setUsedNames([]);
    }

    setSpinning(true);
    setResult(null);

    const spins = 5 + Math.random() * 5;
    setWheelRotation(prev => prev + spins * 360);

    setTimeout(() => {
      const availableNames = classmates.filter(n => !usedNames.includes(n));
      const name =
        availableNames.length > 0
          ? availableNames[Math.floor(Math.random() * availableNames.length)]
          : classmates[Math.floor(Math.random() * classmates.length)];

      const availableTitles = allTitles.filter(t => !usedTitles.includes(t));
      const title = availableTitles[Math.floor(Math.random() * availableTitles.length)];

      setResult({ name, title });
      setUsedNames(prev => [...prev, name]);
      setUsedTitles(prev => [...prev, title]);
      setSpinning(false);

      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    }, 3000);
  };

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

        .page {
          min-height: auto;
          display: block;
          background: linear-gradient(135deg,#667eea,#764ba2);
          font-family: 'Poppins', sans-serif;
          color: #fff;
          padding: 36px 20px 12px; /* reduce bottom padding so footer sits closer */
        }

        .container {
          width: 100%;
          max-width: 700px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 35px;
          text-align: center;
        }

        h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
        }

        .wheel {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: conic-gradient(
            #FF6B6B, #4ECDC4, #FFE66D, #95E1D3,
            #F38181, #AA96DA, #FCBAD3, #A8E6CF
          );
          border: 12px solid #fff;
          box-shadow: 0 25px 70px rgba(0,0,0,0.5);
          transition: transform 3s cubic-bezier(0.17,0.67,0.12,0.99);
          position: relative;
        }

        .pointer {
          font-size: 3rem;
          margin-top: -20px;
          animation: ${spinning ? "bounce 0.5s infinite" : "none"};
        }

        @keyframes bounce {
          0%,100%{transform:translateY(0);}
          50%{transform:translateY(-15px);}
        }

        .spin-btn {
          padding: 18px 50px;
          font-size: 1.5rem;
          font-weight: 900;
          border-radius: 50px;
          border: none;
          background: linear-gradient(45deg,#FFD700,#FFA500);
          cursor: pointer;
          box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }

        .spin-btn:disabled {
          opacity: 0.7;
        }

        .result-card {
          width: 100%;
          max-width: 520px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(12px);
          border: 2px solid rgba(255,255,255,0.4);
          border-radius: 24px;
          padding: 28px 22px;
        }

        .result-name {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 700;
          margin-bottom: 18px;
          word-break: break-word;
        }

        .result-title {
          background: linear-gradient(45deg,#FFD700,#FFA500);
          padding: 16px 20px;
          border-radius: 18px;
          font-size: clamp(1.2rem, 3vw, 2rem);
          font-weight: 700;
          color: #000;
          word-break: break-word;
          line-height: 1.3;
        }

        .stats {
          width: 100%;
          max-width: 520px;
          background: rgba(255,255,255,0.15);
          border-radius: 20px;
          padding: 18px;
          border: 2px solid rgba(255,255,255,0.3);
        }
      `}</style>

      <div className="container">
        <h1>Spin the Wheel – Class Legends</h1>

        <div className="wheel" style={{ transform: `rotate(${wheelRotation}deg)` }} />
        <div className="pointer">👇</div>

        <button className="spin-btn" onClick={spinWheel} disabled={spinning}>
          {spinning ? "Spinning... 🌀" : "SPIN THE WHEEL"}
        </button>

        {result && (
          <div className="result-card">
            <div className="result-name">{result.name}</div>
            <div className="result-title">{result.title}</div>
          </div>
        )}

        <div className="stats">
          🏆 Titles Awarded: <b>{usedTitles.length}</b> / {allTitles.length} <br />
          👥 Unique Winners: <b>{usedNames.length}</b>
        </div>
      </div>
    </div>
  );
};

export default SpinWheelPage;
