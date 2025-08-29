import colors from 'colors';
function logger(req, res, next) {
  const matchedColors = {
    GET: 'green',
    POST: 'yellow',
    PUT: 'blue',
    DELETE: 'red',
  };

  const color = matchedColors[req.method];

  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.url}`[color]
  );

  next();
}

export default logger;
