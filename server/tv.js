var fs = require('fs');

const TVList = JSON.parse(fs.readFileSync("./server/tv/tvlist.json", 'utf8'));

const TVList_CH = JSON.parse(fs.readFileSync("./server/tv/tvlist-cn.json", 'utf8'));

module.exports = {TVList, TVList_CH};
