import { Resource, FilterTree, FilterFunctionCollection } from './typings';

export const isEnglish = (d: Resource) => d.fields.Language && d.fields.Language.includes('English');

export const isSpanish = (d: Resource) => d.fields.Language && d.fields.Language.includes('Spanish');

const getIsABEMSubcat = (categoryId: string) => (d: Resource) => (d.fields["ABEM Model Subcategory"] || []).includes(categoryId);
const getIsResourceType = (rType: string) => (d: Resource) => d.fields["Resource Type"] && d.fields["Resource Type"].includes(rType);
export const isBlogPost = getIsResourceType('Blog Post');
export const isSlidePresentation = getIsResourceType('Slide Presentation');
export const isCaseDiscussion = getIsResourceType('Case Discussion');

export const filterByUserType = (userTypesSelected: string[]) => (data: Resource[]) => {
  return data.filter(d => {
    const userType = d.fields["User type"] || 'Neither';
    return userType === 'Both' || userTypesSelected.includes(userType);
  })
}

export const filterTree: FilterTree<Resource> = {
  name: 'all',
  filter: () => true,
  children: [
    {
      name: 'Chest Trauma',
      filter: getIsABEMSubcat('recgPkjZWGRzqGa8Q'),
    },
    {
      name: 'Oropharynx/Throat',
      filter: getIsABEMSubcat('recKjze3JpZAZITvv'),
    },
    {
      name: 'General',
      filter: getIsABEMSubcat('recg6dyugvvq9K7V4'),
    },
    {
      name: 'Ear',
      filter: getIsABEMSubcat("recrf8wLK77Izk0kP"),
    },
    {
      name: 'Resuscitation',
      filter: getIsABEMSubcat("recHkDcr8jWfRjEwc"),
    },
  ]
}

export const filterCollection: FilterFunctionCollection<Resource> = {
  filterByUserType
}