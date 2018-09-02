export interface DataEntity {
  name: string;
  subject: string;
  language: string;
  authors: string[];
  tags?: string[];
  isGood?: boolean;
}

export interface FilterTree<T> {
  name: string;
  filter: ((item: T) => boolean) | (() => boolean);
  children?: FilterTree<T>[];
}