import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
// import 'whatwg-fetch'
// const HOST = 'http://localhost:3001';

// fetch(HOST + '/api/data', {
//   method: 'GET'
// }).then((res) => {
//   return res.json()
// }).then((res) => {
//   const Cubes = {
//     // 'VideoWebsites': {
//     //   Dimensions: videoDims,
//     //   Measures: videoMeas,
//     //   dataSource: videoData()
//     // },
//     // 'FoodinRestaurants': {
//     //   Dimensions: foodDims,
//     //   Measures: foodMeas,
//     //   dataSource: foodData()
//     // },
//     'HemaOS': {
//       Dimensions: hemaDims,
//       Measures: hemaMeas,
//       dataSource: res
//     }
//   }
//   console.log('res', res)
//   ReactDOM.render(<App Cubes={Cubes} />, document.getElementById('root'));
//   registerServiceWorker();
// })
