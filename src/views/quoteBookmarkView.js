"use strict";

import Handlebars from "handlebars/dist/handlebars";
import _ from "lodash";

import templates from "../templates";

function generateQuoteBookmarkMarkup({ quotes }) {
  const quoteBookmarkData = {
    bookmarks: quotes,
  };
  const template = Handlebars.compile(templates.quoteBookmark());
  return template(quoteBookmarkData);
}

function buildQuoteBookmarkView() {
  // Create base parent
  const base = document.createElement("div");
  // Public methods
  const render = (data) => {
    if (!_.isObject(data)) return;
    const quoteBookmarkMarkup = generateQuoteBookmarkMarkup(data);
    base.innerHTML = quoteBookmarkMarkup;
    base.addEventListener("click", (e) => {
      const clicked = e.target.closest("li");
      if (!clicked) return;
      const list = clicked.querySelector(".item__list");
      list.classList.toggle("hide");
    });
  };
  // Public API
  const publicApi = {
    render,
    base,
  };
  return publicApi;
}

export default buildQuoteBookmarkView;
