var express = require('express');
var bodyParser = require('body-parser');

var {Menu} = require('./Menu.js');
var {SlideShow} = require('./SlideShow.js');
var {FlightData} = require('./FlightData.js');
var {PopularMedia} = require('./PopularMedia.js');
var {MovieList} = require('./movielist.js');

var {InteractiveEnglish} = require('./InteractiveEnglish.js');
var {InteractiveChinese} = require('./InteractiveChinese.js');

var LanguageArr = new Array();
LanguageArr['EN'] = InteractiveEnglish;
LanguageArr['CH'] = InteractiveChinese;


const port = process.env.PORT || 3000;
var app = new express();

app.use(bodyParser.json());

app.post('/setlanguage/:lang',(req, res) => {
  console.log('IP is: ',req.ip.split(':')[3]);
  var languageData = LanguageArr[req.params.lang]
  res.set({
    "Access-Control-Allow-Origin": "*"
  })
  res.send({
    languageData
   })
  },(e) => {
    res.status(400).send(e);
});

app.get('/menu',(req, res) => {
  console.log('IP is: ',req.ip.split(':')[3]);
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
  res.send({
    MovieList
   })
  },(e) => {
    res.status(400).send(e);
});

app.listen(port, ()=> {
  console.log("App started")
});

module.exports = {app};
