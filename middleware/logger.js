function logger(req, res, next) {
  const matchedColors = {
    GET: 'green',
    POST: 'yellow',
    PUT: 'blue',
    DELETE: 'red',
  };

  const colors = matchedColors[req.method];

  console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.url}`)[
    colors
  ];

  next();
}

export default logger;
