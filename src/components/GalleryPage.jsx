import React, { useState } from 'react';

const GalleryPage = () => {
    const images = [
        { src: "/gallery/img1.jpg", hidden: true },
        { src: "/gallery/img2.jpg", hidden: true },
        { src: "/gallery/img3.jpg", hidden: true },
        { src: "/gallery/img4.jpg", hidden: true },
        { src: "/gallery/img6.jpg", hidden: true },
        { src: "/gallery/img7.jpg", hidden: true },
        { src: "/gallery/img8.jpg", hidden: true },
        { src: "/gallery/img9.jpg", hidden: true },
        { src: "/gallery/img10.jpg", hidden: true },
        { src: "/gallery/img11.jpg", hidden: true },
        { src: "/gallery/img12.jpg", hidden: true },
        { src: "/gallery/img13.jpg", hidden: true },
        { src: "/gallery/img14.jpg", hidden: true }
    ];

    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div style={{
            minHeight: '100vh',
            padding: '40px 20px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            fontFamily: "'Poppins', sans-serif",
            position: 'relative'
        }}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap');
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .gallery-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 20px;
                    padding: 15px;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .gallery-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 45px rgba(0,0,0,0.1);
                }

                .gallery-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 45px rgba(0,0,0,0.1);
                }

                .gallery-image {
                    width: 100%;
                    height: 250px;
                    object-fit: cover;
                    border-radius: 15px;
                    margin-bottom: 15px;
                }
                
                @media (max-width: 768px) {
                    .gallery-image {
                        height: 200px;
                    }
                }
                
                @media (max-width: 480px) {
                    .gallery-image {
                        height: 180px;
                    }
                }
                
                .hidden-placeholder {
                    width: 100%;
                    height: 250px;
                    border-radius: 15px;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #dfe6e9;
                    color: #636e72;
                    font-size: 1.2rem;
                    font-weight: bold;
                    flex-direction: column;
                    font-family: 'Poppins', sans-serif;
                    line-height: 1.4;
                }
                
                @media (max-width: 768px) {
                    .hidden-placeholder {
                        height: 200px;
                        font-size: 1.1rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .hidden-placeholder {
                        height: 180px;
                        font-size: 1rem;
                    }
                }

                .view-btn {
                    background: black;
                    color: white;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'Poppins', sans-serif;
                    font-size: 1rem;
                }

                .view-btn:hover {
                    transform: scale(1.05);
                    background: #333;
                }
                `}
            </style>

            <header style={{ textAlign: 'center', marginBottom: '40px', padding: '0 15px' }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    background: 'linear-gradient(to right, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '10px',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    fontFamily: 'Poppins, sans-serif',
                    letterSpacing: '0.5px'
                }}>
                    Memories Gallery 📸
                </h1>
                <p style={{ color: '#666', fontSize: '1.3rem', padding: '0 10px', fontFamily: 'Poppins, sans-serif', lineHeight: '1.5', fontWeight: '500' }}>Capturing the best moments of our school life.</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '25px',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 15px'
            }} className="responsive-grid">
                {images.map((img, index) => (
                    <div key={index} className="gallery-card" style={{ animation: `fadeIn 0.5s ease backwards ${index * 0.1}s` }}>
                        {img.hidden ? (
                            <div className="hidden-placeholder">
                                <span style={{ fontSize: '3rem', marginBottom: '10px' }}></span>
                                <span>Surprise Memory</span>
                            </div>
                        ) : (
                            <img src={img.src} alt={`Memory ${index + 1}`} className="gallery-image" />
                        )}
                        <button className="view-btn" onClick={() => setSelectedImage(img.src)}>
                            View Photo 👁️
                        </button>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    animation: 'fadeIn 0.3s ease'
                }} onClick={() => setSelectedImage(null)}>
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
                        <img src={selectedImage} alt="Full View" style={{
                            maxWidth: '100%',
                            maxHeight: '90vh',
                            borderRadius: '10px',
                            boxShadow: '0 0 50px rgba(255,255,255,0.1)'
                        }} />
                        <button style={{
                            position: 'absolute',
                            top: '-40px',
                            right: '-40px',
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                        }} onClick={() => setSelectedImage(null)}>
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
