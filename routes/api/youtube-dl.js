const express = require("express");
const router = express.Router();
const ytSearch = require("yt-search");
const youtubedl = require("youtube-dl");
const imagefinder = require("imagefinder");

router.get("/image", function(req, res) {
  console.log("query: " + req.query.query);

  var query = req.query.query;
  imagefinder({
    keyword: query
  }).then(images => {
    res.json(images);
  });
});

router.get("/audio", function(req, res) {
  console.log("query: " + req.query.query);

  var query = req.query.query;

  ytSearch({ query }, function(err, results) {
    if (err) throw err;

    const videos = results.videos;
    const url = "https://www.youtube.com" + videos[0].url;

    youtubedl.exec(
      url,
      ["-f", "bestaudio", "-g", "--geo-bypass-country", "PE"],
      {},
      function(err, output) {
        if (err) throw err;
        res.json(output);
      }
    );
  });
});

module.exports = router;
