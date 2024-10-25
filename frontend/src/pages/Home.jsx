import React from 'react'
import { useSelector } from 'react-redux'

const Home = () =>{

    const user = useSelector((store) => store?.user?.User)    
    return(
        <div>
             <div>
      {user && user.length > 0 ? (
        <p>Welcome, {user[0].username}!</p> // Replace with relevant user data
      ) : (
        <p>Please log in</p>
      )}
    </div>
        </div>
    )
}
export default Home
