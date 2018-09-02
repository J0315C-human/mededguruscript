
// const apiToken = 'e416890a51f25f24090238a75d91c37c1c8b97fb1889b5383afd4c565616f754';
// const siteId = '5a6e7730513ec40001b82d10';
// const url = "https://api.webflow.com/collections/5a6e7730513ec40001b82d1f/items?api_version=1.0.0&access_token=" + apiToken;
import { createFilterButtons, displayData } from './dom';
import { filterDataByTreePath, testData, filterTree } from './filters';

// var myHeaders = new Headers();
// myHeaders.append('Content-Type', 'image/jpeg');

// var myInit = {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   mode: 'no-cors',
//   cache: 'default'
// };

// var myRequest = new Request(url);

// fetch(myRequest, myInit as any).then(function (response: any) {
//   console.log(response);
// });
export const doTheThing = () => {
  createFilterButtons(testData, filterTree);
  const filtered = filterDataByTreePath(testData, filterTree, [])
  displayData(filtered);
}
doTheThing();



