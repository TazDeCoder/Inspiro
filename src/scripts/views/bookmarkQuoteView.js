"use strict";

import Handlebars from "handlebars/dist/handlebars.js";
import _ from "lodash";

import sources from "../sources.js";

export default function buildBookmarkQuoteView() {
  let listItems;
  // Creating base parent
  const base = document.createElement("div");
  // Private methods
  const generateQuotesMarkup = ({ quotes }) => {
    const bookmarkQuoteData = {
      bookmarks: quotes,
    };
    const template = Handlebars.compile(sources.bookmarkQuote());
    return template(bookmarkQuoteData);
  };
  // Add event handler
  const addHandleToggle = function () {
    base.addEventListener("click", function (e) {
      const clicked = e.target.closest("li");
      if (!clicked) return;
      const list = clicked.querySelector(".item__list");
      list.classList.toggle("hide");
    });
  };
  // Public methods
  const render = function (data) {
    if (!_.isObject(data)) return;
    const bookmarkQuoteMarkup = generateQuotesMarkup(data);
    base.innerHTML = bookmarkQuoteMarkup;
    listItems = base.querySelectorAll(".list__item--group");
    addHandleToggle();
  };
  // Public API
  const publicApi = {
    render,
    base,
  };
  return publicApi;
}
