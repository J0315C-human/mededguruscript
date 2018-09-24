import { FilterFunctionSelections, Resource } from "typings";
import { filterByOptionsAndTreePath } from "./filters";
import siteFilters from './siteFilters';
import dom from "./dom";

const FIRST_PAGE_QTY = 100;
const PAGE_QTY = 50;
class GodObject {
  // User input state
  selections: {
    [filterName: string]: string[];
  };
  filterPath: string[];
  qtyShown: number;
  showMorePressed: boolean;
  showMoreButtonVisible: boolean;
  // Data
  resources: Resource[];
  results: Resource[];

  constructor() {
    this.selections = {
      filterByUserType: ['All'],
      filterByContentType: ['All'],
      filterByLanguage: ['All'],
      filterByPediatricSpecific: [],
    }
    this.qtyShown = 0;
    this.showMoreButtonVisible = false;
    this.showMorePressed = false;
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
  setResources = (resources: Resource[]) => {
    this.resources = resources;
    this.updateResults();
    const qty = this.results.length;
    if (qty < FIRST_PAGE_QTY) {
      this.qtyShown = qty;
      this.showMoreButtonVisible = false;
    } else {
      if (!this.showMorePressed) {
        this.qtyShown = FIRST_PAGE_QTY;
        this.showMoreButtonVisible = true;
      }
    }
    this.updateDisplay();
  }
  updatePagination = () => {
    const qty = this.results.length;
    if (qty < FIRST_PAGE_QTY) {
      this.qtyShown = qty;
      this.showMoreButtonVisible = false;
    } else {
      this.qtyShown = FIRST_PAGE_QTY;
      this.showMoreButtonVisible = true;
    }
  }
  onClickShowMore = () => {
    this.showMorePressed = true;
    const more = this.qtyShown + PAGE_QTY;
    if (more > this.results.length) {
      this.qtyShown = this.results.length;
    } else {
      this.qtyShown = more;
    }
    this.updateDisplay();
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
    dom.showLoadingSpinner();
    this.updateResults();
    this.updatePagination();
    this.updateDisplay();
  }
}

const global = new GodObject();
export default global;