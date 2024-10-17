import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
//import Signup from './Signup'

const Login = () => {

  
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
  
      // Envoi de la requête avec les inputs mis à jour
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInputs),
      });
  
      const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }

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
      <input name="username" required value={inputs.username} onChange={(e) => { setInputs({ ...inputs, username: e.target.value }) }} />
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={handleSubmit}>Log in</button>
    </>
  )
}

export default Login
