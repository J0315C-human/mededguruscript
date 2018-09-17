import { Resource, FilterTree } from './typings';
import { subcatIdToName } from './categories';
import glob from './globals';


const createFilterButtons = (branch: FilterTree<Resource>, fullTree: FilterTree<Resource>, depth: number, path: string[]) => {
  const el = document.getElementById('filters') as HTMLElement;
  const filter = document.createElement("div");
  filter.textContent = '_____'.repeat(depth) + branch.name;
  filter.classList.add('filterPath');
  const thisPath = path.concat(branch.name);

  filter.onclick = () => {
    glob.setFilterPath(thisPath);
  }
  el.appendChild(filter);

  if (!branch.children) return;
  branch.children.forEach(child => {
    createFilterButtons(child, fullTree, depth + 1, thisPath);
  });
}

const setHandlersForOptions = () => {
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

class DomHandler {
  controlsWereCreated: boolean;

  constructor() {
    this.controlsWereCreated = false;
  }

  createInitialControls = (filterTree: FilterTree<any>) => {
    if (!this.controlsWereCreated) {
      createFilterButtons(filterTree, filterTree, 0, []);
      setHandlersForOptions();
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
}

const dom = new DomHandler();

export default dom;