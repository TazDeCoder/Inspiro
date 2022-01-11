"use strict";

function menuView() {
  // Private variables
  const itemEl = document.querySelector(".content__nav-item");
  const tabsEl = document.querySelector(".content__nav-tabs");
  // Private methods
  const toggleTabs = () => tabsEl.classList.toggle("hidden");
  // Add event listner
  itemEl.addEventListener("click", toggleTabs);
  // Public methods
  const addHandlerClick = function (handler) {
    tabsEl.addEventListener("click", function (e) {
      const clicked = e.target.closest(".item-link");
      if (!clicked) return;
      toggleTabs();
      handler(e);
    });
  };
  // Public variables
  const publicApi = {
    addHandlerClick,
  };
  return publicApi;
}

export default menuView();
