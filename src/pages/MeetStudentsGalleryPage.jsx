import React, { useState, useEffect, useCallback, useMemo } from "react";

import { createPortal } from "react-dom";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import "./MeetStudentsGalleryPage.css";



const M_GALLERY_IMAGES = Array.from({ length: 12 }, (_, i) => `/gallery/m${i + 1}.jpg`);

const GALLERY_LEN = M_GALLERY_IMAGES.length;



const PAGE_TITLE = "Meet our seniors & juniors";

const PAGE_SUBTITLE =

  "Older and younger schoolmates in one place — tap a photo to view it full screen.";



export default function MeetStudentsGalleryPage() {

  const reduceMotion = useReducedMotion();

  const [selectedImage, setSelectedImage] = useState(null);

  const [thumbLoaded, setThumbLoaded] = useState(() => new Set());



  const closeViewer = useCallback(() => setSelectedImage(null), []);



  const viewerTransition = useMemo(

    () => (reduceMotion ? { duration: 0.01 } : { duration: 0.26, ease: [0.16, 1, 0.3, 1] }),

    [reduceMotion]

  );

  const frameTransition = useMemo(

    () => (reduceMotion ? { duration: 0.01 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }),

    [reduceMotion]

  );

  const closeBtnTransition = useMemo(

    () => (reduceMotion ? { duration: 0.01 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }),

    [reduceMotion]

  );

  const cancelBtnTransition = useMemo(

    () => (reduceMotion ? { duration: 0.01 } : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }),

    [reduceMotion]

  );



  useEffect(() => {

    if (!selectedImage) return undefined;

    const onKey = (e) => {

      if (e.key === "Escape") {

        e.preventDefault();

        closeViewer();

      }

    };

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);

  }, [selectedImage, closeViewer]);



  useEffect(() => {

    if (!selectedImage) return undefined;

    const prev = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {

      document.body.style.overflow = prev;

    };

  }, [selectedImage]);



  const markThumbLoaded = useCallback((index) => {

    setThumbLoaded((prev) => {

      if (prev.has(index)) return prev;

      const next = new Set(prev);

      next.add(index);

      return next;

    });

  }, []);



  /** Cached images are often complete before `onLoad` runs; still reveal the thumb. */

  const thumbRef = useCallback(

    (img, index) => {

      if (!img || typeof index !== "number") return;

      if (img.complete && img.naturalWidth > 0) markThumbLoaded(index);

    },

    [markThumbLoaded]

  );



  return (

    <div className="page-wrap meet-students-gallery">

      <header className="meet-students-gallery__header">

        <h1 className="meet-students-gallery__title">{PAGE_TITLE}</h1>

        <div className="meet-students-gallery__title-rule" aria-hidden />

        <p className="meet-students-gallery__subtitle">{PAGE_SUBTITLE}</p>

      </header>

      <div className="meet-students-gallery__grid" role="list">

        {M_GALLERY_IMAGES.map((src, i) => (

          <div

            key={src}

            className={`meet-students-gallery__tile${thumbLoaded.has(i) ? " meet-students-gallery__tile--thumb-ready" : ""}`}

            role="listitem"

          >

            <span className="meet-students-gallery__skeleton" aria-hidden />

            <span className="meet-students-gallery__media">

              <button

                type="button"

                className="meet-students-gallery__open-photo"

                onClick={() => setSelectedImage(src)}

                aria-label={`Open photo ${i + 1} of ${GALLERY_LEN} full screen`}

              >

                <img

                  ref={(el) => thumbRef(el, i)}

                  src={src}

                  alt=""

                  loading="lazy"

                  decoding="async"

                  draggable={false}

                  className={`meet-students-gallery__thumb${thumbLoaded.has(i) ? " meet-students-gallery__thumb--loaded" : ""}`}

                  onLoad={() => markThumbLoaded(i)}

                  onError={() => markThumbLoaded(i)}

                />

              </button>

              <span className="meet-students-gallery__gradient" aria-hidden />

            </span>

          </div>

        ))}

      </div>



      {typeof document !== "undefined" &&

        createPortal(

          <AnimatePresence>

            {selectedImage ? (

              <motion.div

                key={selectedImage}

                className="meet-viewer"

                role="dialog"

                aria-modal="true"

                aria-label="Photo viewer"

                initial={{ opacity: 0 }}

                animate={{ opacity: 1 }}

                exit={{ opacity: 0 }}

                transition={viewerTransition}

                onClick={closeViewer}

              >

                <motion.button

                  type="button"

                  className="meet-viewer__close"

                  onClick={(e) => {

                    e.stopPropagation();

                    closeViewer();

                  }}

                  aria-label="Close"

                  initial={{ opacity: 0, scale: 0.9 }}

                  animate={{ opacity: 1, scale: 1 }}

                  exit={{ opacity: 0, scale: 0.9 }}

                  transition={closeBtnTransition}

                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}

                >

                  <span className="meet-viewer__close-icon" aria-hidden>

                    ×

                  </span>

                </motion.button>



                <div className="meet-viewer__center" onClick={(e) => e.stopPropagation()}>

                  <motion.div

                    className="meet-viewer__frame"

                    initial={{ opacity: 0, scale: 0.95 }}

                    animate={{ opacity: 1, scale: 1 }}

                    exit={{ opacity: 0, scale: 0.95 }}

                    transition={frameTransition}

                  >

                    <img

                      src={selectedImage}

                      alt=""

                      className="meet-viewer__img"

                      draggable={false}

                    />

                  </motion.div>

                  <motion.button

                    type="button"

                    className="meet-viewer__cancel"

                    aria-label="Cancel"

                    onClick={(e) => {

                      e.stopPropagation();

                      closeViewer();

                    }}

                    initial={{ opacity: 0, y: 6 }}

                    animate={{ opacity: 1, y: 0 }}

                    exit={{ opacity: 0, y: 6 }}

                    transition={cancelBtnTransition}

                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}

                  >

                    Cancel

                  </motion.button>

                </div>

              </motion.div>

            ) : null}

          </AnimatePresence>,

          document.body

        )}

    </div>

  );

}


