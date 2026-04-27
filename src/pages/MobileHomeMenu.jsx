import React from "react";
import collegeImg from "../assets/college.jpg";
import desaiImg from "../assets/desai.jpg";
import "./mobileHubMenus.css";

export default function MobileHomeMenu() {
  return (
    <section className="mobile-home-hero" aria-label="School home">
      <div className="mobile-home-hero__scene">
        <img
          src={collegeImg}
          alt="MDRS residential school campus"
          className="mobile-home-hero__campus"
          width={1200}
          height={800}
          decoding="async"
          fetchPriority="high"
        />
        <div className="mobile-home-hero__scrim" aria-hidden />
        <div className="mobile-home-hero__vignette" aria-hidden />
        <div className="mobile-home-hero__stack">
          <div className="mobile-home-hero__content">
            <div className="mobile-home-hero__avatar-ring">
              <img
                src={desaiImg}
                alt="Morarji Desai"
                className="mobile-home-hero__avatar"
                width={160}
                height={160}
                decoding="async"
              />
            </div>
            <h1 className="mobile-home-hero__headline">
              Morarji Desai
              <span className="mobile-home-hero__headline-sub">Residential School</span>
            </h1>
            <div className="mobile-home-hero__rule" aria-hidden />
            <address className="mobile-home-hero__tagline">
              Dorigudda Ukkemala, Shahapur, Yadgir Dist — 585309
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}
