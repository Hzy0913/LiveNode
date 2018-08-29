const express = require('express');
const fs = require("fs");
const path = require("path");
const timeout = require('connect-timeout');
const proxy = require('http-proxy-middleware');
const app = express();
const {proxyTable = [], reload = true, spaHistory, notFound = ''} = require('../config');
const TIME_OUT = 30 * 1e3;
const filename = path.resolve();
const bs = require("browser-sync").create('server');
app.use(timeout(TIME_OUT));
app.use((req, res, next) => {if (!req.timedout) next();});
app.use('/', express.static(`${filename}/src`));
const resolve = file => path.resolve(__dirname, file);
proxyTable.forEach(item => app.use(proxy(item.api, {target: item.host})));
if (reload) {
  bs.watch(`${filename}/src/**/*.html`).on("change", bs.reload);
  bs.watch(`${filename}/src/**/*.css`, (event, file) => {if (event === "change") {bs.reload("*.css");}});
  bs.watch(`${filename}/src/**/*.js`, (event, file) => {if (event === "change") {bs.reload("*.js");}});
}
const files = fs.readdirSync(`${filename}/src`);
const serverPort = Math.floor(Math.random() * 5000 + 3000);
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
app.listen(serverPort, () => {
  const index = files.find(item => item === 'index.html') ? '' : `/${files.find(item => item.includes('.html'))}`;
  bs.init({proxy: `http://localhost:${serverPort}${index}`,notify: true});
})
