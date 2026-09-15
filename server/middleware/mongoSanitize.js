const mongoSanitize = () => (req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (key.startsWith('$')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  // In Express 5, req.query is a read-only getter.
  // We clone it, sanitize the cloned object, and redefine the property to be writable.
  if (req.query) {
    try {
      const sanitizedQuery = JSON.parse(JSON.stringify(req.query));
      sanitize(sanitizedQuery);
      Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      console.error('Error sanitizing query params:', e);
    }
  }

  next();
};

module.exports = mongoSanitize;
