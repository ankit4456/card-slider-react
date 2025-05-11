// src/components/CardSlider.js
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "../styles/globals.css";

import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import logo from "../assets/logo.png";

const slides = [
  {
    type: "text",
    title: "New on Sale",
    subtitle: "New York, NY",
  },
  {
    type: "image",
    image: img1,
  },
  {
    type: "image",
    image: img2,
  },
  {
    type: "image",
    image: img3,
  },
  {
    type: "brand",
    logo: logo,
    text: "See full listing in the description",
  },
];

const CardSlider = () => {
  const [current, setCurrent] = useState(0);
  const slideRefs = useRef([]);
  const isAnimating = useRef(false);
  const slideWidthRef = useRef(0);

  useEffect(() => {
    const total = slides.length;
    const duration = 2; // Slightly slower for better rhythm
    const intervalTime = 300;
    const scaleFactor = 0.85; // More pronounced zoom

    // Get slide width
    if (slideRefs.current[0]) {
      slideWidthRef.current = slideRefs.current[0].offsetWidth;
    }
    const slideWidth = slideWidthRef.current;

    slideRefs.current.forEach((slide, idx) => {
      gsap.set(slide, {
        autoAlpha: 1,
        scale: idx === current ? 1 : scaleFactor,
        x: idx === current ? 0 : slideWidth,
        zIndex: idx === current ? 2 : 1,
      });
    });

    const animateSlider = () => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const prev = current;
      const next = (current + 1) % total;

      gsap.timeline({ onComplete: () => (isAnimating.current = false) })
        .to(slideRefs.current[prev], {
          x: -slideWidth,
          scale: scaleFactor, // Zoom out
          zIndex: 0,
          duration: duration,
          ease: "expo.inOut", // More dynamic ease
          autoAlpha: 1, // Ensure it stays visible during transition
        })
        .to(
          slideRefs.current[next],
          {
            x: 0,
            scale: 1, // Zoom in
            zIndex: 2,
            duration: duration,
            ease: "expo.inOut",
            onComplete: () => setCurrent(next),
          },
          "-=" + duration // Start next animation at the same time
        )
        .set(slideRefs.current[(next + 1) % total], { x: slideWidth, scale: scaleFactor, zIndex: 1, autoAlpha: 1 });
    };

    const intervalId = setInterval(animateSlider, intervalTime);

    const handleResize = () => {
      if (slideRefs.current[0]) {
        slideWidthRef.current = slideRefs.current[0].offsetWidth;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, [current]);

  return (
    <div className="slider-container">
      {slides.map((slide, i) => (
        <div
          className="slider-slide"
          key={i}
          ref={(el) => (slideRefs.current[i] = el)}
          style={{ zIndex: i === current ? 2 : 1 }}
        >
          {slide.type === "text" && (
            <div className="text-slide">
              <h1 className="big-title">
                NEW<br />
                ON<br />
                SALE
              </h1>
              <h3 className="small-subtitle">NEW YORK, NY</h3>
            </div>
          )}
          {slide.type === "image" && (
            <img
              src={slide.image}
              alt={`Slide ${i}`}
              className="slider-image"
            />
          )}
          {slide.type === "brand" && (
            <div className="brand-slide">
              <img src={slide.logo} alt="Brand Logo" className="brand-logo" />
              <p className="cta">{slide.text}</p>
            </div>
          )}
        </div>
      ))}
      <div className="slider-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default CardSlider;