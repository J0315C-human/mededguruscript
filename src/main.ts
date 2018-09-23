
import dom from './dom';
import siteFilters from './siteFilters';
import { Resource } from 'typings';
import { fetchAllResources } from './fetch';
import glob from './globals';


fetchAllResources((allResources: Resource[]) => {
  console.log(allResources.length + ' resources loaded');
  dom.createInitialControlsAndContainers(siteFilters.filterTree, siteFilters.filterOptionDomParams); // method will only perform its duties once
  glob.resources = allResources;
  glob.updateResults();
  glob.updateDisplay();
});