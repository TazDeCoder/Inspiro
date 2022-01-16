import Handlebars from "handlebars/dist/handlebars.js";
import _ from "lodash";

export async function getJSON(url) {
  try {
    const req = await fetch(url);
    if (!req.ok) throw new Error("Failed to fetch");
    const data = await req.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

////////////////////////////////////////////////
////// Handlerbars Custom Helpers
///////////////////////////////////////////////

Handlebars.registerHelper("columnData", function (pageContents) {
  let contents = [];
  const ignoreContents = [
    "References",
    "Notes",
    "Bibliography",
    "External links",
  ];
  for (const pageContent of pageContents) {
    if (
      ignoreContents.find(
        (ignoreContent) => ignoreContent === pageContent.textContent
      )
    )
      break;
    const contentHeader = document.createElement("li");
    // Creating shortcut to content header
    const hash = "#".concat(pageContent.firstChild.id);
    const link = document.createElement("a");
    link.classList.add("list__item-link");
    link.textContent = pageContent.textContent;
    link.setAttribute("href", hash);
    contentHeader.appendChild(link);
    contents.push(contentHeader);
  }
  const markup = contents
    .map((header) => {
      return `
        <li class="list__item--header">
          ${header.innerHTML}
        </li>
      `;
    })
    .join("");
  return new Handlebars.SafeString(markup);
});

Handlebars.registerHelper("searchListMarkup", function (suggestions) {
  const listLimit = 10;
  const filteredSuggestions = _.slice(suggestions, 0, listLimit);
  const markup = filteredSuggestions
    .map((listItem) => `<li class="list__item--suggestion">${listItem}</li>`)
    .join("");
  return new Handlebars.SafeString(markup);
});

Handlebars.registerHelper("articleData", function (pageText) {
  const markup = pageText.join("");
  return new Handlebars.SafeString(markup);
});

Handlebars.registerHelper("targetData", function (targets) {
  const convertTitleCase = function (title) {
    const exceptions = [
      "a",
      "an",
      "and",
      "as",
      "at",
      "by",
      "for",
      "in",
      "of",
      "on",
      "or",
      "the",
      "to",
      "up",
      "via",
      "with",
    ];
    const titleCase = title
      .toLowerCase()
      .split(" ")
      .map((word) => (exceptions.includes(word) ? word : _.startCase(word)))
      .join(" ");
    return titleCase;
  };

  const markup = targets
    .map((target) => {
      return `
      <li class="list-item" data-id="${target.id}">
        <label class="item__label">${convertTitleCase(target.quota)}</label>
        <input class="item__input" type="checkbox" ${
          target.checked ? "checked" : ""
        } />
      </li>
    `;
    })
    .join("");

  return new Handlebars.SafeString(markup);
});

Handlebars.registerHelper(
  "tableData",
  function (markedDays, firstDayIndex, prevLastDay, lastDay, currMonth, today) {
    let currDay = 1;
    let tableRows = [];
    let calendarOffDays = false;
    const numRows = 5;
    const numDays = 7;
    // Create rows
    for (let i = 0; i < numRows; i++) {
      const row = document.createElement("tr");
      // Populate row with data
      for (let z = 0; z < numDays; z++) {
        let month;
        // Calculating month
        if (i === 0 && z < firstDayIndex) {
          month = String(currMonth === 0 ? 11 : currMonth - 1);
        } else if (calendarOffDays) {
          month = String(currMonth === 11 ? 0 : currMonth + 1);
        } else month = currMonth + "";
        // Calculating day
        const day = String(
          i === 0 && z < firstDayIndex
            ? prevLastDay - (firstDayIndex - z - 1)
            : currDay
        );
        const dateObj = {
          month,
          day,
        };
        const html = `
        <td class="row-data" data-date="${`${dateObj.month}-${dateObj.day}`}">
          <div class="data__item-dot ${
            markedDays.some((markDay) => _.isEqual(markDay, dateObj))
              ? "data__item--active"
              : ""
          }"></div>
          
          <div class="data__item-wrapper ${
            `${dateObj.month}-${dateObj.day}` === today
              ? "data__item--today"
              : ""
          } 
            ${
              (i === 0 && z < firstDayIndex) || calendarOffDays
                ? "data__item--null"
                : ""
            }">
            ${
              i === 0 && z < firstDayIndex
                ? String(prevLastDay - (firstDayIndex - z - 1))
                : String(currDay)
            }
          </div>
        </td>
        `;
        row.insertAdjacentHTML("beforeend", html);
        if (i === 0 && z < firstDayIndex) continue;
        // Reset day when reach last day of month
        if (currDay === lastDay) {
          calendarOffDays = true;
          currDay = 0;
        }
        currDay++;
      }
      tableRows.push(row);
    }
    const markup = tableRows.map((row) => `<tr>${row.innerHTML}</tr>`).join("");
    return new Handlebars.SafeString(markup);
  }
);

Handlebars.registerHelper("bookmarkModelMarkup", function (bookmarks) {
  let modelItems = [];
  for (const bookmark of bookmarks) {
    const li = document.createElement("li");
    li.setAttribute("data-title", bookmark.name);
    const markup = `
      <img
        class="item__img"
        src="${bookmark.imageSrc}"
      />
      <p class="item__label item__label--name">${bookmark.name}</p>
    `;
    li.insertAdjacentHTML("beforeend", markup);
    modelItems.push(li);
  }
  const markup = modelItems
    .map(
      (modelItem) =>
        `<li class="list__item list__item--single" data-title="${modelItem.dataset.title}">${modelItem.innerHTML}</li>`
    )
    .join("");
  return new Handlebars.SafeString(markup);
});

Handlebars.registerHelper("bookmarkQuoteMarkup", function (bookmarks) {
  let groupedAuthors = [];
  const authorSet = new Set(bookmarks.map((quote) => quote.author));
  const groupedBookmarks = Array.from(authorSet);
  for (const authorName of groupedBookmarks) {
    const authorQuotes = bookmarks
      .filter((quote) => authorName === quote.author)
      .map((quote) => quote.text);
    const li = document.createElement("li");
    const authorMarkup = `
      <p class="item__label item__label--author">
        ${authorName}
      </p>
    `;
    const listEl = document.createElement("ul");
    listEl.classList.add("item__list");
    for (const quote of authorQuotes) {
      const quoteMarkup = `
        <li class="list__item list__item--single">
          <q>${quote}</q>
        </li>
      `;
      listEl.insertAdjacentHTML("beforeend", quoteMarkup);
    }
    li.insertAdjacentHTML("beforeend", authorMarkup);
    li.insertAdjacentElement("beforeend", listEl);
    groupedAuthors.push(li);
  }
  const markup = groupedAuthors
    .map(
      (listItem) =>
        `<li class="list__item list__item--group">${listItem.innerHTML}</li>`
    )
    .join("");
  return new Handlebars.SafeString(markup);
});
