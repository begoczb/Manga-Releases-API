function getQueryForSearch(urlQuery) {
  const query = {};

  if (urlQuery.name) {
    query.name = { $regex: new RegExp(urlQuery.name, "i") };
    if (query.name.length === 0) {
      res.status(400).json({ message: "Please provide a series name" });
      return;
    }
  }

  if (urlQuery.authors) {
    if (typeof urlQuery.authors === "string") {
      urlQuery.authors = [urlQuery.authors];
    }
    query.authors = {
      // $or: [
      // {
      $in: urlQuery.authors.map((author) => new RegExp(author, "i")),
      // },
      // ],
    };
    if (query.authors.length === 0) {
      res.status(400).json({ message: "Please provide an author's name" });
      return;
    }
  }

  if (urlQuery.genres) {
    if (typeof urlQuery.genres === "string") {
      urlQuery.genres = [urlQuery.genres];
    }
    query.genres = {
      $in: urlQuery.genres.map((genre) => new RegExp(genre, "i")),
    };
    if (query.genres.length === 0) {
      res.status(400).json({ message: "Please provide a proper series genre" });
      return;
    }
  }

  if (urlQuery.publisher) {
    query.publisher = { $regex: new RegExp(urlQuery.publisher, "i") };
    if (query.publisher.length === 0) {
      res.status(400).json({ message: "Please provide a correct publisher" });
      return;
    }
  }

  return query;
}

module.exports = getQueryForSearch;
