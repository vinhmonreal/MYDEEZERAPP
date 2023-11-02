

export default function TopArtist() {

    const handleArtist = () => {
        const url = document.querySelector('a')?.href
        const res = fetch(url!)
        if (res) {
            console.log(res)
            
        }
    }

    return (
        <div>
            <h1>Top Artist</h1>
            <div>
                <h3><a href="https://api.deezer.com/artist/382937/top?limit=50"></a>nicki</h3>
                <img src="https://e-cdns-images.dzcdn.net/images/artist/274db63c739086f6e24514b87cea46f2/250x250-000000-80-0-0.jpg" alt="https://api.deezer.com/artist/382937/top?limit=50" onClick={handleArtist} />

            </div>
            
        </div>
    )
}