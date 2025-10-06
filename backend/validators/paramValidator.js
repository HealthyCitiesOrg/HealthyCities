const { ValidationError } = require("../utils/errors");
const { ALLOWED_YEARS } = require("../utils/constants");

const validateCoordinates = (lat, lng) => {
  if (!lat || !lng) {
    throw new ValidationError("Missing lat or lng");
  }
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new ValidationError("Invalid lat or lng format");
  }
  if (latitude < -90 || latitude > 90) {
    throw new ValidationError("Latitude must be between -90 and 90");
  }
  if (longitude < -180 || longitude > 180) {
    throw new ValidationError("Longitude must be between -180 and 180");
  }
  return { latitude, longitude };
};

const validateYear = (year) => {
  if (!year) {
    throw new ValidationError("Missing year");
  }
  const yearInt = parseInt(year);
  if (isNaN(yearInt)) {
    throw new ValidationError("Invalid year format");
  }
  return yearInt;
};

const validateYearRange = (yearStart, yearEnd) => {
  const start = parseInt(yearStart);
  const end = parseInt(yearEnd);
  if (!ALLOWED_YEARS.includes(start) || !ALLOWED_YEARS.includes(end)) {
    throw new ValidationError(
      `Invalid years. Allowed years: ${ALLOWED_YEARS.join(", ")}`
    );
  }
  return { start, end };
};

const validateMonth = (month) => {
  if (!month) {
    throw new ValidationError("Missing month");
  }
  const monthInt = parseInt(month);
  if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
    throw new ValidationError("Month must be between 1 and 12");
  }
  return monthInt;
};

module.exports = {
  validateCoordinates,
  validateYear,
  validateYearRange,
  validateMonth,
};
