"use strict";

import Handlebars from "handlebars/dist/handlebars.js";
import _ from "lodash";

import sources from "../sources.js";

export default function buildArticleView() {
  let iconEl, listEl, bookmarkTitle;
  // Creating base parent
  const base = document.createElement("div");
  // Private methods
  const generateArticleMarkup = ({
    title,
    imageSrc,
    pageContents,
    pageText,
  }) => {
    bookmarkTitle = title;
    const articleInput = { title, imageSrc, pageContents, pageText };
    const template = Handlebars.compile(sources.article());
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
    if (!_.isObject(data)) return;
    const articleMarkup = generateArticleMarkup(data);
    clear();
    base.innerHTML = articleMarkup;
    iconEl = base.querySelector(".head__icon--bookmark");
    listEl = base.querySelector(".head__list");
    listEl.addEventListener("click", handleClick);
  };
  const addHandlerToggle = function (handler) {
    iconEl.addEventListener("click", function (e) {
      e.preventDefault();
      const clicked = e.target;
      if (!clicked) return;
      handler(bookmarkTitle);
    });
  };
  // Public API
  const publicApi = {
    render,
    addHandlerToggle,
    base,
  };
  return publicApi;
}
