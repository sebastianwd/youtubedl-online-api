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

    console.log("url: " + url);
    youtubedl.exec(url, ["-f", "bestaudio", "-g", "--geo-bypass"], {}, function(
      err,
      output
    ) {
      if (err) throw err;
      res.json(output);
    });
  });
});

router.get("/", function(req, res) {
  try {
    console.log("url: " + req.query.url);
    console.log("options: " + req.query.o);

    const url = req.query.url;
    let options = req.query.o;

    if (!Array.isArray(options)) {
      options = [options];
    }

    youtubedl.exec(url, options || [], {}, function(err, output) {
      if (err) throw err;
      res.json(output);
    });
  } catch (error) {
    res.json("Couldn't process that command");
    console.warn(error);
  }
});

module.exports = router;
