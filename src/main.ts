
import { createFilterButtons, displayData } from './dom';
import { filterByOptionsAndTreePath } from './filters';
import { filterTree, filterCollection } from './siteFilters';
import { Resource } from 'typings';
import { fetchAllResources } from './fetch';
import glob, { getGlobalFilterSelections, getGlobalFilterPath } from './globals';

export const doTheThing = (data: Resource[]) => {
  glob.resources = data;
  createFilterButtons(filterTree);
  const filtered = filterByOptionsAndTreePath(data, filterTree, getGlobalFilterPath(), filterCollection, getGlobalFilterSelections())
  displayData(filtered);
}

fetchAllResources((records: Resource[]) => {
  console.log(records.length + ' resources loaded');
  doTheThing(records);
})