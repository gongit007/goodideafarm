import { useEffect, useState } from "react";
import { heroSlides } from "../data";

const INTERVAL_MS = 4500;

export default function CoverSlides() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;
    const id = window.setInterval(() => {
      setIndex((n) => (n + 1) % heroSlides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const current = heroSlides[index];

  return (
    <figure className="cover-plate">
      <div className="cover-slides" aria-roledescription="carousel" aria-label="농장 사진">
        {heroSlides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={i === index ? slide.alt : ""}
            className={i === index ? "is-on" : ""}
          />
        ))}
      </div>
      <figcaption>
        <span className="cover-slide-no">{String(index + 1).padStart(2, "0")}</span>
        {current.caption}
      </figcaption>
    </figure>
  );
}
