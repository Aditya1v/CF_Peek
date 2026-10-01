export async function createEditorialModal(editorialHtml) {
  const existing = document.getElementById("cf-editorial-modal");

  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = "cf-editorial-modal";

  overlay.innerHTML = `
    <div class="cf-editorial-backdrop"></div>

    <div class="cf-editorial-dialog">
      <div class="cf-editorial-header">
        <h2>Editorial Quick View</h2>
        <button class="cf-editorial-close" aria-label="Close">
          ×
        </button>
      </div>

      <div class="cf-editorial-body">
        ${editorialHtml}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelectorAll(".spoiler").forEach((spoiler) => {
    const title = spoiler.querySelector(".spoiler-title");
    const content = spoiler.querySelector(".spoiler-content");

    if (!title || !content) return;

    title.style.cursor = "pointer";

    title.addEventListener("click", () => {
      const isHidden = content.style.display === "none";

      content.style.display = isHidden ? "block" : "none";
    });
  });

  const close = () => overlay.remove();

  overlay
    .querySelector(".cf-editorial-close")
    .addEventListener("click", close);

  overlay
    .querySelector(".cf-editorial-backdrop")
    .addEventListener("click", close);

  document.addEventListener("keydown", function handleEscape(event) {
    if (event.key === "Escape") {
      close();
      document.removeEventListener("keydown", handleEscape);
    }
  });
}