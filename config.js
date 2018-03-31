const port = 3000;
const reload = true;
const spaHistory = false;
const notFound = '/notFound.html';
const proxyTable = [
  {
    host: 'http://www.binlive.cn',
    api: '/api/testApi'
  }
];




module.exports = {reload, proxyTable, port, spaHistory, notFound};
