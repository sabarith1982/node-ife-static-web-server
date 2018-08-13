const ReadList = JSON.parse(fs.readFileSync("./server/readjson/readlist.json";, 'utf8'));

const ReadList_CH = JSON.parse(fs.readFileSync("./server/readjson/readlist-cn.json";, 'utf8'));

const ReadKidsList = JSON.parse(fs.readFileSync("./server/readjson/readlist-kids.json";, 'utf8'));

const ReadKidsList_CH = JSON.parse(fs.readFileSync("./server/readjson/readlist-kids-cn.json";, 'utf8'));

const ReadSearch = JSON.parse(fs.readFileSync("./server/readjson/readsearch.json";, 'utf8'));

const ReadSearch_CH = JSON.parse(fs.readFileSync("./server/readjson/readsearch-cn.json";, 'utf8'));

const ReadKidsSearch = JSON.parse(fs.readFileSync("./server/readjson/readsearch-kids.json";, 'utf8'));

const ReadKidsSearch_CH = JSON.parse(fs.readFileSync("./server/readjson/readsearch-kids-cn.json";, 'utf8'));

module.exports = {ReadList, ReadList_CH, ReadKidsList, ReadKidsList_CH, ReadSearch, ReadSearch_CH, ReadKidsSearch, ReadKidsSearch_CH};
