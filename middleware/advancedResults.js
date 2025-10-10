const advancedResults = (Model, populate) => async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ['select', 'sort', 'page', 'limit'];

  removeFields.forEach((field) => delete reqQuery[field]);

  if (reqQuery.location === 'all') {
    delete reqQuery.location;
  }

  let queryStr = JSON.stringify(reqQuery);

  // filtering using MongoDB queries operators and normal filtering
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|eq|regex|in)\b/g,
    (match) => `$${match}`
  );
  query = Model.find(JSON.parse(queryStr)).populate(populate);

  // chain select() schema type to Model
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // chain sort() schema type to Model
  if (req.query.sort) {
    const fields = req.query.sort.split(',').join(' ');
    query = query.sort(fields);
  } else {
    query = query.sort({ createdAt: -1 });
  }

  // Pagination
  const pagination = {};
  const limit = Number(req.query.limit) || 4;
  const page = Number(req.query.page) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Model.countDocuments(query);

  query = await query.skip(startIndex).limit(limit);

  pagination.total_page = Math.ceil(total / limit);

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const results = await query;

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    results,
  };

  next();
};

export default advancedResults;
