import axios from "axios";
import { useEffect, useState } from "react";
import { json, useParams } from "react-router-dom";
import CreatPlayTrack, { convertToMin } from "./CreatePlayingTrack";
import Body from "./Body";
import style from '../style.css'

export default function GetArtist() {     
    // add - between sapces
    const [artist, setArtist] = useState('')
    const [url, setURL] = useState('')
    const [image, setImage] = useState('')
    const [results, setResult] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isplaying , setIsPlaying] = useState(false)
    const { artistname } = useParams()
    const [track, setTrack] = useState<any[]>([])
    const [showrightbar, setShowRightBar] = useState(false)
    const [id, setId] = useState('')
    const [showicon, setShowIcon] = useState(false)
    let name = artistname

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




 
    useEffect(() => {        
    
        axios({
            method: 'GET',
            url: `http://localhost:3000/search/${name}`,
 
        })
            .then((response) => {
                console.log(response)
                if (response.data.data.length === 0) {
                    setError('Cannot find artist')
                    setLoading(false)
                    return
                }
                setArtist(response.data.data[0].name)
                setURL(response.data.data[0].tracklist)
                console.log(response.data.data[0].tracklist, 'url')
                setImage(response.data.data[0].picture_big)
                setResult(response.data.data[0])
                console.log(results)
                
            })
            .catch((error) => {
                console.log(error)
            })
            
    }, [])
    
    useEffect(() => {
        if (!url) return
        axios({
            method: 'GET',
            url: `http://localhost:3000/artist/${name}/top50`,
        
        })
            .then((response) => {
                console.log(response)
                response.data.data.forEach((element: any) => {
                    if (element){

                        track.push(element)
                    }
                })
                console.log(track, 'track')
                if (response.data.data.length === 0) {
                    setError('Cannot find artists songs')
                    console.log(error)
                    
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                if (track.length === 0) {
                    setError('Cannot find artists songs')
                    setLoading(false)
                    return
                }
                else{
                    localStorage.setItem('playlist', JSON.stringify(track))
                }
                setError('')
                setLoading(false)
            })
    }, [url])



    useEffect(() => {
          const horizontalStack = document.getElementById('horizontal-stack')
          if (showrightbar === true){
                horizontalStack?.classList.remove('horizontal-stack-home')
            } else {
            horizontalStack?.classList.add('horizontal-stack-home')
      }
    }, [showrightbar])



   return (
    <Body navigation={true} sidebar={true} bottombar={true} rightsidebar={showrightbar === true ? true : false} >
    <div>
            <div className="section">
                <div className="artist-wrapper">
                    <h1>{artist}</h1>
                    <img src={image} alt={artist} />
                </div>
       
            <div id="search-wrapper">
            <center>
                {loading &&  <><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i></> }
            </center>
            {!loading && error && <p>{error}</p>}
            {loading === false && error && <div>{error}</div>}
            {loading === false && !error && (
                
            <div className="search-result-table" id="search-result-tabel">
                        {track.map((result: trackofArtist) => (                           
                            <div className="search-result" key={result.id} 
                            onMouseOver={()=>{
                                setId(result.id)
                                setShowIcon(true)                             
 
                            }} onMouseOut={()=>{                              
                                setShowIcon(false)
                                setId('')                       
                            }}>


                            <div className="search-result-count" ><span className={result.id} onClick={()=>{
                                if (results.length>0){
                                    let playlist = track                             
                                    localStorage.setItem('playlist', JSON.stringify(playlist))
                                }     
                                setIsPlaying(true)
                                setShowRightBar(true)
                                CreatPlayTrack(result, setIsPlaying)                               
                                }                                   
                            }                
                            >{showicon && id ==  result.id ? <i className="fa fa-play"></i> : track.indexOf(result)+1}</span></div>
                            <div className="search-result-cover"><img src={result.album.cover_small} width={46}/></div>
                            <div className="search-result-title-artist"><div className="search-result-title" >{result.title}</div><div className="search-result-artist" onClick={()=>{
                                }} ><a className="search-result-artist">{result.artist.name}</a></div></div>
                            <div className="search-result-album">{result.album.title}</div>
                            <div className="search-result-heart" ><span className={result.id}>{showicon && id == result.id ? <i className="fa fa-heart"></i> : ''}</span></div>
                            <div className="search-result-duration">{convertToMin(result.duration)}</div>
                            
                            </div>                 
                        ))}                    
                    </div>   
                    )}               
                    </div>
                    </div>
                    </div>
                    </Body>
    )
}

