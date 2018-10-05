var fs = require('fs');

const MovieList = JSON.parse(fs.readFileSync("./server/moviejson/movielist.json", 'utf8'));

const MovieList_CH = JSON.parse(fs.readFileSync("./server/moviejson/movielist.json", 'utf8'));

module.exports = {MovieList, MovieList_CH};
