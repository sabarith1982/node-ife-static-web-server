var express = require('express');
var bodyParser = require('body-parser');

var {Menu} = require('./Menu.js');
var {KidsMenu} = require('./KidsMenu.js');
var {SlideShow} = require('./SlideShow.js');
var {FlightData} = require('./FlightData.js');
var {PopularMedia} = require('./PopularMedia.js');
var {MovieList} = require('./movielist.js');
var {MovieList_CH} = require('./movielist.js');

var {InteractiveEnglish} = require('./InteractiveEnglish.js');
var {InteractiveChinese} = require('./InteractiveChinese.js');
var {trackIP} = require('./trackIP.js');
var {searchList} = require('./searchList.js');
var {searchOptions} = require('./searchOptions.js');

var LanguageArr = new Array();
LanguageArr['EN'] = InteractiveEnglish;
LanguageArr['CH'] = InteractiveChinese;

const port = process.env.PORT || 3000;
var app = new express();
var _trackIP = new trackIP();

app.use(bodyParser.json());

app.post('/setlanguage/:lang',(req, res) => {
  console.log('IP is: ',req.ip, " :", req.ip.split(':')[3]);
  var ip = req.ip.split(':')[3] ? req.ip.split(':')[3]+"" : "localhost";
  var languageData = LanguageArr[req.params.lang]
  _trackIP.setIPandLanguage(ip, req.params.lang);
  res.set({
    "Access-Control-Allow-Origin": "*"
  })
  res.send({
    languageData
   })
  },(e) => {
    res.status(400).send(e);
});

app.post('/search',(req, res) => {
  console.log('IP is: ',req.ip, " :", req.ip.split(':')[3]);
  var ip = req.ip.split(':')[3] ? req.ip.split(':')[3]+"" : "localhost";
  var dataObj = req.body.data;
  res.set({
    "Access-Control-Allow-Origin": "*"
  })
  res.send({
    searchList
   })
  },(e) => {
    res.status(400).send(e);
});

app.post('/setKidsMode/:password',(req, res) => {
  console.log('IP is: ',req.ip, " :", req.ip.split(':')[3]);
  var ip = req.ip.split(':')[3] ? req.ip.split(':')[3]+"" : "localhost";
  var menu = {"code": "201", "message": "Kids Mode Cannot be set."}
  if(_trackIP.setIPandKidsMode(ip, req.params.password))
    var menu = KidsMenu;
  res.set({
    "Access-Control-Allow-Origin": "*"
  })
  res.send({
    menu
   })
  },(e) => {
    res.status(400).send(e);
});

app.post('/resetKidsMode/:password',(req, res) => {
  console.log('IP is: ',req.ip, " :", req.ip.split(':')[3]);
  var ip = req.ip.split(':')[3] ? req.ip.split(':')[3]+"" : "localhost";
  var menu = {"code": "201", "message": "Cannot reset Kids mode."}
  if(_trackIP.resetIPandKidsMode(ip, req.params.password))
    var menu = Menu;
  res.set({
    "Access-Control-Allow-Origin": "*"
  })
  res.send({
    menu
   })
  },(e) => {
    res.status(400).send(e);
});

app.get('/searchoptions',(req, res) => {
  console.log('IP is: ',req.ip);
  res.send({
    searchOptions
   })
  },(e) => {
    res.status(400).send(e);
});

app.get('/menu',(req, res) => {
  console.log('IP is: ',req.ip);
  res.send({
    Menu
   })
  },(e) => {
    res.status(400).send(e);
});

app.get('/adengine/slideshow',(req, res) => {
  res.send({
    SlideShow
   })
  },(e) => {
    res.status(400).send(e);
});

app.get('/flightdata',(req, res) => {
  res.send({
    FlightData
   })
  },(e) => {
    res.status(400).send(e);
});

app.get('/media/popularmedia',(req, res) => {
  res.send({
    PopularMedia
   })
  },(e) => {
    res.status(400).send(e);
});

app.get('/movielist',(req, res) => {
  var ip = req.ip.split(':')[3] ? req.ip.split(':')[3]+"" : "localhost";
  var lang = _trackIP.getIPLanguage(ip);

  var lvMovieList = MovieList;
  if(lang === 'CH')
    lvMovieList = MovieList_CH;

  res.send({
    lvMovieList
   })
  },(e) => {
    res.status(400).send(e);
});

app.listen(port, ()=> {
  console.log("App started")
});

module.exports = {app};
