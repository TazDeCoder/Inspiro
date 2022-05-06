"use strict";

function spinnerTemplate() {
  return `
    <div class="lds-roller">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  `;
}

function searchListTemplate() {
  return `
    {{searchListMarkup suggestions}}
  `;
}

function quotaTemplate() {
  return `
    {{targetData targets}}
  `;
}

function quoteTemplate() {
  return `
    <i
    class="content__container-icon--bookmark gg-bookmark"
    title="Add to quotes"
    ></i>

    <q class="container__label container__label--quote">{{text}}</q>

    <p class="container__label container__label--author">{{author}}</p>
  `;
}

function articleTemplate() {
  return `
    <header class="content__head">
      <h1 class="head__header">{{title}}</h1>

      <div class="head__container-img">
        <i
        class="head__icon--bookmark gg-bookmark"
        title="Add to models"
        ></i>

        <img
          class="head__img"
          src="{{imageSrc}}"
        />
      </div>

      <ul class="head__list">
        <li class="list__item--header">
          Contents
        </li>

        {{columnData pageContents}}
      </ul>
    </header>

    <article class="content__article">
      {{articleData pageText}}
    </article>
  `;
}

function calendarTemplate() {
  return `
    <thead>
      <tr>
        {{#each days}}
        <th class="row-header" scope="col">{{this}}</th>
        {{/each}}
      </tr>
    </thead>

    <tbody>
      {{tableData markedDays firstDayIndex prevLastDay lastDay currMonth today}}
    </tbody>
  `;
}

function calendarPaginationTemplate() {
  return `
    <button class="nav__btn nav__btn--prev btn" data-goto="{{prevMonth}}"">
      Previous
    </button>

    <button class="nav__btn nav__btn--next btn" data-goto="{{nextMonth}}">
      Next
    </button>
  `;
}

function quoteBookmarkTemplate() {
  return `
    <header class="content__head">
      <h1 class="head__header">Bookmarks</h1>
    </header>

    <div class="content__container--hero">
      <ul class="container__list--bookmarks">
        {{quoteBookmarkMarkup bookmarks}}
      </ul>
    </div>
  `;
}

function modelBookmarkTemplate() {
  return `
    <header class="content__head">
      <h1 class="head__header">Bookmarks</h1>
    </header>

    <div class="content__container--hero">
      <ul class="container__list--bookmarks">
        {{modelBookmarkMarkup bookmarks}}
      </ul>
    </div>
  `;
}

export default {
  spinner: spinnerTemplate,
  searchList: searchListTemplate,
  article: articleTemplate,
  quota: quotaTemplate,
  calendar: calendarTemplate,
  calendarPagination: calendarPaginationTemplate,
  quote: quoteTemplate,
  quoteBookmark: quoteBookmarkTemplate,
  modelBookmark: modelBookmarkTemplate,
};
