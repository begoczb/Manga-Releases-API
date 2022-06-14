function dateConversion(date, format) {
  let goodDate;
  if (format === "YYYYMMDD") {
    goodDate = date.split("/");
    goodDate = new Date(
      +goodDate[0],
      +goodDate[1] - 1,
      +goodDate[2],
      02,
      00,
      00
    );
  } else if (format === "MMDDYYYY") {
    goodDate = date.split("/");
    goodDate = new Date(
      +goodDate[2],
      +goodDate[0] - 1,
      +goodDate[1],
      02,
      00,
      00
    );
  } else if (format === "YYYYDDMM") {
    goodDate = date.split("/");
    goodDate = new Date(
      +goodDate[0],
      +goodDate[2] - 1,
      +goodDate[1],
      02,
      00,
      00
    );
  } else if (format === "DDMMYYYY") {
    goodDate = date.split("/");
    goodDate = new Date(
      +goodDate[2],
      +goodDate[1] - 1,
      +goodDate[0],
      02,
      00,
      00
    );
  } else {
    goodDate = date.split("/");
    goodDate = new Date(
      +goodDate[2],
      +goodDate[0] - 1,
      +goodDate[1],
      02,
      00,
      00
    );
  }

  return goodDate;
}

module.exports = dateConversion;
