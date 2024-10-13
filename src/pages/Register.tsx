import React, { useEffect } from 'react'
import { AnimationControls, motion, useAnimation } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate()
    const animationControls: AnimationControls = useAnimation()

    useEffect(() => {
      animationControls.start('visible')
    }
    , [])

    const redirect = async (): Promise<void> => {
        await animationControls.start('hidden')
        navigate("/login")
    }

    return (
        <div className='h-screen grid place-items-center'>
            <motion.div
                initial='hidden'
                variants={
                    {
                        hidden: { opacity: 0, y: -200, scale: 0.7 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                    }
                }
                animate={animationControls}
                transition={{ duration: 0.3 }}
                className='glass-morphism-login w-[40rem]'>
                <form className='flex flex-col gap-4 p-8'>
                    <h1 className='text-2xl font-bold text-center text-secondary-100'>Register</h1>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-secondary-100">E-mail</label>
                        <input type="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John@gmail.com" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-secondary-100">Username</label>
                        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="johndoe" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-secondary-100">Senha</label>
                        <input type="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="123456789" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-secondary-100">Birthday</label>
                        <input type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="123456789" required />
                    </div>
                    <div className="flex items-center">
                        <input id="link-checkbox" type="checkbox" value="" className="w-4 h-4 accent-primary-100 rounded focus:ring-secondary-200" />
                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">terms and conditions</a>.</label>
                    </div>
                    <button type="button" className="text-secondary-100 bg-primary-100 hover:bg-secondary-200 hover:text-primary-100 focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 transition ease-all">Log In</button>
                    <span className='font-semibold text-lg'>Already have an account? <a onClick={redirect} className="text-secondary-100 text-sm text-center text-xl hover:underline transition ease-all">Log In</a></span>
                </form>
            </motion.div>
        </div>
    )
}

export default Register