
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { PlaylistModel } from './Playlists.js';



export const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: {type: String, required: true},
    type: {type: String, required: true},
    dateCreated: {type: Date, required: true},
    playlists: {type: Array, required: false}
});

export const UserModel = mongoose.model('users', UserSchema);

export async function CreateNewUser(req, res) {
    if (req.body.name == null || req.body.email == null || req.body.password == null) {
        res.status(400).send('Failed to create new account');
        return false;
    }

    const passwordHash = bcrypt.hashSync(req.body.password, 10);
    const _id = new mongoose.Types.ObjectId();
    let newUser = await UserModel.create({
        _id: _id,
        name: req.body.name,
        email: req.body.email,
        password: passwordHash,
        type: req.body.type,
        dateCreated: Date.now(),
        playlists: [
            {
                title: 'Liked Songs',
                ownerID: _id,
                dateCreated: Date.now(),
                playlistID: new mongoose.Types.ObjectId().toString(),
                songs: []
            }
        ]
    });
    // add token to user
    const token = GenerateToken(newUser);
    newUser.token = token;
    // const data = {
    //     id: newUser._id,
    //     name: newUser.name,
    //     email: newUser.email,
    //     type: newUser.type,
    //     dateCreated: newUser.dateCreated,
    //     playlists: newUser.playlists,
    //     token: token
    // };



    res.status(201).json(newUser);
}

function GenerateToken(user){
    return jwt.sign({
        data: user
      }, 'secret', { expiresIn: '1h' })
}




export async function VerifyUser(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({email: email});
    if(!user){
        res.status(401).json({message: 'No such user found'});
        return false;
    }

    if (user && (await bcrypt.compare(password, user.password))) {
        const data = {
            id: user._id,
            name: user.name,
            email: user.email,
            type: user.type,
            dateCreated: user.dateCreated,
            playlists: user.playlists,
            token: GenerateToken(user)
        };
        res.status(200).json(data);
    } else {
        res.status(401).json({message: 'Password is incorrect'});
    }
}


export async function GetUserInfo(req,res){
    const userID = req.body.userID;
    const username = req.body.username;
    console.log(userID, username);
    try {
        const user = await UserModel.findOne({_id: userID, name: username});
        if(user){
            const data = {
                id: user._id,
                name: user.name,
                email: user.email,
                type: user.type,
                dateCreated: user.dateCreated,
                playlists: user.playlists,
                token: GenerateToken(user)
            };
            res.status(200).json(data);
        }
        else{
            res.status(401).json({message: 'No such user found'});
        }
    }
    catch(error){
        res.status(401).json({message: 'Err No such user found'});
    }
}





export async function CreatePlaylist(req,res){
    const ID = req.body.id;
    try {
        let flag = true;
        let number = 1;
        while(flag){
        // add number to playlist title automatically
        const defaultTitle = `New Playlist ${number}`
        const ifTitleTaken = await UserModel.findOne({_id: ID, 'playlists.title': defaultTitle})
        if(ifTitleTaken){
            number++;
            flag = true;
        } else {
            const playlistID = new mongoose.Types.ObjectId().toString();
            const dateCreated = Date.now();
            const playlist = await UserModel.updateOne({_id: ID}, {$push: {playlists: {title: defaultTitle, ownerID: ID, dateCreated: dateCreated, playlistID: playlistID, songs: []}}});
            if (playlist) {
                const user = await UserModel.findOne({_id: ID})
                const data = user.playlists
                res.status(201).json(data);
                console.log(data);
            }
            else {
                res.status(401).json({message: 'Failed to create playlist'});
            }   
            flag = false;
        }
    }
    }
    catch(error){
        res.status(401).json({message: 'No such user found'});
    }
}



export async function EditPlaylist(req, res){

    const userID = req.body.userID
    const playlistID = req.body.playlistID
    const newTitle = req.body.newTitle
    const img = req.body.img
    const description = req.body.description


    if (newTitle !=''){
        try{
            const playlist = await UserModel.updateOne({_id: userID, 'playlists.playlistID': playlistID}, {$set: {'playlists.$.title': newTitle}});
        }
        catch(error){
            res.status(401).json({message: 'No such user found'});
        }
    }
    // if (img !=''){
    //     try{
    //         const playlist = await UserModel.updateOne({_id: userID, 'playlists.playlistID': playlistID}, {$set: {'playlists.$.img': img}});
    //         if(playlist){
    //             const user = await UserModel.findOne({_id: userID})
    //             const data = user.playlists
    //             res.status(201).json(data);
    //         }
    //         else{
    //             res.status(401).json({message: 'Failed to edit playlist'});
    //         }
    //     }
    //     catch(error){
    //         res.status(401).json({message: 'No such user found'});
    //     }
    // }
    if (description !=''){
        try{
            const playlist = await UserModel.updateOne({_id: userID, 'playlists.playlistID': playlistID}, {$set: {'playlists.$.description': description}});
        }
        catch(error){
            res.status(401).json({message: 'No such user found'});
        }
    }
    const user = await UserModel.findOne({_id: userID})
    const data = user.playlists
    console.log(data);
    res.status(201).json(data);
}






export async function DeletePlaylist(req, res){
    const userID = req.body.userID
    const title = req.body.title
    const playlistID = req.body.playlistID
    console.log(userID, title)
    // delete playlist
    try{
        const playlist = await UserModel.updateOne({_id: userID}, {$pull: {playlists: {title: title}}});
        if(playlist){
            const user = await UserModel.findOne({_id: userID})
            const data = user.playlists
            res.status(201).json(data);
        }
        else{
            res.status(401).json({message: 'Failed to delete playlist'});
        }
    }
    catch(error){
        res.status(401).json({message: 'No such user found'});
    }
}



export async function LikeASong(req, res) {
    const song = req.body.song;
    const userID = req.body.userID;
    const title = req.body.title;
    const playlistID = req.body.playlistID;
    song.songID = new mongoose.Types.ObjectId().toString();
    // create Liked Songs playlist if it doesn't exist
    try {
        const LikedSongsPlayList = await UserModel.findOne({_id: userID, 'playlists.title': 'Liked Songs'});
        if(!LikedSongsPlayList){
            // create Liked Songs playlist
            const NewLikedSongsPlayList = await UserModel.updateOne({_id: userID}, {$push: {playlists: {title: 'Liked Songs', ownerID: userID, dateCreated: Date.now(), playlistID: new mongoose.Types.ObjectId().toString(), songs: []}}});
            if(NewLikedSongsPlayList){
                console.log(NewLikedSongsPlayList);
            }
            else{
                res.status(401).json({message: 'Failed to create Liked Songs playlist'});
                return false;
            }
        }
        
    }
    catch(error){
        res.status(401).json({message: 'No such user found'});
        return false;
    }

    // query for playlist that has the playlistID
    try {
        const likeSong = await UserModel.updateOne({_id: userID, 'playlists.title': title}, {$push: {'playlists.$.songs': song}});
        if (likeSong) {
            console.log(likeSong);
        }
        else {
            res.status(401).json({message: 'Failed to like song'});
        }
    }
    catch(error){
        res.status(401).json({message: 'No such playlist or user found'});
    }
    const user = await UserModel.findOne({_id: userID});
        res.status(201).json(user);
}


export async function DislikeASong(req, res) {
    const userID = req.body.userID;
    const songID = req.body.songID;
    
    
    
    try{
        const dislikeSong = await UserModel.updateOne({_id: userID}, {$pull: {'playlists.$[].songs': {songID: songID}}});
        if(dislikeSong){
            console.log(dislikeSong);
            const user = await UserModel.findOne({_id: userID});
            res.status(201).json(user);
        }
        else{
            res.status(401).json({message: 'Failed to dislike song'});
        }
    }
    catch(error){
        res.status(401).json({message: 'No such user found'});
    }
}




export async function AddSongToAPlayList(req,res){
    const song = req.body.song;
    const userID = req.body.userID;
    const title = req.body.title;
    song.songID = new mongoose.Types.ObjectId().toString();
    // query for playlist that has the playlistID
    try{
        const playlist = await UserModel.findOne({_id: userID}, {'playlists.title': title})
        if(playlist){
            try {
                const addedSong = await UserModel.updateOne({_id: userID, 'playlists.title': title}, {$push: {'playlists.$.songs': song}});
                if(addedSong){
                    const data = await UserModel.findOne({_id: userID});
                    res.status(201).json(data.playlists);
                }
            }
            catch(error){
                res.status(401).json({message: 'Failed to add song to playlist'});
            }   
        }
    }
    catch(error){
        res.status(401).json({message: 'No such playlist or user found'});
    }
}





export async function GetUserPlaylists(req,res){
    const username = req.params.username;
    const user = await UserModel.findOne({name: username});
    if(user){
        console.log(user);
        res.status(200).json(user.playlists);
    }
    else{
        res.status(401).json({message: 'No such user found'});
    }
}


export async function RemoveSongFromPlaylist(req, res){
    const userID = req.body.userID;
    const songID = req.body.songID;
    const title = req.body.title;
    console.log(userID, songID, title);
    try{
        const removeSong = await UserModel.updateOne({_id: userID, 'playlists.title': title}, {$pull: {'playlists.$.songs': {songID: songID}}});
        if(removeSong){
            const user = await UserModel.findOne({_id: userID});
            res.status(201).json(user.playlists);
        }
        else{
            res.status(401).json({message: 'Failed to remove song from playlist'});
        }
    }
    catch(error){
        res.status(401).json({message: 'No such user found'});
    }
}

