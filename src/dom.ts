import { Resource, FilterTree } from './typings';
import { filterByOptionsAndTreePath } from './filters';
import { filterCollection, filterTree } from './siteFilters';
import { subcatIdToName } from './categories';
import glob, { getGlobalResources, getGlobalFilterSelections, getGlobalFilterPath } from './globals';

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
  filter.textContent = '. . '.repeat(depth) + branch.name;
  filter.classList.add('filterPath');
  const thisPath = path.concat(branch.name);

  filter.onclick = () => {
    glob.filterPath = thisPath;
    const filtered = filterByOptionsAndTreePath(getGlobalResources(), fullTree, thisPath, filterCollection, getGlobalFilterSelections())
    displayData(filtered);
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
    const filtered = filterByOptionsAndTreePath(getGlobalResources(), filterTree, getGlobalFilterPath(), filterCollection, getGlobalFilterSelections())
    displayData(filtered);
  }
  document.getElementById('optionUserType').onchange = (e: any) => {
    console.log(e.target.value);
    glob.selections = {
      ...glob.selections,
      filterByUserType: [e.target.value]
    }
    const filtered = filterByOptionsAndTreePath(getGlobalResources(), filterTree, getGlobalFilterPath(), filterCollection, getGlobalFilterSelections())
    displayData(filtered);
  }
  document.getElementById('optionLanguage').onchange = (e: any) => {
    console.log(e.target.value);
    glob.selections = {
      ...glob.selections,
      filterByLanguage: [e.target.value]
    }
    const filtered = filterByOptionsAndTreePath(getGlobalResources(), filterTree, getGlobalFilterPath(), filterCollection, getGlobalFilterSelections())
    displayData(filtered);
  }
}
export const createFilterButtons = (filterTree: FilterTree<any>) => {
  createFilterButtonsInner(filterTree, filterTree, 0, []);
  setHandlersForOptions();
}