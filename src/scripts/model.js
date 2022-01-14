"use strict";

import { getJSON } from "./helpers.js";
import { API_URL_WIKI, API_URL_QUOTE } from "./config.js";

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
  search: {},
  calendar: {
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
};

////////////////////////////////////////////////
////// Target Functionalities
///////////////////////////////////////////////

const createTargetQuota = ({ quota, checked = false }) => ({
  quota,
  checked,
  setChecked(checked) {
    this.checked = checked;
    return this;
  },
});

export function addTargetQuota(newTargetQuota) {
  const object = createTargetQuota({ quota: newTargetQuota });
  state.targets.push(object);
}

////////////////////////////////////////////////
////// Calendar Functionalities
///////////////////////////////////////////////

// Helper functions
const getFirstDayIndex = (year, month) => new Date(year, month).getDay();

const getLastDay = (year, month) => new Date(year, month, 0).getDate();

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
  console.log(state.calendar);
}

////////////////////////////////////////////////
////// Quote Functionalities
///////////////////////////////////////////////

export async function loadQuote() {
  const url = API_URL_QUOTE;
  const data = await getJSON(url);
  state.quote = data[Math.floor(Math.random() * data.length)];
}

////////////////////////////////////////////////
////// Search Functionalities
///////////////////////////////////////////////

export async function getSearchResult(query) {
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
  const url = `${API_URL_WIKI}?${searchParams}`;
  const data = await getJSON(url);
  const { pages } = data.query;
  const [page] = Object.values(pages);
  const { title } = page;
  const imageSrc = page.original?.source ?? "";
  // Parse data
  const parser = new DOMParser();
  const htmlDOM = parser.parseFromString(page.extract, "text/html");
  const bodyDOM = htmlDOM.body;
  const contentsArr = [...bodyDOM.children].filter(
    (el) => el.nodeName === "H2" || el.nodeName === "H3"
  );
  const contextArr = [...bodyDOM.children].map((el) => el.outerHTML);
  state.search.query = query;
  return { title, image: imageSrc, contentsArr, contextArr };
}
