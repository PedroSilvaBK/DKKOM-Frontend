import { useEffect } from 'react'
import { AnimationControls, motion, useAnimation } from 'framer-motion'
import google_logo from '../assets/google_logo.png'

function LogIn() {
    const animationControls: AnimationControls = useAnimation()
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        animationControls.start('visible')
    }
    , [])

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
            <div className='glass-morphism-login w-[40rem]'>
                <form className='flex flex-col items-center gap-4 p-8'>
                    <h1 className='text-2xl font-bold text-center text-secondary-100'>Login</h1>
                    <a className='bg-white rounded-full p-2' href={backendUrl}>
                        <img className='w-[4rem]' src={google_logo} />
                    </a>
                </form>
            </div>
        </motion.div>
    )
}

export default LogIn