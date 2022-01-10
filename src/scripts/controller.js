"use strict";

import * as model from "./model.js";
import templates from "./templates.js";
import menuView from "./views/menuView.js";

const contentMain = document.querySelector(".main__content");

// HTML templates
const routes = {
  404: templates.error,
  "/": templates.home,
  "/quotes": templates.bookmark,
  "/models": templates.bookmark,
  "/goals": templates.gallery,
};

function route(evt = window.event) {
  evt.preventDefault();
  window.history.pushState({}, "", evt.target.href);
  handleLocation();
}

function handleLocation() {
  // Get current url pathname
  const pathName = window.location.pathname;
  // Find HTML template based on path
  const htmlTemplate = routes[pathName] || routes[404];
  // Now generate the HTML template markup in "main__content" placeholder
  contentMain.innerHTML = htmlTemplate();
}

function controlTabs(evt) {
  route(evt);
}

function init() {
  // Add event handlers
  menuView.addHandlerClick(controlTabs);
  window.addEventListener("popstate", handleLocation);
  window.addEventListener("load", handleLocation);
}

init();
