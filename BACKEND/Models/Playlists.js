import mongoose from 'mongoose';

export const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    title: { type: String, required: true },
    ownerID: { type: String, required: true },
    songs: { type: Array, required: true },
    dateCreated: { type: Date, required: true }
});

export const PlaylistModel = mongoose.model('playlists', PlaylistSchema);

