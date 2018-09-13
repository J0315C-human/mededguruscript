import { FilterTree, FilterFunctionCollection, FilterFunctionSelections } from "./typings";

export function filterDataByTreePath<T>(data: T[], branch: FilterTree<T>, treePath: string[]): T[] {
  if (!treePath.length) return data;
  const filtered = data.filter(branch.filter);
  const children = branch && branch.children || false;
  const newPath = treePath.filter(p => p !== branch.name);
  if (!children && newPath.length) throw new Error(`Filter Tree leaf node reached, leftover filter path: "[${treePath.join('->')}]"`);
  if (!children || !newPath.length) return filtered;
  const childFilterName = newPath[0];
  const childBranch = children.find((filt => filt.name === childFilterName));
  if (!childBranch) throw new Error(`Tree Branch not found for "${childFilterName}"`);
  return filterDataByTreePath(filtered, childBranch, newPath);
}

export function filterDataByFilterOptions<T>(data: T[], filters: FilterFunctionCollection<T>, selections: FilterFunctionSelections): T[] {
  let filtered = data;
  for (let filterName in selections) {
    if (filters[filterName] !== undefined) {
      filtered = filters[filterName](selections[filterName])(filtered);
    } else {
      console.log('no filter function for ' + filterName)
    }
  }
  return filtered;
}

export function filterByOptionsAndTreePath<T>(data: T[], branch: FilterTree<T>, treePath: string[], filters: FilterFunctionCollection<T>, selections: FilterFunctionSelections) {
  let filtered = filterDataByTreePath(data, branch, treePath);
  filtered = filterDataByFilterOptions(filtered, filters, selections);
  return filtered;
}