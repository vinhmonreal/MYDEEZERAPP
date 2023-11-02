import { useEffect, useState } from "react"


const BottomBar = () => {
    const [play, setPlay] = useState(false)
    const [pause, setPause] = useState(false)
    const [currentSong, setCurrentSong] = useState<any>('')
    const [currentCover, setCurrentCover] = useState<any>('')
    

    useEffect(() => {
        setCurrentCover(localStorage.getItem('currentcover'))
        setCurrentSong(localStorage.getItem('currentsong'))
        console.log("change",currentCover)
    }, [ localStorage.getItem('currentcover'), localStorage.getItem('currentsong')])
    

    const handlePlay = (preview:any, cover:any) => {
        const audios = document.querySelectorAll('audio')
        const song = preview

        if (localStorage.getItem('currentsong')===song) {
            if (play) {
                setPlay(false)
                setPause(true)
                localStorage.setItem('currentsong', song)
                localStorage.setItem('currentcover', cover)
                for (let i = 0; i < audios.length; i++) {
                        audios[i].pause()

                }

            } else if (pause) {
                setPlay(true)
                setPause(false)
                localStorage.setItem('currentsong', song)
                localStorage.setItem('currentcover', cover)
                for (let i = 0; i < audios.length; i++) {
                        audios[i].play()

                }

            }
        } else {
            setPlay(true)
            setPause(false)
            localStorage.setItem('currentsong', song)
            localStorage.setItem('currentcover', cover)
            for (let i = 0; i < audios.length; i++) {

                    audios[i].pause()

            }
            for (let i = 0; i < audios.length; i++) {
                if (audios[i].src===song) {
                    audios[i].play()
                }
            }
        }
    }

    return (
        <div className="bottombar">
        </div>
    )
}

export default BottomBar
