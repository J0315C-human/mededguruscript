import { FilterFunctionSelections, Resource } from "typings";

const glob = {
  filtersCreated: false,
  selections: {
    filterByUserType: ['Learners']
  } as FilterFunctionSelections,
  filterPath: [],
  resources: [] as Resource[],
}

export const getGlobalResources = () => glob.resources;

export const getGlobalFilterSelections = () => glob.selections;
export const getGlobalFilterPath = () => glob.filterPath;

export default glob;