//Hashing class to sign and verify tokens

var jwt = require('jsonwebtoken');

class Hashing{
  constructor(){
    this.hashMap = new Object();
    this.secretKey = "xiamenife";
    this.connection = 0;
  }

  hashToken(data){
    this.connection++;
    var token = jwt.sign(this.connection+""+data, this.secretKey, { algorithm: 'HS256'});
    this.hashMap[token] = this.connection;
    return token;
  }

  verifyToken(token){
    try{
      if(this.hashMap[token]){
        var decoded = jwt.verify(token, this.secretKey, { algorithms: ['HS256'] });
        return true;
      }
    }catch(e){
      console.log(e);
    }
    return false;
  }
}

module.exports = {Hashing}
