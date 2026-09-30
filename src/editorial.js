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