// Mobile menu
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  links.classList.toggle("is-open", open);
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});
links.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

// If an image can't load, hide it and let the soft placeholder show instead
document.querySelectorAll("img").forEach((img) => {
  const fail = () => { img.style.visibility = "hidden"; };
  if (img.complete && img.naturalWidth === 0) fail();
  img.addEventListener("error", fail);
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Typed role in the hero
const roleEl = document.getElementById("role");
if (roleEl) {
  const roles = ["UI/UX Designer", "ITI Instructor", "Research-driven Designer"];
  if (reduceMotion) {
    roleEl.textContent = "UI/UX Designer & ITI Instructor";
  } else {
    let r = 0, i = roles[0].length, deleting = false;
    const tick = () => {
      const word = roles[r];
      roleEl.textContent = word.slice(0, i);
      let delay = deleting ? 38 : 80;
      if (!deleting && i === word.length) { deleting = true; delay = 1700; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
      else { i += deleting ? -1 : 1; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 1800);
  }
}

// Scroll progress bar
const bar = document.querySelector(".progress i");
if (bar) {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

// Custom cursor + card tilt (mouse devices only)
if (finePointer && !reduceMotion) {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  const label = ring.querySelector("span");
  let x = -100, y = -100, rx = -100, ry = -100;
  document.documentElement.classList.add("has-cursor");

  window.addEventListener("mousemove", (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    const t = e.target;
    const card = t.closest && t.closest(".card");
    const link = t.closest && t.closest("a, button");
    ring.classList.toggle("is-view", !!card);
    ring.classList.toggle("is-link", !!link && !card);
    label.textContent = card ? "View" : "";
  }, { passive: true });
  document.addEventListener("mouseleave", () => { dot.classList.add("is-hidden"); ring.classList.add("is-hidden"); });
  document.addEventListener("mouseenter", () => { dot.classList.remove("is-hidden"); ring.classList.remove("is-hidden"); });

  const follow = () => {
    rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
    ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
    requestAnimationFrame(follow);
  };
  follow();

  document.querySelectorAll(".card").forEach((card) => {
    const img = card.querySelector(".card__img");
    card.addEventListener("mousemove", (e) => {
      const b = card.getBoundingClientRect();
      const px = (e.clientX - b.left) / b.width - 0.5;
      const py = (e.clientY - b.top) / b.height - 0.5;
      img.style.setProperty("--ry", (px * 7).toFixed(2) + "deg");
      img.style.setProperty("--rx", (-py * 7).toFixed(2) + "deg");
    });
    card.addEventListener("mouseleave", () => {
      img.style.setProperty("--ry", "0deg");
      img.style.setProperty("--rx", "0deg");
    });
  });
}

// Reveal on scroll
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add("is-visible"));
}
