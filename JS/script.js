// fade/slide elements in as they scroll into view
const initReveal = () => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );

  items.forEach((item) => observer.observe(item));
};

// open/close the mobile menu
const initNavToggle = () => {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
};

// fade the hero elements in one after another on page load
const initHeroAnim = () => {
  const items = document.querySelectorAll(".hero-anim");
  if (!items.length) return;
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add("in"), 120 + i * 110);
  });
};

// highlight the nav link for the section that's in view
const initScrollspy = () => {
  const nav = document.getElementById("siteNav");
  if (!nav) return;
  const links = [...nav.querySelectorAll("a[href*='#']")];
  const sections = links
    .map((link) => {
      const id = link.getAttribute("href").split("#")[1];
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const match = link.getAttribute("href").endsWith("#" + id);
      link.classList.toggle("active", match);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );
  sections.forEach((s) => observer.observe(s));
};

// show/hide the back-to-top button while scrolling
const initToTop = () => {
  const btn = document.getElementById("toTop");
  if (!btn) return;
  const toggle = () => btn.classList.toggle("visible", window.scrollY > 900);
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

// reveal the HOW I WORK steps one by one once the section is in view
const initHowIWork = () => {
  const section = document.getElementById("howIWork");
  if (!section) return;
  const steps = [...section.querySelectorAll(".how__step, .how__arrow")];
  if (!steps.length) return;

  const play = () => {
    steps.forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), i * 260);
    });
  };

  if (!("IntersectionObserver" in window)) {
    play();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          play();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 },
  );
  observer.observe(section);
};

// makes the EXPERIENCE timeline line "draw" itself in as you scroll
const initTimeline = () => {
  const track = document.getElementById("timelineTrack");
  const path = document.getElementById("timelinePath");
  const svg = document.getElementById("timelineLine");
  if (!track || !path || !svg) return;

  const length = path.getTotalLength();
  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${length}`;

  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = track.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // start drawing a bit before the track reaches the bottom of the screen
    const startOffset = vh * 0.85;
    const progress = (startOffset - rect.top) / rect.height;
    const clamped = Math.min(1, Math.max(0, progress));
    path.style.strokeDashoffset = `${length * (1 - clamped)}`;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener("resize", update);
  window.addEventListener("scroll", onScroll, { passive: true });
  update();
};

initReveal();
initNavToggle();
initHeroAnim();
initScrollspy();
initToTop();
initHowIWork();
initTimeline();
