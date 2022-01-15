"use strict";

import Handlebars from "handlebars/dist/handlebars.js";
import _ from "lodash";

import sources from "../sources.js";

export default function buildQuoteView() {
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
  // Append children to base parent
  base.appendChild(iconEl);
  base.appendChild(quoteLbl);
  base.appendChild(authorLbl);
  // Private methods
  const generateQuoteMarkup = ({ text, author }) => {
    const quoteInput = { text, author };
    const template = Handlebars.compile(sources.quote());
    return template(quoteInput);
  };
  const clear = () => (base.innerHTML = "");
  // Public methods
  const render = function (data) {
    if (!_.isObject(data)) return;
    const quoteMarkup = generateQuoteMarkup(data);
    clear();
    base.innerHTML = quoteMarkup;
  };
  // TODO Bookmark quote
  // const addHandlerClick = function (handler) {
  //   parentEl.addEventListener("click", function (e) {
  //     const clicked = e.target.closest(".gg-bookmarks");
  //     if (!clicked) return;
  //   });
  // };
  // Public API
  const publicApi = {
    render,
    base,
  };
  return publicApi;
}
