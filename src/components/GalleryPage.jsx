import React, { useState } from 'react';
import { handleImgError, publicAssetUrl } from '../utils/imageFallback';

/** Paths under `public/gallery/` (avoids 404 storms in WebView / PWA). */
const GalleryPage = () => {
    const images = [
        publicAssetUrl('gallery/00.jpg'),
        publicAssetUrl('gallery/2.jpg'),
        publicAssetUrl('gallery/21.jpg'),
        publicAssetUrl('gallery/22.jpg'),
        publicAssetUrl('gallery/23.jpg'),
        publicAssetUrl('gallery/33.jpg'),
        publicAssetUrl('gallery/78.jpg'),
        publicAssetUrl('gallery/99.jpg'),
        publicAssetUrl('gallery/friends.jpg'),
        publicAssetUrl('gallery/image.jpg'),
        publicAssetUrl('gallery/img1.jpg'),
        publicAssetUrl('gallery/img2.jpg'),
        publicAssetUrl('gallery/img3.jpg'),
        publicAssetUrl('gallery/img4.jpg'),
        publicAssetUrl('gallery/img6.jpg'),
        publicAssetUrl('gallery/img9.jpg'),
        publicAssetUrl('gallery/img10.jpg'),
        publicAssetUrl('gallery/img11.jpg'),
        publicAssetUrl('gallery/img12.jpg'),
        publicAssetUrl('gallery/img13.jpg'),
    ];

    const [selectedImage, setSelectedImage] = useState(null);
    const [revealedImages, setRevealedImages] = useState(() => new Set());

    const closeLightbox = () => setSelectedImage(null);

    const handleCancelLightbox = () => {
        const src = selectedImage;
        setSelectedImage(null);
        if (src != null) {
            setRevealedImages((prev) => {
                const next = new Set(prev);
                next.delete(src);
                return next;
            });
        }
    };

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
                    container-type: inline-size;
                    container-name: gallery;
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
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
                    gap: 10px;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    width: 100%;
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

                .memory-card {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .memory-locked-layer {
                    position: absolute;
                    inset: 0;
                    z-index: 4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    padding: 14px;
                    overflow: hidden;

                    background: linear-gradient(
                        155deg,
                        rgba(30, 58, 95, 0.92) 0%,
                        rgba(21, 94, 117, 0.9) 48%,
                        rgba(14, 116, 144, 0.88) 100%
                    );
                    backdrop-filter: blur(10px) saturate(140%);
                    -webkit-backdrop-filter: blur(10px) saturate(140%);

                    border: 1px solid rgba(103, 232, 249, 0.35);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.15),
                        0 10px 32px rgba(8, 47, 73, 0.35);

                    text-align: center;

                    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                        visibility 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                        box-shadow 0.35s ease;
                    opacity: 1;
                    visibility: visible;
                }

                .memory-locked-layer--revealed {
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                }

                .memory-locked-title {
                    position: relative;
                    z-index: 1;
                    display: block;
                    max-width: 92%;
                    margin: 0 auto;
                    padding: 0 6px;
                    font-weight: 600;
                    font-size: 14px;
                    line-height: 1.4;
                    letter-spacing: 0.01em;
                    color: rgba(240, 253, 255, 0.98);
                    text-shadow: 0 1px 3px rgba(8, 47, 73, 0.45);
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }

                @media (hover: hover) {
                    .gallery-card:hover .memory-locked-layer {
                        box-shadow:
                            inset 0 1px 0 rgba(255, 255, 255, 0.25),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.12),
                            0 12px 40px rgba(6, 78, 117, 0.45),
                            0 0 0 1px rgba(34, 211, 238, 0.2);
                    }
                }

                @media (min-width: 769px) and (max-width: 1024px) {
                    .memory-locked-title {
                        font-size: 13px;
                    }
                }

                @media (max-width: 768px) {
                    .memory-locked-layer {
                        padding: 10px;
                    }
                    .memory-locked-title {
                        font-size: 12px;
                    }
                }
            `}</style>

            <h2 className="gallery-title">School Memories</h2>

            <div className="gallery-grid">
                {images.map((src, index) => (
                    <div
                        key={src}
                        className="gallery-card"
                        onClick={() => {
                            setRevealedImages((prev) => new Set(prev).add(src));
                            setSelectedImage(src);
                        }}
                    >
                        <div className="memory-card">
                            <img
                                src={src}
                                alt={`img-${index}`}
                                decoding="async"
                                loading="eager"
                                fetchPriority={index < 4 ? 'high' : 'auto'}
                                onError={handleImgError}
                            />
                            <div
                                className={`memory-locked-layer${revealedImages.has(src) ? " memory-locked-layer--revealed" : ""}`}
                                aria-hidden={revealedImages.has(src)}
                            >
                                <span className="memory-locked-title">Click to see your memory</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="lightbox" onClick={closeLightbox}>
                    
                    <img
                        key={selectedImage}
                        src={selectedImage}
                        alt="preview"
                        decoding="async"
                        loading="eager"
                        onClick={(e) => e.stopPropagation()}
                        onError={handleImgError}
                    />

                    <div className="buttons" onClick={(e) => e.stopPropagation()}>
                        <button className="btn cancel-btn" onClick={handleCancelLightbox}>
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