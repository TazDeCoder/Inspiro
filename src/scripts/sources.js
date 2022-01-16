"use strict";

export default {
  spinner: spinnerSource,
  searchList: searchListSource,
  article: articleSource,
  quota: quotaSource,
  calander: calendarSource,
  calanderPagination: calendarPaginationSource,
  quote: quoteSource,
  bookmarkQuote: bookmarkQuoteSource,
  bookmarkModel: bookmarkModelSource,
};

function spinnerSource() {
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

function searchListSource() {
  return `
    {{searchListMarkup suggestions}}
  `;
}

function quotaSource() {
  return `
    <ul class="content__container-list">
      {{targetData targets}}
    </ul>
  `;
}

function quoteSource() {
  return `
    <i
    class="content__container-icon--bookmark gg-bookmark"
    title="Add to quotes"
    ></i>

    <q class="container__label container__label--quote">{{text}}</q>

    <p class="container__label container__label--author">{{author}}</p>
  `;
}

function articleSource() {
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

function calendarSource() {
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

function calendarPaginationSource() {
  return `
    <button class="nav__btn nav__btn--prev btn" data-goto="{{prevMonth}}"">
      Previous
    </button>

    <button class="nav__btn nav__btn--next btn" data-goto="{{nextMonth}}">
      Next
    </button>
  `;
}

function bookmarkQuoteSource() {
  return `
    <header class="content__head">
      <h1 class="head__header">Bookmarks</h1>
    </header>

    <div class="content__container--hero">
      <ul class="container__list--bookmarks">
        {{bookmarkQuoteMarkup bookmarks}}
      </ul>
    </div>
  `;
}

function bookmarkModelSource() {
  return `
    <header class="content__head">
      <h1 class="head__header">Bookmarks</h1>
    </header>

    <div class="content__container--hero">
      <ul class="container__list--bookmarks">
        {{bookmarkModelMarkup bookmarks}}
      </ul>
    </div>
  `;
}
