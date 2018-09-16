import { Resource, FilterTree, FilterFunctionCollection } from './typings';
import { categoryToSubcatIds, subcatIdToName, categoryNames } from './categories';

const getABEMCatFilter = (categoryName: string) => (d: Resource) => {
  const ids = categoryToSubcatIds.get(categoryName) || [];
  return (d.fields["ABEM Model Subcategory"] || []).some((id: string) => ids.includes(id));
};

const getABEMSubCatFilters = (parentCategoryName: string) => {
  const subcats = categoryToSubcatIds.get(parentCategoryName) || [];
  const x = subcats.map(id => ({
    name: subcatIdToName.get(id) || '???',
    filter: (resource: Resource) => (resource.fields["ABEM Model Subcategory"] || []).includes(id)
  }));
  console.log(x);
  return x;
}

const getABEMCategoryFilter = (name: string) => ({
  name,
  filter: getABEMCatFilter(name),
  children: getABEMSubCatFilters(name),
});


const getResourceTypeFilter = (rType: string) => (d: Resource) => d.fields["Resource Type"] && d.fields["Resource Type"].includes(rType);

const filterByContentType = (selections: string[]) => (data: Resource[]) => {
  if (selections.includes('any')) return data;
  let filtered = data;
  selections.forEach((type: string) => {
    const filter = getResourceTypeFilter(type);
    filtered = filtered.filter(filter);
  })
  return filtered;
}

const filterByUserType = (selections: string[]) => (data: Resource[]) => {
  if (selections.includes('any')) return data;
  return data.filter(d => {
    const userType = d.fields["User type"] || 'Neither';
    return userType === 'Both' || selections.includes(userType);
  })
}

const filterByLanguage = (selections: string[]) => (data: Resource[]) => {
  if (selections.includes('any')) return data;
  if (selections.includes('Both')) return data;
  return data.filter(d => (d.fields["Language"] || []).some(lang => selections.includes(lang)));
}

const filterTree: FilterTree<Resource> = {
  name: 'all',
  filter: () => true,
  children: categoryNames.map((categoryName: string) =>
    getABEMCategoryFilter(categoryName)
  )
}

const filterOptions: FilterFunctionCollection<Resource> = {
  filterByUserType,
  filterByContentType,
  filterByLanguage,
}

const siteFilters = {
  filterTree,
  filterOptions,
}

export default siteFilters;