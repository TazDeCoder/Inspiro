"use strict";

import _ from "lodash";
import Quotesy from "quotesy/lib/index.js";

import { getJSON } from "./utils.js";
import { API_URL } from "./config.js";

const nameMonths = new Map([
  [0, "JAN"],
  [1, "FEB"],
  [2, "MAR"],
  [3, "APR"],
  [4, "MAY"],
  [5, "JUN"],
  [6, "JUL"],
  [7, "AUG"],
  [8, "SEP"],
  [9, "OCT"],
  [10, "NOV"],
  [11, "DEC"],
]);

const currDate = new Date();

export const state = {
  search: {
    query: "",
    imageSrc: "",
    title: "",
    pageContents: [],
    pageText: [],
    list: [],
    suggestions: [],
  },
  calendar: {
    markedDays: [],
    formatDate: "",
    formatMonth: "",
    month: 0,
    year: 0,
    firstDayIndex: 0,
    prevLastDay: 0,
    lastDay: 0,
  },
  quote: {},
  targets: [],
  bookmarks: {
    models: [],
    quotes: [],
  },
};

////////////////////////////////////////////////
////// Search Functionalities
///////////////////////////////////////////////

export function loadSearchList(currentSearch) {
  if (_.isEmpty(state.search.list)) {
    const authorSet = new Set(
      Quotesy.parse_json().map((quote) => quote.author)
    );
    state.search.list = Array.from(authorSet);
  }
  state.search.suggestions = state.search.list.filter((suggestion) =>
    suggestion.toLocaleLowerCase().startsWith(currentSearch.toLocaleLowerCase())
  );
}

export async function getSearchResult(query) {
  state.search.query = query;
  const searchParams = new URLSearchParams({
    origin: "*",
    action: "query",
    prop: "extracts|pageimages",
    piprop: "original",
    titles: query.toLowerCase(),
    redirects: true,
    converttitles: true,
    format: "json",
  });
  const url = `${API_URL}?${searchParams}`;
  const data = await getJSON(url);
  const { pages } = data.query;
  const [page] = Object.values(pages);
  if (page?.missing === "") return (state.search.query = "");
  state.search.title = page.title;
  state.search.imageSrc = page.original?.source ?? "";
  // Parse data
  const parser = new DOMParser();
  const htmlDOM = parser.parseFromString(page.extract, "text/html");
  const bodyDOM = htmlDOM.body;
  state.search.pageContents = [...bodyDOM.children].filter(
    (el) => el.nodeName === "H2"
  );
  state.search.pageText = [...bodyDOM.children].map((el) => el.outerHTML);
}

////////////////////////////////////////////////
////// Article Functionalities
///////////////////////////////////////////////

// Local Storage
function persistModelBookmarks() {
  localStorage.setItem(
    "modelBookmarks",
    JSON.stringify(state.bookmarks.models)
  );
}

export function addModelBookmark(newModel) {
  const foundDuplicate = _.findIndex(state.bookmarks.models, newModel);
  if (foundDuplicate === -1) state.bookmarks.models.push(newModel);
  else state.bookmarks.models.splice(foundDuplicate, 1);
  persistModelBookmarks();
}

export function restoreModelBookmarks() {
  const storage = localStorage.getItem("modelBookmarks");
  if (storage) state.bookmarks.models = JSON.parse(storage);
}

////////////////////////////////////////////////
////// Target Functionalities
///////////////////////////////////////////////

// Local Storage
function persistTargets() {
  localStorage.setItem("targets", JSON.stringify(state.targets));
}

const createTargetQuota = ({
  id = String(Date.now()).slice(10),
  quota,
  checked = false,
}) => ({
  id,
  quota,
  checked,
  toggleChecked() {
    this.checked = !checked;
    return this;
  },
});

export function addTargetQuota(newTargetQuota) {
  if (!newTargetQuota) return;
  const object = createTargetQuota({ quota: newTargetQuota });
  state.targets.push(object);
  persistTargets();
}

export function updateTargetQuotas(id, remove) {
  if (remove) {
    state.targets = [];
    localStorage.removeItem("targets");
  } else {
    const targetQuota = _.find(
      state.targets,
      (targetQuota) => targetQuota.id === id
    );
    targetQuota.toggleChecked();
    persistTargets();
  }
}

export function restoreTargets() {
  const storage = localStorage.getItem("targets");
  if (!storage) return;
  const targets = JSON.parse(storage);
  for (const target of targets) {
    const object = createTargetQuota({
      quota: target.quota,
      checked: target.checked,
    });
    state.targets.push(object);
  }
}

////////////////////////////////////////////////
////// Calendar Functionalities
///////////////////////////////////////////////

// Helper functions
const getFirstDayIndex = (year, month) => new Date(year, month).getDay();
const getLastDay = (year, month) => new Date(year, month, 0).getDate();

// Local Storage
function persistMarkedDays() {
  localStorage.setItem("markedDays", JSON.stringify(state.calendar.markedDays));
}

// Export functions
export function loadCalendar() {
  // Getting current month and year
  const day = currDate.getDate();
  const year = currDate.getFullYear();
  const month = currDate.getMonth();
  // Set first day of current month
  state.calendar.firstDayIndex = getFirstDayIndex(year, month);
  // Set previous month last day
  state.calendar.prevLastDay = getLastDay(year, month + 1);
  // Set current month last day
  state.calendar.lastDay = getLastDay(year, month + 1);
  // Set current month and year
  state.calendar.year = year;
  state.calendar.month = month;
  state.calendar.formatDate = `${month}-${day}`;
  state.calendar.formatMonth = nameMonths.get(month);
}

export function setCalendar(month, reverse) {
  // Set previous month last day
  state.calendar.prevLastDay = getLastDay(
    state.calendar.year,
    reverse ? state.calendar.month - 1 : state.calendar.month + 1
  );
  // Go back a year
  if (state.calendar.month === 0 && month === 11) state.calendar.year--;
  // Go foward a year
  if (state.calendar.month === 11 && month === 0) state.calendar.year++;
  // Set first day of selected month
  state.calendar.firstDayIndex = getFirstDayIndex(state.calendar.year, month);
  // Set selected month last day
  state.calendar.lastDay = getLastDay(state.calendar.year, month + 1);
  // Set selected month
  state.calendar.month = month;
  state.calendar.formatMonth = nameMonths.get(month);
}

export function updateMarkedDays(date, remove) {
  const [month, day] = date.split("-");
  const dateObj = { month, day };
  if (!remove) state.calendar.markedDays.push(dateObj);
  if (remove) {
    const idx = _.findIndex(state.calendar.markedDays, dateObj);
    state.calendar.markedDays.splice(idx, 1);
  }
  persistMarkedDays();
}

export function restoreMarkedDays() {
  const storage = localStorage.getItem("markedDays");
  if (storage) state.calendar.markedDays = JSON.parse(storage);
}

////////////////////////////////////////////////
////// Quote Functionalities
///////////////////////////////////////////////

// Local Storage
function persistQuoteBookmarks() {
  localStorage.setItem(
    "quoteBookmarks",
    JSON.stringify(state.bookmarks.quotes)
  );
}

export async function loadQuote() {
  if (!_.isEmpty(state.quote)) return;
  state.quote = Quotesy.random();
}

export function addQuoteBookmark(newQuote) {
  const foundDuplicate = _.findIndex(state.bookmarks.quotes, newQuote);
  if (foundDuplicate === -1) state.bookmarks.quotes.push(newQuote);
  else state.bookmarks.quotes.splice(foundDuplicate, 1);
  persistQuoteBookmarks();
}

export function restoreQuoteBookmarks() {
  const storage = localStorage.getItem("quoteBookmarks");
  if (storage) state.bookmarks.quotes = JSON.parse(storage);
}
