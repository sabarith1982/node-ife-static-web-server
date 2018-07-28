class trackIP{
  constructor(){
    this.iptable = new Object();
    this.kidsMode = new Object();
  }

  setIPandLanguage(ip, language){
    console.log("In settrackIP ",ip);
    this.iptable[ip] = language;
  }

  getIPLanguage(ip){
    console.log("In gettrackIP ",ip,this.iptable[ip]);
    return this.iptable[ip] ? this.iptable[ip] : 'EN';
  }

  setIPandKidsMode(ip, password){
    console.log("In setIPandKidsMode ",ip);
    if(this.kidsMode[ip]){
      console.log("Already in kids mode. This shouldn't happen");
      return false;
    }
    this.kidsMode[ip] = password;
    return true;
  }

  resetIPandKidsMode(ip, password){
    console.log("In resetIPandKidsMode ", ip);
    if (this.kidsMode[ip]){
      if(this.kidsMode[ip] == password){
        console.log("Resetting kids mode");
        delete this.kidsMode[ip];
        return true;
      }
    }
    return false;
  }

  checkKidsMode(ip){
    if(this.kidsMode[ip]){
      return true;
    }
    return false;
  }
}

module.exports = {trackIP};
