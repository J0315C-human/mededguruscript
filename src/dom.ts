import { Resource, FilterTree, ElementWithTreeDepth } from './typings';
import { subcatIdToName } from './categories';
import glob from './globals';
import * as formatDate from 'date-fns/format';
import { customCss } from './customCss';

const t_containers = `
<div class="resource-catalog-page-category-wrapper">
<div class="resource-page-catalog-category-list">
  <h1 class="resource-page-catalog-category-header" id="categoriesHeading" >Categories</h1>
  <div class="w-dyn-list">
  <div id="categoryNav"></div>
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
  const type = resource.fields && resource.fields['Resource Type'] || 'Resource';
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
  filterElements: Map<string, ElementWithTreeDepth>;

  constructor() {
    this.controlsWereCreated = false;
    this.filterElements = new Map();
  }

  createPrereqs = () => {
    if (!this.prereqsWereCreated) {
      const elements = document.getElementsByClassName('resource-catalog-page-content-wrapper') as HTMLCollectionOf<HTMLElement>;
      if (!elements) return;
      const outer = elements.item(0);
      outer.innerHTML = customCss + t_containers;
      this.prereqsWereCreated = true;
    }
  }

  createInitialControlsAndContainers = (filterTree: FilterTree<any>) => {
    if (!this.prereqsWereCreated) {
      this.createPrereqs();
    }
    if (!this.controlsWereCreated) {
      this.createFilterButtons(filterTree, filterTree, 0, []);
      // this.setHandlersForOptions();
      this.controlsWereCreated = true;
    }
  }

  displayResources = (data: Resource[]) => {
    const results = document.getElementById('putResourcesHere') as HTMLElement;
    if (!results) return;

    results.innerHTML = data.map(d => {
      return t_resourceItem(d);
    }).join('');
  }

  displayBreadcrumb = (filterPath: string[]) => {
    // const bc = document.getElementById('breadcrumb') as HTMLElement;
    // bc.textContent = `Filter Path: ${filterPath.join(' -> ')}`;
  }

  createFilterButtons = (branch: FilterTree<Resource>, fullTree: FilterTree<Resource>, depth: number, path: string[]) => {
    const el = document.getElementById('putCategoriesHere') as HTMLElement;
    const filter = document.createElement("div");
    filter.innerHTML = t_categoryFilter(branch.name);
    filter.classList.add('resource-page-catalog-category-item', 'w-dyn-item');
    // should we hide the 'all' filter?
    if (depth !== 1) {
      filter.style.display = 'none';
    }

    const thisPath = path.concat(branch.name);

    filter.onclick = () => {
      glob.setFilterPath(thisPath);
      console.log(thisPath);
      this.navigateToBranch(thisPath, fullTree);
    }
    // filterKey uses parent branch name so that a subcat can belong to two categories.
    const filterKey = path[path.length - 1] + '/' + branch.name;
    this.filterElements.set(filterKey, { depth, name: branch.name, el: filter });
    el.appendChild(filter);

    if (!branch.children) return;
    branch.children.forEach(child => {
      this.createFilterButtons(child, fullTree, depth + 1, thisPath);
    });
  }

  setCurrentFocused = (leafBranchName: string) => {
    Array.from(this.filterElements.values()).forEach((e: ElementWithTreeDepth) => {
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
  }
  clearBackButton = () => {
    const btn = document.getElementById('categoryNav');
    if (!btn) { return; };
    btn.textContent = '';
    btn.onclick = () => 0;
  }

  setCategoriesHeading = (name: string) => {
    const btn = document.getElementById('categoriesHeading');
    if (!btn) { return; };
    btn.textContent = name;
  }

  navigateToBranch = (path: string[], fullTree: FilterTree<Resource>) => {
    this.setCategoriesHeading(path[path.length - 1]);
    const branch = this.getFilterTreeBranch(path, fullTree) as FilterTree<Resource>;
    if (branch.children) {
      if (path.length > 1) {
        this.setBackButton(path.slice(0, path.length - 1), fullTree)
      } else {
        this.clearBackButton();
      }
      const childNames = branch.children.map(c => c.name);
      // hide everything not on this level
      Array.from(this.filterElements.values()).forEach((e: ElementWithTreeDepth) => {
        if (childNames.includes(e.name)) {
          e.el.style.display = 'block';
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

  setHandlersForOptions = () => {
    document.getElementById('optionContentType').onchange = (e: any) => {
      console.log(e.target.value);
      glob.setFilterSelection({ filterByContentType: [e.target.value] });
    }
    document.getElementById('optionUserType').onchange = (e: any) => {
      console.log(e.target.value);
      glob.setFilterSelection({ filterByUserType: [e.target.value] });
    }
    document.getElementById('optionLanguage').onchange = (e: any) => {
      console.log(e.target.value);
      glob.setFilterSelection({ filterByLanguage: [e.target.value] });
    }
  }

}

const dom = new DomDomDom();

export default dom;