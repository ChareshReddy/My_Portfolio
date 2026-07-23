import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollReveal Component
 * Wraps content and applies smooth GSAP ScrollTrigger fade-and-slide entry reveals.
 * Bypasses animations automatically if prefers-reduced-motion is active.
 */
export default function ScrollReveal({ 
  children, 
  className = '', 
  stagger = 0.1, 
  delay = 0, 
  yOffset = 30,
  triggerHook = "85%" // triggers when top of component hits 85% viewport height
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) {
      // Instantly visible for accessibility/reduced motion
      if (containerRef.current) {
        gsap.set(containerRef.current.children, { opacity: 1, y: 0 });
      }
      return;
    }

    const targets = Array.from(containerRef.current.children);
    if (targets.length === 0) return;

    // Prepare initial state
    gsap.set(targets, { opacity: 0, y: yOffset });

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: stagger,
        delay: delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: `top ${triggerHook}`,
          toggleActions: 'play none none none', // Trigger once on scroll down
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stagger, delay, yOffset, triggerHook]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
