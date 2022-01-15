"use strict";

import templates from "../templates.js";

export default function buildArticleView() {
  let listEl;
  // Creating base parent
  const base = document.createElement("div");
  // Private methods
  const generateArticleMarkup = ({
    title,
    imageSrc,
    pageContents,
    pageText,
  }) => {
    const articleInput = { title, imageSrc, pageContents, pageText };
    const template = Handlebars.compile(templates.article());
    return template(articleInput);
  };

  const clear = () => (base.innerHTML = "");
  // Add event handler
  const handleClick = function (e) {
    e.preventDefault();
    const clicked = e.target.closest(".list__item-link");
    if (!clicked) return;
    const hash = clicked.hash.slice(1);
    document.getElementById(hash).scrollIntoView({ behavior: "smooth" });
  };
  // Public methods
  const render = function (data) {
    if (!data || data.length === 0);
    const articleMarkup = generateArticleMarkup(data);
    clear();
    base.innerHTML = articleMarkup;
    listEl = base.querySelector(".head__list");
    listEl.addEventListener("click", handleClick);
  };
  // Public API
  const publicApi = {
    render,
    base,
  };
  return publicApi;
}
