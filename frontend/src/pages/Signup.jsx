import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    faceImage: null
  })
  const [errorMessage, setErrorMessage] = useState(null)


  const handleSubmit = async () => {
    try {
      const imageSrc = await webcamRef.current.getScreenshot();
      const payload = {
        username: inputs.username,
        faceImage: imageSrc,
      };

      const res = await fetch("http://127.0.0.1:5000/api/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      

      if (!res.ok) {
        setErrorMessage(data.error)
        throw new Error(data.error);

      }
      
      setInputs({
        username: "",
        faceImage: null,
      });
      setErrorMessage(null); // Clear any previous error messages
      navigate('/login');
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 mx-auto  py-10 px-8 justify-center items-center">
        <div className="mx-auto max-w-md px-6 py-4 bg-white border-0 shadow-lg rounded-3xl">
          <center>
            <h1 className="text-2xl font-bold mb-4">Face-Auth</h1>
          </center>
          <label className="text-l mb-4">username : </label>
          <input
            type="text"
            name="username"
            placeholder=" "
            required
            onChange={(e) => { setInputs({ ...inputs, username: e.target.value }) }}
            className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#777575] mt-2 "
          />
          {errorMessage && (
            <span className="text-sm text-red-600">{errorMessage}</span>
          )}


          <div className="rounded-lg overflow-hidden mt-4" >
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
          </div>
          <div className="flex flex-col items-center">
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white text-lg font-medium rounded-md w-1/3" onClick={handleSubmit}>Sign Up </button>
            <p className='text-sm font-light text-gray-500 mt-2'>
              have an account?{" "}
              <Link to='/signup' className='font-medium text-primary-600 hover:underline text-blue-600'>
                Log in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </>
  )
}

export default Signup
