import { parseProblemUrl } from "./problemParser.js";
import { findTutorialLink, extractEditorial} from "./editorial.js";




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

    console.log("Extracted editorial:", editorialHtml);
  } catch (error) {
    console.error("Editorial error:", error);
  }
});

document.body.appendChild(button);