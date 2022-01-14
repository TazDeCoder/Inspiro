"use strict";

import templates from "../templates.js";

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
    firstDayIndex,
    prevLastDay,
    lastDay,
    month,
    formatDate,
  }) => {
    const calendarInput = {
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      firstDayIndex,
      prevLastDay,
      lastDay,
      currMonth: month,
      today: formatDate,
    };
    const template = Handlebars.compile(templates.calander());
    return template(calendarInput);
  };

  const generateNavMarkup = ({ month: currMonth }) => {
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    const nextMonth = currMonth === 11 ? 0 : currMonth + 1;
    const navInput = {
      prevMonth,
      nextMonth,
    };
    const template = Handlebars.compile(templates.calanderPagination());
    return template(navInput);
  };
  // Clear inner HTML functions
  const clearTable = () => (tableEl.innerHTML = "");
  const clearNav = () => (navEl.innerHTML = "");
  // Add event listeners
  tableEl.addEventListener("click", function (e) {
    const clicked = e.target.closest(".data__item-dot");
    if (!clicked) return;
    clicked.classList.toggle("data__item--active");
  });
  // Public methods
  const renderTable = function (data) {
    if (!data || data.length === 0) return;
    const tableMarkup = generateCalanderMarkup(data);
    clearTable();
    tableEl.innerHTML = tableMarkup;
  };

  const renderNav = function (data) {
    if (!data || data.length === 0) return;
    const navMarkup = generateNavMarkup(data);
    clearNav();
    navEl.innerHTML = navMarkup;
  };
  // Updates calendar header
  const updateHeader = (month, year) =>
    (headerEl.textContent = `${month}, ${year}`);
  // Add event handlers
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
    addHandlerClick,
    base,
  };
  return publicApi;
}
