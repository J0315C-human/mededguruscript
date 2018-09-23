import { Resource, FilterTree, FilterFunctionCollection, FilterOptionParams } from './typings';
import { categoryToSubcatIds, subcatIdToName, categoryNames, nonClinicalCategories, contentTypes } from './categories';

const sortUniqueChildFilters = (children: FilterTree<Resource>[]) => {
  const filts = [] as FilterTree<Resource>[];
  const addedNames = [] as string[];
  children.forEach((filt) => {
    if (!addedNames.includes(filt.name)) {
      filts.push(filt);
      addedNames.push(filt.name);
    }
  })
  return filts.sort((a, b) => {
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
    section: parentCategoryName,
    filter: (resource: Resource) => !!(resource.fields && (resource.fields["ABEM Model Subcategory"] || []).includes(id))
  }));
  return x;
}

const getABEMCategoryFilter = (name: string) => ({
  name,
  filter: getABEMCatFilter(name),
  section: 'CLINICAL CATEGORIES',
  children: sortUniqueChildFilters(
    getABEMSubCatFilters(name)
  ),
});

const getNonClinicalCategoryFilters = (cats: string[]) => {
  return cats.map(cat => ({
    name: cat,
    section: 'NON-CLINICAL CATEGORES',
    filter: (r: Resource) => !!(r.fields && r.fields["Non-Clinical Subcategory"] && r.fields["Non-Clinical Subcategory"].includes(cat))
  }))
}

const getResourceTypeFilter = (rType: string) => (d: Resource) => d.fields["Resource Type"] && d.fields["Resource Type"].includes(rType);

const filterByContentType = (selections: string[]) => (data: Resource[]) => {
  if (selections.includes('All')) return data;
  let filtered = [];
  const filters = selections.map(type => getResourceTypeFilter(type));
  data.forEach((resource: Resource) => {
    const doInclude = filters.some((filter: ((r: Resource) => boolean)) => filter(resource))
    if (doInclude) {
      filtered.push(resource);
    }
  })
  return filtered;
}

const filterByUserType = (selections: string[]) => (data: Resource[]) => {
  if (selections.includes('All')) return data;
  return data.filter(d => {
    const userType = d.fields["User type"] || 'Neither';
    return userType === 'Both' || selections.includes(userType);
  })
}

const filterByLanguage = (selections: string[]) => (data: Resource[]) => {
  if (selections.includes('All')) return data;
  if (selections.includes('Both')) return data;
  return data.filter(d => (d.fields["Language"] || []).some(lang => selections.includes(lang)));
}

const filterByPediatricSpecific = (selections: string[]) => (data: Resource[]) => {
  if (selections.length === 0) { /// not checked
    return data;
  } else {
    return data.filter(d => !!(d.fields && d.fields["Pediatric Related"] && d.fields["Pediatric Related"] === true));
  }
}


// export const isClinical = (data: Resource) => !!(data.fields && data.fields["ABEM Model Subcategory"]);
// export const isNonClinical = (data: Resource) => !!(data.fields && data.fields["Non-Clinical Subcategory"]);

const clinicalFilters = sortUniqueChildFilters(categoryNames.map((categoryName: string) => getABEMCategoryFilter(categoryName)));
const nonClinicalFilters = sortUniqueChildFilters(getNonClinicalCategoryFilters(nonClinicalCategories))
const allFilters = [...clinicalFilters, ...nonClinicalFilters];

const siteFilters = {
  filterTree: {
    name: 'All Categories',
    filter: () => true,
    section: 'All Categories',
    children: allFilters
  } as (FilterTree<Resource>),
  filterOptions: {
    filterByUserType,
    filterByContentType,
    filterByLanguage,
    filterByPediatricSpecific,
  } as FilterFunctionCollection<Resource>
  ,
  filterOptionDomParams: [
    {
      name: 'Content Type',
      inputType: 'multiSelect',
      options: contentTypes,
      filterName: 'filterByContentType',
    },
    {
      name: 'Language',
      inputType: 'multiSelect',
      options: ['English', 'Spanish'],
      filterName: 'filterByLanguage',
    },
    {
      name: 'User Type',
      inputType: 'multiSelect',
      options: ['Learners', 'Educators'],
      filterName: 'filterByUserType',
    },
    {
      name: 'Pediatric Specific',
      inputType: 'checkBox',
      options: [],
      filterName: 'filterByPediatricSpecific',
    },
  ] as FilterOptionParams[]
}

export default siteFilters;