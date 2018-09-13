import { Resource } from "typings";

const apiKey = '';
const view = 'Visible%20on%20Site';
const url = `https://api.airtable.com/v0/appKSRgyXYjvW2nzO/Resource%20Catalog?maxRecords=200000&view=${view}&pageSize=100&api_key=${apiKey}`;

var myInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  cache: 'default',
};


const fetchResources = (offset?: string) => {
  const thisUrl = offset ? url + `&offset=${offset}` : url;
  var myRequest = new Request(thisUrl);
  return fetch(myRequest, myInit as any);
}

const fetchSomeResources = (onUpdate: (records: Resource[]) => void, collection: Resource[] = [], offset?: string) => fetchResources(offset).then(res => res.json())
  .then(function (json) {
    if (json.records) {
      onUpdate(collection.concat(json.records));
    }
    return json;
  }).then(json => {
    if (json.offset) {
      return fetchSomeResources(onUpdate, collection.concat(json.records), json.offset);
    }
    console.log('resource loading complete')
  });

export const fetchAllResources = (onUpdate?: (records: Resource[]) => void) => {
  fetchSomeResources(onUpdate || ((records: Resource[]) => console.log(records)));
}