const axios = require('axios');
const cors = require('cors');
const express = require("express");
const { getChart } = require('billboard-top-100');
const { send } = require('vite');
const { get } = require('http');



const ep_track = (title) => `https://api.deezer.com/search/track?q=${title}`;
const top_50 = (id) => `https://api.deezer.com/artist/${id}/top?limit=50`;
const ep_artist = (artist) => `https://api.deezer.com/artist/${artist}`;
const ep_search = (artist) => `https://api.deezer.com/search/artist?q=${artist}&limit=50&index=0`;//&index=0&limit=200&output=json
const ep_searchex = (query) => `https://api.deezer.com/search/artist?q=${query}&index=0`;//&index=0&limit=200&output=json
const ep_album = (id) => `https://api.deezer.com/album/${id}`;
const ep_albums = (id) => `https://api.deezer.com/search/album?q=${id}`;
const ep_albumsex = (id) => `https://api.deezer.com/search?q=artist:"${id}"`;

const app = express();
app.options('*', cors());
app.use(cors());

// app.options('/search', function (req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader('Access-Control-Allow-Methods', '*');
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.end();
// });

  

  app.get("/BillBoardTopSong", (ex_req, ex_res, next) => 
  
  {
    const date = new Date();
    let yyyy = date.getFullYear();
    let mm = date.getMonth();
    let dd = date.getDate();
    let dateStr = `${yyyy}-${mm}-${dd}`;
    console.log(yyyy, mm, dd);


    getChart('hot-100', `${yyyy-mm-dd}`, (err, chart) => {
      if (err) console.log(err);
      // // week of the chart in the date format YYYY-MM-DD
      // console.log(chart.week);
      // // URL of the previous week's chart
      // console.log(chart.previousWeek.url);
      // // date of the previous week's chart in the date format YYYY-MM-DD
      // console.log(chart.previousWeek.date);
      // // URL of the next week's chart
      // console.log(chart.nextWeek.url);
      // // date of the next week's chart in the date format YYYY-MM-DD
      // console.log(chart.nextWeek.date);
      // // array of top 100 songs for week of August 27, 2016
      // console.log(chart.songs);
      // // song with rank: 4 for week of August 27, 2016
      // console.log(chart.songs[3]);
      // // title of top song for week of August 27, 2016
      // console.log(chart.songs[0].title);
      // // artist of top songs for week of August 27, 2016
      // console.log(chart.songs[0].artist);
      // // rank of top song (1) for week of August 27, 2016
      // console.log(chart.songs[0].rank);
      // // URL for Billboard cover image of top song for week of August 27, 2016
      // console.log(chart.songs[0].cover);
      // // position info of top song
      // console.log(chart.songs[0].position.positionLastWeek);
      // console.log(chart.songs[0].position.peakPosition);
      // console.log(chart.songs[0].position.weeksOnChart);
      ex_res.setHeader("Access-Control-Allow-Origin", "*");
      ex_res.setHeader('Access-Control-Allow-Methods', '*');
      ex_res.setHeader("Access-Control-Allow-Headers", "*");
      ex_res.send(chart.songs[0]);

    });

  });

  app.get("/BillBoardTop100", (ex_req, ex_res, next) =>
  {
    const date = new Date();
    let yyyy = date.getFullYear();
    let mm = date.getMonth();
    let dd = date.getDate();
    let dateStr = `${yyyy}-${mm}-${dd}`;
    console.log(yyyy, mm, dd);

    getChart('hot-100', `${yyyy-mm-dd}`, (err, chart) => {
      if (err) console.log(err);
      ex_res.send(chart.songs);
    });
  });



  const { listCharts } = require('billboard-top-100');


  app.get("/listcharts", (ex_req, ex_res, next) =>
  {
    listCharts((err, charts) => {
      if (err) console.log(err);
      // array of all charts
      // console.log(charts);
      ex_res.setHeader("Access-Control-Allow-Origin", "*");
      ex_res.setHeader('Access-Control-Allow-Methods', '*');
      ex_res.setHeader("Access-Control-Allow-Headers", "*");
      ex_res.send(charts);
    });
  });


app.get("/artist/:artist/top50", (ex_req, ex_res, next) => {
  const artist = ex_req.params.artist;
  if(artist && artist.length > 0) {
    axios.get(ep_search(artist)).then(ax_res => {
      const id = ax_res.data.data[0].id;
      axios.get(top_50(id)).then(ax_res => {
        ex_res.setHeader("Access-Control-Allow-Origin", "*");
        ex_res.setHeader('Access-Control-Allow-Methods', '*');
        ex_res.setHeader("Access-Control-Allow-Headers", "*");
        ex_res.send(ax_res.data);
      });
    });
  }
});

app.get("/track/:title", (ex_req, ex_res, next) => {
  const title = ex_req.params.title;
  if(title && title.length > 0) { 
    axios.get(ep_track(title)).then(ax_res => {
      ex_res.setHeader("Access-Control-Allow-Origin", "*");
      ex_res.setHeader('Access-Control-Allow-Methods', '*');
      ex_res.setHeader("Access-Control-Allow-Headers", "*");
      ex_res.send(ax_res.data);
    });
  }
});


app.get("/search/:artist", (ex_req, ex_res, next) => {
  const artist = ex_req.params.artist;
  if(artist && artist.length > 0) {
    axios.get(ep_search(artist)).then(ax_res => {
      ex_res.setHeader("Access-Control-Allow-Origin", "*");
      ex_res.setHeader('Access-Control-Allow-Methods', '*');
      ex_res.setHeader("Access-Control-Allow-Headers", "*");      
      ex_res.send(ax_res.data);
    });
  }
});

app.get("/searchex/:artist", (ex_req, ex_res, next) => {
  const artist = ex_req.params.artist;
  if(artist && artist.length > 0) {
    axios.get(ep_searchex(artist)).then(ax_res => {
      ex_res.setHeader("Access-Control-Allow-Origin", "*");
      ex_res.setHeader('Access-Control-Allow-Methods', '*');
      ex_res.setHeader("Access-Control-Allow-Headers", "*");      
      ex_res.send(ax_res.data);
    });
  }
});

app.get("/artist/:artist", (ex_req, ex_res, next) => {
  const artist = ex_req.params.artist;
  if(artist && artist.length > 0) {
    axios.get(ep_artist(artist)).then(ax_res => {
      ex_res.setHeader("Access-Control-Allow-Origin", "*");
      ex_res.setHeader('Access-Control-Allow-Methods', '*');
      ex_res.setHeader("Access-Control-Allow-Headers", "*");
      ex_res.send(ax_res.data);
    });
  }
});

/** universal fn for app.get */
const set_get = (ep_local, ep_origin) => {
  app.get(ep_local, (ex_req, ex_res, next) => {
    const id = ex_req.params.id;
    if(id && id.length > 0) {
      axios.get(ep_origin(id)).then(ax_res => {
        ex_res.setHeader("Access-Control-Allow-Origin", "*");
        ex_res.setHeader('Access-Control-Allow-Methods', '*');
        ex_res.setHeader("Access-Control-Allow-Headers", "*");
        ex_res.send(ax_res.data);
      });
    }
  });
}

set_get("/albums/:id", ep_albumsex);
set_get("/albums2/:id", ep_albums);

app.listen(3000, () => {
 console.log("Server running on port 3000");
});




// ZING MP3 API CODE
