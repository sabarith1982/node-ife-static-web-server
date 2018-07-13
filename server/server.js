var express = require('express');
var bodyParser = require('body-parser');

var {Menu} = require('./Menu.js');
var {SlideShow} = require('./SlideShow.js');
var {FlightData} = require('./FlightData.js');
var {PopularMedia} = require('./PopularMedia.js');


const port = process.env.PORT || 3000;
var app = new express();

app.use(bodyParser.json());

app.get('/menu',(req, res) => {
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

app.listen(port, ()=> {
  console.log("App started")
});

module.exports = {app};
