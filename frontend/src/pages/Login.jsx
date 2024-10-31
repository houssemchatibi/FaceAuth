import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Webcam from 'react-webcam';
import { fetchUserConnect, logout } from '../redux/userSlice';
import { Link } from 'react-router-dom';
//import Signup from './Signup'

const Login = () => {

    const dispatch = useDispatch()
    const user = useSelector((store) => store?.user?.User)
    console.log("user", user)
    const webcamRef = useRef(null);
    const [inputs, setInputs] = useState({
        username: "",
        faceImage: null
    })
    const errorMessage = useSelector((state) => state.user.error);

    const handleSubmit = async () => {

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

        if (!updatedInputs.faceImage) {
            throw new Error("Missing face image");
        }

        dispatch(fetchUserConnect(updatedInputs));


        // Reset fields if login is successful
        // setInputs({ username: "", faceImage: null });

        console.log("well connecte")
        console.log("the connected user :", inputs)

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
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white text-lg font-medium rounded-md w-1/3" onClick={handleSubmit}>Log in</button>
                        <p className='text-sm font-light text-gray-500 mt-2'>
                            {"Don't"} have an account?{" "}
                            <Link to='/signup' className='font-medium text-primary-600 hover:underline text-blue-600'>
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
               
            </div>
        </>
    )
}

export default Login
