function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "The user is not authorized" });
  }

  if (err.name === "ValidationError") {
    return res.status(401).json({ message: err });
  }

  console.log(err);
  return res.status(500).json({ message: "Internal Server Error" });
}

module.exports = errorHandler;
