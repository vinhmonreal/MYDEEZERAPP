import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/UserProvider";
import { useContext, useEffect } from "react"


export function SignUp() {
    const { user, setUser } = useContext(AuthContext)
    async function handleSubmit(e: { preventDefault: () => void; target: { username: { value: any }; email: { value: any }; password: { value: any } } }){
        e.preventDefault()
        const username = e.target.username.value
        const email = e.target.email.value
        const password = e.target.password.value
        const data = {
            name: username,
            email: email,
            password: password,
            type: 'freemium'
        }
        console.log(data)
        if (username && email && password){
            const res = await fetch('http://localhost:4000/api/createaccount', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const result = await res.json()
            console.log(result)
            if (res.status===201){
                // add to user context
                // localStorage.setItem('user', JSON.stringify(result.name))
                // localStorage.setItem('userID', JSON.stringify(result.id))
                // localStorage.setItem('token', JSON.stringify(result.token))
                // localStorage.setItem('myplaylists', JSON.stringify(result.playlists))
                // localStorage.setItem('type', JSON.stringify(result.type))
                // localStorage.setItem('dateCreated', JSON.stringify(result.dateCreated))
                // localStorage.setItem('email', JSON.stringify(result.email))
                // setUser({
                //     loggedIn:true,
                //     username:result.name,
                //     userID:result._id,
                //     token:result.token,
                //     myplaylists:result.myplaylists,
                //     type:result.type
                //   })
                //   user.loggedIn = true
                // take window to home page
                window.location.href = '/signin'
            }
        }
    }
    


    return (
        <div className="sign-form">
            <h1>Sign Up</h1>
            <form  onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" />
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export function SignIn() {
    // http://localhost:4000/api/verifyuser
    const { user, setUser } = useContext(AuthContext)

    async function handleSubmit(e: { preventDefault: () => void; target: { email: { value: any }; password: { value: any } } }){
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
        const data = {
            email: email,
            password: password,
        }
        if (email && password){
            const res = await fetch('http://localhost:4000/api/verifyuser', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const result = await res.json()
            console.log(result, 'result')
            if (res.status===200){
                // add to user context
                localStorage.setItem('user', JSON.stringify(result.name))
                localStorage.setItem('userID', JSON.stringify(result.id))
                localStorage.setItem('token', JSON.stringify(result.token))
                localStorage.setItem('myplaylists', JSON.stringify(result.playlists))
                localStorage.setItem('type', JSON.stringify(result.type))
                localStorage.setItem('dateCreated', JSON.stringify(result.dateCreated))
                localStorage.setItem('email', JSON.stringify(result.email))
                setUser({
                    loggedIn:true,
                    username:result.name,
                    userID:result._id,
                    token:result.token,
                    myplaylists:result.myplaylists,
                    type:result.type
                  })
                  user.loggedIn = true
                window.location.href = '/home'
            }
        }
    }
    
    return (
        <div className="sign-form">
            <h1>Sign In</h1>
            <form  onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <button type="submit">Sign In</button>
            </form>
        </div>
    )
}


export function SignOut() {
    const { setUser } = useContext(AuthContext)
    useEffect(() => {
        setUser({
            loggedIn:false,
            username:'',
            userID:'',
            token:'',
            myplaylists:[],
            type:''
          })
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('myplaylists')
        
    }, [])
    window.location.href = '/home'
    return (
        <div>
            <h1>Sign Out</h1>
            <center><i className="fa fa-spinner fa-spin fa-5x"></i></center>
        </div>
    )
}