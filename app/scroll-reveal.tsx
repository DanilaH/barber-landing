"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";

type RevealVariant = "fade-up" | "fade-left" | "fade-right";
type RevealDelay = 0 | 100 | 180;

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: RevealDelay;
};

export default function ScrollReveal({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;

    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const isAlreadyVisible =
      rect.top < window.innerHeight - 48 && rect.bottom > 0;

    if (isAlreadyVisible) {
      return;
    }

    element.classList.add("is-prepared");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -48px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal scroll-reveal--${variant} scroll-reveal--delay-${delay} ${className}`}
    >
      {children}
    </div>
  );
}