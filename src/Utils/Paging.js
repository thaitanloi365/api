import _ from "lodash";
/**
 * Return a pagingOptions for paginate schema
 * @param {import("@Types").Request} req
 * @param {import("@Types").Populate} populate
 * @param {Array<string> | string} select
 * @param {import("@Types").Sort} sort
 */
function options(req, populate = [], select = [], sort = {}) {
  let page = 1;
  let limit = 20;
  let _sort = sort;
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
  return { page, limit, populate, select, sort: _sort };
}

function queries() {
  let queries = {};
  return queries;
}

export default {
  options,
  queries
};
