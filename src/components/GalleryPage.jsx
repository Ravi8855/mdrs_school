import React, { useState } from 'react';

const GalleryPage = () => {
    const images = [
        "/gallery/img1.jpg",
        "/gallery/img2.jpg",
        "/gallery/img3.jpg",
        "/gallery/img4.jpg",
        "/gallery/img6.jpg",
        "/gallery/img9.jpg",
        "/gallery/img10.jpg",
        "/gallery/img11.jpg",
        "/gallery/img12.jpg",
        "/gallery/img13.jpg",
        "/gallery/img14.jpg",
        "/gallery/33.jpg",
        "/gallery/88.jpg",
        "/gallery/99.jpg"
    ];

    const [selectedImage, setSelectedImage] = useState(null);

    const closeLightbox = () => setSelectedImage(null);

    const downloadImage = (src) => {
        const link = document.createElement('a');
        link.href = src;
        link.download = src.split('/').pop() || 'image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="gallery-page-wrap" style={{
            minHeight: 'auto',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            fontFamily: "'Poppins', sans-serif",
            position: 'relative'
        }}>
            <style>
                {`
                .gallery-page-wrap {
                    padding: clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px) 0;
                }
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
                    transition: box-shadow 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
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
                
                .view-btn {
                    background: black;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    min-height: 44px;
                    border-radius: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    align-items: center;
                    gap: 4px;
                    font-family: 'Poppins', sans-serif;
                    font-size: clamp(1rem, 2.5vw, 1.2rem);
                }

                .view-btn:hover {
                    transform: scale(1.05);
                    background: #333;
                }

                .gallery-card-share {
                    background: rgba(255, 255, 255, 0.5);
                    border: 2px dashed rgba(102, 126, 234, 0.6);
                    border-radius: 20px;
                    padding: 15px;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.08);
                    transition: box-shadow 0.3s ease, border-color 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 0;
                }
                .gallery-card-share:hover {
                    border-color: rgba(102, 126, 234, 0.9);
                    box-shadow: 0 12px 36px rgba(102, 126, 234, 0.15);
                }
                .gallery-share-placeholder {
                    width: 100%;
                    height: 250px;
                    border-radius: 15px;
                    margin-bottom: 15px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 20px;
                    box-sizing: border-box;
                    background: linear-gradient(145deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
                    border: 1px dashed rgba(102, 126, 234, 0.35);
                }
                .gallery-share-title {
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: #4c51a3;
                    text-align: center;
                    margin: 0;
                    font-family: 'Poppins', sans-serif;
                }
                .gallery-share-text {
                    font-size: 0.95rem;
                    color: #64748b;
                    text-align: center;
                    margin: 0;
                    line-height: 1.4;
                    font-family: 'Poppins', sans-serif;
                }
                .share-memory-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    text-decoration: none;
                    font-family: 'Poppins', sans-serif;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .share-memory-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }
                @media (max-width: 768px) {
                    .gallery-share-placeholder { height: 200px; }
                }
                @media (max-width: 480px) {
                    .gallery-share-placeholder { height: 180px; }
                }

                .gallery-header {
                    text-align: center;
                    margin-bottom: clamp(16px, 4vw, 24px);
                    padding: 0 clamp(12px, 3vw, 20px);
                }
                .gallery-title {
                    font-size: clamp(1.75rem, 5vw, 3rem);
                    background: linear-gradient(to right, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0 0 10px 0;
                    font-weight: 700;
                    line-height: 1.2;
                    font-family: 'Poppins', sans-serif;
                    letter-spacing: 0.02em;
                }
                .gallery-desc {
                    color: #666;
                    font-size: clamp(1rem, 2.5vw, 1.3rem);
                    padding: 0 10px;
                    font-family: 'Poppins', sans-serif;
                    line-height: 1.5;
                    font-weight: 500;
                    margin: 0;
                }
                .gallery-grid-wrap {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
                    gap: clamp(16px, 3vw, 25px);
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 clamp(12px, 3vw, 20px);
                }
                @media (max-width: 600px) {
                    .gallery-grid-wrap { gap: 16px; }
                }
                `}
            </style>

            <header className="gallery-header">
                <h1 className="gallery-title">Memories Gallery</h1>
                <p className="gallery-desc">Capturing the best moments of our school life.</p>
            </header>

            <div className="gallery-grid-wrap">
                {images.map((src, index) => (
                    <div key={index} className="gallery-card" style={{ animation: `fadeIn 0.5s ease backwards ${index * 0.1}s` }}>
                        <img src={src} alt={`Memory ${index + 1}`} className="gallery-image" />
                        <button className="view-btn" onClick={() => setSelectedImage(src)}>
                            View Photo
                        </button>
                    </div>
                ))}
                <div className="gallery-card gallery-card-share" style={{ animation: `fadeIn 0.5s ease backwards ${images.length * 0.1}s` }}>
                    <div className="gallery-share-placeholder">
                        <h3 className="gallery-share-title">Share Your Memory </h3>
                        <p className="gallery-share-text">Got a funny school memory? Send it to us!</p>
                    </div>
                    <a href="mailto:ravichalmar@gmail.com" className="share-memory-btn">
                        Share Memory
                    </a>
                </div>
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
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    animation: 'fadeIn 0.3s ease',
                    padding: '20px',
                    boxSizing: 'border-box'
                }} onClick={closeLightbox}>
                    <button style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
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
                        fontWeight: 'bold',
                        zIndex: 1001
                    }} onClick={(e) => { e.stopPropagation(); closeLightbox(); }} aria-label="Close">
                        ✕
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Full View" style={{
                            maxWidth: '100%',
                            maxHeight: '70vh',
                            borderRadius: '10px',
                            boxShadow: '0 0 50px rgba(255,255,255,0.1)',
                            display: 'block'
                        }} />
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button
                                style={{
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontFamily: "'Poppins', sans-serif"
                                }}
                                onClick={closeLightbox}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    background: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontFamily: "'Poppins', sans-serif"
                                }}
                                onClick={() => downloadImage(selectedImage)}
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;