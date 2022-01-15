"use strict";

function searchView() {
  // Private variables
  const headEl = document.querySelector(".head--top");
  const parentEl = document.querySelector(".content__form--search");
  const iconEl = document.querySelector(".form__icon--search");
  const inputEl = document.querySelector(".form__input--field");
  const headHeight = headEl.getBoundingClientRect().height;
  // Private methods
  // Add event listener
  window.addEventListener("scroll", function () {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos > headHeight + 100) {
      headEl.classList.add("head--hide");
    } else {
      headEl.classList.remove("head--hide");
    }
  });
  // Public methods
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
    addHandlerSearch,
  };
  return publicApi;
}

export default searchView();
