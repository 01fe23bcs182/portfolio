// Smooth scroll for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetID = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetID);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// Example simple animation using GSAP (if included)
if (typeof gsap !== 'undefined') {
  gsap.from('header', { duration: 1, y: -100, opacity: 0, ease: 'bounce' });
  gsap.from('section', { duration: 1, opacity: 0, stagger: 0.3, delay: 0.5 });
}
