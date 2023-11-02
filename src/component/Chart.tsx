import axios from "axios"
import { useEffect, useState } from "react"
import { Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import CreatPlayTrack from "./CreatePlayingTrack"

interface Top100  {
    artist: string, 
    cover: string,
    title: string,
    rank: any,
    position: {
        peakPosition: any,
        positionLastWeek: any,
        weeksOnChart: any
    }
}

export default function Chart() {
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState([])
    const [error, setError] = useState('')
    const [searched, setSearched] = useState(false)
    const [isplaying, setIsPlaying] = useState(false)
    const [top100, setTop100] = useState([])
    const [show, setShow] = useState(false)
    const [top5, setTop5] = useState([])
    const navigate = useNavigate()
    const [song, setSong] = useState([])
    const [showPopup, setShowPopup] = useState(false)

    
    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:3000/BillBoardTopSong',

        })
            .then((response) => {
                
                console.log(response.data)
                if (song.length <1){
                song.push(response.data)}
                setLoading(false)

            })
            .catch((error) => {
                console.log(error)
                setError(error.message)
            })
            .finally(() => {

                if (results.length === 0) {
                    setError('No results found')
                    setSearched(true)
                } else {
                    setError('')
                    setSearched(true)
                }
            })
    }, [])

    const handleShowmore = () => {
        const btt = document.getElementById('showmore-btt')
        if (show) {
            if (btt){
                btt.innerHTML = 'Show More'
            }
            setResults(top5)
            setShow(false)
            return
        }
        if (btt){
            btt.innerHTML = 'Show Less'

        }
        setResults(top100)
        setShow(true)       

    }

    const handleClickonTitle = (title: string, artist: string) => {
        axios({
            method: 'GET',
            url: `http://localhost:3000/track/${title}`,
        })
            .then((response) => {
                console.log(response.data.data)
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].artist.name === artist) {
                        setIsPlaying(true)
                        CreatPlayTrack(response.data.data[i], setIsPlaying)
                        return
                    }
                }
                setIsPlaying(true)
                CreatPlayTrack(response.data.data[0], setIsPlaying)
            }
            )
            .catch((error) => {
                console.log(error)
                setError(error.message)
            })

       


    }






    return (
        <div className="chart">
            <div className="chart-title">
                <h1>Chart This Week</h1>
                <a className="showmore-btt" onClick={() => {
                    handleShowmore()
                }}>Show More</a>
            </div>
            <datalist className="chart-container">
                {song.map((result: Top100) => (
                    <div className="chart-card" key={result.rank}>
                        <div id={result.rank} className="top-track-cover"><img src={result.cover} alt='fa' id={result.cover}
                        onClick={()=>{
                            handleClickonTitle(result.title, result.artist)
                        
                        }}
                        onMouseOver={()=>{

                            const div = document.createElement('div')
                            document.body.appendChild(div)

                            div.style.visibility = 'hidden'
                        
                            
                            
                            let x = event.clientX
                            let y = event.clientY
                            setTimeout(() => {
                                // set position of div
                                console.log(x, y)
                                if (y + 220 > screen.height){
                                    y = y - 220}
                                if (x + 220 > screen.width){
                                    x = x - 220}
                                console.log(x, y)
                                div.style.top = `${y}px`
                                div.style.left = `${x}px`
                                div.innerHTML = `
                                <h4>${result.title}</h4>
                                <h5>${result.artist}</h5>
                                <h5>Rank: ${result.rank}</h5>
                                <h5>Peak Position: ${result.position.peakPosition}</h5>
                                <h5>Position Last Week: ${result.position.positionLastWeek}</h5>
                                <h5>Weeks On Chart: ${result.position.weeksOnChart}</h5>`
                                div.style.visibility = 'visible'
                                div.classList.add('chart-card-info-hover')

                            }, 1000);
                           

                        }}
                        onMouseOut={()=>{

                            const div = document.querySelectorAll('.chart-card-info-hover')
                            div.forEach((item)=>{
                                item.remove()
                            })
                        }}
                        ></img>
                        <div className="chart-card-info">
                            <h4>{result.title}</h4>
                            <h5>
                            <a className="artist-name" onClick={()=>{
                                navigate(`/artist/${result.artist}`)
                            }}>{result.artist}</a>
                            </h5>
                        </div>
                        </div>
                    </div>
                ))}
  
        </datalist>
        </div>
    )
}
