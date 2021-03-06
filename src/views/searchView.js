"use strict";

import Handlebars from "handlebars/dist/handlebars";
import _ from "lodash";

import templates from "../templates";
import { MEDIUM_DEVICE_WIDTH_PX } from "../config";

function generateListMarkup({ suggestions }) {
  const listData = {
    suggestions,
  };
  const template = Handlebars.compile(templates.searchList());
  return template(listData);
}

function searchView() {
  let listItems = [];
  // Selecting HTML elements
  const headEl = document.querySelector(".head--top");
  const formEl = document.querySelector(".wrapper__form-search");
  const iconEl = document.querySelector(".form__icon--search");
  const inputEl = document.querySelector(".form__input--field");
  const listEl = document.querySelector(".form__list--autofill");
  const headHeight = headEl.getBoundingClientRect().height;
  // Add event listeners
  window.addEventListener("scroll", function () {
    const windowInnerWidth = document.documentElement.clientWidth;
    if (windowInnerWidth >= MEDIUM_DEVICE_WIDTH_PX) return;
    const currentScrollPos = window.scrollY;
    if (currentScrollPos > headHeight + 100) {
      headEl.classList.add("head--hide");
    } else {
      headEl.classList.remove("head--hide");
    }
  });
  // Public methods
  const renderList = (data) => {
    if (!_.isObject(data)) return;
    const listMarkup = generateListMarkup(data);
    listEl.innerHTML = listMarkup;
    listItems = listEl.querySelectorAll("li");
    listEl.classList.remove("hide");
  };
  // Add handler functions
  const addHandlerInput = (handler) => {
    inputEl.addEventListener("keyup", () => {
      const searchInput = inputEl.value;
      if (!searchInput) return listEl.classList.add("hide");
      listEl.classList.remove("hide");
      handler(searchInput);
    });
  };
  const addHandlerSearch = (handler) => {
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = inputEl.value;
      if (query === "") return inputEl.focus();
      inputEl.value = "";
      handler(query);
    });
    iconEl.addEventListener("click", (e) => {
      e.preventDefault();
      const query = inputEl.value;
      if (query === "") return inputEl.focus();
      inputEl.value = "";
      handler(query);
    });
    listEl.addEventListener("click", (e) => {
      const clicked = e.target.closest("li");
      if (!clicked) return;
      inputEl.value = "";
      listItems.forEach((item) => (item.style.display = "none"));
      handler(clicked.textContent);
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
