import { parseProblemUrl } from "./problemParser.js";
import { findTutorialLink } from "./editorial.js";

const button = document.createElement("button");

button.textContent = "Editorial Quick View";
button.id = "cf-editorial-button";

button.addEventListener("click", () => {
  const problem = parseProblemUrl(window.location.href);
  const tutorialUrl = findTutorialLink();

  console.log("Current problem:", problem);
  console.log("Tutorial URL:", tutorialUrl);
});

document.body.appendChild(button);