// https://rapidapi.com/deezerdevs/api/deezer-1

import { useEffect } from "react"
import { useState } from "react"
import axios from 'axios'
import Body from "./Body"
import { Container, Spinner } from "react-bootstrap"

export default  function Search () {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState([])
    const [error, setError] = useState('')

    const [nextURL, setNextURL] = useState('')
    const [prevURL, setPrevURL] = useState('')
    const [prev, setPrev] = useState(Boolean)
    const [next, setNext] = useState(Boolean)
    const [hitNext, setHitNext] = useState(Boolean)
    const [hitPrev, setHitPrev] = useState(Boolean)
    const [play, setPlay] = useState(Boolean)

    useEffect(() => {
        if (!loading) return

        axios({
            method: 'GET',
            url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
            params: {q: search},
            headers: {
              'X-RapidAPI-Key': 'ae4ed62fb5msh8644126332ad430p1751a7jsn7833fed069df',
              'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        })
        .then((response) => {
            console.log(response)
            setResults(response.data.data)
            setPrev(false)
            if (response.data.prev) {
                setPrevURL(response.data.prev)
                setPrev(true)
                console.log(prevURL, prev, "pre")
            }
            if (response.data.next) {
                setNextURL(response.data.next)
                setNext(true)
                console.log(nextURL, next, "next")
            }
           })
        .catch((error) => {
            console.log(error)
            setError(error.message)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [loading])

    useEffect( () => {
        if (!search) return
        setLoading(true)
    }, [search])

    useEffect(() => {
        if (!prevURL) return
        setLoading(true)
    }, [prevURL])

    useEffect(() => {
        if (!nextURL) return
        setLoading(true)
    }, [nextURL])

    useEffect(() => {
        if (!prevURL) return
        function prevSearch () {
            // if (!prev) return
            setLoading(true)
            fetch(prevURL)
            .then(res => res.json())
            .then(data => {
                setResults(data.data)
                if (data.prev) {
                    setPrevURL(data.prev)
                    setPrev(true)
                }
                if (data.next) {
                    setNextURL(data.next)
                    setNext(true)
                }
            })
            .finally(() => {
                setLoading(false)
                setHitPrev(false)
            }
            )
        }
        prevSearch()
    }, [hitPrev])

    

    const handlePlay = (e: any) => {
        if (play===true) {
            const audios = document.querySelectorAll('audio')
            console.log(audios)
            for (let i = 0; i < audios.length; i++) {
                audios[i].pause()
            }
        }
        const audio = e.target.nextSibling
        audio.play()
        setPlay(true)
    }


    return (
        <Body navigation={true} sidebar={true} bottombar={true} rightsidebar={true} >
                <input id="search" placeholder="Search" type="text" value={search} onChange={e => setSearch(e.target.value)} />
            <div id="search-container">      

                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <div className="cards-container">                
                    {results.map((result: any) => (
                        <div key={result.id} className="card">
                            <div className="title">
                                <h3>{result.title}</h3>
                            </div>
                            <img src={result.album.cover_medium} alt={result.title} onClick={handlePlay}/>
                            <audio src={result.preview} controls onPlay={(e:any)=>{
                                const audios = document.querySelectorAll('audio')
                                for (let i = 0; i < audios.length; i++) {
                                    if (audios[i]!==e.target) {
                                        audios[i].pause()
                                    }
                                }
                            }} onPause={()=>{console.log("pau")}}> </audio>
                        </div>

                    ))}
                </div>
            </div>


        </Body>
    )
}
