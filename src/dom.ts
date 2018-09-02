import { DataEntity, FilterTree } from './typings';
import { filterDataByTreePath } from './filters';

export const displayData = (data: DataEntity[]) => {
  const results = document.getElementById('results') as HTMLElement;
  if (!results) return;
  results.innerHTML = data.map(d => {
    const inner = `-${d.name}. by ${d.authors.join(', ')}, sub:${d.subject}, lang:${d.language}${d.isGood ? ' -GOOD' : ''}`;
    return `<div>${inner}</div>`;
  }).join('<br/>');
}

const createFilterButtonsInner = (branch: FilterTree<DataEntity>, fullTree: FilterTree<DataEntity>, testData: any, depth: number, path: string[]) => {
  const el = document.getElementById('filters') as HTMLElement;
  const filter = document.createElement("div");
  filter.textContent = '. . '.repeat(depth) + branch.name;
  filter.classList.add('filterPath');
  const thisPath = path.concat(branch.name);

  filter.onclick = () => {
    const filtered = filterDataByTreePath(testData, fullTree, thisPath);
    displayData(filtered);
  }
  el.appendChild(filter);

  if (!branch.children) return;
  branch.children.forEach(child => {
    createFilterButtonsInner(child, fullTree, testData, depth + 1, thisPath);
  });
}

export const createFilterButtons = (testData: DataEntity[], filterTree: FilterTree<any>) => {
  createFilterButtonsInner(filterTree, filterTree, testData, 0, []);
}