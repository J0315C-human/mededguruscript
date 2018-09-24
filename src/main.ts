
import dom from './dom';
import siteFilters from './siteFilters';
import { Resource } from 'typings';
import { fetchAllResources } from './fetch';
import glob from './globals';

let someHaveLoaded = false;

setTimeout(() => {
  if (!someHaveLoaded) {
    dom.showLoadingSpinner();
  }
}, 2000);

fetchAllResources((allResources: Resource[]) => {
  someHaveLoaded = true;
  dom.createInitialControlsAndContainers(siteFilters.filterTree, siteFilters.filterOptionDomParams); // method will only perform its duties once
  glob.setResources(allResources);
});