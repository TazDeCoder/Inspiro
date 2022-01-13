"use strict";

import templates from "../templates.js";
import { contentMain } from "../controller.js";

function articleView() {
  // Private methods
  const generateArticleMarkup = ({ title, image, contentsArr, contextArr }) => {
    const articleInput = {
      title,
      image,
      contentsArr,
      contextArr,
    };
    const template = Handlebars.compile(templates.article2());
    return template(articleInput);
  };
  const clearContent = () => (contentMain.innerHTML = "");
  // Public methods
  const render = function (data) {
    if (!data || (Array.isArray(data) && data.length === 0));
    const articleMarkup = generateArticleMarkup(data);
    clearContent();
    contentMain.insertAdjacentHTML("afterbegin", articleMarkup);
  };
  // Public API
  const publicApi = {
    render,
  };
  return publicApi;
}

export default articleView();
