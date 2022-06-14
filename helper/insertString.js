function insertString(mainString, insString, pos) {
  if (typeof pos == "undefined") {
    pos = 0;
  }
  if (typeof insString == "undefined") {
    insString = "";
  }
  return mainString.slice(0, pos) + insString + mainString.slice(pos);
}

module.exports = insertString;
