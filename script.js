const cards = Array.from(document.querySelectorAll(".card"));
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxVideoNote = document.getElementById("lightboxVideoNote");
const closeBtn = document.getElementById("lightboxClose");
const prevBtn = document.getElementById("lightboxPrev");
const nextBtn = document.getElementById("lightboxNext");

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const card = cards[currentIndex];
  lightboxImage.src = card.dataset.full;
  lightboxImage.alt = card.dataset.caption;
  lightboxCaption.textContent = card.dataset.caption;
  lightboxVideoNote.hidden = card.dataset.type !== "video";
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
}

function showRelative(offset) {
  currentIndex = (currentIndex + offset + cards.length) % cards.length;
  openLightbox(currentIndex);
}

cards.forEach((card, index) => {
  card.addEventListener("click", () => openLightbox(index));
});

closeBtn.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", () => showRelative(-1));
nextBtn.addEventListener("click", () => showRelative(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showRelative(-1);
  if (event.key === "ArrowRight") showRelative(1);
});
