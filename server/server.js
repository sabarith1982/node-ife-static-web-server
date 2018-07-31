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
var {Hashing} = require('./hashing.js');

var LanguageArr = new Array();
LanguageArr['EN'] = InteractiveEnglish;
LanguageArr['CH'] = InteractiveChinese;

const port = process.env.PORT || 3000;
var app = new express();
var _trackIP = new trackIP();
var _hashing = new Hashing();
app.use(bodyParser.json());


app.post('/setlanguage/:lang',(req, res) => {
  console.log('IP is: ',req.ip, " :", req.ip.split(':')[3]);
  var ip = req.ip.split(':')[3] ? req.ip.split(':')[3]+"" : "localhost";
  var xauthtoken;
  if(!req.headers.xauth || req.headers.xauth == ""){
    var data = {
      from: ip,
      at: Math.floor(Date.now() / 1000) - 30
    }
    xauthtoken=_hashing.hashToken(data);
  }else {
      if(_hashing.verifyToken(req.headers.xauth)){
        xauthtoken = req.headers.xauth;
      }else{
        var menuAuth = {"code": "401", "message": "Cannot be authorized"}
        res.send({
          menuAuth
         })
        ,(e) => {
          res.status(401).send(e);
        return;
      }
    }
  }

  var languageData = LanguageArr[req.params.lang]
  _trackIP.setIPandLanguage(xauthtoken, req.params.lang);
  res.set({
    "Access-Control-Allow-Origin": "*",
    "xauth": xauthtoken
  })
  res.send({
    languageData
   })
 },(e) => {
    res.status(400).send(e);
});

app.post('/search',(req, res) => {
  var menuAuth = {"code": "401", "message": "Cannot be authorized"}
  if(verifyHeader(req, res)){
    var dataObj = req.body.data;
    res.set({
      "Access-Control-Allow-Origin": "*",
      "xauth": req.headers.xauth
    })
    res.send({
      searchList
     })
    ,(e) => {
      res.status(400).send(e);
    }
  }
});

app.post('/setKidsMode/:password',(req, res) => {
  var menu = {"code": "201", "message": "Kids Mode Cannot be set."}
  if(verifyHeader(req, res)){
    if(_trackIP.setIPandKidsMode(req.headers.xauth, req.params.password))
      var menu = KidsMenu;

    res.set({
      "Access-Control-Allow-Origin": "*",
      "xauth":req.headers.xauth
    })
    res.send({
      menu
     })
    ,(e) => {
      res.status(400).send(e);
    }
  }
});

app.post('/resetKidsMode/:password',(req, res) => {
  var menu = {"code": "201", "message": "Kids Mode Cannot be set."}
  if(verifyHeader(req, res)){
    if(_trackIP.resetIPandKidsMode(req.headers.xauth, req.params.password))
      var menu = Menu;
    res.set({
      "Access-Control-Allow-Origin": "*",
      "xauth": req.headers.xauth
    })
    res.send({
      menu
     })
    ,(e) => {
      res.status(400).send(e);
    }
  }
});

app.get('/searchoptions',(req, res) => {
  var menuAuth = {"code": "401", "message": "Cannot be authorized"}
  if(verifyHeader(req, res)){
    res.send({
      searchOptions
     })
    ,(e) => {
      res.status(400).send(e);
    }
  }
});

app.get('/menu',(req, res) => {
  var menuAuth = {"code": "401", "message": "Cannot be authorized"}
  if(verifyHeader(req, res)){
    var lmenu = Menu;
    if(_trackIP.checkKidsMode(req.headers.xauth))
      lmenu = KidsMenu;
    res.send({
      lmenu
     })
    ,(e) => {
      res.status(400).send(e);
    }
  }
});

app.get('/adengine/slideshow',(req, res) => {
  var menuAuth = {"code": "401", "message": "Cannot be authorized"}
  if(verifyHeader(req, res)){
    res.send({
      SlideShow
     })
    ,(e) => {
      res.status(400).send(e);
    }
  }
});

app.get('/flightdata',(req, res) => {
  var menuAuth = {"code": "401", "message": "Cannot be authorized"}
  if(verifyHeader(req, res)){
    res.send({
      FlightData
     })
    ,(e) => {
      res.status(400).send(e);
    }
  }
});

app.get('/media/popularmedia',(req, res) => {
  var menuAuth = {"code": "401", "message": "Cannot be authorized"}
  if(verifyHeader(req, res)){
    res.send({
      PopularMedia
     })
    ,(e) => {
      res.status(400).send(e);
    }
  }
});

app.get('/movielist',(req, res) => {
  var menuAuth = {"code": "401", "message": "Cannot be authorized"}
  if(verifyHeader(req, res)){
    var lang = _trackIP.getIPLanguage(req.headers.xauth);
    var lvMovieList = MovieList;
    if(lang === 'CH')
      lvMovieList = MovieList_CH;
    res.send({
      lvMovieList
     })
    ,(e) => {
      res.status(400).send(e);
    }
  }
});

function verifyHeader(req, res){
  var menuAuth = {"code": "401", "message": "Cannot be authorized"}
  var processData = true;
  if(!req.headers.xauth || req.headers.xauth == ""){
    processData = false;
  }else {
    processData = _hashing.verifyToken(req.headers.xauth);
  }

  if(!processData){
    res.send({
      menuAuth
     })
    ,(e) => {
      res.status(401).send(e);
    return false;
    }
  }

  return true;
}

app.listen(port, ()=> {
  console.log("App started")
});

module.exports = {app};
