"use strict";

import Handlebars from "handlebars/dist/handlebars.js";
import _ from "lodash";

import sources from "../sources.js";

function searchView() {
  let listItems = [];
  // Private variables
  const headEl = document.querySelector(".head--top");
  const parentEl = document.querySelector(".content__wrapper--search");
  const formEl = document.querySelector(".wrapper__form-search");
  const iconEl = document.querySelector(".form__icon--search");
  const inputEl = document.querySelector(".form__input--field");
  const listEl = document.querySelector(".form__list--autofill");
  const headHeight = headEl.getBoundingClientRect().height;
  // Private methods
  const generateListMarkup = function ({ suggestions }) {
    const listData = {
      suggestions,
    };
    const template = Handlebars.compile(sources.searchList());
    return template(listData);
  };
  // Add event listener
  window.addEventListener("scroll", function () {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos > headHeight + 100) {
      headEl.classList.add("head--hide");
    } else {
      headEl.classList.remove("head--hide");
    }
  });
  // Add event handler
  const addHandleClick = function () {
    listEl.addEventListener("click", function (e) {
      const clicked = e.target.closest("li");
      if (!clicked) return;
      inputEl.value = clicked.textContent;
      listItems.forEach((item) => (item.style.display = "none"));
    });
  };
  // Public methods
  const renderList = function (data) {
    if (!_.isObject(data)) return;
    const listMarkup = generateListMarkup(data);
    listEl.innerHTML = listMarkup;
    listItems = listEl.querySelectorAll("li");
    listEl.classList.remove("hide");
    addHandleClick();
  };
  // Add event handlers
  const addHandlerInput = function (handler) {
    inputEl.addEventListener("keyup", function () {
      const searchInput = inputEl.value;
      if (!searchInput) return listEl.classList.add("hide");
      listEl.classList.remove("hide");
      handler(searchInput);
    });
  };

  const addHandlerSearch = function (handler) {
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = inputEl.value;
      if (query === "") return inputEl.focus();
      inputEl.value = "";
      handler(query);
    });
    iconEl.addEventListener("click", function (e) {
      e.preventDefault();
      const query = inputEl.value;
      if (query === "") return inputEl.focus();
      inputEl.value = "";
      handler(query);
    });
  };
  // Public API
  const publicApi = {
    renderList,
    addHandlerInput,
    addHandlerSearch,
  };
  return publicApi;
}

export default searchView();
