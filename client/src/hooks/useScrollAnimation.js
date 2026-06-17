/**
 * useScrollAnimation.js — Intersection Observer hook for scroll-triggered animations
 *
 * Usage:
 *   import { useScrollAnimation } from '../hooks/useScrollAnimation';
 *   const ref = useScrollAnimation();
 *   <div ref={ref} className="animate-on-scroll">...</div>
 */
import { useEffect, useRef } from 'react';

/**
 * Attaches IntersectionObserver to a container ref.
 * Marks all `.animate-on-scroll` children as `visible` when they enter viewport.
 */
export function useScrollAnimation(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once animated, stop observing
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold || 0.12,
        rootMargin: options.rootMargin || '0px 0px -40px 0px',
      }
    );

    // Observe all children with the animate class
    const targets = el.querySelectorAll('.animate-on-scroll');
    targets.forEach((target) => observer.observe(target));

    // Also observe the container itself if it has the class
    if (el.classList.contains('animate-on-scroll')) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return ref;
}

/**
 * useScrollSection — marks a section as visible when it enters viewport
 * Use this on the section element directly.
 */
export function useScrollSection(sectionRef, threshold = 0.1) {
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate all animate-on-scroll children inside this section
          el.querySelectorAll('.animate-on-scroll').forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 70);
          });
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionRef, threshold]);
}
