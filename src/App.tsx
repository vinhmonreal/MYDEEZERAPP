// import { BrowserRouter, Routes, Route } from "react-router-dom"
// import Home from "./pages/Home"
// import { Container } from "react-bootstrap"
// import Search from "./component/Search"
// import GetArtist from "./component/GetArtist"
// import CreatePlayList from "./component/CreatePlayList"
// import BillBoardTop100 from "./component/BillBoardTop100"
// import './style.css'
// import {  SignIn, SignOut, SignUp } from "./component/User"
// import CreateUserPlayList from "./component/CreateUserPlayList"
// import { useEffect } from "react"


// function App() {
//   const path = window.location.pathname

//   useEffect(()=>{
//     if (path === '/'){
//       window.location.href = '/signin'
//     }
//     if (path === '/home'){
//       window.location.href = '/signup'
//     } 
//   },[path])
//   return(
//   <Container>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/search" element={<Search />} />
//         <Route path="/search/:searchValue" element={<Search />} />
//         <Route path="/artist/:artistname" element={<GetArtist />} />
//         <Route path="/chart" element={<Home />} />
//         {/* <Route path="/home" element={<Home />} /> */}
//         <Route path="/playlist/:playlistname" element={<CreatePlayList />} />
//         <Route path="/playlist/:ownerID/:playlistID/:playlisttitle/" element={<CreateUserPlayList />} />  
//         <Route path="/playlist/BillBoardTop100" element={<BillBoardTop100 />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/signin" element={<SignIn />} />
//         <Route path="/signout" element={<SignOut />} />
//       </Routes>
//     </BrowserRouter>
//   </Container>
//   )
// }

// export default App





import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { Container } from "react-bootstrap"
import Search from "./component/Search"
import GetArtist from "./component/GetArtist"
import CreatePlayList from "./component/CreatePlayList"
import BillBoardTop100 from "./component/BillBoardTop100"
import './style.css'
import {  SignIn, SignOut, SignUp } from "./component/User"
import CreateUserPlayList from "./component/CreateUserPlayList"
import { useEffect } from "react"
import Body from "./component/Body"
import Upgrade from "./component/Upgrade"
import { AuthContext } from "./contexts/UserProvider"


function App() {
  const path = window.location.pathname
  console.log(path)

    if (path === '/welcome'){
      console.log('iam here')
      return(
          <BrowserRouter>
            <Routes>
              <Route path="/welcome" element={<Body navigation={true} sidebar={true} bottombar={true} children={true} children2={undefined} rightsidebar={true}/>} />
            </Routes>
          </BrowserRouter>
        )
    } 
    //  path for sign in
    if (path === '/signin'){
      return(
          <BrowserRouter>
            <Routes>
              <Route path="/signin" element={<SignIn />} />
            </Routes>
          </BrowserRouter>
        )
    }
    // path for sign up
    if  (path === '/signup'){
      return(
          <BrowserRouter>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        )
      }
    // path for sign out
    if  (path === '/signout'){
      return(
          <BrowserRouter>
            <Routes>
              <Route path="/signout" element={<SignOut />} />
            </Routes>
          </BrowserRouter>
        )
      }
    // path for upgrade to premium
    if  (path === '/upgrade'){
      return(
          <BrowserRouter>
            <Routes>
              <Route path="/upgrade" element={<Upgrade  />} />
            </Routes>
          </BrowserRouter>
        )
      }


  return(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Body navigation={true} sidebar={true} bottombar={true} children={true} children2={undefined} rightsidebar={true}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
