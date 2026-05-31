"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowUpRight, Facebook, Instagram, Sparkles, X } from "lucide-react";
import type { PortfolioImage } from "@/lib/images";

type PortfolioExperienceProps = {
  images: PortfolioImage[];
};

type CampaignFrame = PortfolioImage & {
  frameId: string;
};

const roles = ["DIGITAL CREATOR", "CONTENT CREATOR", "VISUAL STORYTELLER"];

const timeline = [
  {
    marker: "01",
    title: "Visual Instinct",
    copy: "A creator shaped by modern culture, atmosphere, and the rhythm of cinematic images."
  },
  {
    marker: "02",
    title: "Content Language",
    copy: "Short-form moments, fashion energy, and visual identity designed to feel immediate."
  },
  {
    marker: "03",
    title: "Digital Presence",
    copy: "A premium personal world built around presence, movement, and memorable frames."
  }
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/_saayarii_/",
    handle: "@_saayarii_",
    icon: Instagram
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/yassin.sayari.50",
    handle: "yassin.sayari.50",
    icon: Facebook
  }
];

function AnimatedWord({
  text,
  className = "",
  delay = 0
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`split-word ${className}`} aria-label={text}>
      {text.split("").map((character, index) => (
        <motion.span
          aria-hidden="true"
          className="split-letter"
          initial={{ y: "110%", opacity: 0, filter: "blur(18px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.9,
            delay: delay + index * 0.035,
            ease: [0.16, 1, 0.3, 1]
          }}
          key={`${text}-${character}-${index}`}
        >
          {character === " " ? "\u00A0" : character}
        </motion.span>
      ))}
    </span>
  );
}

function Loader({ done }: { done: boolean }) {
  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          className="loader-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(18px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="loader-mark"
            initial={{ scale: 0.78, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            YS
          </motion.div>
          <motion.div
            className="loader-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.25, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PhotoLayer({
  image,
  className,
  speed
}: {
  image: PortfolioImage;
  className: string;
  speed: string;
}) {
  return (
    <div className={className} data-parallax data-speed={speed}>
      <img src={image.src} alt={image.alt} draggable="false" />
    </div>
  );
}

export default function PortfolioExperience({ images }: PortfolioExperienceProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [loaderDone, setLoaderDone] = useState(false);
  const [preview, setPreview] = useState<PortfolioImage | null>(null);

  const campaignFrames = useMemo<CampaignFrame[]>(() => {
    if (!images.length) {
      return [];
    }

    const minimumFrames = Math.max(images.length, 8);

    return Array.from({ length: minimumFrames }, (_, index) => ({
      ...images[index % images.length],
      frameId: `${images[index % images.length].id}-${index}`
    }));
  }, [images]);

  const heroFrames = campaignFrames.slice(0, 4);
  const hasImages = images.length > 0;

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoaderDone(true), 1650);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion || !rootRef.current) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        const speed = Number(element.dataset.speed ?? "0.18");
        const trigger = element.closest("section") ?? element;

        gsap.to(element, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          {
            y: 54,
            opacity: 0,
            filter: "blur(22px)"
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%"
            }
          }
        );
      });

      gsap.fromTo(
        ".timeline-progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-wrap",
            start: "top 70%",
            end: "bottom 65%",
            scrub: true
          }
        }
      );
    }, rootRef);

    return () => {
      context.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const root = rootRef.current;

    if (!root || event.pointerType === "touch") {
      return;
    }

    const bounds = root.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    root.style.setProperty("--mx", `${x * 34}px`);
    root.style.setProperty("--my", `${y * 34}px`);
    root.style.setProperty("--rx", `${y * -6}deg`);
    root.style.setProperty("--ry", `${x * 7}deg`);
  }

  function resetPointer() {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    root.style.setProperty("--mx", "0px");
    root.style.setProperty("--my", "0px");
    root.style.setProperty("--rx", "0deg");
    root.style.setProperty("--ry", "0deg");
  }

  return (
    <main
      ref={rootRef}
      className="page-shell bg-obsidian text-champagne"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      style={
        {
          "--mx": "0px",
          "--my": "0px",
          "--rx": "0deg",
          "--ry": "0deg"
        } as CSSProperties
      }
    >
      <Loader done={loaderDone} />
      <div className="grain-layer" />
      <div className="light-sweep" />
      <div className="particle-field" aria-hidden="true">
        {Array.from({ length: 34 }, (_, index) => (
          <span key={`particle-${index}`} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>

      <header className="fixed-nav">
        <a href="#hero" className="nav-mark" aria-label="Yassin Sayari home">
          YS
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#social">Social</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section id="hero" className="hero-section section-panel">
        {hasImages ? (
          <div className="hero-photo-stack" aria-hidden="true">
            {heroFrames[0] ? (
              <PhotoLayer image={heroFrames[0]} className="hero-photo hero-photo-primary" speed="-0.18" />
            ) : null}
            {heroFrames[1] ? (
              <PhotoLayer image={heroFrames[1]} className="hero-photo hero-photo-secondary" speed="0.24" />
            ) : null}
            {heroFrames[2] ? (
              <PhotoLayer image={heroFrames[2]} className="hero-photo hero-photo-tertiary" speed="-0.1" />
            ) : null}
          </div>
        ) : null}

        <div className="hero-vignette" />
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaderDone ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <div className="eyebrow">
            <Sparkles size={17} strokeWidth={1.4} />
            Yassin Sayari
          </div>
          <h1 className="hero-title font-display">
            <AnimatedWord text="YASSIN" delay={1.7} />
            <AnimatedWord text="SAYARI" delay={1.92} />
          </h1>
          <div className="role-stack">
            {roles.map((role, index) => (
              <motion.span
                initial={{ y: 24, opacity: 0, filter: "blur(16px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 2.18 + index * 0.12, duration: 0.8 }}
                key={role}
              >
                {role}
              </motion.span>
            ))}
          </div>
          <div className="hero-actions">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a href={social.href} target="_blank" rel="noreferrer" className="glass-button" key={social.label}>
                  <Icon size={18} strokeWidth={1.45} />
                  {social.label}
                  <ArrowUpRight size={16} strokeWidth={1.35} />
                </a>
              );
            })}
          </div>
        </motion.div>

        <div className="floating-card float-one glass-panel">
          <span>FRAME 01</span>
          <strong>Visual Culture</strong>
        </div>
        <div className="floating-card float-two glass-panel">
          <span>CREATOR MODE</span>
          <strong>Cinematic Identity</strong>
        </div>
        <div className="floating-card float-three glass-panel">
          <span>YS</span>
          <strong>Modern Storytelling</strong>
        </div>
      </section>

      <section id="about" className="about-section section-panel">
        <div className="section-kicker" data-reveal>
          Editorial File
        </div>
        <div className="about-grid">
          <div className="about-copy" data-reveal>
            <h2 className="section-title font-display">WHO IS YASSIN?</h2>
            <p className="reveal-text">
              A young creator passionate about visuals, creativity and modern digital culture.
            </p>
          </div>
          <div className="about-card glass-panel" data-reveal>
            <p>
              Yassin Sayari creates with the eye of a visual storyteller: sharp atmosphere, modern digital rhythm,
              and a sense for moments that feel elevated before they even move.
            </p>
            <div className="about-metrics">
              <span>Visuals</span>
              <span>Culture</span>
              <span>Motion</span>
            </div>
          </div>
        </div>
        {campaignFrames[3] ? (
          <div className="about-photo" data-parallax data-speed="0.2">
            <img src={campaignFrames[3].src} alt={campaignFrames[3].alt} />
          </div>
        ) : null}
      </section>

      <section id="gallery" className="gallery-section section-panel">
        <div className="gallery-heading" data-reveal>
          <span className="section-kicker">Campaign Gallery</span>
          <h2 className="section-title font-display">A VISUAL WORLD IN MOTION</h2>
        </div>
        <div className="gallery-masonry">
          {images.map((image, index) => (
            <motion.button
              className={`gallery-card gallery-card-${(index % 4) + 1}`}
              onClick={() => setPreview(image)}
              whileHover={prefersReducedMotion ? undefined : { y: -12, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="button"
              data-reveal
              key={image.id}
            >
              <img src={image.src} alt={image.alt} loading="lazy" />
              <span className="gallery-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="gallery-shine" />
            </motion.button>
          ))}
        </div>
      </section>

      <section id="social" className="social-section section-panel">
        <div className="section-kicker" data-reveal>
          Social Hub
        </div>
        <h2 className="section-title font-display" data-reveal>
          FLOATING SIGNALS
        </h2>
        <div className="social-grid">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="social-card glass-panel"
                data-reveal
                style={{ "--card-delay": `${index * 120}ms` } as CSSProperties}
                key={social.label}
              >
                <div className="social-icon">
                  <Icon size={30} strokeWidth={1.3} />
                </div>
                <div>
                  <span>{social.label}</span>
                  <strong>{social.handle}</strong>
                </div>
                <ArrowUpRight size={22} strokeWidth={1.25} />
              </a>
            );
          })}
        </div>
      </section>

      <section className="timeline-section section-panel">
        <div className="timeline-intro" data-reveal>
          <span className="section-kicker">Experience Timeline</span>
          <h2 className="section-title font-display">THE MAKING OF A DIGITAL PRESENCE</h2>
        </div>
        <div className="timeline-wrap">
          <div className="timeline-line">
            <span className="timeline-progress" />
          </div>
          {timeline.map((item) => (
            <article className="timeline-item glass-panel" data-reveal key={item.marker}>
              <span>{item.marker}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-section section-panel">
        {campaignFrames[4] ? (
          <div className="quote-photo" data-parallax data-speed="-0.14">
            <img src={campaignFrames[4].src} alt={campaignFrames[4].alt} />
          </div>
        ) : null}
        <div className="quote-overlay" />
        <blockquote className="font-display" data-reveal>
          "Creating moments that feel timeless."
        </blockquote>
      </section>

      <section id="contact" className="contact-section section-panel">
        <div className="contact-inner" data-reveal>
          <span className="section-kicker">Contact</span>
          <h2 className="section-title font-display">LET'S CREATE SOMETHING DIFFERENT.</h2>
          <div className="contact-actions">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a href={social.href} target="_blank" rel="noreferrer" className="contact-button" key={social.label}>
                  <Icon size={20} strokeWidth={1.35} />
                  {social.label}
                  <ArrowUpRight size={17} strokeWidth={1.35} />
                </a>
              );
            })}
          </div>
        </div>
        {campaignFrames[5] ? (
          <div className="contact-photo glass-panel" data-parallax data-speed="0.12">
            <img src={campaignFrames[5].src} alt={campaignFrames[5].alt} />
          </div>
        ) : null}
      </section>

      <AnimatePresence>
        {preview ? (
          <motion.div
            className="preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="preview-frame"
              initial={{ scale: 0.92, opacity: 0, filter: "blur(22px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.96, opacity: 0, filter: "blur(18px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                className="preview-close"
                type="button"
                onClick={() => setPreview(null)}
                aria-label="Close preview"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
              <img src={preview.src} alt={preview.alt} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
