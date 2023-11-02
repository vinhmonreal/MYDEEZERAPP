// https://rapidapi.com/deezerdevs/api/deezer-1

import { useEffect } from "react"
import { useState } from "react"
import axios from 'axios'
import Body from "./Body"
import CreatPlayTrack from "./CreatePlayingTrack"
import { convertToMin } from "./CreatePlayingTrack"
import {useNavigate, useParams } from "react-router-dom"
import ArtistPlaying from "./ArtistPlaying"
import TrackPlaying from "./TrackPlaying"


export default  function Search () {
    // localStorage.setItem('playing', 'false')
    // const playing = localStorage.getItem('playing')
    // console.log(playing, 'palayin')

    

    const {link} = useParams()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState([])
    const [error, setError] = useState('')
    const [searched, setSearched] = useState(false)  
    const [isplaying , setIsPlaying] = useState(false)
    let { searchValue } = useParams()
    const [showrightbar, setShowRightBar] = useState(false)
    const [isAddedLoadingBar, setIsAddedLoadingBar] = useState(false)
    const [id, setId] = useState('')
    const [showicon, setShowIcon] = useState(false)
    
    let count = 1
    // check if there is a search value in the url at the first render
    
    window.onload = function() {
        if (searchValue) {
            setSearch(searchValue)
            setLoading(true)
        }
    }

    useEffect(() => {
        if (!loading){ 
            const loader = document.getElementsByClassName('fa-spinner')[0]
            loader?.remove()
            return
        }
        if (!isAddedLoadingBar) {
            const searchbox = document.getElementById('search-box-wraper')
            const loader = document.createElement('i')
            loader.classList.add('fa')
            loader.classList.add('fa-spinner')  
            loader.classList.add('fa-spin')
            loader.classList.add('fa-2x')
            loader.classList.add('fa-fw')
            searchbox?.appendChild(loader)
        } 


        axios({
            method: 'GET',
            url: `http://localhost:3000/track/${search}`,
        
           
        })

        .then((response) => {
            console.log(response)
            setResults(response.data.data)
            setLoading(false)
            setSearched(true)
         
           })
        .catch((error) => {
            console.log(error)
            setError(error.message)
            setLoading(false)
            setSearched(true)
        })
 
    }, [loading])

    useEffect( () => {
        if (!search) {
            setResults([])
            setSearched(false)
            return
        }
        searchValue = search
        // update url
        navigate(`/search/${searchValue}`)
        setLoading(true)
    }, [search])

    useEffect(() => {
        if(results.length==0 && searched){
            setError('No results found')
          
        } else {
            setError('')
     
        }
       
    }, [results, searched])

 
  
   
    let spanIconCountValue: string
    useEffect(() => {

    const input = document.getElementById('search-box-wraper')
    input?.classList.add('search-box-for-home-page')
    const navbar = document.getElementById('navbar')
    navbar?.appendChild(input as Node)
    }, [])

      useEffect(() => {
          const horizontalStack = document.getElementById('horizontal-stack')
          if (showrightbar === true){
                horizontalStack?.classList.remove('horizontal-stack-home')
            } else {
            horizontalStack?.classList.add('horizontal-stack-home')
      }
    }, [showrightbar])


    return (
        <Body navigation={true} sidebar={true} bottombar={true} rightsidebar={showrightbar === true ? true : false}>
            <div className="section">
                <div id="search-box-wraper">
                    {/* <label htmlFor=""><i className="fa fa-search"></i></label> */}
                    <input id="search-box"  placeholder=" What do you want to listen to?" type="text" value={search} onChange={e => setSearch(e.target.value)} ></input>

                </div>
                <div id="search-wrapper">    
                    {!loading && error && <p>{error}</p>}
                    {results.length>0  &&                   
                    <div className="search-result-table" id="search-result-tabel">
                        {results.map((result: any) => (                           
                            <div className="search-result" key={result.id} 
                            onMouseOver={()=>{
                                setShowIcon(true)
                                setId(result.id)                              
                            }} onMouseOut={()=>{                              
                                setShowIcon(false)
                                setId('')                        
                            }}>

                            <div className="search-result-count" ><span className={result.id} onClick={()=>{
                                if (results.length>0){
                                    let playlist = results                              
                                    localStorage.setItem('playlist', JSON.stringify(playlist))
                                }     
                                setIsPlaying(true)
                                setShowRightBar(true)
                                CreatPlayTrack(result, setIsPlaying)    
                                }                                   
                            }                
                            >{showicon && id ==  result.id ? <i className="fa fa-play"></i> : results.indexOf(result)+1}</span></div>
                            <div className="search-result-cover"><img src={result.album.cover_small} width={46}/></div>
                            <div className="search-result-title-artist"><div className="search-result-title" >{result.title}</div><div className="search-result-artist" onClick={()=>{
                                navigate(`/artist/${result.artist.name}`)
                                }} ><a className="search-result-artist">{result.artist.name}</a></div></div>
                            <div className="search-result-album">{result.album.title}</div>
                            <div className="search-result-heart" ><span className={result.id}>{showicon && id == result.id ? <i className="fa fa-heart"></i> : ''}</span></div>
                            <div className="search-result-duration">{convertToMin(result.duration)}</div>
                            
                            </div>                 
                        ))}                    
                    </div>
                    }
                </div>
            </div>
        </Body>
    )
}

