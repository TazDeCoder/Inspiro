"use strict";

import * as model from "./model.js";
import sources from "./sources.js";
// Header
import menuView from "./views/menuView.js";
import searchView from "./views/searchView.js";
import buildArticleView from "./views/articleView.js";
// Homepage
import buildTargetView from "./views/targetView.js";
import buildCalendarView from "./views/calendarView.js";
import buildQuoteView from "./views/quoteView.js";

const contentMain = document.querySelector(".main__content");

// Building page views
const targetView = buildTargetView();
const calendarView = buildCalendarView();
const quoteView = buildQuoteView();
const articleView = buildArticleView();

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
      calendarView.addHandlerToggle(controlCalendar);
      calendarView.addHandlerClick(controlCalendarPagination);
      contentMain.insertAdjacentElement("beforeend", calendarView.base);
      // Quote
      await model.loadQuote();
      quoteView.render(model.state.quote);
      contentMain.insertAdjacentElement("beforeend", quoteView.base);
      break;
    case "/article":
      contentMain.insertAdjacentHTML("beforeend", sources.spinner());
      await model.getSearchResult(model.state.search.query);
      articleView.render(model.state.search);
      articleView.addHandlerToggle(controlBookmarkArticle);
      contentMain.innerHTML = "";
      contentMain.insertAdjacentElement("beforeend", articleView.base);
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

function controlBookmarkArticle(newModel) {
  model.addModelBookmark(newModel);
}

async function controlSearch(query) {
  await model.getSearchResult(query);
  window.history.pushState({}, "", "/article");
  handleLocation();
}

function controlTarget(newTargetQuota) {
  model.addTargetQuota(newTargetQuota);
  targetView.renderList(model.state.targets);
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

function init() {
  model.loadSearchList();
  searchView.renderList(model.state.search);
  // Add event handlers
  menuView.addHandlerClick(controlMenu);
  searchView.addHandlerSearch(controlSearch);
  // Add event listeners
  window.addEventListener("popstate", handleLocation);
  window.addEventListener("load", handleLocation);
  // Restore local storage
  model.restoreMarkedDays();
  model.restoreModelBookmarks();
}

init();
