"use strict";

import Handlebars from "handlebars/dist/handlebars";
import _ from "lodash";

import templates from "../templates";

let bookmarkTitle, bookmarkImageSrc;

function generateArticleMarkup({ title, imageSrc, pageContents, pageText }) {
  const articleInput = { title, imageSrc, pageContents, pageText };
  [bookmarkTitle, bookmarkImageSrc] = [title, imageSrc];
  const template = Handlebars.compile(templates.article());
  return template(articleInput);
}

function buildArticleView() {
  let iconEl, listEl;
  // Create base parent
  const base = document.createElement("div");
  // Private methods
  const clear = () => (base.innerHTML = "");
  // Add event handlers
  const handleClick = (e) => {
    e.preventDefault();
    const clicked = e.target.closest(".list__item-link");
    if (!clicked) return;
    const hash = clicked.hash.slice(1);
    document.getElementById(hash).scrollIntoView({ behavior: "smooth" });
  };
  // Public methods
  const render = (data) => {
    if (!_.isObject(data)) return;
    const articleMarkup = generateArticleMarkup(data);
    clear();
    base.innerHTML = articleMarkup;
    iconEl = base.querySelector(".head__icon--bookmark");
    listEl = base.querySelector(".head__list");
    listEl.addEventListener("click", handleClick);
  };
  const renderError = () => {
    const markup = `
      <p class="error__label">
        Page couldn't be found, or is missing
      </p>
    `;
    base.innerHTML = markup;
  };
  // Add handler functions
  const addHandlerToggle = (handler) => {
    if (iconEl.getAttribute("data-event-click") !== "true") {
      iconEl.setAttribute("data-event-click", "true");
      iconEl.addEventListener("click", () => {
        iconEl.classList.toggle("bookmark--active");
        const data = {
          name: bookmarkTitle,
          imageSrc: bookmarkImageSrc,
        };
        handler(data);
      });
    }
  };
  // Public API
  const publicApi = {
    render,
    renderError,
    addHandlerToggle,
    base,
  };
  return publicApi;
}

export default buildArticleView;
