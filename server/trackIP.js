class trackIP{
  constructor(){
    this.iptable = new Object();
  }

  setIPandLanguage(ip, language){
    console.log("In settrackIP ",ip);
    this.iptable[ip] = language;
  }

  getIPLanguage(ip){
    console.log("In gettrackIP ",ip,this.iptable[ip]);
    return this.iptable[ip] ? this.iptable[ip] : 'EN';
  }
}

module.exports = {trackIP};
