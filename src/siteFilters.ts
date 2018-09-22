import { Resource, FilterTree, FilterFunctionCollection } from './typings';
import { categoryToSubcatIds, subcatIdToName, categoryNames, nonClinicalCategories } from './categories';

const sortChildFilters = (children: FilterTree<Resource>[]) => {
  return [].concat(children).sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (b.name < a.name) {
      return 1;
    }
    return 0;
  })
}

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
  return x;
}

const getABEMCategoryFilter = (name: string) => ({
  name,
  filter: getABEMCatFilter(name),
  children: sortChildFilters(
    getABEMSubCatFilters(name)
  ),
});

const getNonClinicalCategoryFilters = (cats: string[]) => {
  return cats.map(cat => ({
    name: cat,
    filter: (r: Resource) => !!(r.fields && r.fields["Non-Clinical Subcategory"] && r.fields["Non-Clinical Subcategory"].includes(cat))
  }))
}

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

const isClinical = (data: Resource) => !!(data.fields && data.fields["ABEM Model Subcategory"]);
const isNonClinical = (data: Resource) => !!(data.fields && data.fields["Non-Clinical Subcategory"]);

const siteFilters = {
  filterTree: {
    name: 'Categories',
    filter: () => true,
    children: [
      {
        name: 'Clinical Categories',
        filter: isClinical,
        children: sortChildFilters(
          categoryNames.map((categoryName: string) =>
            getABEMCategoryFilter(categoryName)
          ))
      },
      {
        name: 'Non-Clinical Categories',
        filter: isNonClinical,
        children: sortChildFilters(
          getNonClinicalCategoryFilters(nonClinicalCategories)
        )
      }
    ]
  } as (FilterTree<Resource>),
  filterOptions: {
    filterByUserType,
    filterByContentType,
    filterByLanguage,
  } as FilterFunctionCollection<Resource>
}

export default siteFilters;