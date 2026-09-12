/* ==========================================================================
   PORTFOLIO APP
   All content is loaded dynamically from data/data.json.
   Edit that file to update the site — no need to touch this JS or the HTML.
   ========================================================================== */

/* ---- Inline SVG icons for social links (name -> markup) ---- */
const ICONS = {
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.7 5.4-5.28 5.69.42.36.78 1.08.78 2.18 0 1.57-.02 2.84-.02 3.23 0 .31.21.67.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.5h3.68l-8.04 9.19L24 22.5h-7.4l-5.8-7.58-6.63 7.58H.47l8.6-9.83L0 1.5h7.59l5.25 6.93 6.06-6.93Zm-1.29 18.83h2.04L6.5 3.56H4.3l13.31 16.77Z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm18.29 2H3.7l8.3 6.44L20.3 6ZM3 7.24V18h18V7.24l-8.7 6.75-.61.02L3 7.24Z"/></svg>'
};

/* ---- Small DOM helpers ---- */
const $ = (id) => document.getElementById(id);
const el = (tag, className, html) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
};

/* ==========================================================================
   DATA LOADING
   ========================================================================== */
async function loadData() {
  const response = await fetch('data/data.json');
  if (!response.ok) throw new Error('Could not load data.json');
  return response.json();
}

/* ==========================================================================
   RENDER FUNCTIONS — one per section
   ========================================================================== */
function renderSocials(container, socials) {
  container.innerHTML = '';
  socials.forEach((s) => {
    const link = el('a', '', ICONS[s.icon] || s.name);
    link.href = s.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', s.name);
    container.appendChild(link);
  });
}

function renderHero(hero, siteName) {
  $('heroGreeting').textContent = hero.greeting;
  $('heroName').textContent = hero.name;
  $('heroProfession').textContent = hero.profession;
  $('heroIntro').textContent = hero.intro;
  $('heroImage').src = hero.profileImage;
  $('heroImage').alt = `Photo of ${hero.name}`;
  $('heroResume').href = hero.resumeLink;
  $('navLogo').textContent = siteName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  $('footerLogo').textContent = $('navLogo').textContent;
  renderSocials($('heroSocials'), hero.socials);
  renderSocials($('footerSocials'), hero.socials);
}

function renderAbout(about) {
  $('aboutEyebrow').textContent = about.eyebrow.replace(/^\d+\.\s*/, (m) => m); // keep as-is, CSS adds "//"
  $('aboutEyebrow').textContent = about.eyebrow;
  $('aboutHeading').textContent = about.heading;

  const textWrap = $('aboutText');
  textWrap.innerHTML = '';
  about.paragraphs.forEach((p) => textWrap.appendChild(el('p', '', p)));

  const stats = $('aboutStats');
  stats.innerHTML = '';
  about.highlights.forEach((h) => {
    stats.appendChild(
      el('li', 'reveal', `<span class="stat__value">${h.value}</span><span class="stat__label">${h.label}</span>`)
    );
  });
}

function renderSkills(skills) {
  $('skillsEyebrow').textContent = skills.eyebrow;
  $('skillsHeading').textContent = skills.heading;

  const grid = $('skillsGrid');
  grid.innerHTML = '';
  skills.categories.forEach((cat) => {
    const tags = cat.items.map((item) => `<span class="tag">${item}</span>`).join('');
    grid.appendChild(
      el('div', 'skill-card reveal', `<h3>${cat.name}</h3><div class="skill-card__tags">${tags}</div>`)
    );
  });
}

function renderProjects(projects) {
  $('projectsEyebrow').textContent = projects.eyebrow;
  $('projectsHeading').textContent = projects.heading;

  const grid = $('projectsGrid');
  grid.innerHTML = '';
  projects.items.forEach((p) => {
    const tech = p.technologies.map((t) => `<span class="tag">${t}</span>`).join('');
    const card = el(
      'article',
      'project-card reveal',
      `
      <div class="project-card__image">
        <img src="${p.image}" alt="${p.title} screenshot" loading="lazy" />
      </div>
      <div class="project-card__body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="project-card__tech">${tech}</div>
        <div class="project-card__links">
          <a href="${p.githubLink}" target="_blank" rel="noopener noreferrer">Code</a>
          <a href="${p.liveLink}" target="_blank" rel="noopener noreferrer">Live Demo</a>
        </div>
      </div>
    `
    );
    grid.appendChild(card);
  });
}

function renderExperience(experience) {
  $('experienceEyebrow').textContent = experience.eyebrow;
  $('experienceHeading').textContent = experience.heading;

  const list = $('experienceTimeline');
  list.innerHTML = '';
  experience.items.forEach((job) => {
    const responsibilities = job.responsibilities.map((r) => `<li>${r}</li>`).join('');
    list.appendChild(
      el(
        'div',
        'timeline-item reveal',
        `
        <p class="timeline-item__meta">${job.duration}</p>
        <h3>${job.role}</h3>
        <p class="timeline-item__org">${job.company}</p>
        <p>${job.description}</p>
        <ul>${responsibilities}</ul>
      `
      )
    );
  });
}

function renderEducation(education) {
  $('educationEyebrow').textContent = education.eyebrow;
  $('educationHeading').textContent = education.heading;

  const list = $('educationTimeline');
  list.innerHTML = '';
  education.items.forEach((edu) => {
    list.appendChild(
      el(
        'div',
        'timeline-item reveal',
        `
        <p class="timeline-item__meta">${edu.duration}</p>
        <h3>${edu.degree}</h3>
        <p class="timeline-item__org">${edu.institution}</p>
        <p>${edu.description}</p>
      `
      )
    );
  });
}

function renderContact(contact) {
  $('contactEyebrow').textContent = contact.eyebrow;
  $('contactHeading').textContent = contact.heading;
  $('contactDesc').textContent = contact.description;

  const info = $('contactInfo');
  info.innerHTML = '';
  const rows = [
    ['✉', contact.email],
    ['☎', contact.phone],
    ['⚲', contact.location]
  ];
  rows.forEach(([icon, value]) => {
    info.appendChild(el('li', '', `<span>${icon}</span><span>${value}</span>`));
  });
}

function renderFooter(footer) {
  $('footerText').textContent = footer.text;
  $('footerCopyright').textContent = footer.copyright;
}

/* ==========================================================================
   INTERACTIVITY
   ========================================================================== */

/* Sticky navbar background on scroll */
function initStickyNavbar() {
  const navbar = $('navbar');
  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Mobile hamburger menu */
function initMobileMenu() {
  const toggle = $('navToggle');
  const menu = $('navMenu');

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  });

  menu.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* Highlight active nav link based on scroll position */
function initActiveLinkTracking() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* Back to top button */
function initBackToTop() {
  const btn = $('backToTop');
  window.addEventListener(
    'scroll',
    () => btn.classList.toggle('is-visible', window.scrollY > 500),
    { passive: true }
  );
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* Scroll-reveal animations for cards/items */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((t) => observer.observe(t));
}

/* Contact form — front-end only mock submission */
function initContactForm() {
  const form = $('contactForm');
  const status = $('formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';

    // Simulate a network request. Replace with a real endpoint later.
    setTimeout(() => {
      status.textContent = `Thanks! I'll get back to you soon.`;
      form.reset();
    }, 700);
  });
}

/* Hide the loader once content is ready */
function hideLoader() {
  const loader = $('loader');
  loader.classList.add('is-hidden');
  setTimeout(() => loader.remove(), 500);
}

/* ==========================================================================
   INIT
   ========================================================================== */
async function init() {
  try {
    const data = await loadData();

    renderHero(data.hero, data.site.name);
    renderAbout(data.about);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderExperience(data.experience);
    renderEducation(data.education);
    renderContact(data.contact);
    renderFooter(data.footer);

    initStickyNavbar();
    initMobileMenu();
    initActiveLinkTracking();
    initBackToTop();
    initScrollReveal();
    initContactForm();
  } catch (err) {
    console.error(err);
    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;
        color:#f2f2f5;font-family:'JetBrains Mono',monospace;text-align:center;padding:2rem;">
        <p>⚠ Couldn't load portfolio content.<br>Make sure <code>data/data.json</code> exists and this page is served over HTTP (not opened directly as a file).</p>
      </div>`;
  } finally {
    hideLoader();
  }
}

document.addEventListener('DOMContentLoaded', init);
