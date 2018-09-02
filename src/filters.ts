import { DataEntity, FilterTree } from "./typings";

export const testData: DataEntity[] = [
  {
    name: 'once upon a timef',
    subject: 'postmodernism',
    language: 'spanish',
    authors: [
      'davis',
      'dingus',
      'dee',
    ],
    tags: ['book', 'self-help', 'horror', 'dark', 'doom']
  },
  {
    name: 'oh the places youll go',
    subject: 'phenomenology',
    language: 'spanish',
    authors: [
      'davis',
      'lee',
      'smith',
    ],
    tags: ['book', 'self-help', 'epic novel']
  },
  {
    name: 'three guys in a boat',
    subject: 'geometry',
    language: 'english',
    authors: [
      'smith',
      'jones',
      'jee',
    ],
    tags: ['book', 'comedy', 'self-help']
  },
  {
    name: 'My First Day In Paris',
    subject: 'ontology',
    language: 'english',
    authors: [
      'matress',
      'face',
      'chubble',
    ],
    tags: ['book', 'scifi', 'horror', 'historical fiction', 'book', 'romance', 'scifi']
  },
  {
    name: 'three women on a couch',
    subject: 'geometry',
    language: 'portuguese',
    authors: [
      'george',
      'Groggl Greebs',
    ],
    tags: []
  },
  {
    name: 'Taking Nature Photos',
    subject: 'algebra',
    language: 'english',
    authors: [
      'jerry',
      'James',
    ],
  },
  {
    name: 'Taking Candy From Bebbies',
    subject: 'garhoopta',
    language: 'portuguese',
    authors: [
      'obrigado',
      'feijoo',
    ],
  },
  {
    name: 'Space is the Place, Duude',
    subject: 'transcendental math',
    language: 'english',
    authors: [
      'dave',
      'jarvis',
    ],
  },
  {
    name: 'schleemies',
    subject: 'postmodernism',
    language: 'spanish',
    authors: [
      'davis',
      'dingus',
      'dee',
    ],
    isGood: true,
    tags: ['book', 'self-help', 'horror', 'dark', 'doom']
  },
  {
    name: 'oh the places youll go',
    subject: 'phenomenology',
    language: 'spanish',
    authors: [
      'davis',
      'lee',
      'smith',
    ],
    tags: ['book', 'self-help', 'epic novel']
  },
  {
    name: 'three guys in a Bucket',
    subject: 'geometry',
    language: 'english',
    authors: [
      'smith',
      'jones',
      'jee',
    ],
    isGood: true,
    tags: ['book', 'comedy', 'self-help']
  },
  {
    name: 'My First Day In Space',
    subject: 'ontology',
    language: 'english',
    authors: [
      'matress',
      'face',
      'chubble',
    ],
    tags: ['book', 'scifi', 'horror', 'historical fiction', 'book', 'romance', 'scifi']
  },
  {
    name: 'Clambakers',
    subject: 'geometry',
    language: 'portuguese',
    authors: [
      'george',
      'Groggl Greebs',
    ],
    isGood: true,
    tags: []
  },
  {
    name: 'Old Bazbies',
    subject: 'algebra',
    language: 'english',
    authors: [
      'jerry',
      'James',
    ],
  },
  {
    name: 'Throw THings, you go girl',
    subject: 'garhoopta',
    language: 'portuguese',
    authors: [
      'obrigado',
      'feijoo',
    ],
  },
  {
    name: 'Smoking Weed',
    subject: 'transcendental math',
    language: 'english',
    authors: [
      'dave',
      'jarvis',
    ],
  },
]

// main groupings: 'algebra', 'math'
export const isMath = (d: DataEntity) => {
  return (d.subject === 'algebra' || d.subject === 'geometry' || d.subject === 'transcendental math');
}
export const isPhilosophy = (d: DataEntity) => {
  return (d.subject === 'ontology' || d.subject === 'phenomenology' || d.subject === 'postmodernism' || d.subject === 'transcendental math');
}

export const isGood = (d: DataEntity) => !!d.isGood;

export const filterTree: FilterTree<DataEntity> = {
  name: 'all',
  filter: () => true,
  children: [
    {
      name: 'mathematics',
      filter: isMath,
      children: [
        {
          name: 'algebra',
          filter: (d: DataEntity) => d.subject === 'algebra',
        },
        {
          name: 'geometry',
          filter: (d: DataEntity) => d.subject === 'geometry',
        }
      ]
    },
    {
      name: 'philosophy',
      filter: isPhilosophy,
      children: [
        {
          name: 'ontology',
          filter: (d: DataEntity) => d.subject === 'ontology',
        },
        {
          name: 'phenomenology',
          filter: (d: DataEntity) => d.subject === 'phenomenology',
        },
        {
          name: 'postmodernism',
          filter: (d: DataEntity) => d.subject === 'postmodernism',
        }
      ]
    },
    {
      name: 'both',
      filter: (d: DataEntity) => (isMath(d) && isPhilosophy(d)),
    },
    {
      name: 'other',
      filter: (d: DataEntity) => (!isMath(d) && !isPhilosophy(d)),
    }
  ]
}

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


