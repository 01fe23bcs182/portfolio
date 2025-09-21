/* === EDIT THESE FIELDS ===
   Replace with your own email address / EmailJS info later.
*/
const SITE_OWNER_EMAIL = 'aarav@example.com'; // shown by mailto fallback

// tiny helper
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

/* THEME TOGGLER */
const toggleBtn = $('#themeToggle');
const root = document.documentElement;
function setTheme(t){
  if(t === 'dark') root.setAttribute('data-theme','dark');
  else root.removeAttribute('data-theme');
  toggleBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', t);
}
const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(saved);
toggleBtn.addEventListener('click', () => {
  const cur = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  setTheme(cur === 'dark' ? 'light' : 'dark');
});

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href === '#') return;
    const el = document.querySelector(href);
    if(!el) return;
    e.preventDefault();
    el.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* REVEAL ON SCROLL */
const revealEls = $$('.fade-in');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('show'); io.unobserve(entry.target);}
  });
}, {threshold: 0.12});
revealEls.forEach(el => io.observe(el));

/* SKILLS PROGRESS */
document.querySelectorAll('.card').forEach(c=>{
  const iEls = c.querySelectorAll('i[data-width]');
  if(!iEls.length) return;
  const ob = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        iEls.forEach(i=>{
          const to = i.getAttribute('data-width');
          i.style.width = to + '%';
        });
        ob.unobserve(e.target);
      }
    });
  }, {threshold: 0.2});
  ob.observe(c);
});

/* COUNTERS */
$$('[data-counter]').forEach(c=>{
  const end = +c.getAttribute('data-counter');
  let cur = 0;
  const step = Math.max(1, Math.floor(end / 40));
  const run = ()=> {
    cur += step;
    if(cur >= end){ c.textContent = end; return; }
    c.textContent = cur;
    requestAnimationFrame(run);
  };
  const co = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ run(); co.unobserve(e.target); }
    });
  }, {threshold:0.2});
  co.observe(c);
});

/* PROJECT MODAL */
const modal = $('#modalBackdrop');
const modalTitle = $('#modalTitle');
const modalDesc = $('#modalDesc');
const modalImg = $('#modalImg');
const modalLive = $('#modalLive');
const modalCode = $('#modalCode');

$$('.project').forEach(card=>{
  card.addEventListener('click', ()=>{
    const title = card.dataset.title;
    const desc = card.dataset.desc;
    const img = card.dataset.img;
    const live = card.dataset.live || '#';
    const code = card.dataset.code || '#';
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalImg.src = img;
    modalLive.href = live;
    modalCode.href = code;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden','false');
  });
  card.addEventListener('keydown', e=>{
    if(e.key === 'Enter') card.click();
  })
});
$('#closeModal').addEventListener('click', ()=>{ modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); });
modal.addEventListener('click', e=>{ if(e.target === modal) { modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); }});

/* CONTACT FORM - EMAILJS INTEGRATION (client-side)
   1) Sign up at https://www.emailjs.com/
   2) Create an email service + email template
   3) Add your user ID, service ID and template ID below
*/
const form = $('#contactForm');
const formStatus = $('#formStatus');

// ======= EmailJS config - EDIT THESE =======
const EMAILJS_USER_ID = 'user_XXXXXXXXXXXX';   // EmailJS user ID
const EMAILJS_SERVICE_ID = 'service_xxx';     // EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'template_xxx';   // EmailJS template ID
// ==========================================

form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const message = $('#message').value.trim();

  if(!EMAILJS_USER_ID || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID){
    // fallback: open mail client
    const subject = encodeURIComponent('Portfolio contact from ' + name);
    const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = `mailto:${SITE_OWNER_EMAIL}?subject=${subject}&body=${body}`;
    return;
  }

  formStatus.textContent = 'Sending…';

  try{
    // EmailJS v3 SDK (we will load it via script tag dynamically)
    if(!window.emailjs){
      await new Promise((res, rej)=>{
        const s = document.createElement('script');
        s.src = 'https://cdn.emailjs.com/sdk/2.3.2/email.min.js';
        s.onload = ()=> res();
        s.onerror = ()=> rej(new Error('Failed to load EmailJS'));
        document.head.appendChild(s);
      });
      window.emailjs.init(EMAILJS_USER_ID);
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message
    };

    const resp = await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    formStatus.textContent = 'Message sent — thank you!';
    form.reset();
  }catch(err){
    console.error(err);
    formStatus.textContent = 'Failed to send — try the mail link.';
  }
});

/* YEAR */
document.getElementById('yr').textContent = new Date().getFullYear();

/* keyboard 't' toggles theme */
window.addEventListener('keydown', (e)=> { if(e.key === 't') toggleBtn.click(); });

/* respect reduced motion */
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  $$('.blob').forEach(b=> b.style.animation = 'none');
}
