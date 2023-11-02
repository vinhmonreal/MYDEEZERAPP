
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CreatPlayTrack, { convertToMin } from "./CreatePlayingTrack"
import Body from "./Body"
import axios from "axios"
import { DislikeASong } from "./SideBar"
import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { TextField } from "@mui/material"



export default function CreateUserPlayList() {

    const {playlisttitle} = useParams()
    const {ownerID} = useParams()
    const {playlistID} = useParams()
    const userID = localStorage.getItem('userID')?.replace(/['"]+/g, '')
    const [results, setResults] = useState([])
    const [isplaying, setIsPlaying] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [showrightbar, setShowRightBar] = useState(false)
    const navigate = useNavigate()
    const [idsongplaying, setIdSongPlaying] = useState('')
    const [description, setDescription] = useState('')



    useEffect(() => {
        function call(){
      const url = `http://localhost:4000/api/playlist/${ownerID}/${playlistID}/${playlisttitle}`
      console.log(url, 'urllll')
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
                    setLoading(false)
        
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
    const [id, setId] = useState<number | string | null>(null);
    const [clickonplayicon, setClickOnPlayIcon] = useState(false)
    const [clickonplayiconID, setClickOnPlayIconID] = useState('')

   


    // popup
    const [anchorElPopUp, setAnchorElPopUp] = React.useState<HTMLButtonElement | null>(null);
    const [ClickOnDeletePopover, SetClickOnDeletePopover] = React.useState(false);
    const [ClickOnEditDetailsPopover, SetClickOnEditDetailsPopover] = React.useState(false);
    const handleOpenPopUp = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElPopUp(event.currentTarget);
    };
  
    const handleClosePopUp = () => {
      setAnchorElPopUp(null);
    };

  
    const open = Boolean(anchorElPopUp);
    const _id = open ? 'simple-popover' : undefined;
    const popupforuserplaylist = () => {
        return (
            <div>
              <Button aria-describedby={_id} variant="contained" onClick={handleOpenPopUp} style={{backgroundColor: 'transparent', border: 'none'}}>
                <i className="fa fa-ellipsis-h" style={{fontSize: '24px'}}></i>
              </Button>
              <Popover
                id={_id}
                open={open}
                anchorEl={anchorElPopUp}
                onClose={handleClosePopUp}
                anchorOrigin={{
                  vertical: 'bottom',
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

        // delete form
        
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
                                <Button className="confirm-button" onClick={()=>{setConfirmDelete(true)}}>Yes</Button>
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
        console.log(clickontrashicon, 'clickontrashicon')
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
                                <Button className="confirm-button" onClick={()=>{setConfirmTrashDelete(true); setClickOnTrashIcon(false)}}>Yes</Button>
                            </div>
                        </Box>
                  </Modal>
                </div>
                );
        }
    }

    useEffect(() => {
        if (confirmTrashDelete===true){
            console.log(userID, idtrash, 'userID, idtrash')
            if(userID){
                DislikeASong(userID, idtrash)
            }
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
                navigate(`/home`)
            })
            .catch((error) => {
                console.log(error)
            })}
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
                                <TextField id="outlined-basic-description" label="Description" variant="outlined" inputRef={descriptionfield} placeholder='description' multiline={true} size="small"/>
                            </span>
                            <span>
                                <Button className="confirm-button" onClick={()=>{SetClickOnEditDetailsPopover(false)}}>Cancel</Button>
                                <Button className="confirm-button" onClick={()=>{setEditDetails(true);submitform()}}>Save</Button>
                            </span>
                        </Box>
                    </Modal>
                </div>
                );
        }
    }



     const submitform = () => {
        console.log(playlisttitlefield.current?.value, 'playlisttitlefield')
        console.log(descriptionfield.current?.value), 'descriptionfield'
        console.log(newImage, newImage.valueOf(), 'newImage')
        
             const url = `http://localhost:4000/api/editplaylist`
             const data = {
                    userID: userID?.replace(/['"]+/g, ''),
                    playlistID: playlistID,
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
                 navigate(`/home`)
             })
             .catch((error) => {
                 console.log(error)
             })
         }

    
      if(ownerID !== userID){
        return(
                <Body navigation={true} sidebar={true} bottombar={true} rightsidebar={false} >
                        <div className="section"> 
                            <div id="search-wrapper">    
                                    <div className="search-result-table" id="search-result-tabel">
                                        <h1>You are not the owner of this playlist</h1>
                                    </div>
                            </div>
                        </div>
                </Body>
            )
    }

    // if (!loading && data.length === 0){
    //     return(
    //             <Body navigation={true} sidebar={true} bottombar={true} rightsidebar={false} >
    //                     <div className="section"> 
    //                         <div id="search-wrapper">    
    //                                 <div className="search-result-table" id="search-result-tabel">
    //                                     <h1>This playlist is empty</h1>
    //                                 </div>
    //                                     {popup()}
    //                         </div>
    //                     </div>
    //             </Body>
    //         )
    // }


    return (
      <Body navigation={true} sidebar={true} bottombar={true} rightsidebar={showrightbar === true ? true : false} >
        {ClickOnDeletePopover===true && <DeleteForm />}
        {ClickOnEditDetailsPopover===true && <EditDetailsForm />}
        <div className="decoration">
            <div className="decoration-wrapper">
                <img src="https://e-cdns-images.dzcdn.net/images/cover/1ea1a631aa5235bbd0063643beb96fa8/120x120-000000-80-0-0.jpg" alt="" />
                <div>
                    <h1>{playlisttitle}</h1>
                    <h4>{description}</h4>
                    <p>{data.length===0 ? '': data.length === 1 ? `${data.length} song` : `${data.length} songs`}</p>
                </div>
            </div>
            {popupforuserplaylist()}
        </div>

      <div className="section"> 
            <div id="search-wrapper">    
                  <div className="search-result-table" id="search-result-tabel">
                        {data.map((result: any) => (                           
                            <div className="search-result" key={data.indexOf(result)} 
                            onMouseOver={()=>{
                                      setShowPlayIcon(true)
                                      setId(data.indexOf(result))
                                  }} 
                            onMouseOut={()=>{  
                                      setShowPlayIcon(false)
                                      setId('')                                                 
                                  }}
                                  >
                                  <div className="search-result-count" >
                                    <span className={result.id} >
                                          {showplayicon && id ==  data.indexOf(result) ? <i  className={"fa fa-play"}
                                                onClick={()=>{
                                                      if (results.length>0){
                                                            let playlist = results                              
                                                            localStorage.setItem('playlist', JSON.stringify(playlist))
                                                      }  
                                                      setIdSongPlaying(result.id)
                                                      setClickOnPlayIcon(true)
                                                      setClickOnPlayIconID(result.id)
                                                      setShowRightBar(true)   
                                                      CreatPlayTrack(result, setIsPlaying,result.id,data.indexOf(result)+1)                               
                                                }                                   
                                                } 
                                    ></i> : data.indexOf(result)+1 } 

                                    </span>
                                  </div>
                                  <div className="search-result-cover"><img src={result.album.cover_small} width={46}/></div>
                                  <div className="search-result-title-artist"><div className="search-result-title" >{result.title}</div><div className="search-result-artist" 
                                  onClick={()=>{
                                        navigate(`/artist/${result.artist.name}`)
                                        }} ><a className="search-result-artist">{result.artist.name}</a></div>
                                  </div>
                                  <div className="search-result-album">{result.album.title}</div>
                                  <div className="search-result-heart" ><span className={result.id}>{showplayicon && id == data.indexOf(result) ? <i className="fa fa-trash" onClick={()=>{setClickOnTrashIcon(true); setIdTrash(result.songID)}}></i> : ''}</span></div>
                                  {clickontrashicon === true && <FormConfirmTrashDelete />}
                                  <div className="search-result-duration">{convertToMin(result.duration)}</div>
                                  <div className="search-result-heart" ><span className={result.id}>{showplayicon && id == data.indexOf(result) ? <i className="fa fa-ellipsis-h"
                                  onClick={
                                    ()=>{
                                          console.log(result)
                                    }
                                  }></i> : ''}</span></div>
                      </div>                            
                        ))}                    
                  </div>
            </div>
            
      </div>
    </Body>
        )      
}


