"use strict";

import Handlebars from "handlebars/dist/handlebars";
import _ from "lodash";

import templates from "../templates";

function generateCalendarMarkup({
  markedDays,
  firstDayIndex,
  prevLastDay,
  lastDay,
  month,
  formatDate,
}) {
  const calendarData = {
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    markedDays,
    firstDayIndex,
    prevLastDay,
    lastDay,
    currMonth: month,
    today: formatDate,
  };
  const template = Handlebars.compile(templates.calendar());
  return template(calendarData);
}

function generateNavMarkup({ month }) {
  const prevMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  const navInput = {
    prevMonth,
    nextMonth,
  };
  const template = Handlebars.compile(templates.calendarPagination());
  return template(navInput);
}

function buildCalendarView() {
  // Create base parent
  const base = document.createElement("div");
  base.classList.add("content__wrapper--hero");
  // Create header
  const headerEl = document.createElement("h1");
  headerEl.classList.add("content__wrapper-header");
  // Create table
  const tableEl = document.createElement("table");
  tableEl.classList.add("content__wrapper-table");
  // Create nav
  const navEl = document.createElement("nav");
  navEl.classList.add("content__wrapper-nav");
  // Add children to base parent
  base.appendChild(headerEl);
  base.appendChild(tableEl);
  base.appendChild(navEl);
  // Public methods
  const renderTable = (data) => {
    if (!_.isObject(data)) return;
    const tableMarkup = generateCalendarMarkup(data);
    tableEl.innerHTML = tableMarkup;
  };
  const renderNav = (data) => {
    if (!_.isObject(data)) return;
    const navMarkup = generateNavMarkup(data);
    navEl.innerHTML = navMarkup;
  };
  // Updates calendar header
  const updateHeader = (month, year) =>
    (headerEl.textContent = `${month}, ${year}`);
  // Add handler functions
  const addHandlerToggle = (handler) => {
    if (tableEl.getAttribute("data-event-click") !== "true") {
      tableEl.setAttribute("data-event-click", "true");
      tableEl.addEventListener("click", (e) => {
        const clicked = e.target.closest(".data__item-dot");
        if (!clicked) return;
        clicked.classList.toggle("data__item--active");
        const cell = clicked.closest(".row-data");
        const cellDate = cell.getAttribute("data-date");
        const removeDate = clicked.classList.contains("data__item--active")
          ? false
          : true;
        handler(cellDate, removeDate);
      });
    }
  };
  const addHandlerClick = (handler) => {
    if (navEl.getAttribute("data-event-click") !== "true") {
      navEl.setAttribute("data-event-click", "true");
      navEl.addEventListener("click", (e) => {
        let reverse = false;
        const clicked = e.target.closest(".nav__btn");
        if (!clicked) return;
        if (clicked.classList.contains("nav__btn--prev")) reverse = true;
        const goToMonth = +clicked.getAttribute("data-goto");
        handler(goToMonth, reverse);
      });
    }
  };
  // Public API
  const publicApi = {
    renderTable,
    renderNav,
    updateHeader,
    addHandlerToggle,
    addHandlerClick,
    base,
  };
  return publicApi;
}

export default buildCalendarView;
