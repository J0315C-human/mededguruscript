import { Resource, FilterTree, ElementWithTreeDepth } from './typings';
import { subcatIdToName } from './categories';
import glob from './globals';


class DomDomDom {
  controlsWereCreated: boolean;
  filterElements: Map<string, ElementWithTreeDepth>;

  constructor() {
    this.controlsWereCreated = false;
    this.filterElements = new Map();
  }

  createInitialControls = (filterTree: FilterTree<any>) => {
    if (!this.controlsWereCreated) {
      this.createFilterButtons(filterTree, filterTree, 0, []);
      this.setHandlersForOptions();
      this.controlsWereCreated = true;
    }
  }

  displayResources = (data: Resource[]) => {
    const results = document.getElementById('results') as HTMLElement;
    if (!results) return;
    results.innerHTML = data.map(d => {
      const inner = `-${d.fields["Resource Title"]}, topic:${
        ((d.fields["ABEM Model Subcategory"] || []).map(id => {
          if (!subcatIdToName.get(id)) {
            console.log('No subcategory name for for ID: "' + id + '"');
            return 'NONE';
          }
          return subcatIdToName.get(id);
        }) || []).join('/')
        }, lang:${d.fields.Language && d.fields.Language.join('/') || 'NONE'}, User: ${d.fields["User type"]}`;
      return `<div>${inner}</div>`;
    }).join('<br/>');
  }

  displayBreadcrumb = (filterPath: string[]) => {
    const bc = document.getElementById('breadcrumb') as HTMLElement;
    bc.textContent = `Filter Path: ${filterPath.join(' -> ')}`;
  }

  expandPathChildren = (filterPath: string[]) => {

  }

  createFilterButtons = (branch: FilterTree<Resource>, fullTree: FilterTree<Resource>, depth: number, path: string[]) => {
    const el = document.getElementById('filters') as HTMLElement;
    const filter = document.createElement("div");
    filter.textContent = '_____'.repeat(depth) + branch.name;
    filter.classList.add('filterPath');
    // should we hide the 'all' filter?
    if (depth === 2) {
      filter.style.display = 'none';
    }

    const thisPath = path.concat(branch.name);

    filter.onclick = () => {
      glob.setFilterPath(thisPath);
      if (branch.children) {
        this.hideAllSubCategories();
        branch.children.forEach(ft => {
          const id = branch.name + '/' + ft.name;
          const element = this.filterElements.get(id) as ElementWithTreeDepth;
          if (!element) return;
          element.el.style.display = 'block';
        })
        this.panToTreeLevel(depth + 1);
      }
    }
    // filterKey uses parent branch name so that a subcat can belong to two categories.
    const filterKey = path[path.length - 1] + '/' + branch.name;
    this.filterElements.set(filterKey, { depth, el: filter });
    el.appendChild(filter);

    if (!branch.children) return;
    branch.children.forEach(child => {
      this.createFilterButtons(child, fullTree, depth + 1, thisPath);
    });
  }

  hideAllSubCategories = () => {
    Array.from(this.filterElements.values()).forEach((e: ElementWithTreeDepth) => {
      if (e.depth === 2) {
        e.el.style.display = 'none';
      }
    })
  }

  panToTreeLevel = (level: number) => {
    console.log('PAN TO TREE LEVEL ' + level);
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