import { useEffect } from "react"
import ArtistPlaying from "./ArtistPlaying"
import TrackPlaying from "./TrackPlaying"
import { json } from "react-router-dom"

export default async function CreatPlayTrack(result:any, playlist:any, playlistname?:string) {

    let data= []
    for (let i=0; i<playlist.length; i++) {
        data.push(playlist[i])
    }
    localStorage.setItem('leftoverplaylisttitle', playlistname!)
    console.log(localStorage.getItem('leftoverplaylisttitle'), 'leftoverplaylisttitle')
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
        track_title.innerHTML = await result.title
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
                // const icon123 = document.getElementById('i123')
                // if (icon123) {
                //     icon123.className = 'fa fa-play'
                // }
                audio.play()
                playicon.className = pausecircle
            }
            else {
                // const icon123 = document.getElementById('i123')
                // if (icon123) {
                //     icon123.className = ''
                // }
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
                CreatPlayTrack(previoussong, playlist)
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
                CreatPlayTrack(nextsong, playlist)
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
         

            
            // try {
            //     const fafaplayicon = document.getElementsByClassName('fa fa-play')
            //     fafaplayicon[0].className = ''
            //     const fafastopcircleicon = document.getElementsByClassName('fa fa-stop-circle')
            //     fafastopcircleicon[0].className = ''
            //     fafaplayicon[0].innerHTML = '9'
            //     fafastopcircleicon[0].innerHTML = '9'
            // }
            // catch {
            //     console.log('error')
            // }
            
         
            if (localStorage.getItem('repeateMode')==='true') {
                audio.play()
                playicon.className = pausecircle
                
                return
            }
            if (localStorage.getItem('shufflemode')==='true') {
                const randomIndex = Math.floor(Math.random() * playlist.length)
                const randomsong = playlist[randomIndex]
                CreatPlayTrack(randomsong, playlist)
                return
            }
            if (onLastTrack) {
                audio.pause()
                playicon.className = playcircle
                return
            }
            else {
                playicon.className = playcircle
                const icon123 = document.getElementById('i123')
              
                CreatPlayTrack(nextsong, playlist)
            }

        }
        


        audio.onplay = () => {
            // const icon123 = document.getElementById('i123')
            // console.log(icon123, 'icon123')
            // if (icon123) {
            //     icon123.className = 'fa fa-stop-circle'
            // }
            // icons.forEach((icon)=> {
            //     if (icon.id !== 'playicon' && icon.id !== 'previousicon' && icon.id !== 'nexticon' && icon.id !== 'shuffleicon' && icon.id !== 'repeaticon' && icon.id !== 'play__stop__icon') {
            //     icon.className = pausecircle
            //     }
            // }
            // )
            // if (icon) {
            //     icon.className = stopcircle
            //     setIsPlaying(true)
              
            // }

        }
        audio.onpause = () => {

            // const icon123 = document.getElementById('i123')
            // console.log(icon123, 'icon123')
            // if (icon123) {
            //     icon123.className = 'fa fa-play'
            // }
            // icons.forEach((icon)=> {
            //     if (icon.id !== 'playicon' && icon.id !== 'previousicon' && icon.id !== 'nexticon' && icon.id !== 'shuffleicon' && icon.id !== 'repeaticon') {
            //         icon.className = playcircle
            //         }
            // }
            // )
            // if (icon) { 
            //     icon.className = playcircle
            //     setIsPlaying(false)
            // }
        }

        // if (icon?.className==='fa fa-play') {
        //     icons.forEach((icon)=>{
        //         if (icon.id !== 'playicon' && icon.id !== 'previousicon' && icon.id !== 'nexticon' && icon.id !== 'shuffleicon' && icon.id !== 'repeaticon') {
        //             icon.className = playcircle
        //             }
        //     })
        //     icon.className = playcircle
        //     setIsPlaying(true)
        // } else if (icon?.className==='fa fa-stop-circle') {
        //     icons.forEach((icon)=>{
        //         if (icon.id !== 'playicon' && icon.id !== 'previousicon' && icon.id !== 'nexticon' && icon.id !== 'shuffleicon' && icon.id !== 'repeaticon') {
        //             icon.className = playcircle
        //             }                                         
        //     })
        //     icon.className = playcircle
        //     setIsPlaying(false)
        //     document.querySelectorAll('audio').forEach((audio)=>{
        //         audio.pause()
        //     }
        //     )                                     
            
        // }

        // add element to rightsidebar
        // Next up element
        // get nextvup track from playlist array
        
        // const rightsidebar = document.getElementById('right-side-bar')
        // rightsidebar?.classList.add('right-side-bar-show')
        // const nextUp = document.getElementById('nextup') as HTMLDivElement
        // nextUp.style.visibility = 'visible'
        // if (!onLastTrack) {          
        //     const nextUpTrack = await playlist[nextsongindex]   
        //     console.log(nextUpTrack, 'nextUpTrack')
        //     const nextUpTrackImage = document.getElementById('nextup__track__img') as HTMLImageElement
        //     const nextUpTrackTitle = document.getElementById('nextup__track__title') as HTMLHeadingElement
        //     const nextUpTrackArtist = document.getElementById('nextup__track__artist') as HTMLParagraphElement
        //     nextUpTrackImage.src = nextUpTrack.album.cover_small
        //     nextUpTrackTitle.innerHTML = nextUpTrack.title
        //     nextUpTrackArtist.innerHTML = nextUpTrack.artist.name
        //     nextUpTrackArtist.addEventListener('click', ()=> {
        //         window.location.href = `/artist/${nextUpTrack.artist.name}`
        //     })
        // } else {
        //     nextUp.style.visibility = 'hidden'
        // }
        // // Track playing element
        // // get playlist Name from URL if url is not /playlist
        // const url = window.location.pathname
        // console.log(url, 'url')
        // // if url is /playlist, playlistName = ''
        // let playlistName = ''
        // // if url contain /playlist, playlistName = url split by '/' at index 2
        // if (url.includes('/playlist')) {
        //     playlistName = url.split('/')[2]
        // }
        // const trackplayingHeading = document.getElementById('track__playing__heading') as HTMLHeadingElement
        // trackplayingHeading.classList.remove('animated')
        // const trackPlayingImage = document.getElementById('track__playing__img') as HTMLImageElement
        // const trackPlayingTitle = document.getElementById('track__playing__title') as HTMLHeadingElement
        // const trackPlayingArtist = document.getElementById('track__playing__artist') as HTMLParagraphElement
        // trackPlayingImage.src = result.album.cover_medium
        // trackPlayingTitle.innerHTML = result.title
        // trackPlayingArtist.innerHTML = result.artist.name
        // playlistName? trackplayingHeading.innerHTML = playlistName : playlistname? trackplayingHeading.innerHTML = playlistname : trackplayingHeading.innerHTML = ''
        // if (trackPlayingTitle.innerHTML.length > 20) {
        //     console.log(trackPlayingTitle.offsetWidth, 'trackPlayingTitle.offsetWidth')
        //     trackPlayingTitle.classList.add('animated')
        // }
        // if (trackplayingHeading.innerHTML.length > 20) {
        //     console.log(trackplayingHeading.offsetWidth, 'trackplayingHeading.offsetWidth')
        //     trackplayingHeading.classList.add('animated')
        // }
        // // Artist playing element
        // const artistPlayingImage = document.getElementById('artist__playing__img') as HTMLImageElement
        // const artistPlayingdetail = document.getElementById('artist__playing__details') as HTMLParagraphElement
        // artistPlayingImage.src = result.artist.picture_medium
        // artistPlayingdetail.innerHTML = result.artist.name
        // // artistPlayingdetail.addEventListener('click', ()=> {
        // //     window.location.href = `/artist/${result.artist.name}`
        // // })
}


export const convertToMin = (duration:number) => {
    const min = Math.floor(duration/60)
    const sec = duration%60
    if (sec<10) {
        return `${min}:0${sec}`
    }
    return `${min}:${sec}`
}










