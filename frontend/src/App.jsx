import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';


function App() {

  const webcamRef = useRef(null);
  const [inputs, setInputs] = useState({
    username: "",
    faceImage: null
  })
  const capture = async () => {
    const imageSrc = await webcamRef.current.getScreenshot();
    setInputs(({ ...inputs, faceImage: imageSrc }))
    
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error);
      }
      setInputs({
        username: "",
        faceImage: null
      });
    } catch (error) {
console.log(error.message)
    }
  }

useEffect(()=>console.log("image",inputs.faceImage)
)
  return (
    <>
      <p>Username</p>
      <input name="username" required onChange={(e) => { setInputs({ ...inputs, username: e.target.value }) }} />
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>Capture</button>
      <button onClick={handleSubmit}>Sign up</button>
    </>
  )
}

export default App
