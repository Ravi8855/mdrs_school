import React, { useEffect, useState } from 'react';

const dialogues = [
    // Classic English (Boy Sound)
    { text: "This will come in the exam!", pitch: 1.0, rate: 1.0, lang: 'en', gender: 'male' },
    { text: "Stand outside!", pitch: 0.8, rate: 0.9, lang: 'en', gender: 'male' },
    { text: "Is this a class or a fish market?", pitch: 0.9, rate: 1.1, lang: 'en', gender: 'male' },
    { text: "Pin drop silence!", pitch: 0.6, rate: 0.8, lang: 'en', gender: 'male' },

    // Kannada Roasts & Emotional (Girl Sound)
    { text: "yenu ninna kathe?", pitch: 1.2, rate: 1.0, lang: 'kn', gender: 'female' },
    { text: "ninge esht sala helbeku?", pitch: 1.3, rate: 1.1, lang: 'kn', gender: 'female' },
    { text: "Munde baa illi!", pitch: 1.2, rate: 1.2, lang: 'kn', gender: 'female' },
    { text: "Ninge naachike agalva?", pitch: 1.4, rate: 0.9, lang: 'kn', gender: 'female' },
    { text: "Naale parents na karkondu baa!", pitch: 1.1, rate: 0.9, lang: 'kn', gender: 'female' },
    { text: "Danda pinda!", pitch: 1.5, rate: 1.1, lang: 'kn', gender: 'female' },
    { text: "Ninna kayalli yene agalla!", pitch: 1.2, rate: 1.0, lang: 'kn', gender: 'female' },
    { text: "Thale kettidiya?", pitch: 1.4, rate: 1.2, lang: 'kn', gender: 'female' }
];

const TeacherDialogues = () => {
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        // Load voices
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const getVoice = (gender) => {
        if (!voices.length) return null;

        // Simple heuristic to find male/female voices
        // Note: Browser voice names vary wildly. This is a best-effort.
        const lowerVoices = voices.map(v => ({ voice: v, name: v.name.toLowerCase() }));

        if (gender === 'female') {
            return lowerVoices.find(v => v.name.includes('female') || v.name.includes('woman') || v.name.includes('zira') || v.name.includes('google a'))?.voice
                || voices[0];
        } else {
            return lowerVoices.find(v => v.name.includes('male') || v.name.includes('man') || v.name.includes('david'))?.voice
                || voices.find(v => !v.name.includes('female')) // fallback to anything not explicitly female
                || voices[0];
        }
    };

    const playSound = (dialogue) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(dialogue.text);

        // Select Voice
        const targetVoice = getVoice(dialogue.gender);
        if (targetVoice) {
            utterance.voice = targetVoice;
        }

        // Adjust pitch to enforce gender perception if voice selection fails or to enhance it
        // Higher pitch = generally more feminine, Lower = masculine
        utterance.pitch = dialogue.gender === 'female' ? Math.max(dialogue.pitch, 1.2) : Math.min(dialogue.pitch, 0.9);
        utterance.rate = dialogue.rate;

        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="card" style={{
            background: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
            border: '4px solid #000',
            color: 'white',
            position: 'relative',
            overflow: 'visible'
        }}>
            <div style={{
                position: 'absolute',
                top: '-25px',
                left: '-20px',
                background: '#FFD700',
                color: 'black',
                padding: '10px 20px',
                border: '3px solid black',
                borderRadius: '30px',
                fontWeight: '900',
                transform: 'rotate(-10deg)',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
                zIndex: 10
            }}>
                LOUD 🔊
            </div>

            <h2 style={{ textShadow: '2px 2px 0px #000', marginBottom: '10px' }}>📢 Teacher Dialogues 📢</h2>
            <p style={{ marginBottom: '30px', fontWeight: 'bold', opacity: 0.9 }}>
                Click to relive the trauma (Boy 👨 & Girl 👩 Teacher):
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {dialogues.map((d, index) => (
                    <button
                        key={index}
                        onClick={() => playSound(d)}
                        className="dialogue-btn"
                        style={{
                            backgroundColor: 'white',
                            color: '#333',
                            border: '3px solid #000',
                            borderRadius: '20px 20px 20px 0px',
                            padding: '15px 20px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            boxShadow: '6px 6px 0px rgba(0,0,0,0.2)',
                            position: 'relative',
                            transition: 'all 0.1s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            minWidth: '150px'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem', marginRight: '5px' }}>
                            {d.gender === 'male' ? '👨‍🏫' : '👩‍🏫'}
                        </span>
                        "{d.text}"
                    </button>
                ))}
            </div>

            <style>{`
        .dialogue-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 8px 8px 0px rgba(0,0,0,0.3) !important;
          background-color: #FFF9C4 !important;
        }
        .dialogue-btn:active {
          transform: translateY(2px);
          box-shadow: 2px 2px 0px rgba(0,0,0,0.3) !important;
        }
      `}</style>
        </div>
    );
};

export default TeacherDialogues;
