const heroSlides = Array.from(document.querySelectorAll(".hero-bg-slide"));
let heroSlideIndex = 0;

if (heroSlides.length > 0) {
  heroSlides[0].classList.add("active");

  if (heroSlides.length > 1) {
    setInterval(() => {
      heroSlides[heroSlideIndex].classList.remove("active");
      heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
      heroSlides[heroSlideIndex].classList.add("active");
    }, 4000);
  }
}

function initCarousel(carousel) {
  const viewport = carousel.querySelector(".carousel-viewport");
  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");
  const dotsContainer = carousel.querySelector(".carousel-dots");

  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `${i + 1}枚目を表示`);
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    slides.forEach((slide, i) => {
      if (i === index) return;
      const video = slide.querySelector("video");
      if (video) video.pause();
    });
  }

  function goTo(target) {
    index = (target + slides.length) % slides.length;
    update();
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  let tracking = false;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let pointerId = null;

  viewport.addEventListener("pointerdown", (event) => {
    tracking = true;
    dragging = false;
    startX = event.clientX;
    startY = event.clientY;
    pointerId = event.pointerId;
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!tracking) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!dragging) {
      if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
        dragging = true;
        track.style.transition = "none";
        viewport.setPointerCapture(pointerId);
      } else if (Math.abs(deltaY) > 10) {
        tracking = false;
        return;
      } else {
        return;
      }
    }

    event.preventDefault();
    track.style.transform = `translateX(calc(-${index * 100}% + ${deltaX}px))`;
  });

  function endDrag(event) {
    tracking = false;
    if (!dragging) return;
    dragging = false;
    track.style.transition = "";
    const deltaX = event.clientX - startX;
    if (Math.abs(deltaX) > 50) {
      goTo(deltaX < 0 ? index + 1 : index - 1);
    } else {
      update();
    }
  }

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  update();
}

document.querySelectorAll("[data-carousel]").forEach(initCarousel);

function initCountdown() {
  const daysEl = document.getElementById("cdDays");
  const hoursEl = document.getElementById("cdHours");
  const minutesEl = document.getElementById("cdMinutes");
  const secondsEl = document.getElementById("cdSeconds");
  const captionEl = document.querySelector(".countdown-caption");
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const target = new Date("2026-08-08T12:30:00+09:00").getTime();
  const pad = (n) => String(n).padStart(2, "0");
  let timer = null;

  function update() {
    const diff = target - Date.now();

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      if (captionEl) captionEl.textContent = "集合時刻になりました！";
      if (timer) clearInterval(timer);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    daysEl.textContent = pad(Math.floor(totalSeconds / 86400));
    hoursEl.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    minutesEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    secondsEl.textContent = pad(totalSeconds % 60);
  }

  update();
  timer = setInterval(update, 1000);
}

initCountdown();

function initScrollReveal() {
  const targets = Array.from(document.querySelectorAll(".reveal"));
  if (targets.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const carGroups = new Map();
  targets.forEach((el) => {
    if (!el.classList.contains("car-card")) return;
    const parent = el.parentElement;
    if (!carGroups.has(parent)) carGroups.set(parent, []);
    carGroups.get(parent).push(el);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const group = carGroups.get(el.parentElement);
        const delay = group ? group.indexOf(el) * 0.08 : 0;
        el.style.transitionDelay = `${delay}s`;
        el.classList.add("is-visible");
        observer.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

initScrollReveal();
