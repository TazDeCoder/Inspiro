"use strict";

import Handlebars from "handlebars/dist/handlebars.js";
import _ from "lodash";

export default function buildTargetView() {
  let formEl, inputEl;
  // Create base parent
  const base = document.createElement("div");
  base.classList.add("content__container--aside");
  // Create head
  const headEl = document.createElement("header");
  headEl.classList.add("content__container-head");
  // Create list
  const listEl = document.createElement("ul");
  listEl.classList.add("content__container-list");
  // Add children to base parent
  base.appendChild(headEl);
  base.appendChild(listEl);
  // Private methods
  const generateTargetQuotaMarkup = function ({ targets }) {
    const targetQuotaData = {
      targets,
    };
    const template = Handlebars.compile("{{targetData targets}}");
    return template(targetQuotaData);
  };

  const clearList = () => (listEl.innerHTML = "");
  // Add event listeners
  headEl.addEventListener("click", function (e) {
    const clicked = e.target.closest(".gg-add");
    if (!clicked) return;
    formEl = document.querySelector(".head__form--inline");
    formEl.classList.toggle("head__form--display");
  });
  // Public methods
  const renderHead = function () {
    headEl.innerHTML = `
      <header class="content__container-head">
        <h1 class="head__header">Weekly Targets</h1>  
        <i class="head__icon--add gg-add" title="Add a target quota"></i>
        <form class="head__form--inline">
          <input
            class="form__input--quota"
            type="text"
            placeholder="Type in a target quota"
            required
          />
          <i
            class="form__icon--enter gg-enter"
            title="Submit target quota"
          ></i>
        </form>
      </header>
    `;
    formEl = headEl.querySelector(".head__form--inline");
  };

  const renderList = function (data) {
    if (!_.isObject(data)) return;
    const markup = generateTargetQuotaMarkup(data);
    clearList();
    listEl.insertAdjacentHTML("afterbegin", markup);
  };
  // Add event handlers
  const addHandlerSubmit = function (handler) {
    if (
      formEl.getAttribute("data-event-submit") !== "true" &&
      formEl.getAttribute("data-event-click") !== "true"
    ) {
      formEl.setAttribute("data-event-submit", "true");
      formEl.addEventListener("submit", function (e) {
        e.preventDefault();
        inputEl = document.querySelector(".form__input--quota");
        const quota = inputEl.value;
        inputEl.value = "";
        formEl.classList.toggle("head__form--display");
        handler(quota);
      });

      formEl.setAttribute("data-event-submit", "true");
      formEl.addEventListener("click", function (e) {
        e.preventDefault();
        inputEl = document.querySelector(".form__input--quota");
        const clicked = e.target.closest(".gg-enter");
        if (!clicked) return;
        const quota = inputEl.value;
        inputEl.value = "";
        formEl.classList.toggle("head__form--display");
        handler(quota);
      });
    }
  };

  const addHandlerToggle = function (handler) {
    if (listEl.getAttribute("data-event-toggle") !== "true") {
      listEl.addEventListener("click", function (e) {
        const elementClicked = e.target;
        elementClicked.setAttribute("data-event-toggle", "true");
        const clicked = e.target.closest(".item__input");
        if (!clicked) return;
        const toggleBoxes = Array.from(listEl.querySelectorAll(".item__input"));
        const allChecked = toggleBoxes.every((toggleBox) => toggleBox.checked);
        const id = clicked.closest(".list-item").getAttribute("data-id");
        handler(id, allChecked);
      });
    }
  };
  // Public API
  const publicApi = {
    renderHead,
    renderList,
    addHandlerSubmit,
    addHandlerToggle,
    base,
  };
  return publicApi;
}
