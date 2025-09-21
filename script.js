// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Dark mode toggle
const toggle = document.getElementById("dark-toggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Simple typewriter effect
const text = ["Frontend Developer 🚀", "UI Designer 🎨", "Tech Enthusiast 💡"];
let i = 0, j = 0, current = "", isDeleting = false;

function type() {
  if (i < text.length) {
    if (!isDeleting && j <= text[i].length) {
      current = text[i].substring(0, j++);
    } else if (isDeleting && j >= 0) {
      current = text[i].substring(0, j--);
    }
    document.getElementById("typed-text").innerHTML = current;

    if (j === text[i].length) {
      isDeleting = true;
      setTimeout(type, 1000);
      return;
    } else if (isDeleting && j === 0) {
      isDeleting = false;
      i++;
      if (i === text.length) i = 0;
    }
    setTimeout(type, isDeleting ? 100 : 150);
  }
}
type();
