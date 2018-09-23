import { FilterFunctionSelections, Resource } from "typings";
import { filterByOptionsAndTreePath } from "./filters";
import siteFilters from './siteFilters';
import dom from "./dom";

class GodObject {

  // User input state
  selections: {
    [filterName: string]: string[];
  };
  filterPath: string[];

  // Data
  resources: Resource[];
  results: Resource[];

  constructor() {
    this.selections = {
      filterByUserType: ['any'],
      filterByContentType: ['any'],
      filterByLanguage: ['any'],
    }
    this.filterPath = [];
    this.resources = [] as Resource[];
  }

  getResources = () => this.resources;
  getFilterSelections = () => this.selections;
  getFilterPath = () => this.filterPath;
  setFilterPath = (newPath: string[]) => {
    this.filterPath = newPath;
    this.update();
  }
  setFilterSelection = (selections: FilterFunctionSelections) => {
    this.selections = {
      ...this.selections,
      ...selections
    };
    this.update();
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
  updateDisplay = () => {
    dom.displayResources(this.results);
  }
  update = () => {
    this.updateResults();
    this.updateDisplay();
  }
}

const global = new GodObject();
export default global;