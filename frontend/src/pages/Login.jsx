import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Webcam from 'react-webcam';
import { fetchUserConnect, logout } from '../redux/userSlice';
//import Signup from './Signup'

const Login = () => {

  const dispatch = useDispatch()
  const user = useSelector((store) => store?.user?.User)
console.log("user",user)
  const webcamRef = useRef(null);
  const [inputs, setInputs] = useState({
    username: "",
    faceImage: null
  })
  

  const handleSubmit = async () => {
    try {
      // Capture de l'image depuis la webcam
      const imageSrc = await webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Unable to capture image from webcam");
      }
  
      // Utilise une variable temporaire pour stocker l'image capturée
      const updatedInputs = {
        ...inputs,
        faceImage: imageSrc,
      };
  
      // Vérifie que faceImage et username sont bien présents
      if (!updatedInputs.username) {
        throw new Error("Missing username");
      }
      if (!updatedInputs.faceImage) {
        throw new Error("Missing face image");
      }

    dispatch(fetchUserConnect(updatedInputs))

      // Remise à zéro des inputs après la connexion réussie
      setInputs({
        username: "",
        faceImage: null,
      });
      console.log("well connecte")
    } catch (error) {
      console.log(error.message)
    }
  }
 

  return (
    <>
      <p>Username</p>
      <div>
      {user && user.length > 0 ? (
        <p>Welcome, {user[0].username}!</p> // Replace with relevant user data
      ) : (
        <p>Please log in</p>
      )}
    </div>
      <input name="username" required value={inputs.username} onChange={(e) => { setInputs({ ...inputs, username: e.target.value }) }} />
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={handleSubmit}>Log in</button>
      <button onClick={() => dispatch(logout())}>Log out</button>
    </>
  )
}

export default Login
