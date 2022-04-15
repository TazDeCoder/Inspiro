"use strict";

import Handlebars from "handlebars/dist/handlebars.js";
import _ from "lodash";

import templates from "../templates.js";

function generateModelBookmarkMarkup({ models }) {
  const modelBookmarkData = {
    bookmarks: models,
  };
  const template = Handlebars.compile(templates.modelBookmark());
  return template(modelBookmarkData);
}

function buildModelBookmarkView() {
  // Create base parent
  const base = document.createElement("div");
  // Public methods
  const render = (data) => {
    if (!_.isObject(data)) return;
    const modelBookmarkMarkup = generateModelBookmarkMarkup(data);
    base.innerHTML = modelBookmarkMarkup;
  };
  // Add handler functions
  const addHandlerClick = (handler) => {
    if (base.getAttribute("data-event-click") !== "true") {
      base.setAttribute("data-event-click", "true");
      base.addEventListener("click", (e) => {
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

export default buildModelBookmarkView;
