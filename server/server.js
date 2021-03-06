var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
const path = require('path');

var {Menu} = require('./Menu.js');
var {KidsMenu} = require('./KidsMenu.js');
var {SlideShow} = require('./SlideShow.js');
var {FlightData} = require('./FlightData.js');
var {PopularMedia} = require('./PopularMedia.js');
var {MovieList} = require('./movielist.js');
var {MovieList_CH} = require('./movielist.js');

var {MusicList} = require('./musiclist.js');
var {MusicList_CH} = require('./musiclist_ch.js');

var {InteractiveEnglish} = require('./InteractiveEnglish.js');
var {InteractiveChinese} = require('./InteractiveChinese.js');
var {trackIP} = require('./trackIP.js');
var {searchList} = require('./searchList.js');
var {searchOptions, searchOptions_CH} = require('./searchOptions.js');
var {MusicSearch, MusicSearch_CH} = require('./musicsearch.js');
var {Hashing} = require('./hashing.js');
var {ReadList, ReadList_CH, ReadKidsList, ReadKidsList_CH, ReadSearch, ReadSearch_CH, ReadKidsSearch, ReadKidsSearch_CH} = require('./readlist.js');
var {TVList, TVList_CH} = require('./tv.js');
var cors = require('cors');
var LanguageArr = new Array();
LanguageArr['EN'] = InteractiveEnglish;
LanguageArr['CH'] = InteractiveChinese;

const port = process.env.PORT || 3000;
var app = new express();
var _trackIP = new trackIP();
var _hashing = new Hashing();
app.use(bodyParser.json());
app.use(cors());

//POST API to setlanguage.
app.post('/setlanguage/:lang',(req, res) => {
  console.log('In setLanguage IP is: ',req.ip, " :", req.ip.split(':')[3]);
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
        }),(e) => {
          res.status(401).send(e);
        }
        return;
      }
  }

  var languageData = LanguageArr[req.params.lang]
  _trackIP.setIPandLanguage(xauthtoken, req.params.lang);
  res.set({
    "Access-Control-Allow-Origin": "*",
    "xauth": xauthtoken,
    "Access-Control-Expose-Headers" : "xauth"
  })
  res.send({
    languageData
  })
  },(e) => {
    res.status(400).send(e);
});

//POST API to search media in the media dataset
app.post('/search',(req, res) => {
  console.log("In search");
  if(verifyHeader(req, res)){
    var dataObj = req.body.data;
    res.set({
      "Access-Control-Allow-Origin": "*",
      "xauth": req.headers.xauth,
      "Access-Control-Expose-Headers" : "xauth"
    })
    res.send({
      searchList
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//POST API to search music media in the media dataset
app.post('/musicsearch',(req, res) => {
  console.log("In music search");
  if(verifyHeader(req, res)){
    var dataObj = req.body.data;
    var lang = _trackIP.getIPLanguage(req.headers.xauth);
    var lvMusicSearch = MusicSearch;
    if(lang === 'CH')
      lvMusicSearch = MusicSearch_CH;
    res.set({
      "Access-Control-Allow-Origin": "*",
      "xauth": req.headers.xauth,
      "Access-Control-Expose-Headers" : "xauth"
    })
    res.send({
      lvMusicSearch
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//POST API to search read media in the media dataset
app.post('/readsearch',(req, res) => {
  console.log("In read search");
  if(verifyHeader(req, res)){
    var dataObj = req.body.data;
    var lang = _trackIP.getIPLanguage(req.headers.xauth);
    var kidsMode = _trackIP.checkKidsMode(req.headers.xauth);
    var lvReadSearch = ReadSearch;
    if(lang === 'EN' && kidsMode)
      lvReadSearch = ReadKidsSearch;
    else if(lang === 'CH' && kidsMode)
      lvReadSearch = ReadKidsSearch_CH;
    else if(lang === 'CH')
      lvReadSearch = ReadSearch_CH;

    res.set({
      "Access-Control-Allow-Origin": "*",
      "xauth": req.headers.xauth,
      "Access-Control-Expose-Headers" : "xauth"
    })
    res.send({
      lvReadSearch
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//POST API to set Kids Mode with password
app.post('/setKidsMode/:password',(req, res) => {
  console.log("In setKidsMode");
  var menu = {"code": "201", "message": "Kids Mode Cannot be set."}
  if(verifyHeader(req, res)){
    if(_trackIP.setIPandKidsMode(req.headers.xauth, req.params.password))
      var menu = KidsMenu;

    res.set({
      "Access-Control-Allow-Origin": "*",
      "xauth":req.headers.xauth,
      "Access-Control-Expose-Headers" : "xauth"
    })
    res.send({
      menu
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

// POST API to reset from Kids Mode
app.post('/resetKidsMode/:password',(req, res) => {
  console.log("In resetKidsMode");
  var menu = {"code": "201", "message": "Kids Mode Cannot be set."}
  if(verifyHeader(req, res)){
    if(_trackIP.resetIPandKidsMode(req.headers.xauth, req.params.password))
      var menu = Menu;
    res.set({
      "Access-Control-Allow-Origin": "*",
      "xauth": req.headers.xauth,
      "Access-Control-Expose-Headers" : "xauth"
    })
    res.send({
      menu
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//Returns searchoptions required to display on the search dialog
app.get('/searchoptions',(req, res) => {
  console.log("In searchOptions");
  if(verifyHeader(req, res)){
    var lang = _trackIP.getIPLanguage(req.headers.xauth);
    var lvsearchOptions = searchOptions;
    if(lang === 'CH')
      lvsearchOptions = searchOptions_CH;
    res.set({
      "Access-Control-Allow-Origin": "*"
    })
    res.send({
      lvsearchOptions
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//Returns regular / kids menu based on setting
app.get('/menu',(req, res) => {
  console.log("In getMenu");
  if(verifyHeader(req, res)){
    var lmenu = Menu;
    if(_trackIP.checkKidsMode(req.headers.xauth))
      lmenu = KidsMenu;
    res.set({
      "Access-Control-Allow-Origin": "*"
    })
    res.send({
      lmenu
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//Returns slideshow dataset (Advertisement)
app.get('/adengine/slideshow',(req, res) => {
  console.log("In slideshow");
  if(verifyHeader(req, res)){
    res.set({
      "Access-Control-Allow-Origin": "*"
    })
    res.send({
      SlideShow
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//Returns flight data, should it move to socket.io?
app.get('/flightdata',(req, res) => {
  console.log("In flightdata");
  if(verifyHeader(req, res)){
    res.set({
      "Access-Control-Allow-Origin": "*"
    })
    res.send({
      FlightData
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//Returns popularmedia dataset
app.get('/media/popularmedia',(req, res) => {
  console.log("In PopularMedia");
  if(verifyHeader(req, res)){
    res.set({
      "Access-Control-Allow-Origin": "*"
    })
    res.send({
      PopularMedia
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//Returns movielist, It also checks current langauge and returns the movie list
app.get('/movielist',(req, res) => {
  console.log("In Movielist");
  if(verifyHeader(req, res)){
    var lang = _trackIP.getIPLanguage(req.headers.xauth);
    var lvMovieList = MovieList;
    if(lang === 'CH')
      lvMovieList = MovieList_CH;
    res.set({
      "Access-Control-Allow-Origin": "*"
    })
    res.send({
      lvMovieList
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//Returns musiclist, It also checks current langauge and returns the music list
app.get('/musiclist',(req, res) => {
  console.log("In MusicList");
  if(verifyHeader(req, res)){
    var lang = _trackIP.getIPLanguage(req.headers.xauth);
    var lvMusicList = MusicList;
    if(lang === 'CH')
      lvMusicList = MusicList_CH;
    res.set({
      "Access-Control-Allow-Origin": "*"
    })
    res.send({
      lvMusicList
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//Returns tvlist, It also checks current langauge and returns the music list
app.get('/tvlist',(req, res) => {
  console.log("In TVList");
  if(verifyHeader(req, res)){
    var lang = _trackIP.getIPLanguage(req.headers.xauth);
    var lvTVList = TVList;
    if(lang === 'CH')
      lvTVList = TVList_CH;
    res.set({
      "Access-Control-Allow-Origin": "*"
    })
    res.send({
      lvTVList
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//Returns readlist, It also checks current langauge, kids mode and returns the read list
app.get('/readlist',(req, res) => {
  console.log("In readList");
  if(verifyHeader(req, res)){
    var lang = _trackIP.getIPLanguage(req.headers.xauth);
    var kidsMode = _trackIP.checkKidsMode(req.headers.xauth);
    var lvReadList = ReadList;
    if(lang === 'EN' && kidsMode)
      lvReadList = ReadKidsList;
    else if(lang === 'CH' && kidsMode)
      lvReadList = ReadKidsList_CH;
    else if(lang === 'CH')
      lvReadList = ReadList_CH;
    res.set({
      "Access-Control-Allow-Origin": "*"
    })
    res.send({
      lvReadList
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//Returns requested music MID details
app.get('/musiclist/:id',(req, res) => {
  console.log("In MusicList Extract");
  if(verifyHeader(req, res)){
    var lang = _trackIP.getIPLanguage(req.headers.xauth);
    var id = req.params.id;
    var filename = "./server/musiclist/"+id+".json";
    var lvMusicList={"code": "404", "message": "Media not found"}
    if (fs.existsSync(filename))
      lvMusicList = JSON.parse(fs.readFileSync(filename, 'utf8'));
    // if(lang === 'CH')
    //   lvMusicList = MusicList_CH;
    res.set({
      "Access-Control-Allow-Origin": "*"
    })
    res.send({
      lvMusicList
    }),(e) => {
      res.status(400).send(e);
    }
  }
});

//Serve static files
app.use(express.static('public'));

//Route the rest of the APIs
app.get('*', function(req, res) {
  res.set({
    "Access-Control-Allow-Origin": "*"
  })
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

//Function to Verify if the header has xauth and verify using jwt
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
    }),(e) => {
      res.status(401).send(e);
    }
  }
  return processData;
}

app.listen(port, ()=> {
  console.log("App started")
});

module.exports = {app};
