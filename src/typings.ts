export interface FilterTree<T> {
  name: string;
  filter: ((item: T) => boolean) | (() => boolean);
  children?: FilterTree<T>[];
  section: string;
}

export interface FilterOptionParams {
  name: string;
  options: string[];
  filterName: string;
  inputType: string;
}

export interface FilterFunctionCollection<T> {
  [key: string]: (selection: string[]) => (data: T[]) => T[];
}
export interface FilterFunctionSelections {
  [key: string]: string[];
}

export interface ElementRecord {
  depth: number;
  el: HTMLElement;
  name: string;
  parentName: string;
  section: string;
}
export interface RCResponse {
  offset?: string;
  records: any[];
}

export interface Resource {
  createdTime: string;
  fields: ResourceFields;
  id: string;
}

export type ResourceLanguage = 'English' | 'Spanish' | 'Portuguese';
export type ResourceLearnerLevel = 'Resident' | 'Attending Physician' | 'NP/PA' | string; //////

export interface ResourceLogoThumb {
  height: number;
  width: number;
  url: string;
}

export interface ResourceLogo {
  filename: string;
  id: string;
  size: number;
  thumbnails: {
    full: ResourceLogoThumb;
    large: ResourceLogoThumb;
    small: ResourceLogoThumb;
  };
  type: string;
  url: string;

}

export type ResourceUserType = 'Learners' | 'Educators' | 'Both';

export interface ResourceFields {
  Approved: boolean;
  Author?: string;
  Language: ResourceLanguage[];
  Logo: ResourceLogo[];
  Source: string;
  'Date published'?: string;
  'ABEM Model Subcategory'?: string[];
  'Non-Clinical Subcategory'?: string[];
  'Additional Keywords'?: string[];
  'Learner Level'?: ResourceLearnerLevel[];
  'Other Topics'?: string[];
  'Ready for Import to Webflow CMS'?: boolean;
  'Pediatric Related'?: boolean;
  'Resource Title': string;
  'Resource Type': string[]; /////////
  'Resource URL': string;
  'User type'?: ResourceUserType;
}
