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
