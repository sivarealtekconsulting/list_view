import { AUTH_URL, fetchJsonWithAuth } from './dropdownApi';

/**
 * GET /module-data-list — single API for list data with search, filter, sort, tabs.
 *
 * @param {object} opts
 * @param {string}   opts.module      jobs | candidates | submissions | vendors
 * @param {number}   [opts.limit]     page size (default 20)
 * @param {number}   [opts.offset]    skip count (default 0)
 * @param {string}   [opts.tabValue]  filter to one tab key; '' or 'all' = no filter
 * @param {string}   [opts.tabField]  override server-side tab field
 * @param {string}   [opts.search]    global text search across visible text fields
 * @param {string}   [opts.sort]      field path to sort by  (e.g. 'jobTitle')
 * @param {string}   [opts.sortDir]   'asc' | 'desc'
 * @param {Array}    [opts.filters]   array of FilterCondition objects:
 *                                    [{ field, op, value?, values? }]
 *                                    ops: eq|ne|in|nin|contains|gt|gte|lt|lte|isEmpty|notEmpty
 * @returns {{ data, total, tabs, tabField }}
 */
export async function getModuleDataList({
  module,
  limit = 20,
  offset = 0,
  tabValue = '',
  tabField = '',
  search = '',
  sort = '',
  sortDir = '',
  filters = [],
} = {}) {
  const params = new URLSearchParams({
    module,
    limit:  String(limit),
    offset: String(offset),
  });

  if (tabField)                          params.set('tabField',  tabField);
  if (tabValue && tabValue !== 'all')    params.set('tabValue',  tabValue);
  if (search)                            params.set('search',    search);
  if (sort)                              params.set('sort',      sort);
  if (sortDir)                           params.set('sortDir',   sortDir);
  if (filters?.length)                   params.set('filters',   JSON.stringify(filters));

  const json = await fetchJsonWithAuth(AUTH_URL, `/module-data-list?${params}`);
  const payload = json.data ?? json;

  return {
    data:     Array.isArray(payload?.data) ? payload.data : [],
    total:    payload?.total    ?? 0,
    tabs:     Array.isArray(payload?.tabs) ? payload.tabs : [],
    tabField: payload?.tabField ?? '',
  };
}
