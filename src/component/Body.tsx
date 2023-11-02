import { Container, Stack } from "react-bootstrap";
import BottomBar from "./BottomBar";
import TopNav from "./TopNav";
import SideBar from "./SideBar";
import TrackPlaying from "./TrackPlaying";
import ArtistPlaying from "./ArtistPlaying";
import RightSideBar from "./RightSideBar";
import { useContext, useEffect, useRef, useState } from "react";
import { HipHop, ThrowBack } from "./DATA";
import { json, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/UserProvider";
import axios from "axios";
import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import  { convertToMin } from "./CreatePlayingTrack"
import { DislikeASong } from "./SideBar"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Popper, TextField, colors } from "@mui/material"
import { create } from "@mui/material/styles/createTransitions";
import {LikeASong } from "./SideBar"
import NextUp from "./NextUp";
import { get } from "axios";

interface BodyProps {
    navigation: Boolean;
    sidebar: React.ReactNode |  JSX.Element | JSX.Element[] ;
    bottombar: Boolean;
    children: React.ReactNode |  JSX.Element | JSX.Element[] 
    children2: React.ReactNode |  JSX.Element | JSX.Element[]
    rightsidebar: React.ReactNode |  JSX.Element | JSX.Element[] ;
}

const Body = ({navigation, sidebar,children,bottombar,children2,rightsidebar}: BodyProps) => {   
    // PLAYER
    const [play, setPlay] = useState(false)
    const [pause, setPause] = useState(false)
    const [audio, setAudio] = useState<HTMLAudioElement>()
    let tracklength = 30  
    let countUp = 0
    let countDown = tracklength
    const [seekTrackValue, setSeekTrackValue] = useState(0)
    
    // LEFOVER SONGS AND PLAYLISTS

    const [isLeftOver, setIsLeftOver] = useState(false)
    useEffect (() => {
        // change the path
        window.history.pushState(null, '', '/home')
        // console.log('left oevers')
        if (localStorage.getItem('leftoversong') && localStorage.getItem('leftoverplaylist')){
            setIsLeftOver(true)
            setShowRightBar(true)
            setCurrentSong(JSON.parse(localStorage.getItem('leftoversong') as string))
            setCurrentPlaylist(JSON.parse(localStorage.getItem('leftoverplaylist') as string))
            setRightBarSong(JSON.parse(localStorage.getItem('leftoversong') as string))
            setRightBarPlaylist(JSON.parse(localStorage.getItem('leftoverplaylist') as string))
        } 
        // console.log(currentSong, 'currentSong')

    }
    ,[])
    useEffect (() => {
        if (isLeftOver){
        const toBeRemoved = document.querySelector('.bottombar-playing')
             toBeRemoved?.remove()
             CreatePlayTrack(JSON.parse(localStorage.getItem('leftoversong') as string), JSON.parse(localStorage.getItem('leftoverplaylist') as string),localStorage.getItem('leftoverplaylisttitle') as string)
                setCurrentSong(JSON.parse(localStorage.getItem('leftoversong') as string))
                setIsCurrentSong(true)
                setCurrentPlaylist(JSON.parse(localStorage.getItem('leftoverplaylist') as string))
        }
    }, [isLeftOver])
    const [currentPlaylist, setCurrentPlaylist] = useState<any>([])
    const [currentSong, setCurrentSong] = useState<any>({})
    const [IsCurrentSong, setIsCurrentSong] = useState(false)
    const [clickonHome, setClickOnHome] = useState(true)
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState([])
    const [error, setError] = useState('')
    const [searched, setSearched] = useState(false)
    const navigate = useNavigate()
    const [ListCoverIsOnHover, setListCoverIsOnHover] = useState(false)
    const [coverID, setCoverID] = useState('')
    const [song, setSong] = useState([])
    const [currentPath, setCurrentPath] = useState('')

    const [datauserplaylist, setDataUserPlaylist] = useState([])
    const [UserPlaylistID, setUserPlaylistID] = useState('')
    const [websiteplaylistname, setWebsitePlaylistName] = useState('')
    const [clickonuserplaylist, setClickOnUserPlaylist] = useState(false)
    const [clickonwebsiteplaylist, setClickOnWebsitePlaylist] = useState(false)
    const [clickonsearch, setClickOnSearch] = useState(false)
    const [search, setSearch] = useState('')
    const [showrightbar, setShowRightBar] = useState(false)
    const [isAddedLoadingBar, setIsAddedLoadingBar] = useState(false)
    const [showicon, setShowIcon] = useState(false)
    let { searchValue } = useParams()
    const [id4, setId4] = useState('')
    const [searchresults, setSearchResults] = useState([])
    const [loadingdatauserplaylist, setLoadingDataUserPlaylist] = useState(false)
    const { setUser } = useContext(AuthContext)
    const [name, setName] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [userPlaylist, SetUserPlaylist] = useState([])
    const [userID, setUserID] = useState('')
    const [username, setUsername] = useState('')

    const  [pagesHistory, setPagesHistory] = useState<any>([])
    const [pageHistoryIndex, setPageHistoryIndex] = useState(-1)
    const [clickonBackArrow, setClickOnBackArrow] = useState(false)
    const [clickonForwardArrow, setClickOnForwardArrow] = useState(false)

    const [playlisttitle,SetPlaylistTittle] = useState('')
    const {ownerID} = useParams()
    const {playlistID} = useParams()
    // const [results, setResults] = useState([])
    const [isplaying, setIsPlaying] = useState(false)
    const [data, setData] = useState([])
    // const [loading, setLoading] = useState(true)
    const [idsongplaying, setIdSongPlaying] = useState('')
    const [description, setDescription] = useState('')
    const [ triggerLoadUserData, setTriggerLoadUserData ] = useState(false)
    const [loadingforuserprops, setLoadingForUserProps] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [userType, setUserType] = useState('')
    const [userDateCreated, setUserDateCreated] = useState('')
    // GET USER DATA AFTER LOGIN OR SIGNUP
        useEffect(() => {
            setUserID(localStorage.getItem('userID') as string)
            setUsername(localStorage.getItem('user') as string)
            setUserEmail(localStorage.getItem('email') as string)
            setUserType(localStorage.getItem('type') as string)
            setUserDateCreated(localStorage.getItem('dateCreated') as string)


            if (localStorage.getItem('userID') && localStorage.getItem('username')){
                setLoggedIn(true)
            }
        console.log(userID, 'userID')
        }, [])

    // LOAD USER DATA
    useEffect(() => {
        setLoadingForUserProps(true)
        setLoadingForUserProps(false)
        setLoadingDataUserPlaylist(true)
        setLoadingDataUserPlaylist(false)
    }, [userPlaylist])

    
// RIGHTBAR----------------------------------------------------------
const [clickonrightbar, setClickOnRightBar] = useState(false)
const [RightBarSong, setRightBarSong] = useState([])
const [RightBarPlaylist, setRightBarPlaylist] = useState([])

useEffect(() => {
    if (!RightBarSong || !RightBarPlaylist|| RightBarSong.length === 0 || RightBarPlaylist.length === 0) {
        setClickOnRightBar(false)
    }
}, [])

// NAVBAR----------------------------------------------------------
const [userInfo, setUserInfo] = useState<any>([])
const [anchorEl_AccountFace, setAnchorEl_AccountFace] = React.useState<HTMLButtonElement | null>(null);

const handleClick_AccountFace = (event: React.MouseEvent<HTMLButtonElement>) => {
  setAnchorEl_AccountFace(event.currentTarget);
};

const handleClose_AccountFace = () => {
  setAnchorEl_AccountFace(null);
};

const open_AccountFace = Boolean(anchorEl_AccountFace);
const id_AccountFace = open_AccountFace ? 'simple-popover' : undefined;


const popup_AccountFace= () => {
        return (
          <div>
            <i className="fa fa-user-circle" aria-hidden="true" style={{fontSize: '34px', color: 'white'}} onClick={handleClick_AccountFace}></i>
            <Popover
              id={id_AccountFace}
              open={open_AccountFace}
              anchorEl={anchorEl_AccountFace}
              onClose={handleClose_AccountFace}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
                <Modal_UserInfo />
                <Typography className='popup' sx={{ p: 2 }} onClick={()=>{handleLogout()}}>Sign Out</Typography>
            </Popover>
          </div>
        );
      }

      const style_UserInfo = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#333',
        border: '2px solid #000',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4,
      };
      const USER = useContext(AuthContext)
      console.log(USER, 'USER')
      const [open_UserInfo, setOpen_UserInfo] = React.useState(false);
      const handleOpen_UserInfo = () => setOpen_UserInfo(true);
      const handleClose_UserInfo = () => setOpen_UserInfo(false);
     function Modal_UserInfo() {
      
        return (
          <div>
            <Typography className='popup' sx={{ p: 2 }} onClick={()=>{getUserInfo();handleOpen_UserInfo()}}>Account</Typography>
            <Modal
              open={open_UserInfo}
              onClose={handleClose_UserInfo}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style_UserInfo}>
                <div>
                  {/* <p> Name: {USER}</p> */}
                  <p>ID: {userID}</p>
                  <p>Email: {userEmail}</p>
                  <p> Account Type: {userType}</p>
                  <p>Date Created: {userDateCreated.slice(0,10).replace(/['"]+/g, '')}</p>
                </div>
                <div>
                    <h4>Upgrade to Premium for $10 per month</h4>
                </div>
                <Button href="/upgrade">Upgrade</Button>
                <Button onClick={handleClose_UserInfo}>Close</Button>
                
              </Box>
            </Modal>
          </div>
        );
      }

function getUserInfo () {
    const url = 'http://localhost:4000/api/userinfo'
    const data = {
        userID: userID.replace(/['"]+/g, ''),
        username: username.replace(/['"]+/g, ''),
    }
    console.log(data,'fsdfsd')
    axios({
        method: 'POST',
        url: url,
        data: data,
    })
    .then((response) => {
        setUserInfo(response.data)
        console.log(userInfo, 'userInfo')
    })
    .catch((error) => {
        console.log(error)
    })
}
const loader = document.createElement('i')
            loader.className = 'fa fa-spinner fa-spin fa-3x fa-fw'
            loader.style.fontSize = '34px'
            loader.style.color = 'white'
            loader.style.position = 'absolute'
            loader.style.top = '50%'
            loader.style.left = '50%'
            loader.style.transform = 'translate(-50%, -50%)'
        
// SEARCHBAR ---------------------------------------------------------
    useEffect(() => {
        if (!loading){ 
            const loader = document.getElementsByClassName('fa-spinner')[0]
            loader?.remove()
            return
        }
        if (loading){
            // put the loader inside the section and center it
            const section = document.getElementById('section')
            section?.appendChild(loader)
        }

        axios({
            method: 'GET',
            url: `http://localhost:3000/track/${search}`,
        })

        .then((response) => {
            console.log(response)
            setSearchResults(response.data.data)
           })
        .catch((error) => {
            console.log(error)
            setError(error.message)
        })
        .finally(() => {
            setLoading(false)
            setSearched(true)
        }
        )
    }, [loading])

    useEffect( () => {
        if (!search) {
            setSearchResults([])
            setSearched(false)
            return
        }
        searchValue = search
        setLoading(true)
    }, [search])

    useEffect(() => {
        if(searchresults.length==0 && searched){
            setError('No results found')       
        } else {
            setError('')
        }
    }, [searchresults, searched])


 


      useEffect(() => {
          const horizontalStack = document.getElementById('horizontal-stack')
          if (showrightbar === true){
                horizontalStack?.classList.remove('horizontal-stack-home')
            } else {
            horizontalStack?.classList.add('horizontal-stack-home')
      }
    }, [showrightbar])
    const [clickonartist, setClickOnArtist] = useState(false)
    const SEARCHBAR = () => {
        return (
            <div className="section">
                {/* <div id="search-box-wraper">
                    <i className="fa fa-search"></i>
                    <input id="search-box"  placeholder=" What do you want to listen to?" type="text" value={search} onChange={e => setSearch(e.target.value)} ></input>
          
                </div> */}
                <div id="search-wrapper">    
                    {!loading && error && <p>{error}</p>}
                    {searchresults.length>0  &&                   
                    <div className="search-result-table" id="search-result-tabel">
                        {searchresults.map((result: any) => (                           
                            <div className="search-result" key={result.id} 
                            onMouseOver={()=>{
                                setShowIcon(true)
                                setId4(result.id)                              
                            }} onMouseOut={()=>{                              
                                setShowIcon(false)
                                setId4('')                        
                            }}>

                            <div className="search-result-count" ><span className={result.id} onClick={()=>{

                                setIdSongPlaying(result.id)
                                setClickOnPlayIcon(true)
                                setClickOnPlayIconID(result.id)
                                setShowRightBar(true)   
                                setCurrentSong(result)
                                console.log(currentSong, 'currentSong')
                                setCurrentPlaylist(currentPlaylist)
                                CreatePlayTrack(result, currentPlaylist,websiteplaylistname)  
                                setIsCurrentSong(true)
                                // navigate('song')
                                localStorage.setItem('leftoversong', JSON.stringify(result))
                                localStorage.setItem('leftoverplaylist', JSON.stringify(currentPlaylist))
                                }                                   
                            }                
                            >{showicon && id4 ==  result.id ? <i className="fa fa-play"></i> : searchresults.indexOf(result)+1}</span></div>
                            <div className="search-result-cover"><img src={result.album.cover_small} width={46}/></div>
                            <div className="search-result-title-artist">
                                <div className="search-result-title" >{result.title}</div>
                                <div className="search-result-artist"><a className="search-result-artist" onClick={()=>{
                                        setArtistName(result.artist.name);
                                        setClickOnHome(false)
                                        setClickOnSearch(false)
                                        setClickOnUserPlaylist(false)
                                        setClickOnWebsitePlaylist(false)
                                        setClickOnQueue(false)
                                        setClickOnArtist(true)
                                        if (window.location.pathname.replace('/artist/', '').replace(/%20/g, ' ') !== result.artist.name){
                                        navigate(`/artist/${result.artist.name}`)}
                                        }}>
                                {result.artist.name}</a>
                                </div>
                            </div>
                            <div className="search-result-album">{result.album.title}</div>
                            <div className="search-result-heart" ><span className={result.id}>{showicon && id4 == result.id ? <i className="fa fa-heart" onClick={()=>{ setTriggerLoadUserData(true);LikeASong(userID,result);}}></i> : ''}</span></div>
                            <div className="search-result-duration">{convertToMin(result.duration)}</div>
                            <div className="search-result-ellipses" >{showicon && id4 == result.id ? popup_menu(result.artist.name, result) : ''}</div>

                            </div>                 
                        ))}                    
                    </div>
                    }
                </div>
            </div>
        )
    }
    // ARTIST----------------------------------------------------------
    const [artist, setArtist] = useState('')
    const [url, setURL] = useState('')
    const [image, setImage] = useState('')
    const [resultforartist, SetResultForArtist] = useState([])
    const [id5, setId5] = useState('')
    // const { artistname } = useParams()
    const [artistname, setArtistName] = useState('')
    const [track, setTrack] = useState<any[]>([])

    let artisttitle = window.location.pathname.replace('/artist/', '')

    interface trackofArtist {
        album: {
            cover: string,
            cover_big: string,
            cover_medium: string,
            cover_small: string,
            cover_xl: string,
            id: number,
            title: string,
            tracklist: string,
            type: string
        },
        artist: {
            id: number,
            name: string,
            tracklist: string,
            type: string
        },
        duration: number,
        id: string,
        link: string,
        preview: string,
        title: string,
        md5_image: string,
    }



    const [artistImage, setArtistImage] = useState('')
    const callpicture = (name:string) => {
    axios({
        method: 'GET',
        url: `http://localhost:3000/search/${name}`,

    })
        .then((response) => {
            if (response.data.data.length === 0) {
                setError('Cannot find artist')
                return
            }
            console.log(response)
            setArtistImage(response.data.data[0].picture_big)
        }
        )
        .catch((error) => {
            console.log(error)
        })
    }
    function GetArtist(name: string) {
        console.log(name, 'name')
        setLoading(true)
    // SetResultForArtist([])
        const callSongs = () => {
        axios({
            method: 'GET',
            url: `http://localhost:3000/artist/${name}/top50`,
        
        })
            .then((response) => {
                try {
                    SetResultForArtist(response.data.data)
                  
                } catch (error) {
                    setError('Cannot find artists songs')
                }
                console.log(response,'afa')
          
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                if (resultforartist.length === 0) {
                    setError('Cannot find artists songs')
                    console.log(error)
                }
                else{
                    localStorage.setItem('playlist', JSON.stringify(track))
                }
                setError('')
                setLoading(false)
            })
        }
        callpicture(name)
        callSongs()
        setClickOnHome(false)
        setClickOnSearch(false)
        setClickOnUserPlaylist(false)
        setClickOnWebsitePlaylist(false)
        setClickOnQueue(false)
        setClickOnArtist(true)
    
}


const [artistClicked, setArtistClicked] = useState('')
const [clickonartistAlready, setClickOnArtistAlready] = useState(false)
const artistPlayingdetail = document.getElementById('artist__playing__details') as HTMLDivElement


// RIGHT SIDE BAR
const [clickonQueue, setClickOnQueue] = useState(false)
const RIGHTBAR = () => {
    // console.log(currentSong, 'currentSong')
    const onLastTrack = currentPlaylist.indexOf(currentSong) === currentPlaylist.length - 1
    const trackplayingHeading = document.getElementById('track__playing__heading') as HTMLHeadingElement
    trackplayingHeading?.classList.remove('animated')
    const trackPlayingImage = document.getElementById('track__playing__img') as HTMLImageElement
    const trackPlayingTitle = document.getElementById('track__playing__title') as HTMLHeadingElement
    const trackPlayingArtist = document.getElementById('track__playing__artist') as HTMLParagraphElement

    // playlistname? trackplayingHeading.innerHTML = playlistname : playlistname? trackplayingHeading.innerHTML = playlistname : trackplayingHeading.innerHTML = ''
    if (trackPlayingTitle?.innerHTML.length > 20) {
        trackPlayingTitle.classList.add('animated')
    }
    if (trackplayingHeading?.innerHTML.length > 20) {
        trackplayingHeading?.classList.add('animated')
    }
    // Artist playing element
    console.log(currentSong, 'zzzzzzzzzzzzzzzzzzzzzzcurrentSong')
    

    return (
        <div>
            {IsCurrentSong && (
                <>
                <div id="track__playing">
                    <h2 id="track__playing__heading">{playlistname}</h2>
                    <img id="track__playing__img" alt="" src={currentSong.album?.cover_medium} />
                    <div className="track__playing__details">
                        <h3 id="track__playing__title">{currentSong.title}</h3>
                        <p id="track__playing__artist">{currentSong.artist?.name}</p>
                    </div>
                </div>
                
                <div id="artist__playing__artist">
                    <center><h3>Artist</h3></center>
                    <center><img id="artist__playing__img" alt="" src={currentSong.artist?.picture_medium} /></center>
                    <div className="artist__playing__details">
                        <p id="artist__playing__details" className="search-result-artist" onClick={()=>{
                            setArtistName(currentSong.artist?.name);
                            setClickOnHome(false)
                            setClickOnSearch(false)
                            setClickOnUserPlaylist(false)
                            setClickOnWebsitePlaylist(false)
                            setClickOnQueue(false)
                            setClickOnArtist(true)
                            if (window.location.pathname.replace('/artist/', '').replace(/%20/g, ' ') !== currentSong.artist?.name){
                            navigate(`/artist/${currentSong.artist?.name}`)}
                        }}>{currentSong.artist?.name}</p>
                        <p id="artist__playing__more__details">more details</p>
                    </div>
                </div>
    
                <div id="nextup">
                    {currentPlaylist[currentPlaylist.indexOf(currentSong) + 1] ? (
                        <><div className="nextup-heading">
                                <h2>Next Up</h2>
                                <a onClick={()=>{
                                console.log('clicked')
                                setClickOnArtist(false)
                                setClickOnHome(false)
                                setClickOnSearch(false)
                                setClickOnUserPlaylist(false)
                                setClickOnWebsitePlaylist(false)
                                setClickOnQueue(false)
                                setClickOnQueue(true)
                                navigate('/queue')
                                }}>Open Queue</a>
                            </div>
                            <div className="nextup__track">
                                <div className="nextup__track__img">
                                    <img id="nextup__track__img" alt="" onClick={()=>{navigate(`/song/`)}} src={currentPlaylist[currentPlaylist.indexOf(currentSong) + 1]?.album.cover_small ? currentPlaylist[currentPlaylist.indexOf(currentSong) + 1].album.cover_small : ''} />
                                </div>
                                <div className="nextup__track__details">
                                    <h4 id="nextup__track__title">{currentPlaylist[currentPlaylist.indexOf(currentSong) + 1].title ? currentPlaylist[currentPlaylist.indexOf(currentSong) + 1].title : ''}</h4>
                                    <a id="nextup__track__artist" onClick={()=>{
                                        setArtistName(currentPlaylist[currentPlaylist.indexOf(currentSong) + 1].artist.name) 
                                        setClickOnHome(false)
                                        setClickOnSearch(false)
                                        setClickOnUserPlaylist(false)
                                        setClickOnWebsitePlaylist(false)
                                        setClickOnQueue(false)
                                        setClickOnArtist(true)

                                    if (window.location.pathname.replace('/artist/', '').replace(/%20/g, ' ') !== currentPlaylist[currentPlaylist.indexOf(currentSong) + 1].artist.name){
                                        navigate(`/artist/${currentPlaylist[currentPlaylist.indexOf(currentSong) + 1].artist.name}`)}
                                    }}>{currentPlaylist[currentPlaylist.indexOf(currentSong) + 1].artist.name ? currentPlaylist[currentPlaylist.indexOf(currentSong) + 1].artist.name : ''}</a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="nextup-heading">
                            <a onClick={()=>{
                                console.log('clicked')
                                setClickOnArtist(false)
                                setClickOnHome(false)
                                setClickOnSearch(false)
                                setClickOnUserPlaylist(false)
                                setClickOnWebsitePlaylist(false)
                                setClickOnQueue(true)
                                navigate('/queue')
                            }}>Open Queue</a>
                        </div>  
                    )}    
                </div>
            </>
            )}
        </div>
    )
}

const QUEUE = () => {
    return (
        <>
        <div className="decoration">
            <div className="decoration-wrapper">
                <img src="https://e-cdns-images.dzcdn.net/images/cover/bf65337238582a19ee63f35de819ac78/250x250-000000-80-0-0.jpg" alt="" />
                  <h1>QUEUE</h1>
            </div>
        </div>
      <div className="section"> 
            <div id="search-wrapper">    
                  <div className="search-result-table" id="search-result-tabel">
                        {currentPlaylist.map((result: any) => (                           
                            <div className="search-result" key={result.id} 
                            onMouseOver={()=>{
                                      setShowPlayIcon(true)
                                      setId3(currentPlaylist.indexOf(result))                             
                                  }} 
                            onMouseOut={()=>{  
                                      setShowPlayIcon(false)
                                      setId3('')                                                 
                                  }}
                                  >
                                  <div className="search-result-count" >
                                    <span className={result.id} >
                                          {showplayicon && id3 ==  currentPlaylist.indexOf(result) ? <i  className={"fa fa-play"}
                                                onClick={()=>{
                                                    setIdSongPlaying(result.id)
                                                    setClickOnPlayIcon(true)
                                                    setClickOnPlayIconID(result.id)
                                                    setShowRightBar(true)   
                                                    setCurrentSong(result)
                                                    console.log(currentSong, 'currentSong')
                                                    CreatePlayTrack(result, currentPlaylist,websiteplaylistname)  
                                                    setIsCurrentSong(true)
                                                    setCurrentPlaylist(currentPlaylist)
                                                    // navigate(`/song/`)
                                                    localStorage.setItem('leftoversong', JSON.stringify(result))
                                                    localStorage.setItem('leftoverplaylist', JSON.stringify(currentPlaylist))
                                                }                                   
                                                } 
                                    ></i> : currentPlaylist.indexOf(result)+1 } 
                                    </span>
                                  </div>
                                  <div className="search-result-cover"><img src={result.album.cover_small} width={46}/></div>
                                  <div className="search-result-title-artist"><div className="search-result-title" >{result.title}</div><div className="search-result-artist" 
                                  onClick={()=>{
                                        setArtistName(result.artist.name);
                                        setClickOnHome(false)
                                        setClickOnSearch(false)
                                        setClickOnUserPlaylist(false)
                                        setClickOnWebsitePlaylist(false)
                                        setClickOnQueue(false)
                                        setClickOnArtist(true)
                                        if (window.location.pathname.replace('/artist/', '').replace(/%20/g, ' ') !== result.artist.name){
                                        navigate(`/artist/${result.artist.name}`)}
                                        }} ><a className="search-result-artist" onClick={()=>{
                                        setArtistName(result.artist.name);
                                        setClickOnHome(false)
                                        setClickOnSearch(false)
                                        setClickOnUserPlaylist(false)
                                        setClickOnWebsitePlaylist(false)
                                        setClickOnQueue(false)
                                        setClickOnArtist(true)
                                        if (window.location.pathname.replace('/artist/', '').replace(/%20/g, ' ') !== result.artist.name){
                                        navigate(`/artist/${result.artist.name}`)}
                                            }}>{result.artist.name}</a></div>
                                  </div>
                                  <div className="search-result-album">{result.album.title}</div>
                                  <div className="search-result-heart" ><span className={result.id}>{showplayicon && id3 == currentPlaylist.indexOf(result) ? <i className="fa fa-heart-o" 
                                  onClick={
                                    ()=>{
                                          console.log(result)
                                          if (userID){
                                          LikeASong(userID, result)
                                          console.log('like a song')
                                          }
                                          // addToMyPlayList(result)
                                    }
                                  }></i> : ''}</span></div>
                                    <div className="search-result-duration">{convertToMin(result.duration)}</div>
                                    <div className="search-result-ellipses" >{showplayicon && id3 == currentPlaylist.indexOf(result) ? popup_menu(result.artist.name,result) : ''}</div>                                 
                      </div>                            
                        ))}                    
                  </div>
            </div>
      </div>
      </>
        )
    }
 

    useEffect(() => {
          const horizontalStack = document.getElementById('horizontal-stack')
          if (showrightbar === true){
                horizontalStack?.classList.remove('horizontal-stack-home')
            } else {
            horizontalStack?.classList.add('horizontal-stack-home')
      }
    }, [showrightbar])


    const ARTIST = () => {

        return (
        <div>
            {clickonartist && loading === false && !error && (
            <div className="section">
                <div className="artist-wrapper">
                    <h1>{artistname}</h1>
                    <img src={artistImage} alt={artist} />
                </div>
            <div id="search-wrapper">
                {!loading && error && <p>{error}</p>}
            <div className="search-result-table" id="search-result-tabel">
                        {resultforartist.map((result: trackofArtist) => (                           
                            <div className="search-result" key={result.id} 
                            onMouseOver={()=>{
                                setId5(result.id)
                                setShowIcon(true)                             
 
                            }} onMouseOut={()=>{                              
                                setShowIcon(false)
                                setId5('')                       
                            }}>


                            <div className="search-result-count" ><span className={result.id} onClick={()=>{
                                setIdSongPlaying(result.id)
                                                      setClickOnPlayIcon(true)
                                                      setClickOnPlayIconID(result.id)
                                                      setShowRightBar(true)   
                                                        setCurrentSong(result)
                                                        // console.log(currentSong, 'curefds')
                                                        setCurrentPlaylist(resultforartist)
                                                      CreatePlayTrack(result, resultforartist, artistname) 
                                                    //   navigate(`/song/`)
                                                      setIsCurrentSong(true)
                                                      setCurrentPlaylist(resultforartist)
                                                      localStorage.setItem('leftoversong', JSON.stringify(result))
                                                      localStorage.setItem('leftoverplaylist', JSON.stringify(data))
                               
                                }                                   
                            }                
                            >{showicon && id5 ==  result.id ? <i className="fa fa-play"></i> : resultforartist.indexOf(result)+1}</span></div>
                            <div className="search-result-cover"><img src={result.album.cover_small} width={46}/></div>
                            <div className="search-result-title-artist"><div className="search-result-title" >{result.title}</div><div className="search-result-artist" onClick={()=>{
                                }} ><a className="search-result-artist"onClick={()=>{
                                    setArtistName(result.artist.name);
                                    setClickOnHome(false)
                                    setClickOnSearch(false)
                                    setClickOnUserPlaylist(false)
                                    setClickOnWebsitePlaylist(false)
                                    setClickOnQueue(false)
                                    setClickOnArtist(true)
                                    if (window.location.pathname.replace('/artist/', '').replace(/%20/g, ' ') !== result.artist.name){
                                    navigate(`/artist/${result.artist.name}`)}
                                }} >{result.artist.name}</a></div></div>
                            <div className="search-result-album">{result.album.title}</div>
                            <div className="search-result-heart" ><span className={result.id}>{showicon && id5 == result.id ? <i className="fa fa-heart" onClick={()=>{LikeASong(userID,result);setTriggerLoadUserData(true)}}></i> : ''}</span></div>
                            <div className="search-result-duration">{convertToMin(result.duration)}</div>
                            <div className="search-result-ellipses" >{showicon && id5 == result.id ? popup_menu(result.artist.name, result) : ''}</div>
                            </div>                 
                        ))}                    
                    </div>
            </div>
            </div>
            )}
        </div>
        )
    }




    // SIDEBAR CONST
    
    // loading for first time after login
    useEffect(() => {
        if (localStorage.getItem('user') && localStorage.getItem('token')){
            setName(localStorage.getItem('user') as string)
            setLoggedIn(true)
            setUserID(localStorage.getItem('userID') as string)
            setUsername(localStorage.getItem('user') as string)
            // get user playlist
            axios({
                method: 'GET',
                url: `http://localhost:4000/api/userplaylists/${username.replace(/['"]+/g, '')}`,
            })
            .then((response) => {
                SetUserPlaylist(response.data)
            })
        }
        console.log(name, 'name', loggedIn, 'logged in', userPlaylist, 'userPlaylist', userID, 'userID', username, 'username')
    }
    ,[loggedIn])
            
  
    // useEffect(() => {
    //     console.log(currentPath, 'currentPath')
    //     // set the path
    //     window.history.pushState(null, '', currentPath)

    // }, [currentPath])

 
  
    // if (currentPath === '/home'){
    //     setClickOnHome(true)
    // }
    function CreateList (playlist: any){
        return(
            <div className="lists">
                    {playlist.map((result: any) => (
                        <div className="list-card" key={result.id} 
                        onMouseOver={()=>{
                            setCoverID(result.id)
                            setListCoverIsOnHover(true)
                        }}
                        onMouseOut={()=>{
                            setCoverID('')
                            setListCoverIsOnHover(false)
                        }
                        }
                        >
                            <i className={ListCoverIsOnHover && coverID === result.id ? "fa fa-play-circle" : ""}></i>
                            <img className='playlist-cover' src={result.img} alt="" width={150} id={result.id}
                                
                                onClick={() => {
                                    setWebsitePlaylistName(result.link)
                                    console.log(websiteplaylistname, 'linke')
                                    setCurrentPath(`/playlist/${result.link}`)
                                    setResults(result.songs)
                                    console.log(results)
                                    setClickOnHome(false)
                                    setClickOnUserPlaylist(false)
                                    setClickOnSearch(false)
                                    setClickOnArtist(false)
                                    setClickOnQueue(false)
                                    setClickOnWebsitePlaylist(true)
                                    navigate(`/playlist/${result.link}`)


                                }
                                } />
                            <div className="list-title">
                                <h3>{result.title}</h3>
                                <p>{result.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
        )
    }

    const HOMEPAGE = () => {
        return (
        <>

            <div className="playlists-wraper">
                    <div>
                        <h2>BillBoard #1</h2>
                    </div>
                    {CreateList(song)}
            </div><div className="playlists-wraper">
                    <div>
                        <h2>Throw Back</h2>
                    </div>
                    {CreateList(ThrowBack)}
            </div><div className="playlists-wraper">
                <div>
                    <h2>Hiphop</h2>
                </div>
                {CreateList(HipHop)}
            </div>
        </>
        )
    }

    // --------------------sidebar--------------------

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


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
            // sort the playlist by date
            const sorted = response.data.sort((a: any, b: any) => a.title.localeCompare(b.title))
            SetUserPlaylist(response.data.sort((a: any, b: any) => a.title.localeCompare(b.title)))
            console.log(userPlaylist, 'userPlaylist')
            console.log(sorted, 'sorted')
        })
        .catch((error) => {
            console.log(error)
        })
    }


    function handleLogout(){
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('userID')
        localStorage.removeItem('myplaylists')
        localStorage.removeItem('leftoversong')
        localStorage.removeItem('leftoverplaylist')
        localStorage.removeItem('currentplaylist')
        localStorage.removeItem('currentsong')
        localStorage.removeItem('currentpath')
        setIsLeftOver(false)
        SetUserPlaylist([])
        setName('')
        setLoggedIn(false)
        setUserID('')
        setUsername('')
        SetUserPlaylist([])
        setUser({
            loggedIn:false,
            username:'',
            userID:'',
            token:'',
            myplaylists:[],
            type:''
          })
        window.location.reload()
    }


    


const popup_PlusButton = () => {
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
                            transformOrigin={{
                                vertical: 'top',
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

const style = {
    fontSize: '28px',
}

interface PlayList {
    title: string;
    ownerID: string;
    dateCreated: string;
    playlistID: string;
    songs: Array<Object>;
    description: string | ''
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
    
function LikeASong(userID: string, song: {}){
    console.log(userID, song, 'like a song user id')
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
        SetUserPlaylist(response.data.playlists)
        localStorage.setItem('myplaylists', JSON.stringify(response.data.playlists))
        setDataUserPlaylist(response.data.playlists)
    })
    .catch((error) => {
        console.log(error)
    })
    setTriggerLoadUserData(true)
}

function DislikeASong(userID: string, songID: string){
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
        console.log(response, 'nocgbcw')
        SetUserPlaylist(response.data.playlists)
        const newdatauserplaylist = datauserplaylist.filter((song: any) => song.songID !== songID)
        setDataUserPlaylist(newdatauserplaylist)
        localStorage.setItem('myplaylists', JSON.stringify(response.data.playlists))

      
    })
    .catch((error) => {
        console.log(error)
    })
}

// --------------------USERpLAYLIST--------------------------


useEffect(() => {
    function call(){
    const url = `http://localhost:4000/api/playlist/${ownerID}/${playlistID}/${playlisttitle}`
    console.log(url, 'urllll')
    setLoading(true)
        axios({
                method: 'GET',
                url: url,
                })
                .then((response) => {
                        console.log(response)
                        setData(response.data.playlists[0].songs)
                        setDescription(response.data.playlists[0].description)
                        console.log(data,'songs')

                })
                .catch((error) => {
                        console.log(error)
                })
                .finally(() => {
                    setLoading(false)
                })
    }
    call()
}, [playlistID, playlisttitle, ownerID])

useEffect(() => {
      const horizontalStack = document.getElementById('horizontal-stack')
      if (showrightbar === true){
            horizontalStack?.classList.remove('horizontal-stack-home')
        } else {
        horizontalStack?.classList.add('horizontal-stack-home')
  }
}, [showrightbar])

const [showplayicon, setShowPlayIcon] = useState(false)
const [id2, setId2] = useState<number | string | null>(null);
const [clickonplayicon, setClickOnPlayIcon] = useState(false)
const [clickonplayiconID, setClickOnPlayIconID] = useState('')





const [anchorElPopUp, setAnchorElPopUp] = React.useState<HTMLButtonElement | null>(null);
const [ClickOnDeletePopover, SetClickOnDeletePopover] = React.useState(false);
const [ClickOnEditDetailsPopover, SetClickOnEditDetailsPopover] = React.useState(false);
const handleOpenPopUp = (event: React.MouseEvent<HTMLButtonElement>) => {
  setAnchorElPopUp(event.currentTarget);
};

const handleClosePopUp = () => {
  setAnchorElPopUp(null);
};


const open2 = Boolean(anchorElPopUp);
const _id = open2 ? 'simple-popover' : undefined;
const popupforuserplaylist = () => {
    return (
        <div>
          <Button aria-describedby={_id} variant="contained" onClick={handleOpenPopUp} style={{backgroundColor: 'transparent', border: 'none'}}>
            <i className="fa fa-ellipsis-h" style={{fontSize: '24px'}}></i>
          </Button>
          <Popover
            id={_id}
            open={open2}
            anchorEl={anchorElPopUp}
            onClose={handleClosePopUp}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
          > 
            <div onClick={()=>{SetClickOnEditDetailsPopover(true); handleClosePopUp()}} >
                <Typography className='popup' sx={{ p: 2 }}>Edit details</Typography>
            </div>
            <div onClick={()=>{ SetClickOnDeletePopover(true); handleClosePopUp()}}>
                <Typography className='popup' sx={{ p: 2 }} >Delete </Typography>
            </div>
          </Popover>
        </div>
      )
}


const [confirmDelete, setConfirmDelete] = useState(false)
const DeleteForm = () => {
    if (ClickOnDeletePopover === true){
        return (
            <div>
              <Modal
                open={ClickOnDeletePopover}
                onClose={()=>{SetClickOnDeletePopover(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                    <Box className="delete-form">
                        <h2  id="modal-modal-title">Are you sure you want to delete {playlisttitle}</h2>
                        <div >
                            <Button className="confirm-button" onClick={()=>{SetClickOnDeletePopover(false)}}>No</Button>
                            <Button className="confirm-button" onClick={()=>{setConfirmDelete(true);SetClickOnDeletePopover(false)}}>Yes</Button>
                        </div>
                    </Box>
              </Modal>
            </div>
            );
    }
}
const [confirmTrashDelete, setConfirmTrashDelete] = useState(false)
const [idtrash, setIdTrash] = useState('')
const [clickontrashicon, setClickOnTrashIcon] = useState(false)

const FormConfirmTrashDelete = () => {
    if (clickontrashicon === true){
        return (
            <div>
              <Modal
                open={clickontrashicon}
                onClose={()=>{setClickOnTrashIcon(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                    <Box className="delete-form">
                        <h2  id="modal-modal-title">Are you sure you want to delete this song</h2>
                        <div >
                            <Button className="confirm-button" onClick={()=>{setClickOnTrashIcon(false)}}>No</Button>
                            <Button className="confirm-button" onClick={()=>{setConfirmTrashDelete(true);setClickOnTrashIcon(false)}}>Yes</Button>
                        </div>
                    </Box>
              </Modal>
            </div>
            );
    }
}
const FormConfirmTrashDelete2 = () => {
    if (clickontrashicon === true){
        return (
            <div>
              <Modal
                open={clickontrashicon}
                onClose={()=>{setClickOnTrashIcon(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                    <Box className="delete-form">
                        <h2  id="modal-modal-title">Are you sure you want to delete this song</h2>
                        <div >
                            <Button className="confirm-button" onClick={()=>{setClickOnTrashIcon(false)}}>No</Button>
                            <Button className="confirm-button" onClick={()=>{setConfirmTrashDelete(true);setClickOnTrashIcon(false)}}>Yes</Button>
                        </div>
                    </Box>
              </Modal>
            </div>
            );
    }
}

function RemoveSongFromAList (userID: string, songID: string){
    const data = {
        userID: userID.replace(/['"]+/g, ''),
        songID: songID,
        title: UserPlaylistPageTitle
    }
    console.log(data)
    axios({
        method: 'POST',
        url: 'http://localhost:4000/api/removesongfromplaylist',
        data: data
    })
    .then((response) => {
        console.log(response, 'nocgbcw')
        SetUserPlaylist(response.data)
        const newdatauserplaylist = datauserplaylist.filter((song: any) => song.songID !== songID)
        setDataUserPlaylist(newdatauserplaylist)
        localStorage.setItem('myplaylists', JSON.stringify(response.data.playlists))

    })
    .catch((error) => {
        console.log(error)
    })
}

useEffect(() => {
    if (confirmTrashDelete===true){
        console.log(userID, idtrash, 'userID, idtrash')
        if(userID && UserPlaylistPageTitle === 'Liked Songs'){
            DislikeASong(userID, idtrash)
        } else {
            RemoveSongFromAList(userID, idtrash)
        }
        setConfirmTrashDelete(false)
    }
}, [confirmTrashDelete])
                            

useEffect(() => {
    if (confirmDelete === true){
        const url = `http://localhost:4000/api/deleteplaylist`
        const data = {
            userID: userID?.replace(/['"]+/g, ''),
            title: playlisttitle,
        }
        axios({
            method: 'DELETE',
            url: url,
            data: data
        })
        .then((response) => {
            console.log(response)
            navigate(`/welcome`)
            SetUserPlaylist(response.data)
        })
        .catch((error) => {
            console.log(error)
        })}
        setConfirmDelete(false)
        setClickOnHome(true)
        setClickOnUserPlaylist(false)
        setClickOnWebsitePlaylist(false)
        setClickOnSearch(false)
        

    }, [confirmDelete])

// edit details form
const [editDetails, setEditDetails] = useState(false)
const [newImage, setNewImage] = useState('')
const playlisttitlefield = useRef<HTMLInputElement>(null)
const descriptionfield = useRef<HTMLInputElement>(null)
const playlistImage = useRef<HTMLInputElement>(null)

const EditDetailsForm = () => {

    if (ClickOnEditDetailsPopover === true){
        return (
            <div>
                <Modal
                    open={ClickOnEditDetailsPopover}
                    onClose={()=>{SetClickOnEditDetailsPopover(false)}}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className="edit-details-form">
                        <span> 
                            <h2>Edit details</h2>
                            <i className="fa fa-times" style={{fontSize: '24px', float: 'right', cursor: 'pointer', color: 'black'}}  onClick={()=>{SetClickOnEditDetailsPopover(false)}} ></i>
                        </span>
                        <span >
                            <label htmlFor="outlined-basic" className="upload-image" >Upload Image</label>
                            <input type="file" id="upload-image" ref={playlistImage} itemRef={newImage}/>
                            <TextField id="outlined-basic" label="Playlist Title" variant="outlined" inputRef={playlisttitlefield} placeholder={playlisttitle} multiline={false} size="small" color="primary"/>
                            <TextField id="outlined-basic-description" label="Description" variant="outlined" inputRef={descriptionfield} placeholder='Description' multiline={true} size="small"/>
                        </span>
                        <span>
                            <Button className="confirm-button" onClick={()=>{SetClickOnEditDetailsPopover(false)}}>Cancel</Button>
                            <Button className="confirm-button" onClick={()=>{submitform();SetClickOnEditDetailsPopover(false)}}>Save</Button>
                        </span>
                    </Box>
                </Modal>
            </div>
            );
    }
}



 const submitform = () => {
    const newtitle = playlisttitlefield.current?.value
    const newdescription = descriptionfield.current?.value
    const newimage = playlistImage.current?.value
    
         const url = `http://localhost:4000/api/editplaylist`
         const data = {
                userID: userID?.replace(/['"]+/g, ''),
                playlistID: UserPlaylistID,
                newTitle : playlisttitlefield.current?.value,
                description: descriptionfield.current?.value,
                img: newImage,
         }
         axios({
             method: 'PUT',
             url: url,
             data: data
         })
         .then((response) => {
             console.log(response)
                SetUserPlaylist(response.data)
                setUserPlaylistPageDescription(newdescription)
                setUserPlaylistPageTitle(newtitle)
         })
         .catch((error) => {
             console.log(error)
         })
     }
     const [UserPlaylistPageTitle, setUserPlaylistPageTitle] = useState('')
    const [UserPlaylistPageDescription, setUserPlaylistPageDescription] = useState('')



     const USERPLAYLIST = () => {
        return (
            <>
        {ClickOnDeletePopover===true && <DeleteForm />}
        {ClickOnEditDetailsPopover===true && <EditDetailsForm />}
        <div className="decoration">
            <div className="decoration-wrapper">
                <img src="https://e-cdns-images.dzcdn.net/images/cover/1ea1a631aa5235bbd0063643beb96fa8/120x120-000000-80-0-0.jpg" alt="" />
                <div>
                    <h1>{UserPlaylistPageTitle}</h1>
                    <h4>{UserPlaylistPageDescription}</h4>
                    <p>{datauserplaylist.length===0 ? '': datauserplaylist.length === 1 ? `${datauserplaylist.length} song` : `${datauserplaylist.length} songs`}</p>
                </div>
            </div>
            {popupforuserplaylist()}
        </div>

      <div className="section"> 
            <div id="search-wrapper">    
                  <div className="search-result-table" id="search-result-tabel">
                    {loadingdatauserplaylist && <><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i></>}
                        {!loadingdatauserplaylist && datauserplaylist.map((result: any) => (                           
                            <div className="search-result" key={datauserplaylist.indexOf(result)+1} 
                            onMouseOver={()=>{
                                      setShowPlayIcon(true)
                                      setId2(datauserplaylist.indexOf(result)+1)
                                  }} 
                            onMouseOut={()=>{  
                                      setShowPlayIcon(false)
                                      setId2('')                                                 
                                  }}
                                  >
                                  <div className="search-result-count" >
                                    <span className={result.id} >
                                          {showplayicon && id2 ==  datauserplaylist.indexOf(result)+1 ? <i  className={"fa fa-play"}
                                                onClick={()=>{
                                                      setIdSongPlaying(result.id)
                                                      setClickOnPlayIcon(true)
                                                      setClickOnPlayIconID(result.id)
                                                      setShowRightBar(true)   
                                                      setCurrentSong(result)
                                                      CreatePlayTrack(result, datauserplaylist,UserPlaylistPageTitle) 
                                                      setIsCurrentSong(true)
                                                      setCurrentPlaylist(datauserplaylist)
                                                    //   navigate(`/song/`)
                                                      localStorage.setItem('leftoversong', JSON.stringify(result))
                                                      localStorage.setItem('leftoverplaylist', JSON.stringify(data))
                              
                                                }                                   
                                                } 
                                    ></i> : datauserplaylist.indexOf(result)+1 } 

                                    </span>
                                  </div>
                                  <div className="search-result-cover"><img src={result.album.cover_small} width={46}/></div>
                                  <div className="search-result-title-artist"><div className="search-result-title" >{result.title}</div><div className="search-result-artist" ><a className="search-result-artist" onClick={()=>{
                                    setArtistName(result.artist.name);
                                    setClickOnHome(false)
                                    setClickOnSearch(false)
                                    setClickOnUserPlaylist(false)
                                    setClickOnWebsitePlaylist(false)
                                    setClickOnQueue(false)
                                    setClickOnArtist(true)
                                    if (window.location.pathname.replace('/artist/', '').replace(/%20/g, ' ') !== result.artist.name){
                                    navigate(`/artist/${result.artist.name}`)}
                                    }}>{result.artist.name}</a></div>
                                  </div>
                                  <div className="search-result-album">{result.album.title}</div>
                                  <div className="search-result-heart" ><span className={result.id}>{showplayicon && id2 == datauserplaylist.indexOf(result)+1 ? <i className="fa fa-trash" onClick={()=>{setClickOnTrashIcon(true); setIdTrash(result.songID)}}></i> : ''}</span></div>
                                  {clickontrashicon === true && UserPlaylistPageTitle === 'Liked Songs' && <FormConfirmTrashDelete />}
                                  {clickontrashicon === true && UserPlaylistPageTitle !== 'Liked Songs' && <FormConfirmTrashDelete2 />}
                                  <div className="search-result-duration">{convertToMin(result.duration)}</div>
                                  <div className="search-result-ellipses" >{showplayicon &&  id2 == datauserplaylist.indexOf(result)+1 ? popup_menu(result.artist.name, result) : ''}</div>

                                  
                      </div>                            
                        ))}                    
                  </div>
            </div>
            
      </div>
        </>
            )
        }


// WEBSITE PLAYLIST------------------------------------------------------------

const {playlistname} = useParams()
// const {ownerID} = useParams()
// const [results, setResults] = useState([])
// const [data, setData] = useState([])
// const [idsongplaying, setIdSongPlaying] = useState('')


useEffect(() => {
      localStorage.setItem('playlist', JSON.stringify(data))
      console.log(localStorage.getItem('playlist'))
}, [loading])

useEffect(() => {
let url = ''
if (playlistname === 'BillBoardTop100'){
      url = 'http://localhost:3000/BillBoardTop100'
}
else{
      url = `http://localhost:4000/api/playlist/${websiteplaylistname.replace(/\s/g, '')}`
}      
  if (websiteplaylistname)
  { 
      axios({
          method: 'GET',
          url: url,
      })
          .then((response) => {
              console.log(response)
              setData(response.data)
              console.log(data)
              setLoading(false)
          })
          .catch((error) => {
              console.log(error)
          })
  }
 
}, [websiteplaylistname])

// elipses popover menu
const [anchorElPopUp_menu, setAnchorElPopUp_menu] = React.useState<HTMLButtonElement | null>(null);
const [popupAddToPlaylist, SetpopupAddToPlaylist] = useState(false)
const [ShowAddToPlaylist, setShowAddToPlaylist] = useState(false)
const handleOpenPopUp_menu = (event: React.MouseEvent<HTMLButtonElement>) => {
  setAnchorElPopUp_menu(event.currentTarget);
};

const handleClosePopUp_menu = () => {
  setAnchorElPopUp_menu(null);
};


useEffect(() => {
    if (popupAddToPlaylist === true){
        setShowAddToPlaylist(true)
        setAnchorElPopUp_addtoplaylist(anchorElPopUp_menu)
    }
    else{
        setShowAddToPlaylist(false)
    }
}, [popupAddToPlaylist])

// Add to playlist popover
const [anchorElPopUp_addtoplaylist, setAnchorElPopUp_addtoplaylist] = React.useState<HTMLButtonElement | null>(null);
const handleOpenPopUp_addtoplaylist = (event: React.MouseEvent<HTMLButtonElement>) => {
  setAnchorElPopUp_addtoplaylist(event.currentTarget);
};

const handleClosePopUp_addtoplaylist = () => {
  setAnchorElPopUp_addtoplaylist(null);
};


const open_addtoplaylist = Boolean(anchorElPopUp_addtoplaylist);
const _id_addtoplaylist = open_addtoplaylist ? 'simple-popover' : undefined;
const popup_addtoplaylist = (song: any) => {
    return (
        <div>
          <Typography className='popup' sx={{ p: 2 }}  onClick={handleOpenPopUp_addtoplaylist} >
            Add To Playlist  <i className="fa fa-angle-right" style={{fontSize: '12px'}}></i>
          </Typography>
          <Popover                        
            id={_id_addtoplaylist}
            open={open_addtoplaylist}
            onClose={handleClosePopUp_addtoplaylist}
            anchorEl={anchorElPopUp_addtoplaylist}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
          > 
            <div onClick={()=>{handleClosePopUp_addtoplaylist();handleClosePopUp_menu();CreateAPlayListForUser()}} >
                <Typography className='popup' sx={{ p: 2 }} >Create New Playlist</Typography>
            </div>
            {
            userPlaylist.filter((result: PlayList) => result.title !== 'Liked Songs').map((result: PlayList) => (
              <div  onClick={()=>{
                // close the popover
                handleClosePopUp_addtoplaylist()
                handleClosePopUp_menu()
                // add to playlist
                AddSongToAPlaylist(userID, result.title, song)
                    
                }
            }>
                <Typography className='popup' sx={{ p: 2 }}  >{result.title}</Typography>
            </div>
          ))}
          </Popover>
        </div>
      )
}

// useEffect(() => {
//     if (ShowAddToPlaylist === true){
//         console.log('clicked')
//     popup_addtoplaylist()
//     }
// }, [ShowAddToPlaylist])

// add song to a certain playlist
const AddSongToAPlaylist = (userID: string, playlisttitle: string, song: any) =>{
    console.log(userID, playlisttitle, song, 'add song to a playlist')
    const data = {
        userID: userID.replace(/['"]+/g, ''),
        song: song,
        title: playlisttitle
    }
    axios({
        method: 'PUT',
        url: 'http://localhost:4000/api/addsongtoaplaylist',
        data: data
    })
    .then((response) => {
        console.log(response)
        SetUserPlaylist(response.data)
        // localStorage.setItem('myplaylists', JSON.stringify(response.data))
    })
    .catch((error) => {
        console.log(error)
    })
}





const open_menu = Boolean(anchorElPopUp_menu);
const _id_menu = open_menu ? 'simple-popover' : undefined;
const popup_menu = (artist: string, song:any) => {
    return (
        <div>
          <Button aria-describedby={_id_menu} variant="contained" onClick={handleOpenPopUp_menu} style={{backgroundColor: 'transparent', border: 'none'}}>
            <i className="fa fa-ellipsis-h" style={{fontSize: '24px'}}></i>
          </Button>
          <Popover
            id={_id_menu}
            open={open_menu}
            anchorEl={anchorElPopUp_menu}
            onClose={handleClosePopUp_menu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          > 
            { popup_addtoplaylist(song)}
            <div onClick={()=>{handleClosePopUp_menu()}} >
                <Typography className='popup' sx={{ p: 2 }} >Go To Album </Typography>
            </div>
            <div onClick={()=>{
                    setArtistName(artist);
                    handleClosePopUp_menu();
                    setClickOnHome(false)
                    setClickOnSearch(false)
                    setClickOnUserPlaylist(false)
                    setClickOnWebsitePlaylist(false)
                    setClickOnQueue(false)
                    setClickOnArtist(true)
                    if (window.location.pathname.replace('/artist/', '').replace(/%20/g, ' ') !== artist){ 
                    navigate(`/artist/${artist}`)}

                 }}>
                <Typography className='popup' sx={{ p: 2 }} >Go To Artist </Typography>
            </div>
          </Popover>
        </div>
      )
}
useEffect(() => {
    console.log('effect')
    GetArtist(artistname)
}, [artistname])


useEffect(() => {
    const horizontalStack = document.getElementById('horizontal-stack')
    if (showrightbar === true){
          horizontalStack?.classList.remove('horizontal-stack-home')
      } else {
      horizontalStack?.classList.add('horizontal-stack-home')
}
}, [showrightbar])

// const [showplayicon, setShowPlayIcon] = useState(false)
const [id3, setId3] = useState('')

const WEBSITEPLAYLIST = () => {
    return (
        <>
        <div className="decoration">
            <div className="decoration-wrapper">
                <img src="https://e-cdns-images.dzcdn.net/images/cover/bf65337238582a19ee63f35de819ac78/250x250-000000-80-0-0.jpg" alt="" />
                  <h1>{websiteplaylistname}</h1>
            </div>
        </div>
      <div className="section"> 
            <div id="search-wrapper">    
                  <div className="search-result-table" id="search-result-tabel">
                        {data.map((result: any) => (                           
                            <div className="search-result" key={result.id} 
                            onMouseOver={()=>{
                                      setShowPlayIcon(true)
                                      setId3(data.indexOf(result))                             
                                  }} 
                            onMouseOut={()=>{  
                                      setShowPlayIcon(false)
                                      setId3('')                                                 
                                  }}
                                  >
                                  <div className="search-result-count" >
                                    <span className={result.id} >
                                          {showplayicon && id3 ==  data.indexOf(result) ? <i  className={"fa fa-play"}
                                                onClick={()=>{
                                                    //   if (data.length>0){
                                                    //         let playlist = data                            
                                                    //         localStorage.setItem('playlist', JSON.stringify(playlist))
                                                    //   }  
                                                      setIdSongPlaying(result.id)
                                                      setClickOnPlayIcon(true)
                                                      setClickOnPlayIconID(result.id)
                                                      setShowRightBar(true)   
                                                        setCurrentSong(result)
                                                        // console.log(currentSong, 'currentSong')
                                                      CreatePlayTrack(result, data,websiteplaylistname)  
                                                      setIsCurrentSong(true)
                                                      setCurrentPlaylist(data)
                                                    //   navigate(`/song/`)
                                                      localStorage.setItem('leftoversong', JSON.stringify(result))
                                                      localStorage.setItem('leftoverplaylist', JSON.stringify(data))
                             
                                                }                                   
                                                } 
                                    ></i> : data.indexOf(result)+1 } 

                                    </span>
                                  </div>
                                  <div className="search-result-cover"><img src={result.album.cover_small} width={46}/></div>
                                  <div className="search-result-title-artist"><div className="search-result-title" >{result.title}</div><div className="search-result-artist" 
                                  onClick={()=>{
                                    setArtistName(result.artist.name);
                                        setClickOnHome(false)
                                        setClickOnSearch(false)
                                        setClickOnUserPlaylist(false)
                                        setClickOnWebsitePlaylist(false)
                                        setClickOnQueue(false)
                                        setClickOnArtist(true)
                                        if (window.location.pathname.replace('/artist/', '').replace(/%20/g, ' ') !== result.artist.name){
                                        navigate(`/artist/${result.artist.name}`)}
                                        }} ><a className="search-result-artist" onClick={()=>{
                                            setArtistName(result.artist.name);
                                            setClickOnHome(false)
                                            setClickOnSearch(false)
                                            setClickOnUserPlaylist(false)
                                            setClickOnWebsitePlaylist(false)
                                            setClickOnQueue(false)
                                            setClickOnArtist(true)
                                            if (window.location.pathname.replace('/artist/', '').replace(/%20/g, ' ') !== result.artist.name){
                                            navigate(`/artist/${result.artist.name}`)}
                                        }}>{result.artist.name}</a></div>
                                  </div>
                                  <div className="search-result-album">{result.album.title}</div>
                                  <div className="search-result-heart" ><span className={result.id}>{showplayicon && id3 == data.indexOf(result) ? <i className="fa fa-heart-o" 
                                  onClick={
                                    ()=>{
                                          console.log(result)
                                          if (userID){
                                          LikeASong(userID, result)
                                          console.log('like a song')
                                          }
                                          // addToMyPlayList(result)
                                    }
                                  }></i> : ''}</span></div>
                                    <div className="search-result-duration">{convertToMin(result.duration)}</div>
                                    <div className="search-result-ellipses" >{showplayicon && id3 == data.indexOf(result) ? popup_menu(result.artist.name,result) : ''}</div>
                                  
                      </div>                            
                        ))}                    
                  </div>
            </div>
      </div>
      </>
        )
    }


// USERPROP------------------------------------------------------------
const userprops = () => {
    console.log('userplaylist')
    return (
        <div id="userprops">
                {loggedIn ?
                <>  
                    {loadingforuserprops ? <center><i className="fa fa-spinner fa-spin fa-5x"></i></center> : ''}
                    {!loadingforuserprops && userPlaylist.length > 0 ?
                    <div id="myplaylists">
                        <div id="library-header">
                            <div>
                                <h4>Hello {name}</h4>
                            </div>
                            <div>
                                <div >
                                    <i className="fa fa-music" style={style}></i>
                                    <h4>Your Library</h4>
                                </div>
                                {popup_PlusButton()}
                            </div>
                        </div>
                        <div id="library-body">
                            {userPlaylist.map((playlist: PlayList) => (
                                <div className="library-list" key={playlist.title} onClick={()=>{
                                    const songs = playlist.songs
                                    setUserPlaylistPageDescription(playlist.description)
                                    setUserPlaylistID(playlist.playlistID)
                                    setUserPlaylistPageTitle(playlist.title)
                                    setDataUserPlaylist(songs)
                                    setClickOnHome(false)
                                    setClickOnWebsitePlaylist(false)
                                    setClickOnSearch(false)
                                    setClickOnArtist(false)
                                    setClickOnQueue(false)
                                    setClickOnUserPlaylist(true)
                                    SetPlaylistTittle(playlist.title)
                                    const title = playlist.title
                                    const username = name.replace(/['"]+/g, '')
                                    const usernamefiltered = username.includes(' ') ? username.split(' ').join('%20') : username
                                    const titlefiltered = title.includes(' ') ? title.split(' ').join('%20') : title
                                    // navigate(`/user/${usernamefiltered}/${titlefiltered}`)
                                    if (window.location.pathname.replace('/user/', '').replace(/%20/g, ' ') !== `${username}/${title}`){
                                    navigate(`/user/${usernamefiltered}/${titlefiltered}`)}
                                    }}>
                                    <img src="https://e-cdns-images.dzcdn.net/images/cover/1ea1a631aa5235bbd0063643beb96fa8/120x120-000000-80-0-0.jpg" alt="" width={52} />
                                    <div>
                                        <a>{playlist.title}</a>
                                        <p>{numbertoDate(playlist.dateCreated)}</p>
                                        <p>{playlist.songs !==undefined? playlist.songs.length > 1 ? `${playlist.songs.length} songs` : `${playlist.songs.length} song`: null}</p>
                                    </div>   
                                </div>
                                
                            ))}          
                        </div>
                    </div>
                    : ''}
                    {/* <i className="fa fa-sign-out" style={style} onClick={handleLogout}>Sign Out</i> */}
                </>
                : <h4>Please <a href="/signin">Sign in</a></h4>}
            </div>
    )
                            }




// useEffect(() => {
//     setClickOnArtist(false)
//     setClickOnHome(true)
// }, [])
// BOTTOMBAR
function CreatePlayTrack(result:any, playlist:any, playlistname?:string) {
    console.log(result, 'resultjnbkjbk')
    let data= []
    try {
        for (let i=0; i<playlist.length; i++) {
            data.push(playlist[i])
        }
    } catch (error) {
        console.log(error)
    }
    localStorage.setItem('leftoverplaylisttitle', playlistname!)
    localStorage.setItem('leftoversong', JSON.stringify(result))
    localStorage.setItem('leftoverplaylist', JSON.stringify(data))

    let onLastTrack = false
    let onFristTrack = false
    const playcircle = 'fa fa-play-circle fa-3x'
    const pausecircle = 'fa fa-pause-circle fa-3x'
    const stopcircle = 'fa fa-stop-circle fa-3x'

    const currentsongindex = playlist.findIndex((song:any)=> song.id===result.id)
    if (currentsongindex === playlist.length-1) {
        onLastTrack = true
    }
    if (currentsongindex === 0) {
        onFristTrack = true
    }

    const nextsongindex = currentsongindex + 1
    const previoussongindex = currentsongindex - 1
    const nextsong = playlist[nextsongindex]
    const previoussong = playlist[previoussongindex]
    
    
    if (nextsongindex === playlist.length) {
        onLastTrack = true
    }
    
    
    
    const toBeRemoved = document.querySelector('.bottombar-playing')
    toBeRemoved?.remove()
    
    localStorage.setItem('currentsong', result.preview)
    localStorage.setItem('currentcover', result.album.cover_medium)
    console.log(localStorage.getItem('currentcover'), 'currentcoverwhenclick')
    
    const div = document.createElement('div')
        div.className = 'bottombar-playing'
        const track_details = document.createElement('div') 
        track_details.className = 'track-details'
        const track_title = document.createElement('div') as HTMLDivElement
        track_title.id = 'track-title'
        track_title.innerHTML =result.title
        // track_title.classList.add('animated')
        if (track_title.innerText.length > 20) {
            track_title.classList.add('animated')
            console.log('added')
        }
        const track_artist = document.createElement('div')
        track_artist.className = 'track-artist'
        track_artist.innerHTML = result.artist.name
        const track_title_artist = document.createElement('div')
        track_title_artist.className = 'track-title-artist'
        track_title_artist.appendChild(track_title)
        track_title_artist.appendChild(track_artist)
        const img = document.createElement('img')
        img.src = result.album.cover_medium
        track_details.appendChild(img)
        track_details.appendChild(track_title_artist)

        div.appendChild(track_details)
        const audio = document.createElement('audio')
        audio.src = result.preview
        audio.id = localStorage.getItem(result.id)!
        audio.autoplay = true
      
        
        let seekTrackValue
        // let tracklength = audio.duration
        let tracklength = 30  
        let countUp = 0
        let countDown = tracklength
        let countUpDiv = document.createElement('div')
        let countDownDiv = document.createElement('div')
       
        countUpDiv.className = 'count-up'
        countDownDiv.className = 'count-down'




        
        const track_controls_seekbar = document.createElement('div')
        track_controls_seekbar.className = 'track-controls-seekbar' 
        track_controls_seekbar.id = 'track-controls-seekbar'
        track_controls_seekbar.innerHTML = `<input type="range" min="0" max=${tracklength} value=${seekTrackValue} class="seekbar" id="seekbar">`
        const track_controls = document.createElement('div')
        track_controls.className = 'center track-controls'
        const track_controls_buttons = document.createElement('div')
        track_controls_buttons.className = 'track-controls-buttons'
        audio.addEventListener('timeupdate', ()=> {
            seekTrackValue = audio.currentTime
            countUp = Math.floor(seekTrackValue)
            const seekbar = document.getElementById('seekbar') as HTMLInputElement
            seekbar.value = `${seekTrackValue}`
            countUpDiv.innerHTML = convertToMin(countUp)
            countDownDiv.innerHTML = convertToMin(countDown)
            
        })

        track_controls_seekbar.addEventListener('click', ()=> {
            const seekbar = document.getElementById('seekbar') as HTMLInputElement
            audio.currentTime = Number(seekbar.value)
        })


        const previousicon = document.createElement('i')
        previousicon.className = 'fa fa-step-backward fa-lg'
        previousicon.id = 'previousicon'
        const nexticon = document.createElement('i')
        nexticon.className = 'fa fa-step-forward fa-lg'
        nexticon.id = 'nexticon'
        const playicon = document.createElement('i')
        playicon.className = 'fa fa-pause-circle fa-3x'
        playicon.id = 'playicon'
        let shuffleicon = document.createElement('i')
        shuffleicon.className = 'fa fa-random fa-lg'
        shuffleicon.id = 'shuffleicon'
        localStorage.getItem('shufflemode')==='true' ? shuffleicon.style.opacity = '1' : shuffleicon.style.opacity = '0.5'
        const repeaticon = document.createElement('i')
        repeaticon.className = 'fa fa-repeat fa-lg'
        localStorage.getItem('repeateMode')==='true' ? repeaticon.style.opacity = '1' : repeaticon.style.opacity = '0.5'
        repeaticon.id = 'repeaticon'

        
        
        track_controls_buttons.appendChild(audio)
        track_controls_buttons.appendChild(shuffleicon)
        track_controls_buttons.appendChild(previousicon)
        track_controls_buttons.appendChild(playicon)
        track_controls_buttons.appendChild(nexticon)
        track_controls_buttons.appendChild(repeaticon)
        const track_controls_seekbar_count = document.createElement('div')
        track_controls_seekbar_count.className = 'track-controls-seekbar-count'
        track_controls_seekbar_count.appendChild(countUpDiv)
        track_controls_seekbar_count.appendChild(track_controls_seekbar)
        track_controls_seekbar_count.appendChild(countDownDiv)
        track_controls.appendChild(track_controls_buttons)
        track_controls.appendChild(track_controls_seekbar_count)
        div.appendChild(track_controls)


        shuffleicon.addEventListener('click', ()=> {
            if (localStorage.getItem('shufflemode')==='false') {
                shuffleicon.style.opacity = '1'
                repeaticon.style.opacity = '0.3'
              
                localStorage.setItem('shufflemode', 'true')
                localStorage.setItem('repeateMode', 'false')
            } else {
                shuffleicon.style.opacity = '0.3'
                localStorage.setItem('shufflemode', 'false')
            }
        })

      
        repeaticon.addEventListener('click', ()=> {
            if (localStorage.getItem('repeateMode')==='false') {
                repeaticon.style.opacity = '1'
   
                shuffleicon.style.opacity = '0.3'
                localStorage.setItem('repeateMode', 'true')
                localStorage.setItem('shufflemode', 'false')
            } else {
                repeaticon.style.opacity = '0.3'
                localStorage.setItem('repeateMode', 'false')
            }
        })




        playicon.addEventListener('click', ()=> {
            if (playicon.className===playcircle) {
                audio.play()
                playicon.className = pausecircle
            }
            else {
                audio.pause()
                playicon.className = playcircle
                
            }

        })

        if (onFristTrack) {
            previousicon.style.opacity = '0.3'
            previousicon.style.cursor = 'not-allowed'
        } else {
            previousicon.style.opacity = '1'
        }
        previousicon.addEventListener('click', ()=> {
            if (previoussong) {
                CreatePlayTrack(previoussong, playlist)
                setCurrentSong(previoussong)
            }
        })
        if (onLastTrack) {
            nexticon.style.opacity = '0.3'
            nexticon.style.cursor = 'not-allowed'
        } else {
            nexticon.style.opacity = '1'
        }

        nexticon.addEventListener('click', ()=> {
            if (nextsong) {
                CreatePlayTrack(nextsong, playlist)
                setCurrentSong(nextsong)
            }
        })
        
        
        const bottombar = document.querySelector('.bottombar')
        bottombar?.appendChild(div)
        // get all icons except icon has id =='navigation-icon'
        const icons: HTMLElement[] = []
        document.querySelectorAll('i').forEach((icon)=> {
            if (icon.id !== 'navigation-icon') {
                console.log(icon, 'icon')
                icons.push(icon)
            }
        })


        audio.onended = () => {
  
            if (localStorage.getItem('repeateMode')==='true') {
                audio.play()
                playicon.className = pausecircle
                
                return
            }
            if (localStorage.getItem('shufflemode')==='true') {
                const randomIndex = Math.floor(Math.random() * playlist.length)
                const randomsong = playlist[randomIndex]
                CreatePlayTrack(randomsong, playlist)
                return
            }
            if (onLastTrack) {
                audio.pause()
                playicon.className = playcircle
                return
            }
            else {
                playicon.className = playcircle
              
                CreatePlayTrack(nextsong, playlist)
                setCurrentSong(nextsong)
            }

        }
    }


    // GO TO HOME BY DEFAULT
    useEffect(() => {
        setClickOnHome(true)
        setClickOnUserPlaylist(false)
        setClickOnWebsitePlaylist(false)
        setClickOnSearch(false)
        setClickOnArtist(false)
        setClickOnQueue(false)
    }, [])

function HistoryBack() {
        navigate(-1)
        console.log('back')
}  
function HistoryForward() {
        navigate(1)
        console.log('forward')
}
console.log(userPlaylist, 'userPlaylistsdfsdfdsfdsfsdf')
useEffect(() => {
    const path = window.location.pathname
    const pathArray = path.split('/')
    const pathArrayFiltered = pathArray.filter((result) => result !== '')

    if (pathArrayFiltered[0] === 'home') {
        setClickOnHome(true)
        setClickOnUserPlaylist(false)
        setClickOnWebsitePlaylist(false)
        setClickOnSearch(false)
        setClickOnArtist(false)
        setClickOnQueue(false)
    }
    if (pathArrayFiltered[0] === 'user') {
        const userplaylistTittle = pathArrayFiltered[2].split('%20').join(' ')
        setDataUserPlaylist(userPlaylist.filter((result: PlayList) => result.title === userplaylistTittle)[0].songs)
        setUserPlaylistPageDescription(userPlaylist.filter((result: PlayList) => result.title === userplaylistTittle)[0].description)
        setUserPlaylistPageTitle(userplaylistTittle)
        setClickOnHome(false)
        setClickOnUserPlaylist(true)
        setClickOnWebsitePlaylist(false)
        setClickOnSearch(false)
        setClickOnArtist(false)
        setClickOnQueue(false)
    }
    if (pathArrayFiltered[0] === 'playlist') {
        setClickOnHome(false)
        setClickOnUserPlaylist(false)
        setClickOnWebsitePlaylist(true)
        setClickOnSearch(false)
        setClickOnArtist(false)
        setClickOnQueue(false)
        setWebsitePlaylistName(pathArrayFiltered[1])           
    }
    if (pathArrayFiltered[0] === 'search') {
        setClickOnHome(false)
        setClickOnUserPlaylist(false)
        setClickOnWebsitePlaylist(false)
        setClickOnSearch(true)
        setClickOnArtist(false)
        setClickOnQueue(false)
    }
    if (pathArrayFiltered[0] === 'artist') {
        setClickOnHome(false)
        setClickOnUserPlaylist(false)
        setClickOnWebsitePlaylist(false)
        setClickOnSearch(false)
        setArtistName(pathArrayFiltered[1].split('%20').join(' '))
        setClickOnArtist(true)
        setClickOnQueue(false)
    }
    if (pathArrayFiltered[0] === 'queue') {
        setClickOnHome(false)
        setClickOnUserPlaylist(false)
        setClickOnWebsitePlaylist(false)
        setClickOnSearch(false)
        setClickOnArtist(false)
        setClickOnQueue(true)
    }
    if (pathArrayFiltered[0] === 'song') {
        setClickOnHome(false)
        setClickOnUserPlaylist(false)
        setClickOnWebsitePlaylist(false)
        setClickOnSearch(false)
        setClickOnArtist(false)
        setClickOnQueue(false)
    }
}, [window.location.pathname])




// RETURN-------------------------------------------------------------
    return (
            <>
        <div id="upper-part">
            <div id="left-bar">
                <div id="navigation">
                    <h4  onClick={() => {setClickOnUserPlaylist(false);setClickOnWebsitePlaylist(false);setClickOnSearch(false);setClickOnArtist(false);setClickOnQueue(false) ;setClickOnHome(true);
                    if (window.location.pathname !== '/home') {
                        navigate('/home')
                    }}}><i id='navigation-icon' className="fa fa-home" style={style} onClick={() => {setClickOnUserPlaylist(false);setClickOnWebsitePlaylist(false);setClickOnSearch(false);setClickOnArtist(false);setClickOnHome(true);
                        if (window.location.pathname !== '/home') {
                            navigate('/home')
                        }
                        }}></i>Home</h4>
                    <h4  onClick={() => {setClickOnHome(false);setClickOnUserPlaylist(false);setClickOnWebsitePlaylist(false);setClickOnArtist(false);setClickOnQueue(false);setClickOnSearch(true);
                       if (window.location.pathname !== '/search'){
                        navigate('/search')
                       }}}><i id='navigation-icon' className="fa fa-search" style={style} onClick={() => {setClickOnHome(false);setClickOnUserPlaylist(false);setClickOnWebsitePlaylist(false);setClickOnArtist(false);setClickOnSearch(true);
                        if (window.location.pathname !== '/search'){
                            navigate('/search')
                        }}}></i>Search</h4>
                </div>
                <div id="userprops">
                    {userprops()}
                </div>
            </div>


            <div id="main">
                <div id="navbar">
                    <div id="arrows">
                        <i className="fa fa-arrow-circle-left" style={{ fontSize: '40px', float: 'left', cursor: 'pointer', color: 'white' }} onClick={() => {HistoryBack()}}></i>
                        <i className="fa fa-arrow-circle-right" style={{ fontSize: '40px', float: 'left', cursor: 'pointer', color: 'white' }} onClick={() => {HistoryForward()}}></i>
                        {clickonsearch && (
                            <div id="search-box-wraper">
                                <i className="fa fa-search"></i>
                                <input id="search-box"  placeholder=" What do you want to listen to?" type="text" value={search} onChange={(e) => {setSearch(e.target.value); setClickOnSearch(true);setClickOnHome(false);setClickOnUserPlaylist(false);setClickOnWebsitePlaylist(false);setClickOnArtist(false);setClickOnQueue(false)} } />
                            </div>
                        )}
                    </div>
                    <div>
                        {loggedIn ? popup_AccountFace() : <div><a href="/signin">Sign in</a> <a href="signup">Sign up</a></div>}
                    </div>
                </div>

                <div id="section">
                    {clickonHome && HOMEPAGE()}
                    {clickonuserplaylist && USERPLAYLIST()}
                    {clickonwebsiteplaylist && WEBSITEPLAYLIST()}
                    {clickonsearch && SEARCHBAR()}
                    {clickonartist && ARTIST()}
                    {clickonQueue && QUEUE()}
                </div>
            </div>


            <div id="right-side-bar">
                {showrightbar && RIGHTBAR()}
            </div>
        </div>
        
        <div id="bottombar">
                <BottomBar />
                <i id="right-bar-control-button" className={showrightbar ? 'fa fa-angle-double-down' : 'fa fa-angle-double-up'} style={{ fontSize: '24px', float: 'right', cursor: 'pointer', color: 'white' }} onClick={() => {
                        const rightsidebar= document.getElementById('right-side-bar')
                        if (rightsidebar?.className === 'right-side-bar-show') {
                            rightsidebar?.classList.remove('right-side-bar-show')
                            rightsidebar?.classList.add('right-side-bar-hide')
                            setShowRightBar(false);
                        } else {
                            rightsidebar?.classList.remove('right-side-bar-hide')
                            rightsidebar?.classList.add('right-side-bar-show')
                            setShowRightBar(true);
                        }
                    
                    } }></i>                
        </div>
        </>
    );
}

export default Body;


