"use strict";

function searchView() {
  // Private variables
  const parentEl = document.querySelector(".content__form--search");
  const iconEl = document.querySelector(".form__icon--search");
  const inputEl = document.querySelector(".form__input--field");
  // Private methods
  // Public methods
  const addHandlerSearch = function (handler) {
    parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = inputEl.value;
      if (query === "") return inputEl.focus();
      handler(query);
    });
    iconEl.addEventListener("click", function (e) {
      e.preventDefault();
      const query = inputEl.value;
      if (query === "") return inputEl.focus();
      handler(query);
    });
  };
  // Public variables
  const publicApi = {
    addHandlerSearch,
  };
  return publicApi;
}

export default searchView();
