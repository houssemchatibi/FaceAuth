import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import './index.css' 
import { Navigate, Route, Routes } from 'react-router-dom';


function App() {

  const user = useSelector((store) => store?.user?.User)
  const authUser = user.length > 0
  console.log(authUser)
  
 
  return (
    <>
      <Routes>
          <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
          <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
          <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to={"/"} />} />
          
        </Routes>
    </>
  );
}

export default App
