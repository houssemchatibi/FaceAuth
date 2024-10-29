import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/userSlice'

const Home = () =>{

    const user = useSelector((store) => store?.user?.User)   
    const dispatch = useDispatch() 
    return(
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className=" flex flex-col items-center justify-centerp-8 ">
        <div>
          {user && user.length > 0 ? (
            <p className="text-2xl font-semibold">Welcome, {user[0].username}!</p> 
          ) : (
            <p>Please log in</p>
          )}
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => dispatch(logout())}>
          Log out
        </button>
      </div>
    </div>
    )
}
export default Home
