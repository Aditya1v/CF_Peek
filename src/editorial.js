/* global renderMathInElement */
import { isSectionHeading, isSectionStart } from "./marker.js";
import { sanitizeHtml } from "./sanitize.js";

const FETCH_TIMEOUT_MS = 15000;

// Codeforces: $$$inline$$$ and $$$$$$display$$$$$$. Longest delimiter first.
const MATH_DELIMITERS = [
  { left: "$$$$$$", right: "$$$$$$", display: true },
  { left: "$$$", right: "$$$", display: false },
];

/** An error whose message is safe and useful to show to the user. */
export class EditorialError extends Error {
  constructor(message, { tutorialUrl = null } = {}) {
    super(message);
    this.name = "EditorialError";
    this.tutorialUrl = tutorialUrl;
  }
}

/**
 * Finds the "Tutorial" link in the page sidebar.
 * Prefers the English version when several languages are listed.
 *
 * @returns {string | null} absolute URL, or null if the page has none
 */
export function findTutorialLink(root = document) {
  const links = [...root.querySelectorAll("a[href]")].filter((link) =>
    /^(tutorial|editorial)\b/i.test(link.textContent.trim()),
  );

  const english = links.find((link) => /\(en\)/i.test(link.textContent));

  return (english ?? links[0])?.href ?? null;
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      credentials: "same-origin",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new EditorialError(
        `Codeforces returned HTTP ${response.status} for the tutorial.`,
        { tutorialUrl: url },
      );
    }

    return { html: await response.text(), url: response.url || url };
  } catch (error) {
    if (error instanceof EditorialError) throw error;

    const message =
      error.name === "AbortError"
        ? "Loading the tutorial timed out."
        : "Couldn't load the tutorial. Check your connection and try again.";

    throw new EditorialError(message, { tutorialUrl: url });
  } finally {
    clearTimeout(timer);
  }
}

// Elements from the heading of the section up to the next problem's heading.
function collectSection(start) {
  const elements = [start];

  for (
    let element = start.nextElementSibling;
    element && !isSectionHeading(element.textContent);
    element = element.nextElementSibling
  ) {
    elements.push(element);
  }

  return elements;
}

function findSection(content, contestId, problemIndex) {
  const headings = [...content.querySelectorAll("p, h1, h2, h3, h4, h5, h6")];
  let best = null;

  for (const heading of headings) {
    if (!isSectionStart(heading.textContent, contestId, problemIndex)) continue;

    const elements = collectSection(heading);
    const size = elements.reduce((sum, el) => sum + el.textContent.length, 0);

    // A table of contents can repeat the heading with no body after it,
    // so keep the candidate with the most text.
    if (!best || size > best.size) best = { elements, size };
  }

  return best?.elements ?? null;
}

function renderMath(container) {
  if (typeof renderMathInElement !== "function") return;

  renderMathInElement(container, {
    delimiters: MATH_DELIMITERS,
    throwOnError: false,
  });
}

const cache = new Map();

/**
 * Fetches the tutorial page and returns the sanitised, math-rendered section
 * for one problem as a DOM element.
 *
 * @returns {Promise<HTMLElement>}
 * @throws {EditorialError}
 */
export async function extractEditorial(tutorialUrl, contestId, problemIndex) {
  const key = `${tutorialUrl}#${contestId}${problemIndex}`;

  if (cache.has(key)) return cache.get(key).cloneNode(true);

  if (new URL(tutorialUrl).origin !== window.location.origin) {
    throw new EditorialError(
      "This tutorial is hosted on another site, so it can't be loaded here.",
      { tutorialUrl },
    );
  }

  const { html, url } = await fetchHtml(tutorialUrl);

  const doc = new DOMParser().parseFromString(html, "text/html");
  const content =
    doc.querySelector(".topic .content") ?? doc.querySelector(".content");

  if (!content) {
    throw new EditorialError("Couldn't find the tutorial text on that page.", {
      tutorialUrl,
    });
  }

  const section = findSection(content, contestId, problemIndex);

  if (!section) {
    throw new EditorialError(
      `The tutorial has no section for problem ${problemIndex}.`,
      { tutorialUrl },
    );
  }

  const container = document.createElement("div");

  container.appendChild(
    sanitizeHtml(section.map((element) => element.outerHTML).join(""), url),
  );
  renderMath(container);

  cache.set(key, container);

  return container.cloneNode(true);
}
