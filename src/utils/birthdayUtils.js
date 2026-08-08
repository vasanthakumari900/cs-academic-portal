// src/utils/birthdayUtils.js

/**
 * Calculates birthday status based on DOB string (DD/MM/YYYY or YYYY-MM-DD)
 * Returns true for `isUpcoming` if birthday is within 5 days in advance (0 to 5 days left).
 *
 * @param {string} dobString - Student Date of Birth
 * @param {Date} [referenceDate] - Current date (defaults to today)
 * @returns {Object} { isUpcoming: boolean, isToday: boolean, daysLeft: number, nextAge: number, birthYear: number, formattedDobDate: string }
 */
// Consistent fallback shape (birthYear always included, matching the success path)
const EMPTY_RESULT = { isUpcoming: false, isToday: false, daysLeft: 999, nextAge: 0, birthYear: 0, formattedDobDate: "" };

export function getBirthdayStatus(dobString, referenceDate = new Date()) {
  if (!dobString) {
    return EMPTY_RESULT;
  }

  let day, month, birthYear;
  const str = String(dobString).trim();

  if (str.includes("/")) {
    const parts = str.split("/");
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1; // 0-indexed month
    birthYear = parseInt(parts[2], 10);
  } else if (str.includes("-")) {
    const parts = str.split("-");
    if (parts[0].length === 4) {
      birthYear = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      birthYear = parseInt(parts[2], 10);
    }
  } else {
    return EMPTY_RESULT;
  }

  if (isNaN(day) || isNaN(month) || isNaN(birthYear)) {
    return EMPTY_RESULT;
  }

  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth();
  const currentDate = referenceDate.getDate();

  // Leap-day handling: for a Feb 29 DOB, JS `new Date(year, 1, 29)` silently rolls over to
  // Mar 1 in non-leap years. Convention: celebrate on Feb 28 instead so the countdown stays
  // accurate (1 day before on Feb 27, TODAY on Feb 28) in non-leap years.
  const isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const getCelebrationDay = (year) =>
    month === 1 && day === 29 && !isLeapYear(year) ? 28 : day;

  const todayZero = new Date(currentYear, currentMonth, currentDate);

  // This year's birthday (or celebration day for Feb 29 DOBs)
  let nextBirthday = new Date(currentYear, month, getCelebrationDay(currentYear));

  // If this year's birthday has passed before today's date, look at next year's birthday
  if (nextBirthday < todayZero) {
    nextBirthday = new Date(currentYear + 1, month, getCelebrationDay(currentYear + 1));
  }

  // Difference in calendar days
  const diffTime = nextBirthday.getTime() - todayZero.getTime();
  const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const isToday = daysLeft === 0;
  const isUpcoming = daysLeft >= 0 && daysLeft <= 5;
  const nextAge = nextBirthday.getFullYear() - birthYear;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const formattedDobDate = `${day} ${monthNames[month]}`;

  return {
    isUpcoming,
    isToday,
    daysLeft,
    nextAge,
    formattedDobDate,
    birthYear
  };
}
