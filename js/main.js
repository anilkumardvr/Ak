// AK Photography — shared interactions

document.addEventListener("DOMContentLoaded", () => {
  const yearEls = document.querySelectorAll("[data-year]");
  yearEls.forEach((el) => (el.textContent = new Date().getFullYear()));

  // Lightbox (delegated, works for any .gallery-item rendered later)
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector("img");
    const lbCap = lightbox.querySelector(".lightbox-cap");

    document.body.addEventListener("click", (e) => {
      const item = e.target.closest("[data-lightbox]");
      if (!item) return;
      lbImg.src = item.dataset.full || item.querySelector("img")?.src;
      lbCap.textContent = item.dataset.caption || "";
      lightbox.classList.add("open");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.closest(".lightbox-close")) {
        lightbox.classList.remove("open");
        lbImg.src = "";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        lightbox.classList.remove("open");
        lbImg.src = "";
      }
    });
  }

  // Active nav link highlight
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
});
