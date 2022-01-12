"use strict";

import templates from "../templates.js";
import helper from "../helpers.js";

function calanderView() {
  // Private variables
  let parentEl, headerEl, tableEl, navEl;
  // Private methods
  const generateCalanderMarkup = ({
    firstDayIndex,
    prevLastDay,
    lastDay,
    currDay,
    currMonth,
  }) => {
    const calanderInput = {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      firstDayIndex,
      prevLastDay,
      lastDay,
      currDay,
      currMonth,
    };
    const template = Handlebars.compile(templates.calander());
    return template(calanderInput);
  };
  const generateNavMarkup = ({ currMonth }) => {
    const prevMonth = currMonth === 1 ? 12 : currMonth - 1;
    const nextMonth = currMonth === 12 ? 1 : currMonth + 1;
    const navInput = {
      prevMonth,
      nextMonth,
    };
    const template = Handlebars.compile(templates.calanderPagination());
    return template(navInput);
  };
  const clearTable = () => (tableEl.innerHTML = "");
  const clearNav = () => (navEl.innerHTML = "");
  const addHandleToggle = function () {
    tableEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".data__item-dot");
      if (!clicked) return;
      clicked.classList.toggle("data__item--active");
    });
  };
  // Public methods
  const render = function (data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return;
    parentEl = document.querySelector(".content__wrapper--hero");
    headerEl = document.querySelector(".content__wrapper-header");
    tableEl = document.querySelector(".content__wrapper-table");
    navEl = document.querySelector(".content__wrapper-nav");
    const tableMarkup = generateCalanderMarkup(data);
    clearTable();
    tableEl.insertAdjacentHTML("afterbegin", tableMarkup);
    addHandleToggle();
    const navMarkup = generateNavMarkup(data);
    clearNav();
    navEl.insertAdjacentHTML("afterbegin", navMarkup);
  };
  const updateHeader = (month, year) =>
    (headerEl.textContent = `${month}, ${year}`);
  const addHandlerClick = function (handler) {
    navEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".nav__btn");
      if (!clicked) return;
      const goToMonth = +clicked.getAttribute("data-goto");
      handler(goToMonth);
    });
  };
  // Public API
  const publicApi = {
    render,
    updateHeader,
    addHandlerClick,
  };
  return publicApi;
}

export default calanderView();
