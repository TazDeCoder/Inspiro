"use strict";

import * as model from "./model.js";
import templates from "./templates.js";
import menuView from "./views/menuView.js";
// Header
import searchView from "./views/searchView.js";
import articleView from "./views/articleView.js";
// Homepage
import buildTargetView from "./views/targetView.js";
import buildCalendarView from "./views/calendarView.js";
import buildQuoteView from "./views/quoteView.js";

export const contentMain = document.querySelector(".main__content");

// Views
const targetView = buildTargetView();
const calendarView = buildCalendarView();
const quoteView = buildQuoteView();

function route(evt = window.event) {
  evt.preventDefault();
  window.history.pushState({}, "", evt.target.href);
  handleLocation();
}

async function handleLocation() {
  // Get current url pathname
  const pathName = window.location.pathname;
  // Now generate the HTML template markup in placeholder
  contentMain.innerHTML = "";
  // Render pathname view
  switch (pathName) {
    case "/":
      // Target
      targetView.renderHead();
      targetView.renderList(model.state.targets);
      targetView.addHandlerSubmit(controlTarget);
      contentMain.insertAdjacentElement("beforeend", targetView.base);
      // Calendar
      model.loadCalendar();
      calendarView.renderTable(model.state.calendar);
      calendarView.renderNav(model.state.calendar);
      calendarView.updateHeader(
        model.state.calendar.formatMonth,
        model.state.calendar.year
      );
      calendarView.addHandlerClick(controlCalanderPagination);
      contentMain.insertAdjacentElement("beforeend", calendarView.base);
      // Quote
      await model.loadQuote();
      quoteView.render(model.state.quote);
      contentMain.insertAdjacentElement("beforeend", quoteView.base);
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

function controlTarget(targetQuota) {
  model.addTargetQuota(targetQuota);
  targetView.renderList(model.state.targets);
}

function controlCalanderPagination(month, reverse) {
  model.setCalendar(month, reverse);
  calendarView.renderTable(model.state.calendar);
  calendarView.renderNav(model.state.calendar);
  calendarView.updateHeader(
    model.state.calendar.formatMonth,
    model.state.calendar.year
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
