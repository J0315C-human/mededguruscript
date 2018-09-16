
import { createFilterButtons, displayData } from './dom';
import { filterByOptionsAndTreePath } from './filters';
import siteFilters from './siteFilters';
import { Resource } from 'typings';
import { fetchAllResources } from './fetch';
import glob from './globals';

export const doTheThing = (data: Resource[]) => {
  glob.resources = data;
  createFilterButtons(siteFilters.filterTree);
  const filtered = filterByOptionsAndTreePath(
    data,
    siteFilters.filterTree,
    glob.getFilterPath(),
    siteFilters.filterOptions,
    glob.getFilterSelections())
  displayData(filtered);
}

fetchAllResources((records: Resource[]) => {
  console.log(records.length + ' resources loaded');
  doTheThing(records);
})