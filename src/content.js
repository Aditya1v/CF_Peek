import { parseProblemUrl } from "./problemParser.js";
import {
  EditorialError,
  extractEditorial,
  findTutorialLink,
} from "./editorial.js";
import { openEditorialModal } from "./ui.js";

const BUTTON_ID = "cf-editorial-button";
const KATEX_STYLES_ID = "cf-editorial-katex-styles";

function loadKatexStyles() {
  if (document.getElementById(KATEX_STYLES_ID)) return;

  const link = document.createElement("link");

  link.id = KATEX_STYLES_ID;
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("dist/katex/katex.min.css");

  document.head.appendChild(link);
}

async function showEditorial() {
  const modal = openEditorialModal();

  try {
    const problem = parseProblemUrl(window.location.href);

    modal.setTitle(`Editorial · ${problem.contestId}${problem.problemIndex}`);

    const tutorialUrl = findTutorialLink();

    if (!tutorialUrl) {
      throw new EditorialError(
        "This page has no tutorial link, so the contest probably doesn't have an editorial yet.",
      );
    }

    modal.setSourceLink(tutorialUrl);

    modal.setContent(
      await extractEditorial(
        tutorialUrl,
        problem.contestId,
        problem.problemIndex,
      ),
    );
  } catch (error) {
    console.error("[Editorial Quick View]", error);

    modal.setError(
      error instanceof EditorialError
        ? error.message
        : "Something went wrong while loading the editorial.",
      error.tutorialUrl,
    );
  }
}

function createEditorialButton() {
  if (document.getElementById(BUTTON_ID)) return;

  const button = document.createElement("button");

  button.id = BUTTON_ID;
  button.type = "button";
  button.textContent = "Editorial Quick View";
  button.addEventListener("click", showEditorial);

  document.body.appendChild(button);
}

loadKatexStyles();
createEditorialButton();
