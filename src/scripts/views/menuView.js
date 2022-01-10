"use strict";

// Private variables
const itemEl = document.querySelector(".content__nav-item");
const tabsEl = document.querySelector(".content__nav-tabs");
const toggleTabs = () => tabsEl.classList.toggle("hidden");

function menuView() {
  itemEl.addEventListener("click", toggleTabs);
  // Add handlers
  const addHandlerClick = function (handler) {
    tabsEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".item-link");
      if (!clicked) return;
      toggleTabs();
      handler(e);
    });
  };

  return {
    addHandlerClick,
  };
}

export default menuView();
