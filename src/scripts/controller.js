"use strict";

import "core-js/stable";
import "regenerator-runtime";

import * as model from "./model.js";
import templates from "./templates.js";
// Views
import menuView from "./views/menuView.js";
import searchView from "./views/searchView.js";
// --- Build Functions
import buildArticleView from "./views/articleView.js";
import buildTargetView from "./views/targetView.js";
import buildCalendarView from "./views/calendarView.js";
import buildQuoteView from "./views/quoteView.js";
import buildModelBookmarkView from "./views/modelBookmarkView.js";
import buildQuoteBookmarkView from "./views/quoteBookmarkView.js";

const contentMain = document.querySelector(".main__content");
// Build app views
const articleView = buildArticleView();
const targetView = buildTargetView();
const calendarView = buildCalendarView();
const quoteView = buildQuoteView();
const quoteBookmarkView = buildQuoteBookmarkView();
const modelBookmarkView = buildModelBookmarkView();

////////////////////////////////////////////////
////// Routing + Initialise App
///////////////////////////////////////////////

function route(evt = window.event) {
  evt.preventDefault();
  window.history.pushState({}, "", evt.target.href);
  handleLocation();
}

function handleLocation(redirect = false) {
  // Get current url pathname
  const pathName = redirect ? "/dashboard" : window.location.pathname;
  // Now generate the HTML template markup in placeholder
  contentMain.innerHTML = "";
  // Render pathname view
  switch (pathName) {
    case "/dashboard":
      return controlDashboard();
    case "/article":
      return controlArticle();
    case "/quotes":
      return controlQuotes();
    case "/models":
      return controlModels();
  }
}

function init() {
  // Load calendar
  model.loadCalendar();
  // Add event handlers
  menuView.addHandlerClick(controlMenu);
  searchView.addHandlerInput(controlSearchSuggestions);
  searchView.addHandlerSearch(controlSearch);
  // Add event listeners
  window.addEventListener("popstate", handleLocation);
  // Restore local storage data
  model.restoreTargets();
  model.restoreMarkedDays();
  model.restoreModelBookmarks();
  model.restoreQuoteBookmarks();
  // Redirect to homepage
  handleLocation(true);
}

init();

////////////////////////////////////////////////
////// Control Functionalities
///////////////////////////////////////////////

function controlMenu(event) {
  route(event);
}

async function controlArticle() {
  contentMain.insertAdjacentHTML("beforeend", templates.spinner());
  await model.getSearchResult(model.state.search.query);
  if (model.state.error) {
    articleView.renderError();
  } else {
    articleView.render(model.state.search);
    articleView.addHandlerToggle(controlBookmarkArticle);
  }
  contentMain.innerHTML = "";
  contentMain.classList.remove("content--flex");
  contentMain.insertAdjacentElement("beforeend", articleView.base);
}

function controlModels() {
  contentMain.insertAdjacentHTML("beforeend", templates.spinner());
  modelBookmarkView.render(model.state.bookmarks);
  modelBookmarkView.addHandlerClick(controlSearch);
  contentMain.innerHTML = "";
  contentMain.classList.remove("content--flex");
  contentMain.insertAdjacentElement("beforeend", modelBookmarkView.base);
}

function controlBookmarkArticle(newModel) {
  model.addModelBookmark(newModel);
}

async function controlSearch(query) {
  await model.getSearchResult(query);
  window.history.pushState({}, "", "/article");
  handleLocation();
}

function controlSearchSuggestions(currentSearch) {
  model.loadSearchList(currentSearch);
  searchView.renderList(model.state.search);
}

async function controlDashboard() {
  contentMain.classList.add("content--flex");
  // Target
  targetView.renderHead();
  targetView.renderList(model.state);
  targetView.addHandlerSubmit(controlAddTarget);
  targetView.addHandlerToggle(controlUpdateTargets);
  contentMain.insertAdjacentElement("beforeend", targetView.base);
  // Calendar
  calendarView.renderTable(model.state.calendar);
  calendarView.renderNav(model.state.calendar);
  calendarView.updateHeader(
    model.state.calendar.formatMonth,
    model.state.calendar.year
  );
  calendarView.addHandlerToggle(controlCalendar);
  calendarView.addHandlerClick(controlCalendarPagination);
  contentMain.insertAdjacentElement("beforeend", calendarView.base);
  // Quote
  await model.loadQuote();
  quoteView.render(model.state.quote);
  quoteView.addHandlerToggle(controlBookmarkQuote);
  contentMain.insertAdjacentElement("beforeend", quoteView.base);
}

function controlAddTarget(newTargetQuota) {
  model.addTargetQuota(newTargetQuota);
  targetView.renderList(model.state);
}

function controlUpdateTargets(targetQuotaId, remove = false) {
  model.updateTargetQuotas(targetQuotaId, remove);
  targetView.renderList(model.state);
}

function controlCalendar(markedDayDate, remove = false) {
  model.updateMarkedDays(markedDayDate, remove);
  calendarView.renderTable(model.state.calendar);
}

function controlCalendarPagination(setMonth, reverse) {
  model.setCalendar(setMonth, reverse);
  calendarView.renderTable(model.state.calendar);
  calendarView.renderNav(model.state.calendar);
  calendarView.updateHeader(
    model.state.calendar.formatMonth,
    model.state.calendar.year
  );
}

function controlQuotes() {
  contentMain.insertAdjacentHTML("beforeend", templates.spinner());
  quoteBookmarkView.render(model.state.bookmarks);
  contentMain.innerHTML = "";
  contentMain.classList.remove("content--flex");
  contentMain.insertAdjacentElement("beforeend", quoteBookmarkView.base);
}

function controlBookmarkQuote(newQuote) {
  model.addQuoteBookmark(newQuote);
}
