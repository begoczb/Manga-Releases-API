function getQueryForSearchVolume(urlQuery) {
  const query = {};

  if (urlQuery.title) {
    query.title = { $regex: new RegExp(urlQuery.title, "i") };
    if (query.title.length === 0) {
      res.status(400).json({ message: "Please provide a proper volume title" });
      return;
    }
  }

  if (urlQuery.ISBN) {
    query.ISBN = urlQuery.ISBN;
    if (query.ISBN.length === 0) {
      res.status(400).json({ message: "Please provide a proper volume ISBN" });
      return;
    }
  }

  if (urlQuery.number) {
    query.number = urlQuery.number;
    if (query.number.length === 0) {
      res.status(400).json({ message: "Please provide a volume number" });
      return;
    }
  }

  if (urlQuery.releaseDate) {
    query.releaseDate = urlQuery.releaseDate;
    if (query.releaseDate.length === 0) {
      res
        .status(400)
        .json({ message: "Please provide a correct release date" });
      return;
    }
  }

  return query;
}

module.exports = getQueryForSearchVolume;
