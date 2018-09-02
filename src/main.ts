
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



