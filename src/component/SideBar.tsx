import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/UserProvider";
import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from "axios";




interface SideBarProps {
    navigation: Boolean;
    userprops: React.ReactNode |  JSX.Element | JSX.Element[] 
}

export default function SideBar(props: SideBarProps) {


    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    
    const { setUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [token, setToken] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [mylist, SetMyList] = useState([])
    const [userID, setUserID] = useState('')
    const [loading, setLoading] = useState(true)



    useEffect (() => {
        
        const user = localStorage.getItem('user')?.replace(/['"]+/g, '')
        const token = localStorage.getItem('token')
        const userID = localStorage.getItem('userID')
        if (user && token && userID){
            setLoggedIn(true)
            setName(user)
            setToken(token)
            setUserID(userID)
            setLoading(true)
        }

        let url = `http://localhost:4000/api/userplaylists/${user}`
    
            axios({
                method: 'GET',
                url: url,
            })
            .then((response) => {
                console.log(response, 'response')
                SetMyList(response.data)
            }
            )
            .catch((error) => {
                console.log(error)
            }
            )
            setLoading(false)
        
    }, [loading])

        function CreateAPlayListForUser(){
        const data = {
            id: userID.replace(/['"]+/g, ''),
        }
        axios({
            method: 'POST',
            url: 'http://localhost:4000/api/createplaylist',
            data: data
        })
        .then((response) => {
            console.log(response, 'createplaylist')
            SetMyList(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }


    function handleLogout(){
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser({
            loggedIn:false,
            username:'',
            userID:'',
            token:'',
            myplaylists:[]
          })
        navigate('/home')
    }
    const popup = () => {
        return (
            <div>
                            <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                            <i className="fa fa-plus" onClick={()=>{
                                console.log('clicked')
                            }}></i>
                            </Button>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                                }}
                            >   
                            <div className="popover" onClick={()=>{
                                handleClose()
                                CreateAPlayListForUser()

                                }}>
                                <Typography className='popup' sx={{ p: 2 }} >Create New Playlist</Typography>
                            </div>
                            </Popover>
                            </div>
        )
    }

    
    return (

        <div id="aside">
            <div id="navigation">
                <span><i id='navigation-icon' className="fa fa-home" style={style} onClick={()=>{
                    navigate('/home')
                }}></i>Home</span>
                <span><i id='navigation-icon' className="fa fa-search" style={style} onClick={()=>{navigate('/search')}} ></i>Search</span>
            </div>


            <div id="userprops">
                {loggedIn ?
                <>
                    <h4>Hello {name}</h4>
                    {loading ? <center><i className="fa fa-spinner fa-spin fa-5x"></i></center> : ''}
                    {!loading && mylist.length > 0 ?
                    <div id="myplaylists">
                        <div id="library-header">
                            <i className="fa fa-music" style={style}></i>
                            <h4>Your Library</h4>

                            {popup()}
                        </div>
                            {mylist.map((playlist: PlayList) => (
                                <div className="library-list" key={playlist.title} onClick={()=>{
                                    // remove the "" from the string
                                    const userID = playlist.ownerID.replace(/['"]+/g, '')
                                    const playlistID = playlist.playlistID.replace(/['"]+/g, '')
                                    const playlistTitle = playlist.title.replace(/['"]+/g, '')
                                    console.log(userID, playlistID, playlistTitle, ' iam click')
                                    navigate(`/playlist/${userID}/${playlistID}/${playlistTitle}`)
                                }} >
                                    <img src="https://e-cdns-images.dzcdn.net/images/cover/1ea1a631aa5235bbd0063643beb96fa8/120x120-000000-80-0-0.jpg" alt="" width={52} />
                                    <div>
                                        <a>{playlist.title}</a>
                                        <p>{numbertoDate(playlist.dateCreated)}</p>
                                        <p>{playlist.songs !==undefined? playlist.songs.length > 1 ? `${playlist.songs.length} songs` : `${playlist.songs.length} song`: null}</p>
                                    </div>
                  
                                    
                                </div>
                                
                            ))}          
                    </div>
                    : ''}
                    <i className="fa fa-sign-out" style={style} onClick={handleLogout}><a href="signout">Sign Out</a></i>
                </>
                : <h4>Please <a href="/signin">Sign in</a></h4>}
            </div>
        </div>
    )
}


const style = {
    fontSize: '28px',
}

interface PlayList {
    title: string;
    ownerID: string;
    dateCreated: string;
    playlistID: string;
    songs: Array<Object>;
}

function numbertoDate(num: any) {
    const date = new Date(num)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDay()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
    

export function LikeASong(userID: string, song: {}){
    const data = {
        userID: userID.replace(/['"]+/g, ''),
        song: song,
        title: "Liked Songs"
    }
    console.log(userID,'like a song user id')
    axios({
        method: 'POST',
        url: 'http://localhost:4000/api/likeasong',
        data: data
    })
    .then((response) => {
        console.log(response, 'sucess')
    })
    .catch((error) => {
        console.log(error)
    })
}

export function DislikeASong(userID: string, songID: string){
    console.log(userID, songID, 'dislike a song user id')
    const data = {
        userID: userID.replace(/['"]+/g, ''),
        songID: songID,
    }
    axios({
        method: 'POST',
        url: 'http://localhost:4000/api/dislikeasong',
        data: data
    })
    .then((response) => {
        console.log(response, 'sussesdqds')
        // refresh window
        window.location.reload()
    })
    .catch((error) => {
        console.log(error)
    })
}
