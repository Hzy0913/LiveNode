const express = require('express');
const fs = require("fs");
const path = require("path");
const timeout = require('connect-timeout');
const proxy = require('http-proxy-middleware');
const exec = require('child_process').exec;
const app = express();
const {proxyTable = [], reload = true, port, spaHistory = true, notFound = ''} = require('../config');
const TIME_OUT = 30 * 1e3;
const filename = path.resolve();
app.use(timeout(TIME_OUT));
app.use((req, res, next) => {if (!req.timedout) next();});
app.use('/', express.static(`${filename}/src`));
const resolve = file => path.resolve(__dirname, file);
proxyTable.forEach(item => app.use(proxy(item.api, {target: item.host})));
const files = fs.readdirSync(`${filename}/src`);
if (spaHistory) {
  app.get('*', function(req, res) {
    res.sendFile(`${filename}/src/index.html`, 'utf-8');
  });
}
if (!spaHistory && notFound) {
  app.get('*', function(req, res) {
    res.sendFile(`${filename}/src${notFound}`, 'utf-8');
  });
}
app.listen(port, () => {
  console.log(`server listen ${port}`);
});
