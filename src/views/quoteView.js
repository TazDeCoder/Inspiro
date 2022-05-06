"use strict";

import Handlebars from "handlebars/dist/handlebars";
import _ from "lodash";

import templates from "../templates";

let bookmarkText, bookmarkAuthor;

function generateQuoteMarkup({ text, author }) {
  const quoteInput = { text, author };
  [bookmarkText, bookmarkAuthor] = [text, author];
  const template = Handlebars.compile(templates.quote());
  return template(quoteInput);
}

function buildQuoteView() {
  // Create base parent
  const base = document.createElement("div");
  base.classList.add("content__container--top");
  // Create icon element
  const iconEl = document.createElement("i");
  iconEl.classList.add("content__container-icon--bookmark,gg-bookmark");
  iconEl.setAttribute("title", "Add to quotes");
  // Create quote label
  const quoteLbl = document.createElement("q");
  quoteLbl.classList.add("container__label", "container__label--quote");
  // Create author label
  const authorLbl = document.createElement("p");
  authorLbl.classList.add("container__label", "container__label--author");
  // Add children to base parent
  base.appendChild(iconEl);
  base.appendChild(quoteLbl);
  base.appendChild(authorLbl);
  // Private methods
  const clear = () => (base.innerHTML = "");
  // Public methods
  const render = (data) => {
    if (!_.isObject(data)) return;
    const quoteMarkup = generateQuoteMarkup(data);
    clear();
    base.innerHTML = quoteMarkup;
  };
  // Add handler functions
  const addHandlerToggle = (handler) => {
    if (base.getAttribute("data-event-click") !== "true") {
      base.setAttribute("data-event-click", "true");
      base.addEventListener("click", (e) => {
        const clicked = e.target.closest(".gg-bookmark");
        if (!clicked) return;
        clicked.classList.toggle("bookmark--active");
        const data = {
          text: bookmarkText,
          author: bookmarkAuthor,
        };
        handler(data);
      });
    }
  };
  // Public API
  const publicApi = {
    render,
    addHandlerToggle,
    base,
  };
  return publicApi;
}

export default buildQuoteView;
