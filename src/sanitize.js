import DOMPurify from "dompurify";

// Editorial HTML comes from a user-written blog post, so it is untrusted.
// It is sanitised before it ever touches the live page.

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
  // Inline styles are dropped; spoiler visibility is handled with CSS classes.
  FORBID_ATTR: ["style"],
  ALLOW_DATA_ATTR: false,
  RETURN_DOM_FRAGMENT: true,
};

/**
 * Sanitises an HTML string and returns a DocumentFragment that is safe to
 * insert into the page. Relative links and images are resolved against
 * `pageUrl` (the URL the HTML was fetched from).
 *
 * @param {string} html
 * @param {string} pageUrl
 * @returns {DocumentFragment}
 */
export function sanitizeHtml(html, pageUrl) {
  baseUrl = pageUrl;

  return purify.sanitize(html, CONFIG);
}
