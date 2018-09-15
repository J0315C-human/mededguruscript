import { Resource, FilterTree, FilterFunctionCollection } from './typings';
import { categoryToSubcatIds, subcatIdToName } from './categories';

export const isEnglish = (d: Resource) => d.fields.Language && d.fields.Language.includes('English');

export const isSpanish = (d: Resource) => d.fields.Language && d.fields.Language.includes('Spanish');

const getIsABEMCat = (categoryName: string) => (d: Resource) => {
  const ids = categoryToSubcatIds.get(categoryName) || [];
  return (d.fields["ABEM Model Subcategory"] || []).some((id: string) => ids.includes(id));
};

const getIsABEMSubCat = (subCatId: string) => (d: Resource) => {
  return (d.fields["ABEM Model Subcategory"] || []).includes(subCatId);
};

const getABEMSubCatFilters = (parentCategoryName: string) => {
  const subcats = categoryToSubcatIds.get(parentCategoryName) || [];
  const x = subcats.map(id => ({
    name: subcatIdToName.get(id) || '???',
    filter: getIsABEMSubCat(id),
  }));
  console.log(x);
  return x;
}

const getABEMCategoryFilter = (name: string) => ({
  name,
  filter: getIsABEMCat(name),
  children: getABEMSubCatFilters(name),
});

export const filterTree: FilterTree<Resource> = {
  name: 'all',
  filter: () => true,
  children: [
    getABEMCategoryFilter("Signs, Symptoms and Presentations"),
    getABEMCategoryFilter("Abdominal and Gastrointestinal Disorders"),
    getABEMCategoryFilter("Cardiovascular Disorders"),
    getABEMCategoryFilter("Cutaneous Disorders"),
    getABEMCategoryFilter("Endocrine Metabolic and Nutritional Disorders"),
    getABEMCategoryFilter("Environmental Disorders"),
    getABEMCategoryFilter("HEENT Disorders"),
    getABEMCategoryFilter("Hematologic Disorders"),
    getABEMCategoryFilter("Immune System Disorders"),
    getABEMCategoryFilter("Systemic Infectious Disorders"),
    getABEMCategoryFilter("Musculoskeletal Disorders (Nontraumatic)"),
    getABEMCategoryFilter("Nervous System Disorders"),
    getABEMCategoryFilter("Obstetrics and Gynecology"),
    getABEMCategoryFilter("Psychobehavioral Disorders"),
    getABEMCategoryFilter("Renal and Urogenital Disorders"),
    getABEMCategoryFilter("Thoracic Respiratory Disorders"),
    getABEMCategoryFilter("Toxicologic Disorders"),
    getABEMCategoryFilter("Traumatic Disorders"),
    getABEMCategoryFilter("Procedural and Skills"),
    getABEMCategoryFilter("Other Core Competencies"),
  ]
}

console.log(filterTree);
const getIsResourceType = (rType: string) => (d: Resource) => d.fields["Resource Type"] && d.fields["Resource Type"].includes(rType);

export const filterByContentType = (selections: string[]) => (data: Resource[]) => {
  if (selections.includes('any')) return data;
  let filtered = data;
  selections.forEach((type: string) => {
    const filter = getIsResourceType(type);
    filtered = filtered.filter(filter);
  })
  return filtered;
}

export const filterByUserType = (selections: string[]) => (data: Resource[]) => {
  if (selections.includes('any')) return data;
  if (selections.includes('Both')) return data;
  return data.filter(d => {
    const userType = d.fields["User type"] || 'Neither';
    return userType === 'Both' || selections.includes(userType);
  })
}

export const filterByLanguage = (selections: string[]) => (data: Resource[]) => {
  if (selections.includes('any')) return data;
  if (selections.includes('Both')) return data;
  return data.filter(d => (d.fields["Language"] || []).some(lang => selections.includes(lang)));
}

export const filterCollection: FilterFunctionCollection<Resource> = {
  filterByUserType,
  filterByContentType,
  filterByLanguage,
}