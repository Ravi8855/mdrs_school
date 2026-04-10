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
        "/gallery/99.jpg",
        "/gallery/21.jpg",
        "/gallery/22.jpg",
        "/gallery/23.jpg",
        "/gallery/78.jpg",
        "/gallery/2.jpg",
        "/gallery/00.jpg",
        "/gallery/friends.jpg",
       
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
        <div className="gallery-page-wrap">

            <style>{`
                body {
                    margin: 0;
                    font-family: 'Poppins', sans-serif;
                }

                .gallery-page-wrap {
                    padding: 12px;
                    background: #0a0a0a;
                    min-height: 100vh;
                }

                .gallery-title {
                    color: white;
                    text-align: center;
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    letter-spacing: 1px;
                }

                .gallery-grid {
                    display: grid;
                    gap: 8px;
                }

                @media (max-width: 600px) {
                    .gallery-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (min-width: 601px) and (max-width: 1024px) {
                    .gallery-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                @media (min-width: 1025px) {
                    .gallery-grid {
                        grid-template-columns: repeat(5, 1fr);
                    }
                }

                .gallery-card {
                    position: relative;
                    aspect-ratio: 1/1;
                    overflow: hidden;
                    border-radius: 12px;
                    cursor: pointer;
                }

                .gallery-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }

                .gallery-card:hover img {
                    transform: scale(1.1);
                }

                /* 🔥 PREMIUM OVERLAY */
                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background: linear-gradient(
                        to top,
                        rgba(0,0,0,0.7),
                        rgba(0,0,0,0.2)
                    );

                    backdrop-filter: blur(3px);

                    color: white;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-align: center;
                    padding: 10px;

                    opacity: 0;
                    transition: all 0.3s ease;
                    z-index: 2;
                }

                .gallery-card:hover .overlay {
                    opacity: 1;
                }

                /* Memory Share Card Styling */
                .memory-share-card {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 2px dashed #00d4ff;
                }

                .memory-share-card:hover {
                    background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
                    border-color: #00f0ff;
                    box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
                    transform: scale(1.02);
                }

                .memory-share-text {
                    text-align: center;
                    color: #00d4ff;
                    font-weight: 700;
                    padding: 20px;
                    letter-spacing: 0.5px;
                    line-height: 1.4;
                }

                /* Mobile (max-width: 600px) */
                @media (max-width: 600px) {
                    .memory-share-text {
                        font-size: 0.9rem;
                        padding: 15px;
                    }
                }

                /* Tablet (601px - 1024px) */
                @media (min-width: 601px) and (max-width: 1024px) {
                    .memory-share-text {
                        font-size: 1.1rem;
                        padding: 18px;
                    }
                }

                /* Desktop (1025px+) */
                @media (min-width: 1025px) {
                    .memory-share-text {
                        font-size: 1.5rem;
                        padding: 20px;
                    }
                }

                /* Mobile always visible */
                @media (max-width: 768px) {
                    .overlay {
                        opacity: 1;
                        font-size: 0.65rem;
                    }
                }

                /* 🔥 TEXT STYLE */
                .overlay-text {
                    background: rgba(0,0,0,0.5);
                    padding: 6px 10px;
                    border-radius: 8px;
                    backdrop-filter: blur(6px);
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                }

                /* LIGHTBOX */
                .lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.95);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }

                .lightbox img {
                    max-width: 90%;
                    max-height: 70vh;
                    border-radius: 12px;
                    box-shadow: 0 0 30px rgba(255,255,255,0.1);
                }

                .buttons {
                    display: flex;
                    gap: 15px;
                    margin-top: 20px;
                }

                .btn {
                    padding: 10px 18px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    backdrop-filter: blur(10px);
                }

                .cancel-btn {
                    background: rgba(220,38,38,0.8);
                    color: white;
                }

                .download-btn {
                    background: rgba(22,163,74,0.8);
                    color: white;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>

            <h2 className="gallery-title">School Memories</h2>

            <div className="gallery-grid">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="gallery-card"
                        onClick={() => setSelectedImage(src)}
                    >
                        <img src={src} alt={`img-${index}`} />

                        <div className="overlay">
                            <div className="overlay-text">
                                Click to see your memory
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Memory Share Card */}
                <div style={{
                    position: 'relative',
                    aspectRatio: '1/1',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    backgroundColor: '#1a1a2e',
                    border: '2px dashed #00d4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.4s ease',
                }} className="memory-share-card">
                    <div className="memory-share-text">
                        Share your favorite school<br />
                        memories 
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div className="lightbox" onClick={closeLightbox}>
                    
                    <img
                        src={selectedImage}
                        alt="preview"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div className="buttons" onClick={(e) => e.stopPropagation()}>
                        <button className="btn cancel-btn" onClick={closeLightbox}>
                            Cancel
                        </button>

                        <button
                            className="btn download-btn"
                            onClick={() => downloadImage(selectedImage)}
                        >
                            Download
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default GalleryPage;