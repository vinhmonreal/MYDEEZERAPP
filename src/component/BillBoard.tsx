

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CreatPlayTrack, { convertToMin } from "../component/CreatePlayingTrack"
import Body from "../component/Body"
import axios from "axios"
import '../style.css'



export default function BillBoardTop100() {

      const [results, setResults] = useState([])
      const [top100, setTop100] = useState([])
      const [isplaying, setIsPlaying] = useState(false)  
      const [gettop100, setGetTop100] = useState(false) 
      const navigate = useNavigate()
      const [loading, setLoading] = useState(true)
      let spanIconCountValue: string
      let count = 1
//     set playlist to local storage with AllOut2000sArr
    //   useEffect(() => {
    //         localStorage.setItem('playlist', JSON.stringify(AllOut2000sArr))
    //         console.log(localStorage.getItem('playlist'))
    //   }, [])  

    function CallDeezer(value : any){
        axios({
            method: 'GET',
            url: `http://localhost:3000/track/${value}`,
        })
            .then((response) => {
                console.log(response)
                results.push(response.data.data[0])
            })
            .catch((error) => {
                console.log(error)
            })

    }
      useEffect(() => {

        function CallTop100 () {
            axios({
                method: 'GET',
                url: 'http://localhost:3000/BillBoardTop100',
            })
                .then((response) => {
                    setTop100(response.data)
                    gettop100 ? setGetTop100(false) : setGetTop100(true)
                        
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    if (top100){
                        for (let i = 0; i < top100.length; i++) {
                            let value = top100[i].title 
                            console.log(value)
                            CallDeezer(value)
                        }
                    }
                    setLoading(false)
                })
        }

        CallTop100()
        }, [])





      return (
            <Body navigation={true} sidebar={true} bottombar={true} rightsidebar={true}>
                  <div className="section"> 
                        <div id="search-wrapper">    
                              <div className="search-result-table" id="search-result-tabel">
                                    {!loading && results.map((result: any) => (                           
                                    <div className="search-result" key={result.id} 
                                          onMouseOver={()=>{
                                                      spanIconCountValue = document.getElementsByClassName(result.id)[0].innerHTML
                                                      const iconcount = document.getElementsByClassName(result.id)[0]
                                                      const iconheart = document.getElementsByClassName(result.id)[1]
                                                      iconcount.innerHTML = '<i class="fa fa-play"></i>'
                                                      iconheart.innerHTML = '<i class="fa fa-heart"></i>'                               
                                                }} 
                                          onMouseOut={()=>{                              
                                                      document.getElementsByClassName(result.id)[0].innerHTML = spanIconCountValue
                                                      document.getElementsByClassName(result.id)[1].innerHTML = ''                          
                                                }}>
                                                <div className="search-result-count" ><span className={result.id} 
                                                      onClick={()=>{
                                                            if (results.length>0){
                                                                  let playlist = results                              
                                                                  localStorage.setItem('playlist', JSON.stringify(playlist))
                                                            }     
                                                            CreatPlayTrack(result, setIsPlaying)                               
                                                      }                                   
                                                      }                
                                                      >{count++}</span> 
                                                </div>
                                                <div className="search-result-cover"><img src={result.album.cover_small} width={46}/></div>
                                                <div className="search-result-title-artist"><div className="search-result-title" >{result.title}</div><div className="search-result-artist" 
                                                onClick={()=>{
                                                      navigate(`/artist/${result.artist.name}`)
                                                      }} ><a className="search-result-artist">{result.artist.name}</a></div>
                                                </div>
                                                <div className="search-result-album">{result.album.title}</div>
                                                <div className="search-result-heart" ><span className={result.id}></span></div>
                                                <div className="search-result-duration">{convertToMin(result.duration)}</div>
                                                
                                    </div>                 
                                    ))}                    
                              </div>
                        </div>
                  </div>
                  </Body>
            )      
}



