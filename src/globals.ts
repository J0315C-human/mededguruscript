import { FilterFunctionSelections, Resource } from "typings";
import { filterByOptionsAndTreePath } from "./filters";
import { filterTree, filterCollection } from './siteFilters';
import { displayData, setCurrentBreadcrumb } from "./dom";

const glob = {
  filtersCreated: false,
  selections: {
    filterByUserType: ['any'],
    filterByContentType: ['any'],
    filterByLanguage: ['any'],
  } as FilterFunctionSelections,
  filterPath: [],
  resources: [] as Resource[],
}

export const getGlobalResources = () => glob.resources;

export const getGlobalFilterSelections = () => glob.selections;
export const getGlobalFilterPath = () => glob.filterPath;

export const update = () => {
  const filtered = filterByOptionsAndTreePath(
    getGlobalResources(),
    filterTree,
    getGlobalFilterPath()
    , filterCollection,
    getGlobalFilterSelections()
  )
  displayData(filtered);
  setCurrentBreadcrumb();
}

export default glob;