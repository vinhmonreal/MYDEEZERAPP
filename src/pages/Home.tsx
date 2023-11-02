import { useEffect, useState } from "react";
import Body from "../component/Body";
import Chart from "../component/Chart";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {ThrowBack, HipHop} from "../component/DATA"


 

export default function Home() { 
    
    
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState([])
    const [error, setError] = useState('')
    const [searched, setSearched] = useState(false)
    const navigate = useNavigate()
    const [ListCoverIsOnHover, setListCoverIsOnHover] = useState(false)
    const [coverID, setCoverID] = useState('')
    const [song, setSong] = useState([])

    // adjust size of main section
    // const horizontalStack = document.getElementById('horizontal-stack')
    // horizontalStack?.classList.add('horizontal-stack-home')



    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:3000/BillBoardTopSong',

        })
            .then((response) => {
                console.log(response.data)
                if (song.length <1){
                // modify the data to fit the CreateList function
                let data = {} as any
                data.id = 'billboard' + response.data.rank
                data.img = response.data.cover
                data.title = response.data.title
                data.description = response.data.artist
                data.link = 'BillBoardTop100'
                song.push(data) 
            }
            console.log(song)
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


    // inheritate the bottom bar  from pevious page
    const bottomBar = document.getElementById('bottom-bar')
    if (bottomBar) {
        bottomBar.style.display = 'flex'
    }




    return (
        <Body navigation={true} bottombar={true} sidebar={true} rightsidebar={false}>
            {/* <Chart /> */}
            <div className="playlists-wraper">
                <div >
                    <h2>BillBoard #1</h2>
                </div>
                {CreateList(song)}
            </div>
            <div className="playlists-wraper">
                <div >
                    <h2>Throw Back</h2>
                </div>
                {CreateList(ThrowBack)}
            </div>

            <div className="playlists-wraper">
                <div>
                    <h2>Hiphop</h2>
                </div>
                {CreateList(HipHop)}
            </div>
        </Body>
    )
}

   
