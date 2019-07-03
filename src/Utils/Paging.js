import _ from "lodash";
/**
 * Return a pagingOptions for paginate schema
 * @param {import("@types").Request} req
 * @param {import("@types").Populate} populate
 * @param {Array<string>} select
 */
function options(req, populate = [], select = []) {
  let page = 1;
  let limit = 20;
  let sort = {};
  let pageNum = _.parseInt(req.query.page);
  if (!_.isNaN(pageNum)) {
    page = pageNum;
  }
  let limitNum = _.parseInt(req.query.limit);
  if (!_.isNaN(limitNum)) {
    limit = limitNum;
  }
  if (_.size(req.query.sort) > 0) {
    let params = _.split(req.query.sort, "|");
    for (let i = 0; i < params.length; i += 2) sort[params[i]] = params[i + 1];
  }
  return {
    page: page,
    limit: limit,
    populate: populate,
    select: select,
    sort: sort
  };
}

function queries() {
  let queries = {};
  return queries;
}

export default {
  options,
  queries
};
