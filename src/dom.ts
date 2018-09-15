import { Resource, FilterTree } from './typings';
import { subcatIdToName } from './categories';
import glob, { getGlobalFilterPath, update } from './globals';

export const displayData = (data: Resource[]) => {
  const results = document.getElementById('results') as HTMLElement;
  if (!results) return;
  results.innerHTML = data.map(d => {
    const inner = `-${d.fields["Resource Title"]}, topic:${
      ((d.fields["ABEM Model Subcategory"] || []).map(id => {
        if (!subcatIdToName.get(id)) {
          console.log('none for "' + id + '"');
          return 'NONE';
        }
        return subcatIdToName.get(id);
      }) || []).join('/')
      }, lang:${d.fields.Language && d.fields.Language.join('/') || 'NONE'}, User: ${d.fields["User type"]}`;
    return `<div>${inner}</div>`;
  }).join('<br/>');
}

const createFilterButtonsInner = (branch: FilterTree<Resource>, fullTree: FilterTree<Resource>, depth: number, path: string[]) => {
  if (depth === 0) {
    if (glob.filtersCreated) return;
    glob.filtersCreated = true;
  }
  const el = document.getElementById('filters') as HTMLElement;
  const filter = document.createElement("div");
  filter.textContent = '_____'.repeat(depth) + branch.name;
  filter.classList.add('filterPath');
  const thisPath = path.concat(branch.name);

  filter.onclick = () => {
    glob.filterPath = thisPath;
    update();
  }
  el.appendChild(filter);

  if (!branch.children) return;
  branch.children.forEach(child => {
    createFilterButtonsInner(child, fullTree, depth + 1, thisPath);
  });
}

const setHandlersForOptions = () => {
  document.getElementById('optionContentType').onchange = (e: any) => {
    console.log(e.target.value);
    glob.selections = {
      ...glob.selections,
      filterByContentType: [e.target.value]
    }
    update();
  }
  document.getElementById('optionUserType').onchange = (e: any) => {
    console.log(e.target.value);
    glob.selections = {
      ...glob.selections,
      filterByUserType: [e.target.value]
    }
    update();
  }
  document.getElementById('optionLanguage').onchange = (e: any) => {
    console.log(e.target.value);
    glob.selections = {
      ...glob.selections,
      filterByLanguage: [e.target.value]
    }
    update();
  }
}
export const createFilterButtons = (filterTree: FilterTree<any>) => {
  createFilterButtonsInner(filterTree, filterTree, 0, []);
  setHandlersForOptions();
}

export const setCurrentBreadcrumb = () => {
  const path = getGlobalFilterPath();

  const bc = document.getElementById('breadcrumb') as HTMLElement;

  bc.textContent = `Filter Path: ${path.join(' -> ')}`;
}