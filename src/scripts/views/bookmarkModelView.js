"use strict";

import Handlebars from "handlebars/dist/handlebars.js";
import _ from "lodash";

import sources from "../sources.js";

export default function buildBookmarkModelView() {
  // Creating base parent
  const base = document.createElement("div");
  // Private methods
  const generateModelsMarkup = ({ models }) => {
    const bookmarkModelData = {
      bookmarks: models,
    };
    const template = Handlebars.compile(sources.bookmarkModel());
    return template(bookmarkModelData);
  };
  // Public methods
  const render = function (data) {
    if (!_.isObject(data)) return;
    const bookmarkModelMarkup = generateModelsMarkup(data);
    base.innerHTML = bookmarkModelMarkup;
  };
  // Add event handler
  const addHandlerClick = function (handler) {
    if (base.getAttribute("data-event-click") !== "true") {
      base.setAttribute("data-event-click", "true");
      base.addEventListener("click", function (e) {
        const clicked = e.target.closest("li");
        if (!clicked) return;
        const data = clicked.getAttribute("data-title");
        handler(data);
      });
    }
  };
  // Public API
  const publicApi = {
    render,
    addHandlerClick,
    base,
  };
  return publicApi;
}
