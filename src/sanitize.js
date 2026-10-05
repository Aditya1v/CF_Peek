import DOMPurify from "dompurify";

// Sanitize editorial HTML before adding it to the page.

const purify = DOMPurify(window);

let baseUrl = window.location.href;

function toHttpUrl(value) {
  try {
    const url = new URL(value, baseUrl);

    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

purify.addHook("afterSanitizeAttributes", (node) => {
  if (node.nodeType !== 1) return;

  if (node.nodeName === "A" && node.hasAttribute("href")) {
    const href = toHttpUrl(node.getAttribute("href"));

    if (href) {
      node.setAttribute("href", href);
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    } else {
      node.removeAttribute("href");
    }
  }

  if (node.nodeName === "IMG" && node.hasAttribute("src")) {
    const src = toHttpUrl(node.getAttribute("src"));

    if (src) {
      node.setAttribute("src", src);
      node.setAttribute("loading", "lazy");
    } else {
      node.removeAttribute("src");
    }
  }
});

const CONFIG = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: [
    "style",
    "form",
    "input",
    "button",
    "select",
    "textarea",
    "iframe",
    "object",
    "embed",
    "link",
    "meta",
  ],
  // Remove inline styles and use CSS classes for spoilers.
  FORBID_ATTR: ["style"],
  ALLOW_DATA_ATTR: false,
  RETURN_DOM_FRAGMENT: true,
};

/**
 * Sanitizes the HTML before adding it to the page.
 *
 * @param {string} html
 * @param {string} pageUrl
 * @returns {DocumentFragment}
 */
export function sanitizeHtml(html, pageUrl) {
  baseUrl = pageUrl;

  return purify.sanitize(html, CONFIG);
}
