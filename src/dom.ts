import { Resource, FilterTree, FilterFunctionSelections } from './typings';
import { filterByOptionsAndTreePath } from './filters';
import { filterCollection } from './siteFilters';

export const displayData = (data: Resource[]) => {
  const results = document.getElementById('results') as HTMLElement;
  if (!results) return;
  results.innerHTML = data.map(d => {
    const inner = `-${d.fields["Resource Title"]}, topic:${(d.fields["ABEM Model Subcategory"] || []).join('/')}, lang:${d.fields.Language.join('/')}, User: ${d.fields["User type"]}`;
    return `<div>${inner}</div>`;
  }).join('<br/>');
}

const createFilterButtonsInner = (branch: FilterTree<Resource>, fullTree: FilterTree<Resource>, testData: any, depth: number, path: string[], selections: FilterFunctionSelections) => {
  const el = document.getElementById('filters') as HTMLElement;
  const filter = document.createElement("div");
  filter.textContent = '. . '.repeat(depth) + branch.name;
  filter.classList.add('filterPath');
  const thisPath = path.concat(branch.name);

  filter.onclick = () => {
    const filtered = filterByOptionsAndTreePath(testData, fullTree, thisPath, filterCollection, selections)
    displayData(filtered);
  }
  el.appendChild(filter);

  if (!branch.children) return;
  branch.children.forEach(child => {
    createFilterButtonsInner(child, fullTree, testData, depth + 1, thisPath, selections);
  });
}

export const createFilterButtons = (testData: Resource[], filterTree: FilterTree<any>, selections: FilterFunctionSelections) => {
  createFilterButtonsInner(filterTree, filterTree, testData, 0, [], selections);
}