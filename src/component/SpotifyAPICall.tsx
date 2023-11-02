


let token
let song: any[]
const clientId = '488b560b009f4ee5b56bb0d41d81dac4'
const clientSecret = 'd677d602e41e487f8f5f371f9290d555'

async function getToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${btoa(clientId + ':' + clientSecret)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  if (res.ok) {
    const data = await res.json()
    return data.access_token
  }
}

(async () => {
  token = await getToken()
})()




async function SearchTrackSpotifyAPICall() {
  const res = await fetch(`https://api.spotify.com/v1/search`, {
    method: "Get",
    headers: {
      Authorization: `Bearer ${await getToken()}`,
      'Content-Type': 'application/json'
    }
  })
  if (res.ok) {
    const data = await res.json()
    console.log(data)
  }
}
