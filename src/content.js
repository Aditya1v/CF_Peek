import { parseProblemUrl } from "./problemParser.js";
import { findTutorialLink, extractEditorial } from "./editorial.js";
import { createEditorialModal } from "./ui.js";

function loadKatexStyles() {
  const link = document.createElement("link");

  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL(
    "dist/katex/katex.min.css"
  );

  document.head.appendChild(link);
}

function createEditorialButton() {
  if (document.getElementById("cf-editorial-button")) {
    return;
  }

  const button = document.createElement("button");

  button.textContent = "Editorial Quick View";
  button.id = "cf-editorial-button";

  button.addEventListener("click", async () => {
    try {
      const problem = parseProblemUrl(window.location.href);
      const tutorialUrl = findTutorialLink();

      if (!tutorialUrl) {
        throw new Error("Tutorial not found");
      }

      const editorialHtml = await extractEditorial(
        tutorialUrl,
        problem.contestId,
        problem.problemIndex
      );

      await createEditorialModal(editorialHtml);
    } catch (error) {
      console.error("Editorial error:", error);
    }
  });

  document.body.appendChild(button);
}

loadKatexStyles();
createEditorialButton();