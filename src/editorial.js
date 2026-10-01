// import katex from "katex";

export function findTutorialLink() {
  const links = document.querySelectorAll("a");

  for (const link of links) {
    const text = link.textContent.trim().toLowerCase();

    if (text.startsWith("tutorial")) {
      return link.href;
    }
  }

  return null;
}

function renderMath(container) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  const textNodes = [];
  let node;

  while ((node = walker.nextNode())) {
    if (node.nodeValue.includes("$")) {
      textNodes.push(node);
    }
  }

  for (const textNode of textNodes) {
    const text = textNode.nodeValue;
    const fragment = document.createDocumentFragment();

    let position = 0;
    let changed = false;

    while (position < text.length) {
      const dollarIndex = text.indexOf("$", position);

      // No more math in this text node
      if (dollarIndex === -1) {
        fragment.appendChild(document.createTextNode(text.slice(position)));
        break;
      }

      // Add normal text before the math
      if (dollarIndex > position) {
        fragment.appendChild(
          document.createTextNode(text.slice(position, dollarIndex)),
        );
      }

      // --------------------------------
      // Block math: $$ ... $$
      // --------------------------------
      if (text[dollarIndex + 1] === "$") {
        const closingIndex = text.indexOf("$$", dollarIndex + 2);

        // No closing $$ found → keep the rest as normal text
        if (closingIndex === -1) {
          fragment.appendChild(
            document.createTextNode(text.slice(dollarIndex)),
          );
          break;
        }

        const formula = text.slice(dollarIndex + 2, closingIndex).trim();

        const span = document.createElement("span");

        try {
          window.katex.render(formula, span, {
            displayMode: true,
            throwOnError: false,
          });

          fragment.appendChild(span);
          changed = true;
        } catch (error) {
          console.error("KaTeX block rendering failed:", error);

          fragment.appendChild(
            document.createTextNode(text.slice(dollarIndex, closingIndex + 2)),
          );
        }

        position = closingIndex + 2;
      }

      // Inline math: $ ... $
      else {
        const closingIndex = text.indexOf("$", dollarIndex + 1);

        // No closing $ found → keep the rest as normal text
        if (closingIndex === -1) {
          fragment.appendChild(
            document.createTextNode(text.slice(dollarIndex)),
          );
          break;
        }

        const formula = text.slice(dollarIndex + 1, closingIndex).trim();

        const span = document.createElement("span");

        try {
          window.katex.render(formula, span, {
            displayMode: false,
            throwOnError: false,
          });

          fragment.appendChild(span);
          changed = true;
        } catch (error) {
          console.error("KaTeX inline rendering failed:", error);

          fragment.appendChild(
            document.createTextNode(text.slice(dollarIndex, closingIndex + 1)),
          );
        }

        position = closingIndex + 1;
      }
    }

    if (changed) {
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  }
}

export async function extractEditorial(url, contestId, problemIndex) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch editorial: ${response.status}`);
  }

  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const content = doc.querySelector(".content");

  if (!content) {
    throw new Error("Editorial content container not found");
  }

  const markerPrefix = `${contestId}${problemIndex}`;

  const paragraphs = [...content.querySelectorAll("p")];

  const startMarker = paragraphs.find((p) => {
    const text = p.textContent.trim();

    return text.startsWith(markerPrefix);
  });

  if (!startMarker) {
    throw new Error(`Editorial section for ${problemIndex} not found`);
  }

  const fragment = document.createDocumentFragment();

  let current = startMarker;

  while (current) {
    const text = current.textContent.trim();

    if (current !== startMarker && /^\d+[A-Za-z0-9]+\s*[-–—]/.test(text)) {
      break;
    }

    fragment.appendChild(current.cloneNode(true));
    current = current.nextElementSibling;
  }

  const container = document.createElement("div");
  container.appendChild(fragment);

  // console.log("EDITORIAL QUICK VIEW - KaTeX:", typeof window.katex);
  renderMathInElement(container, {
    delimiters: [
      {
        left: "$$$",
        right: "$$$",
        display: false,
      },
      {
        left: "$$",
        right: "$$",
        display: true,
      },
    ],
    throwOnError: false,
  });

  return container.innerHTML;
}
