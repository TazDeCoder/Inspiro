"use strict";

const nameMonths = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
};

export const state = {
  calendar: {},
};

export function getCurrentDate() {
  // Helper function
  const getFirstDayIndex = (year, month) => new Date(year, month).getDay();
  const getLastDay = (year, month) => new Date(year, month, 0).getDate();
  // Getting current date and setting variables
  const currDate = new Date();
  state.calendar.currDay = currDate.getDate();
  state.calendar.currYear = currDate.getFullYear();
  state.calendar.currMonth = currDate.getMonth();
  const firstDayIndex = getFirstDayIndex(
    state.calendar.currYear,
    state.calendar.currMonth
  );
  const prevLastDay =
    state.calendar.currMonth === 0
      ? 31
      : getLastDay(state.calendar.currYear, state.calendar.currMonth);
  const lastDay = getLastDay(state.calendar.currYear, state.calendar.currMonth);
  const currDay = `${state.calendar.currMonth + 1}-${state.calendar.currDay}`;
  state.calendar.currDay = currDay;
  return { firstDayIndex, prevLastDay, lastDay, currDay };
}

export function setCurrentDate(month) {
  // Helper function
  const getFirstDayIndex = (year, month) => new Date(year, month).getDay();
  const getLastDay = (year, month) => new Date(year, month, 0).getDate();
  const prevLastDay = getLastDay(
    state.calendar.currYear,
    state.calendar.currMonth + 1
  );
  // Go back a year
  if (state.calendar.currMonth === 0 && month === 12) state.calendar.currYear--;
  // Go foward a year
  if (state.calendar.currMonth === 11 && month === 1) state.calendar.currYear++;
  // Setting calander variables
  const firstDayIndex = getFirstDayIndex(state.calendar.currYear, month - 1);
  const lastDay = getLastDay(state.calendar.currYear, month);
  const currDay = state.calendar.currDay;
  state.calendar.currMonth = month - 1;
  return { firstDayIndex, prevLastDay, lastDay, currDay };
}

export function getCurrentMonth() {
  const [currMonth] = Object.entries(nameMonths).find(
    (val) => val[1] === state.calendar.currMonth + 1
  );
  return currMonth;
}
