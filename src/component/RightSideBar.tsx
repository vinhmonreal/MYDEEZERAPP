import ArtistPlaying from "./ArtistPlaying";
import NextUp from "./NextUp";
import TrackPlaying from "./TrackPlaying";

interface RightSideBarProps {
    artistplaying : Boolean;
    trackplaying : Boolean;
    nextup : Boolean;
}
export default function RightSideBar({artistplaying,trackplaying, nextup}:RightSideBarProps){
   
    return(
        <div >
            {trackplaying && <TrackPlaying />}
            {artistplaying && <ArtistPlaying />}
            {nextup && <NextUp />}
        </div>
    )
}