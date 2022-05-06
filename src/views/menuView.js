"use strict";

function menuView() {
  // Selecting HTML elements
  const itemEl = document.querySelector(".content__nav-item");
  const tabsEl = document.querySelector(".content__nav-tabs");
  // Private methods
  const toggleTabs = () => tabsEl.classList.toggle("hidden");
  // Add event listeners
  itemEl.addEventListener("click", toggleTabs);
  // Public methods
  // Add handler functions
  const addHandlerClick = (handler) => {
    tabsEl.addEventListener("click", (e) => {
      const clicked = e.target.closest(".item-link");
      if (!clicked) return;
      toggleTabs();
      handler(e);
    });
  };
  // Public API
  const publicApi = {
    addHandlerClick,
  };
  return publicApi;
}

export default menuView();
