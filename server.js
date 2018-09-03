const express = require('express')
const bodyParser = require('body-parser');
const ugs = require('ultimate-guitar-scraper')
const app = express()

const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', function (req, res) {
  let song = req.body.song;
  
  //try some ultimate guitar scraping
  ugs.search({
    query: song,
    page: 1,
    type: ['Chords']
  }, (error, tabs) => {
    if (error) {
      console.log(error)
    } else {
	//console.log(tabs);
      	let songsJson = JSON.stringify(tabs);
	//console.log(songsJson);
      	let songList = JSON.parse(songsJson);
      	//console.log(songList[0]);
	var artistText = `Artist: ${songList[0].artist}`;
	var songText = `Song: ${songList[0].name}!`;
        console.log(artistText);
	console.log(songText);
	// Get the chords
	var tabUrl = songList[0].url;
	console.log(tabUrl);
	var chords;
	ugs.get(tabUrl, (error, tab) => {
  		if (error) {
    			console.log(error)
  		} else {
    			let tabJson = JSON.stringify(tab);
			let mytab = JSON.parse(tabJson);
			//console.log(mytab);
			chords = mytab.content.text;
        		//console.log(chords);
        		//res.render('index');
        		res.render('index2', {artist: artistText, song: songText, chords: chords, error: null});
  		}
	})
    }
  })

  //res.render('index');
  console.log(req.body.song);
})

app.get('/', function (req, res) {
  res.render('index');
})

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!')
})
