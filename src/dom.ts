import { Resource, FilterTree, ElementRecord, FilterOptionParams } from './typings';
import { subcatIdToName } from './categories';
import glob from './globals';
import * as formatDate from 'date-fns/format';
import { customCss } from './customCss';
import MultiSelect from './MultiSelect';
import CheckBox from './CheckBox';

const START_DEPTH = 1;
export const getFirstElementByClass = (className: string) => {
  const elements = document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>;
  if (!elements) return undefined;
  return elements.item(0);
}

export const loadingDom = `<div class="loadingOuter">
  <div class="loadingSpinner"></div>
</div>
`;

export const headerDom = `<h1 class="resource-page-catalog-category-header" id="categoriesHeading" >Categories</h1>`;
const t_containers = `
<div class="resource-catalog-page-category-wrapper">
<div class="resource-page-catalog-category-list">
  <div id="putOptionsHere" ></div>
  <div id="categoryNav" style="display: none;"></div>
  <div class="w-dyn-list">
    <div class="w-dyn-items" id="putCategoriesHere">
    </div>
  </div>
</div>
</div>
<div class="resource-catalog-page-posts-wrapper">
  <div class="resource-catalog-page-post-list-wrapper w-dyn-list">
    <div class="resource-catalog-page-post-list w-dyn-items" id="putResourcesHere"></div>
  </div>
</div>`;

const t_categoryFilter = (categoryName: string) => `<a role="button"
class="resource-page-catalog-category-link hoverLink">${categoryName}</a>`;

export const t_resourceItem = (resource: Resource) => {
  const date = resource.createdTime && formatDate(resource.createdTime, 'DD/MM/YYYY') || '(date unknown)';
  const type = resource.fields
    && resource.fields['Resource Type'] && resource.fields['Resource Type'].join(', ') || 'Resource';
  const url = resource.fields && resource.fields['Resource URL'] || '-';
  const source = resource.fields && resource.fields['Source'] || 'Source Unknown';
  const logo = resource.fields && resource.fields['Logo'] && resource.fields['Logo'][0];
  const logoSrc = logo && logo.url || '';
  const title = resource.fields && resource.fields["Resource Title"] || 'No Name';
  const category = resource.fields && resource.fields["ABEM Model Subcategory"]
    && resource.fields["ABEM Model Subcategory"].map((id: string) => subcatIdToName.get(id)).join(', ') ||
    resource.fields["Non-Clinical Subcategory"] && resource.fields["Non-Clinical Subcategory"].join(', ');
  return `
<div class="resource-catalog-page-post-item w-dyn-item">
  <a href="${url}" class="resource-catalog-page-post-link-wrapper w-inline-block">
    <div class="resource-catalog-page-post-top-section">
        <div class="resource-catalog-page-post-top-wrapper">
          <div class="catalog-post-type">${type}</div>
          <div class="upload-date-wrapper">
              <div>Updated</div>
              <div class="catalog-post-upload-date">${date}</div>
          </div>
        </div>
        <h1 class="resource-post-title">${title}</h1>
    </div>
    <div class="resource-catalog-page-post-bottom-wrapper">
        <div class="resource-post-source-wrapper">
          <img width="32" src="${logoSrc}" class="resource-post-source-image" />
          <div class="catalog-source-name">${source}</div>
        </div>
        <div class="category-wrapper">
          <div class="catalog-post-category w-dyn-bind-empty"></div>
          <div class="catalog-post-category">${category}</div>
        </div>
    </div>
  </a>
</div>`
};

class DomDomDom {
  controlsWereCreated: boolean;
  prereqsWereCreated: boolean;
  filterElements: Map<string, ElementRecord>;
  multiSelects: MultiSelect[];
  checkBoxes: CheckBox[];
  sectionHeadings: Map<string, { el: HTMLElement; visible: boolean }>;

  constructor() {
    this.prereqsWereCreated = false;
    this.controlsWereCreated = false;
    this.filterElements = new Map();
    this.multiSelects = [];
    this.checkBoxes = [];
    this.sectionHeadings = new Map();
  }

  showLoadingSpinner = () => {
    const outer = document.getElementById('putResourcesHere') as HTMLElement;
    outer.innerHTML = loadingDom;
  }

  createPrereqs = () => {
    const outer = getFirstElementByClass('resource-catalog-page-content-wrapper')
    outer.innerHTML = customCss + t_containers;
    const links = getFirstElementByClass('resource-catalog-links-wrapper');
    this.prereqsWereCreated = true;
    if (!links) return;
    links.innerHTML = '';
  }

  createInitialControlsAndContainers = (filterTree: FilterTree<any>, optionsParams: FilterOptionParams[]) => {
    if (!this.prereqsWereCreated) {
      this.createPrereqs();
    }
    if (!this.controlsWereCreated) {
      this.createOptions(optionsParams);
      this.createFilterButtons(filterTree, filterTree, 0, []);
      // this.setHandlersForOptions();
      this.controlsWereCreated = true;
    }
  }

  addShowMoreButton = (parentDiv: HTMLElement) => {
    const btn = document.createElement('div');
    btn.textContent = 'SHOW MORE';
    btn.classList.add('showMoreButton');
    btn.onclick = () => {
      glob.onClickShowMore();
    }
    parentDiv.appendChild(btn);
  }

  displayResources = (data: Resource[]) => {
    const resultsDiv = document.getElementById('putResourcesHere') as HTMLElement;
    if (!resultsDiv) return;
    resultsDiv.innerHTML = data.slice(0, glob.qtyShown).map(d => {
      return t_resourceItem(d);
    }).join('');
    if (glob.showMoreButtonVisible) {
      this.addShowMoreButton(resultsDiv);
    }
  }

  createOptions = (optionsParams: FilterOptionParams[]) => {
    const parent = document.getElementById('putOptionsHere') as HTMLElement;
    optionsParams.forEach(optParams => {
      if (optParams.inputType === 'checkBox') {
        const cb = new CheckBox(parent, optParams.name, optParams.filterName);
        this.checkBoxes.push(cb);
      } else if (optParams.inputType === 'multiSelect') {

        const ms = new MultiSelect(parent, optParams.name, optParams.options, optParams.filterName);
        this.multiSelects.push(ms);
      }
    })
  }

  createFilterButtons = (branch: FilterTree<Resource>, fullTree: FilterTree<Resource>, depth: number, path: string[]) => {
    const el = document.getElementById('putCategoriesHere') as HTMLElement;
    const headingName = branch.section;
    if (!this.sectionHeadings.has(headingName)) {
      const sectionHeading = document.createElement('h1');
      sectionHeading.classList.add('resource-page-catalog-category-header', 'inlineResourceHeader');
      if (depth === START_DEPTH) {
        sectionHeading.style.display = 'block';
      } else {
        sectionHeading.style.display = 'none';
      }
      sectionHeading.textContent = headingName;
      this.sectionHeadings.set(headingName, { el: sectionHeading, visible: depth === START_DEPTH });
      el.appendChild(sectionHeading);
    }
    const filter = document.createElement("div");
    filter.innerHTML = t_categoryFilter(branch.name);
    filter.classList.add('resource-page-catalog-category-item', 'w-dyn-item');
    // hide the 'all' filter
    if (depth !== START_DEPTH) {
      filter.style.display = 'none';
    }
    const thisPath = path.concat(branch.name);

    filter.onclick = () => {
      glob.setFilterPath(thisPath);
      this.navigateToBranch(thisPath, fullTree);
    }
    const parentName = path[path.length - 1];
    // filterKey uses parent branch name so that a subcat can belong to two categories,
    // ie so it can have two mappings in the this.filterElements map.
    const filterKey = path[path.length - 1] + '/' + branch.name;
    this.filterElements.set(filterKey, {
      depth,
      parentName,
      name: branch.name,
      el: filter,
      section: branch.section,
    });
    el.appendChild(filter);

    if (!branch.children) return;
    branch.children.forEach(child => {
      this.createFilterButtons(child, fullTree, depth + 1, thisPath);
    });
  }

  setCurrentFocused = (leafBranchName: string) => {
    Array.from(this.filterElements.values()).forEach((e: ElementRecord) => {
      if (e.name === leafBranchName) {
        e.el.style.opacity = '0.3';
      } else {
        e.el.style.opacity = '1';
        e.el.style.transform = '';
      }
    })
  }

  setBackButton = (parentPath: string[], fullTree: FilterTree<Resource>) => {
    const btn = document.getElementById('categoryNav');
    const name = parentPath[parentPath.length - 1];
    if (!btn) { return; };
    btn.innerHTML = `&larr; Back to ${name}`;
    btn.onclick = () => {
      this.navigateToBranch(parentPath, fullTree);
    }
    btn.style.display = 'block';
  }

  clearBackButton = () => {
    const btn = document.getElementById('categoryNav');
    if (!btn) { return; };
    btn.textContent = '';
    btn.onclick = () => 0;
    btn.style.display = 'none';
  }

  hideAllSectionHeadings = () => {
    this.sectionHeadings.forEach((sectionHeading, key) => {
      if (sectionHeading.visible) {
        sectionHeading.el.style.display = 'none';
        sectionHeading.visible = false;
      }
    })
  }

  navigateToBranch = (path: string[], fullTree: FilterTree<Resource>) => {
    const branch = this.getFilterTreeBranch(path, fullTree) as FilterTree<Resource>;
    if (branch.children !== undefined) {
      this.hideAllSectionHeadings();
      if (path.length > 1) {
        this.setBackButton(path.slice(0, path.length - 1), fullTree)
      } else {
        this.clearBackButton();
      }
      const childNames = branch.children.map(c => c.name);
      // hide everything not on this level
      Array.from(this.filterElements.values()).forEach((e: ElementRecord) => {

        if (childNames.includes(e.name) && e.parentName === branch.name) {
          e.el.style.display = 'block';
          const sectionHeading = this.sectionHeadings.get(e.section);
          if (!sectionHeading.visible) {
            sectionHeading.el.style.display = 'block';
            sectionHeading.visible = true;
          }
        } else {
          e.el.style.display = 'none';
        }
      });
    } else {
      this.setCurrentFocused(branch.name);
    }
  }

  getFilterTreeBranch = (path: string[], tree: FilterTree<Resource>) => {
    const newPath = path.slice(1);
    if (!newPath.length) return tree;
    if (tree && tree.children) {
      const child = tree.children.find(c => c.name === newPath[0]);
      if (!child) {
        throw new Error("no child found!");
      }
      return this.getFilterTreeBranch(newPath, child);
    }
    throw new Error('ran out of filter tree children');
  }

}

const dom = new DomDomDom();

export default dom;