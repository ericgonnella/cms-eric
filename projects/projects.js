// document.addEventListener('DOMContentLoaded', () => {
//   // -------------------------------------------------
//   // 3. Optimized GSAP & SplitType Animation for Target Text Using ScrollTrigger
//   // -------------------------------------------------
//   const target = document.querySelector('#target');
//   if (
//     target &&
//     typeof SplitType !== 'undefined' &&
//     typeof gsap !== 'undefined' &&
//     typeof ScrollTrigger !== 'undefined'
//   ) {
//     const text = new SplitType(target, { types: 'words, chars' });
//     gsap.set(text.chars, { opacity: 0, y: 20 });
//     gsap.to(text.chars, {
//       opacity: 1,
//       y: 0,
//       translateY: '5px', // Avoid layout-affecting changes
//       duration: 7.50,          // Faster animation
//       ease: "power2.out",
//       stagger: 1.50,           // Minimal stagger for fluidity
//       scrollTrigger: {
//         trigger: target,
//         start: "top 80%",
//         toggleActions: "play none none none",
//         once: true,
//       }
//     });
//   } else {
//     console.warn('Either #target is missing or required libraries (SplitType, gsap, ScrollTrigger) are not loaded.');
//   }

//   // -------------------------------------------------
// });
