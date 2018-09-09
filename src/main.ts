
import { createFilterButtons, displayData } from './dom';
import { filterDataByTreePath, filterDataByFilterOptions } from './filters';
import { filterTree, filterCollection } from './siteFilters';
import { Resource } from 'typings';

const selections = {
  filterByUserType: ['Educators']
}
export const doTheThing = (data: Resource[]) => {
  createFilterButtons(data, filterTree, selections);
  let filtered = filterDataByTreePath(data, filterTree, [])
  filtered = filterDataByFilterOptions(data, filterCollection, {
    filterByUserType: ['Learners'],
    filterByLanguage: ['Spanish'],
  });
  displayData(filtered);  
}

// const view = 'Browse%20All%20View%20(Website%20Embed)';
const view = 'Visible%20on%20Site';
// const format = '&cellFormat=string&timeZone=America/Mexico_City&userLocale=en-ie'
const url = `https://api.airtable.com/v0/appKSRgyXYjvW2nzO/Resource%20Catalog?maxRecords=120&view=${view}&pageSize=100&api_key=`;

var myInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  cache: 'default',
};

var myRequest = new Request(url);

const fetchRecords = () => fetch(myRequest, myInit as any).then(res => res.json())
  .then(function (myJson) {
    console.log(myJson)
    return myJson.records;
  });

fetchRecords().then((records: any) => {
  console.log(records);
  doTheThing(records);

})