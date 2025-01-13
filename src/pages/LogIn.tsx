import { useEffect } from 'react'
import { AnimationControls, motion, useAnimation } from 'framer-motion'
import google_logo from '../assets/google_logo.png'
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { nav } from 'framer-motion/client';

function LogIn() {
    const animationControls: AnimationControls = useAnimation()

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const {login} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        animationControls.start('visible')
    }
        , [])

    const clientId = "953454344870-tfsa3sa7hp5de2p7qeomgc9jdttfs8i3.apps.googleusercontent.com";

    const handleLoginSuccess = (response: CredentialResponse): void => {
        if (response.credential) {
            const idToken = response.credential;

            // Send the token to the backend for verification
            axios.post(`${backendUrl}/user-service/auth/token`, { idToken })
                .then((res) => {
                    console.log("token:", res.data);
                    return res.data;
                })
                .then((token) => {
                    login(token);
                    navigate('/');
                })
                .catch((error) => console.error("Error: ", error));
        } else {
            console.error("No credential received from Google.");
        }
    };

    // Handle login failure
    const handleLoginFailure = (): void => {
        console.error("Google Login Failed.");
    };

    return (
        <motion.div className='h-screen grid place-items-center'
            initial='hidden'
            variants={
                {
                    hidden: { opacity: 0, y: -200, scale: 0.7 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                }
            }
            animate={animationControls}
            transition={{ duration: 0.3 }}
        >

            <div className='glass-morphism-login w-[40rem] h-[20rem] grid place-items-center p-3'>
                <GoogleOAuthProvider clientId={clientId}>
                    <div>
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={handleLoginFailure}
                        />
                    </div>
                </GoogleOAuthProvider>
            </div>
        </motion.div>
    )
}

export default LogIn