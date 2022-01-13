"use strict";

import { API_URL } from "./config.js";
import { getJSON } from "./helpers.js";

const nameMonths = Object.freeze({
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
});

export const state = {
  search: {},
  calendar: {},
};

////////////////////////////////////////////////
////// Calendar Functionalities
///////////////////////////////////////////////

export function getCurrentDate() {
  // Helper function
  const getFirstDayIndex = (year, month) => new Date(year, month).getDay();
  const getLastDay = (year, month) => new Date(year, month, 0).getDate();
  // Getting current date and setting variables
  const currDate = new Date();
  state.calendar.currDay = currDate.getDate();
  state.calendar.currYear = currDate.getFullYear();
  state.calendar.currMonth = currDate.getMonth();
  const firstDayIndex = getFirstDayIndex(
    state.calendar.currYear,
    state.calendar.currMonth
  );
  const prevLastDay =
    state.calendar.currMonth === 0
      ? 31
      : getLastDay(state.calendar.currYear, state.calendar.currMonth);
  const lastDay = getLastDay(state.calendar.currYear, state.calendar.currMonth);
  const currDay = `${state.calendar.currMonth + 1}-${state.calendar.currDay}`;
  state.calendar.currDay = currDay;
  return { firstDayIndex, prevLastDay, lastDay, currDay };
}

export function setCurrentDate(month) {
  // Helper function
  const getFirstDayIndex = (year, month) => new Date(year, month).getDay();
  const getLastDay = (year, month) => new Date(year, month, 0).getDate();
  const prevLastDay = getLastDay(
    state.calendar.currYear,
    state.calendar.currMonth + 1
  );
  // Go back a year
  if (state.calendar.currMonth === 0 && month === 12) state.calendar.currYear--;
  // Go foward a year
  if (state.calendar.currMonth === 11 && month === 1) state.calendar.currYear++;
  // Setting calander variables
  const firstDayIndex = getFirstDayIndex(state.calendar.currYear, month - 1);
  const lastDay = getLastDay(state.calendar.currYear, month);
  const currDay = state.calendar.currDay;
  state.calendar.currMonth = month - 1;
  return { firstDayIndex, prevLastDay, lastDay, currDay };
}

export function getCurrentMonth() {
  const [currMonth] = Object.entries(nameMonths).find(
    (val) => val[1] === state.calendar.currMonth + 1
  );
  return currMonth;
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
  const url = `${API_URL}?${searchParams}`;
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
