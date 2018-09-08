
import { createFilterButtons, displayData } from './dom';
import { filterDataByTreePath, testData, filterTree } from './filters';

export const doTheThing = () => {
  createFilterButtons(testData, filterTree);
  const filtered = filterDataByTreePath(testData, filterTree, [])
  displayData(filtered);
}
doTheThing();

// const view = 'Browse%20All%20View%20(Website%20Embed)';
const view = 'Literally%20all%20the%20Resources';
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
})