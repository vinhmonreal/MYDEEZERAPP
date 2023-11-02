import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'dotenv/config'
import mongoose, { get } from 'mongoose';
import  { AddSongToAPlayList, CreateNewUser, CreatePlaylist, DeletePlaylist, DislikeASong, EditPlaylist, GetUserPlaylists, LikeASong, VerifyUser, RemoveSongFromPlaylist, GetUserInfo } from './Models/User.js';
import { UserModel } from './Models/User.js';
import cors from 'cors';
import arr from './Models/2000hitsongs.js';
import { send } from 'vite';
import {AllOut2000sArr, FeelinMyselfArr, GetTurntArr} from './Models/Data.js';
import { ZingMp3 } from 'zingmp3-api-full';

export const api = process.env.API_URL;
// // get config vars
// dotenv.config();
// // access config var
// process.env.TOKEN_SECRET;
const app = express();
app.use(bodyParser.json());
app.use(morgan('tiny')); // log requests
app.use(cors({
    origin: '*'
}));
// user routes
app.post(`${api}/createaccount`, CreateNewUser);
app.post(`${api}/verifyuser`, VerifyUser);
// get user by username and userID 
app.post(`${api}/userinfo`, GetUserInfo);

// create myplaylist for user
app.post(`${api}/createplaylist`, CreatePlaylist);
// delete a user playlist
app.delete(`${api}/deleteplaylist`, DeletePlaylist)
// edit a user playlist
app.put(`${api}/editplaylist`, EditPlaylist);
// Like A Song
app.post(`${api}/likeasong`, LikeASong  );
// dislike a song
app.post(`${api}/dislikeasong`, DislikeASong);


// add song to playlist
app.put(`${api}/addsongtoaplaylist`, AddSongToAPlayList);
// get userplaylists
app.get(`${api}/userplaylists/:username`, GetUserPlaylists);
// remove a song from playlist
app.post(`${api}/removesongfromplaylist`, RemoveSongFromPlaylist);

// playlist routes
app.get(`${api}/playlist/AllOut2000s`, (req, res) => {
    res.send(AllOut2000sArr);
    send.status(200);        
});
app.get(`${api}/playlist/FeelinMyself`, (req, res) => {
    res.send(FeelinMyselfArr);
    send.status(200);
});
app.get(`${api}/playlist/GetTurnt`, (req, res) => {
    res.send(GetTurntArr);
    send.status(200);
});


// app.get(`${api}/playlist/BillBoardTop100`, async (req, res) => {
//     const data = await fetch('http://localhost:3000/billboardtop100');
//     console.log('hi');
//     res.send(data);
//     send.status(200);    
// });
// get single playlist by onwerID and playlist title
app.get(`${api}/playlist/:ownerID/:playlistID/:title`, async (req, res) => {
    const ownerID = req.params.ownerID;
    const title = req.params.title;
    const playlistID = req.params.playlistID;
    console.log(ownerID), console.log(title);console.log(playlistID);
    try {
        const playlist = await UserModel.findOne({_id: ownerID, 'playlists.title': title}, {'playlists.$': 1})
        if(playlist){
            res.status(200).json(playlist);
        }
        else{
            res.status(401).json({message: 'No such playlist found'});
        }
    } catch (error) {
        console.log('playlist');
        res.status(401).json({message: 'Error. No such playlist found'});
    }
});

// Zing MP3 API
// search anything
app.get(`${api}/zingmp3/search/:query`, async (req, res) => {
    const query = req.params.query;
    console.log(query);
    ZingMp3.search(query).then((data) => {
        console.log(data)
        res.send(data);
      })

});
// get song by id
app.get(`${api}/zingmp3/getsong/:id`, async (req, res) => {
    const id = req.params.id;
    console.log(id);
    ZingMp3.getSong(id).then((data) => {
        console.log(data)
        res.send(data);
      })

});
// get detail playlist by id
app.get(`${api}/zingmp3/getplaylist/:id`, async (req, res) => {
    const id = req.params.id;
    console.log(id);
    ZingMp3.getPlaylist(id).then((data) => {
        console.log(data)
        res.send(data);
      })

});
// get home 
app.get(`${api}/zingmp3/gethome`, async (req, res) => {
    ZingMp3.getHome().then((data) => {
        console.log(data)
        res.send(data);
      })

});
// get top 100
app.get(`${api}/zingmp3/gettop100`, async (req, res) => {
    ZingMp3.getTop100().then((data) => {
        console.log(data)
        res.send(data);
      })

});
// get chart home
app.get(`${api}/zingmp3/getcharthome`, async (req, res) => {
    ZingMp3.getChartHome().then((data) => {
        console.log(data)
        res.send(data);
      })

});
// get new release chart
app.get(`${api}/zingmp3/getnewreleasechart`, async (req, res) => {
    ZingMp3.getNewReleaseChart().then((data) => {
        console.log(data)
        res.send(data);
      })

});
// get song infosong
app.get(`${api}/zingmp3/getinfosong/:id`, async (req, res) => {
    const id = req.params.id;
    console.log(id);
    ZingMp3.getInfoSong(id).then((data) => {
        console.log(data)
        res.send(data);
      })
});
// get artist
app.get(`${api}/zingmp3/getartist/:name`, async (req, res) => {
    const name = req.params.name;
    console.log(name);
    ZingMp3.getArtist(name).then((data) => {
        console.log(data)
        res.send(data);
      })
});
// get lyric
app.get(`${api}/zingmp3/getlyric/:id`, async (req, res) => {
    const id = req.params.id;
    console.log(id);
    ZingMp3.getLyric(id).then((data) => {
        console.log(data)
        res.send(data);
      })
});




mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'My-Music-App'
})
    .then(() => {
        console.log('Database connection is ready');
    })
    .catch((err) => {
        console.log(err);
    }
);

app.listen(4000, () => {
    console.log(api);
    console.log('Server started on port 4000!');
    }
);


