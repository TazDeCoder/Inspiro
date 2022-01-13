"use strict";

import * as model from "./model.js";
import templates from "./templates.js";
import menuView from "./views/menuView.js";
import searchView from "./views/searchView.js";
import articleView from "./views/articleView.js";
import calanderView from "./views/calendarView.js";

export const contentMain = document.querySelector(".main__content");

// HTML templates
const routes = {
  404: templates.error,
  "/": templates.home,
  "/article": templates.article,
  "/quotes": templates.bookmark,
  "/models": templates.bookmark,
  "/goals": templates.gallery,
};

function route(evt = window.event) {
  evt.preventDefault();
  window.history.pushState({}, "", evt.target.href);
  handleLocation();
}

async function handleLocation() {
  // Get current url pathname
  const pathName = window.location.pathname;
  // Find HTML template based on path
  const htmlTemplate = routes[pathName] || routes[404];
  // Now generate the HTML template markup in placeholder
  contentMain.innerHTML = await htmlTemplate();
  // Render view
  switch (pathName) {
    case "/":
      const date = model.getCurrentDate();
      date.currMonth = model.state.calendar.currMonth + 1;
      calanderView.render(date);
      calanderView.updateHeader(
        model.getCurrentMonth(),
        model.state.calendar.currYear
      );
      calanderView.addHandlerClick(controlCalanderPagination);
      break;
    case "/article":
      if (!model.state.search.query) return;
      const searchResult = await model.getSearchResult(
        model.state.search.query
      );
      articleView.render(searchResult);
      break;
    case "/quotes":
      break;
    case "/models":
      break;
    case "/goals":
      break;
  }
}

function controlMenu(evt) {
  route(evt);
}

async function controlSearch(query) {
  await model.getSearchResult(query);
  window.history.pushState({}, "", "/article");
  handleLocation();
}

function controlCalanderPagination(month) {
  const date = model.setCurrentDate(month);
  date.currMonth = model.state.calendar.currMonth + 1;
  calanderView.render(date);
  calanderView.updateHeader(
    model.getCurrentMonth(),
    model.state.calendar.currYear
  );
}

function init() {
  // Add event handlers
  menuView.addHandlerClick(controlMenu);
  searchView.addHandlerSearch(controlSearch);
  // Add event listeners
  window.addEventListener("popstate", handleLocation);
  window.addEventListener("load", handleLocation);
}

init();
