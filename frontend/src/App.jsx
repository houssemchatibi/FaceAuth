import { useRef } from 'react';
import Webcam from 'react-webcam';


function App() {
 
  const webcamRef = useRef(null);
  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
  }
  return (
    <>
    <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
    <button onClick={capture}>Capture</button>

    </>
  )
}

export default App
