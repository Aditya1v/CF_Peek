const MODAL_ID = "cf-editorial-modal";

let activeModal = null;

function toHttpUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function createLink(href, label) {
  const link = document.createElement("a");

  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;

  return link;
}

/**
 * Opens the editorial modal in its loading state and returns a handle to
 * update it. Only one modal exists at a time.
 */
export function openEditorialModal() {
  activeModal?.close();

  const previouslyFocused = document.activeElement;
  const previousOverflow = document.documentElement.style.overflow;
  let closed = false;

  const overlay = document.createElement("div");

  overlay.id = MODAL_ID;
  overlay.innerHTML = `
    <div class="cf-editorial-backdrop"></div>

    <div class="cf-editorial-dialog" role="dialog" aria-modal="true"
         aria-labelledby="cf-editorial-title">
      <div class="cf-editorial-header">
        <h2 id="cf-editorial-title">Editorial Quick View</h2>

        <div class="cf-editorial-actions">
          <a class="cf-editorial-source" target="_blank"
             rel="noopener noreferrer" hidden>Open full tutorial ↗</a>
          <button type="button" class="cf-editorial-close"
                  aria-label="Close">×</button>
        </div>
      </div>

      <div class="cf-editorial-body" tabindex="-1"></div>
    </div>
  `;

  const dialog = overlay.querySelector(".cf-editorial-dialog");
  const title = overlay.querySelector("#cf-editorial-title");
  const sourceLink = overlay.querySelector(".cf-editorial-source");
  const body = overlay.querySelector(".cf-editorial-body");

  function close() {
    if (closed) return;

    closed = true;
    document.removeEventListener("keydown", onKeyDown, true);
    document.documentElement.style.overflow = previousOverflow;
    overlay.remove();

    if (activeModal === handle) activeModal = null;

    previouslyFocused?.focus?.();
  }

  function trapFocus(event) {
    const focusable = [
      ...dialog.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((element) => !element.hidden);

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = document.activeElement;
    const outside = !dialog.contains(current) || current === body;

    if (event.shiftKey && (current === first || outside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (current === last || outside)) {
      event.preventDefault();
      first.focus();
    }
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      trapFocus(event);
    }
  }

  function toggleSpoiler(titleElement) {
    const spoiler = titleElement.closest(".spoiler");

    if (!spoiler) return;

    const open = spoiler.classList.toggle("cf-open");

    titleElement.setAttribute("aria-expanded", String(open));
  }

  body.addEventListener("click", (event) => {
    const spoilerTitle = event.target.closest(".spoiler-title");

    if (spoilerTitle) toggleSpoiler(spoilerTitle);
  });

  body.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const spoilerTitle = event.target.closest(".spoiler-title");

    if (spoilerTitle) {
      event.preventDefault();
      toggleSpoiler(spoilerTitle);
    }
  });

  overlay.querySelector(".cf-editorial-close").addEventListener("click", close);
  overlay.querySelector(".cf-editorial-backdrop").addEventListener("click", close);
  document.addEventListener("keydown", onKeyDown, true);

  const handle = {
    close,

    setTitle(text) {
      title.textContent = text;
    },

    setSourceLink(url) {
      const href = toHttpUrl(url);

      if (!href) return;

      sourceLink.href = href;
      sourceLink.hidden = false;
    },

    setContent(node) {
      if (closed) return;

      body.removeAttribute("aria-busy");
      body.replaceChildren(node);

      body.querySelectorAll(".spoiler-title").forEach((spoilerTitle) => {
        spoilerTitle.tabIndex = 0;
        spoilerTitle.setAttribute("role", "button");
        spoilerTitle.setAttribute("aria-expanded", "false");
      });

      body.scrollTop = 0;
    },

    setError(message, tutorialUrl = null) {
      if (closed) return;

      const box = document.createElement("div");
      const text = document.createElement("p");

      box.className = "cf-editorial-error";
      box.setAttribute("role", "alert");
      text.textContent = message;
      box.appendChild(text);

      const href = tutorialUrl && toHttpUrl(tutorialUrl);

      if (href) {
        const paragraph = document.createElement("p");

        paragraph.appendChild(createLink(href, "Open the tutorial on Codeforces ↗"));
        box.appendChild(paragraph);
      }

      body.removeAttribute("aria-busy");
      body.replaceChildren(box);
    },
  };

  const loading = document.createElement("div");

  loading.className = "cf-editorial-loading";
  loading.setAttribute("role", "status");
  loading.innerHTML = '<span class="cf-editorial-spinner"></span>';
  loading.append("Loading editorial…");

  body.setAttribute("aria-busy", "true");
  body.appendChild(loading);

  document.documentElement.style.overflow = "hidden";
  document.body.appendChild(overlay);
  body.focus();

  activeModal = handle;

  return handle;
}
