
import {useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CreatPlayTrack, { convertToMin } from "./CreatePlayingTrack"
import Body from "./Body"
import axios from "axios"
import {LikeASong } from "./SideBar"


export default function CreatePlayList() {
      
      const {playlistname} = useParams()
      const {ownerID} = useParams()
      const [results, setResults] = useState([])
      const [isplaying, setIsPlaying] = useState(false)
      const [data, setData] = useState([])
      const [loading, setLoading] = useState(true)
      const [showrightbar, setShowRightBar] = useState(false)
      const navigate = useNavigate()
      const [idsongplaying, setIdSongPlaying] = useState('')
      const userID = localStorage.getItem('userID')


    useEffect(() => {
            localStorage.setItem('playlist', JSON.stringify(data))
            console.log(localStorage.getItem('playlist'))
    }, [loading])

    useEffect(() => {
      let url = ''
      if (ownerID){
            url = `http://localhost:4000/api/playlist/${ownerID}/${playlistname}`
            axios({
                  method: 'GET',
                  url: url,
                  })
                  .then((response) => {
                        console.log(response)
                        setData(response.data.playlists[0].songs)
                        console.log(data,'songs')
                        setLoading(false)
                  })
                  .catch((error) => {
                        console.log(error)
                  })
      }else if (playlistname === 'BillBoardTop100'){
            url = 'http://localhost:3000/BillBoardTop100'
      }
      else{
            url = `http://localhost:4000/api/playlist/${playlistname}`
      }      
        if (playlistname)
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

    }, [loading])

    
    useEffect(() => {
          const horizontalStack = document.getElementById('horizontal-stack')
          if (showrightbar === true){
                horizontalStack?.classList.remove('horizontal-stack-home')
            } else {
            horizontalStack?.classList.add('horizontal-stack-home')
      }
    }, [showrightbar])

    const [showplayicon, setShowPlayIcon] = useState(false)
    const [id, setId] = useState('')
    const [clickonplayicon, setClickOnPlayIcon] = useState(false)
    const [clickonplayiconID, setClickOnPlayIconID] = useState('')


    return (
      <Body navigation={true} sidebar={true} bottombar={true} rightsidebar={showrightbar === true ? true : false} >
      <div className="decoration">
            <div className="decoration-wrapper">
                <img src="https://e-cdns-images.dzcdn.net/images/cover/1ea1a631aa5235bbd0063643beb96fa8/120x120-000000-80-0-0.jpg" alt="" />
                  <h1>{playlistname}</h1>
            </div>
        </div>
      <div className="section"> 
            <div id="search-wrapper">    
                  <div className="search-result-table" id="search-result-tabel">
                        {data.map((result: any) => (                           
                            <div className="search-result" key={result.id} 
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
                                  <div className="search-result-heart" ><span className={result.id}>{showplayicon && id == data.indexOf(result) ? <i className="fa fa-heart-o" 
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
                      </div>                            
                        ))}                    
                  </div>
            </div>
      </div>
    </Body>
        )      
}


