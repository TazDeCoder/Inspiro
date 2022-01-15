"use strict";

import Handlebars from "handlebars/dist/handlebars.js";
import _ from "lodash";

import sources from "../sources.js";

export default function buildCalendarView() {
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
  // Private methods
  const generateCalanderMarkup = ({
    markedDays,
    firstDayIndex,
    prevLastDay,
    lastDay,
    month,
    formatDate,
  }) => {
    const calendarData = {
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      markedDays,
      firstDayIndex,
      prevLastDay,
      lastDay,
      currMonth: month,
      today: formatDate,
    };
    const template = Handlebars.compile(sources.calander());
    return template(calendarData);
  };

  const generateNavMarkup = ({ month }) => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    const navInput = {
      prevMonth,
      nextMonth,
    };
    const template = Handlebars.compile(sources.calanderPagination());
    return template(navInput);
  };
  // Public methods
  const renderTable = function (data) {
    if (!_.isObject(data)) return;
    const tableMarkup = generateCalanderMarkup(data);
    tableEl.innerHTML = tableMarkup;
  };

  const renderNav = function (data) {
    if (!_.isObject(data)) return;
    const navMarkup = generateNavMarkup(data);
    navEl.innerHTML = navMarkup;
  };
  // Updates calendar header
  const updateHeader = (month, year) =>
    (headerEl.textContent = `${month}, ${year}`);
  // Add event handlers
  const addHandlerToggle = function (handler) {
    tableEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".data__item-dot");
      if (!clicked) return;
      clicked.classList.toggle("data__item--active");
      const cell = clicked.closest(".row-data");
      const cellDate = cell.getAttribute("data-date");
      const removeDate = clicked.classList.contains("data__item--active")
        ? false
        : true;
      console.log(cellDate);
      handler(cellDate, removeDate);
    });
  };
  const addHandlerClick = function (handler) {
    navEl.addEventListener("click", function (e) {
      let reverse = false;
      const clicked = e.target.closest(".nav__btn");
      if (!clicked) return;
      if (clicked.classList.contains("nav__btn--prev")) reverse = true;
      const goToMonth = +clicked.getAttribute("data-goto");
      handler(goToMonth, reverse);
    });
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
