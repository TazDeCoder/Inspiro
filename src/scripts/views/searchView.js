"use strict";

import Handlebars from "handlebars/dist/handlebars.js";
import _ from "lodash";

import sources from "../sources.js";

function searchView() {
  let listItems;
  // Private variables
  const headEl = document.querySelector(".head--top");
  const parentEl = document.querySelector(".content__form--search");
  const iconEl = document.querySelector(".form__icon--search");
  const inputEl = document.querySelector(".form__input--field");
  const listEl = document.querySelector(".form__list--autofill");
  const headHeight = headEl.getBoundingClientRect().height;
  // Private methods
  const generateListMarkup = function ({ list }) {
    const listData = {
      listItems: list,
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

  inputEl.addEventListener("input", function (e) {
    if (inputEl.value === "")
      listItems.forEach((item) => (item.style.display = ""));
    let searches = [];
    const limit = 5;
    const search = inputEl.value.toLowerCase();
    for (let i of listItems) {
      const item = i.innerHTML.toLowerCase();
      if (item.indexOf(search) === -1) {
        i.style.display = "block";
        searches.push(i);
      } else {
        i.style.display = "";
      }
      if (searches.length === limit) break;
    }
  });
  // Add event handeler
  const addHandleClick = function () {
    listEl.addEventListener("click", function (e) {
      const clicked = e.target.closest("li");
      if (!clicked) return;
      inputEl.value = clicked.textContent;
      listItems.forEach((item) => (item.style.display = ""));
    });
  };
  // Public methods
  const renderList = function (data) {
    if (!_.isObject(data)) return;
    const listMarkup = generateListMarkup(data);
    listEl.innerHTML = listMarkup;
    listItems = document.querySelectorAll("li");
    addHandleClick();
  };
  const addHandlerSearch = function (handler) {
    parentEl.addEventListener("submit", function (e) {
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
  // Public variables
  const publicApi = {
    renderList,
    addHandlerSearch,
  };
  return publicApi;
}

export default searchView();
