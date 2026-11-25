const galleryImages = [
  { file: "Imagem 1.jpeg", title: "Compartilhe. Dê visibilidade.", category: "rede", label: "A rede" },
  { file: "Imagem 2.jpeg", title: "Uma cidade acolhedora começa pelas pessoas", category: "rede", label: "A rede" },
  { file: "Imagem 3.jpeg", title: "Mais acesso, respeito e pertencimento", category: "rede", label: "A rede" },
  { file: "Imagem 4.jpeg", title: "Uma rede para conectar, amplificar e acolher", category: "rede", label: "A rede" },
  { file: "Imagem 5.jpeg", title: "O problema não é existir. É não ser acolhido.", category: "rede", label: "A rede" },
  { file: "Imagem 6.jpeg", title: "Desafios que ainda precisam ser enfrentados", category: "rede", label: "A rede" },
  { file: "Imagem 7.jpeg", title: "Uma cidade pode excluir ou acolher", category: "rede", label: "A rede" },
  { file: "Imagem 8.jpeg", title: "Um convite à escuta, ao acolhimento e à troca", category: "encontro", label: "Encontro" },
  { file: "Imagem 9.jpeg", title: "Convite para a roda de conversa", category: "encontro", label: "Encontro" },
  { file: "Imagem 10.jpeg", title: "Vamos juntos nessa?", category: "informacao", label: "Informação" },
  { file: "Imagem 11.jpeg", title: "Por que isso importa?", category: "informacao", label: "Informação" },
  { file: "Imagem 12.jpeg", title: "Nome social e pronomes", category: "informacao", label: "Informação" },
  { file: "Imagem 13.jpeg", title: "Termos importantes", category: "informacao", label: "Informação" },
  { file: "Imagem 14.jpeg", title: "Identidade de gênero: um resumo", category: "informacao", label: "Informação" },
  { file: "Imagem 15.jpeg", title: "O que é ser trans?", category: "informacao", label: "Informação" },
  { file: "Imagem 16.jpeg", title: "O que é ser cis?", category: "informacao", label: "Informação" },
  { file: "Imagem 17.jpeg", title: "Você sabe a diferença entre cis e trans?", category: "informacao", label: "Informação" }
];

const gallery = document.querySelector("#gallery-grid");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxCount = document.querySelector(".lightbox-count");
const previousButton = document.querySelector(".lightbox-previous");
const nextButton = document.querySelector(".lightbox-next");
const closeButton = document.querySelector(".lightbox-close");
let visibleImages = galleryImages;
let currentImageIndex = 0;
let lastFocusedElement = null;

function renderGallery(images) {
  visibleImages = images;
  gallery.replaceChildren();

  images.forEach((image, index) => {
    const card = document.createElement("article");
    card.className = "gallery-card";

    const openButton = document.createElement("button");
    openButton.className = "gallery-open";
    openButton.type = "button";
    openButton.setAttribute("aria-label", `Ampliar imagem: ${image.title}`);
    openButton.addEventListener("click", () => openLightbox(index));

    const thumbnail = document.createElement("img");
    thumbnail.src = image.file;
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    thumbnail.decoding = "async";

    const zoomIcon = document.createElement("span");
    zoomIcon.className = "gallery-zoom";
    zoomIcon.setAttribute("aria-hidden", "true");
    zoomIcon.textContent = "↗";
    openButton.append(thumbnail, zoomIcon);

    const meta = document.createElement("div");
    meta.className = "gallery-meta";
    const title = document.createElement("h3");
    title.textContent = image.title;
    const label = document.createElement("span");
    label.className = "gallery-tag";
    label.textContent = image.label;
    meta.append(title, label);
    card.append(openButton, meta);
    gallery.append(card);
  });
}

function updateLightbox() {
  const image = visibleImages[currentImageIndex];
  if (!image) return;

  lightboxImage.src = image.file;
  lightboxImage.alt = image.title;
  lightboxCaption.textContent = image.title;
  lightboxCount.textContent = `${currentImageIndex + 1} de ${visibleImages.length}`;
  previousButton.disabled = visibleImages.length < 2;
  nextButton.disabled = visibleImages.length < 2;
}

function openLightbox(index) {
  currentImageIndex = index;
  lastFocusedElement = document.activeElement;
  updateLightbox();
  lightbox.showModal();
  closeButton.focus();
}

function closeLightbox() {
  lightbox.close();
}

function moveLightbox(direction) {
  if (visibleImages.length < 2) return;
  currentImageIndex = (currentImageIndex + direction + visibleImages.length) % visibleImages.length;
  updateLightbox();
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    const filteredImages = filter === "all"
      ? galleryImages
      : galleryImages.filter((image) => image.category === filter);

    document.querySelectorAll(".filter-button").forEach((filterButton) => {
      const active = filterButton === button;
      filterButton.classList.toggle("is-active", active);
      filterButton.setAttribute("aria-pressed", String(active));
    });

    renderGallery(filteredImages);
  });
});

previousButton.addEventListener("click", () => moveLightbox(-1));
nextButton.addEventListener("click", () => moveLightbox(1));
closeButton.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("close", () => {
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  navigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
  if (window.innerWidth > 640) closeMenu();
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

renderGallery(galleryImages);
