const express = require('express');
const fs = require("fs");
const path = require("path");
const timeout = require('connect-timeout');
const proxy = require('http-proxy-middleware');
const exec = require('child_process').exec;
const app = express();
const {proxyTable = [], reload = true, port = 4000, spaHistory, notFound = ''} = require('../config');
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
  const order = `lsof -i tcp:${port}`;
  const index = files.find(item => item === 'index.html') ? '' : `/${files.find(item => item.includes('.html'))}`;
  exec(order, (err, stdout, stderr) => {
    if(err){
      bs.init({proxy: `http://localhost:${serverPort}${index}`,port:port,notify: true});
      return;
    }
    stdout.split('\n').filter((line) => {
      const p=line.trim().split(/\s+/);
      const address=p[1];
      if(address!=undefined && address!="PID"){
        exec('kill '+ address, (err, stdout, stderr) =>{
          if(err){return console.log('端口可能被占用，请重启服务！')};
          bs.init({proxy: `http://localhost:${serverPort}${index}`,port:port,notify: true});
        });
      }
    });
  });
});
