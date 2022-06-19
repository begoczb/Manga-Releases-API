function getDate(year, month, day) {
  return new Date(+year, +month - 1, +day, 00, 00, 00);
}

function dateConversion(date, format) {
  const split = date.split("/");
  switch (format) {
    case "YYYYMMDD": {
      const [year, month, day] = split;
      return getDate(year, month, day);
    }
    case "YYYYDDMM": {
      const [year, day, month] = split;
      return getDate(year, month, day);
    }
    case "DDMMYYYY":
      const [day, month, year] = split;
      return getDate(year, month, day);
    case "MMDDYYYY":
    default: {
      const [month, day, year] = split;
      return getDate(year, month, day);
    }
  }
}

module.exports = { getDate, dateConversion };
