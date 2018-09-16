import { FilterFunctionSelections, Resource } from "typings";
import { filterByOptionsAndTreePath } from "./filters";
import siteFilters from './siteFilters';
import { displayData, setCurrentBreadcrumb } from "./dom";

class GodObject {
  // DOM things
  filtersCreated: boolean;

  // User input state
  selections: {
    [filterName: string]: string[];
  };
  filterPath: string[];

  // Data
  resources: Resource[];
  results: Resource[];

  constructor() {
    this.filtersCreated = false;
    this.selections = {
      filterByUserType: ['any'],
      filterByContentType: ['any'],
      filterByLanguage: ['any'],
    }
    this.filterPath = [];
    this.resources = [] as Resource[];
  }

  updateResults = () => {
    this.results = filterByOptionsAndTreePath(
      this.resources,
      siteFilters.filterTree,
      this.filterPath,
      siteFilters.filterOptions,
      this.selections
    );
  }
  getResources = () => this.resources;
  getFilterSelections = () => this.selections;
  getFilterPath = () => this.filterPath;
  setFilterPath = (newPath: string[]) => {
    this.filterPath = newPath;
    this.updateResults();
    displayData(this.results);
  }
  setFilterSelection = (selections: FilterFunctionSelections) => {
    this.selections = {
      ...this.selections,
      ...selections
    };
    this.updateResults();
    displayData(this.results);
    setCurrentBreadcrumb(this.filterPath);
  }
}

const global = new GodObject();
export default global;