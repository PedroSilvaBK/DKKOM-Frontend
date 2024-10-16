import { IconButton } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import { motion, useAnimation } from 'framer-motion'
import IOSSwitch from './IOSSwitch';
import CaveConfigRolesPermission from './CaveConfigRolesPermission';


function CaveConfigRoles() {
    const saveChangesAnimation = useAnimation()


    return (
        <div className='w-full h-full relative overflow-hidden'>
            <div>
                <h1>Roles</h1>
            </div>
            <div className='flex gap-4 h-full w-full'>
                <div className='self-start flex flex-col gap-3'>
                    <div>
                        <div className='flex items-center gap-2 bg-primary-100 rounded-lg'>
                            <input type="text" placeholder='Role Name' className='outline-none bg-primary-100 rounded-lg p-2 w-full' />
                            <IconButton>
                                <AddIcon className='text-secondary-100' />
                            </IconButton>
                        </div>
                    </div>
                    <div>
                        <div className='text-secondary-100 flex items-center flex-col gap-2'>
                            <div className='hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>
                                <span>Role 1</span>
                            </div>
                            <div className='hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>
                                <span>Role 1</span>
                            </div>
                            <div className='hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>
                                <span>Role 1</span>
                            </div>
                            <div className='hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>
                                <span>Role 1</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-4 h-[30rem] overflow-y-scroll'>
                    {
                        Array.from({ length: 5 }).map((_, index) => (
                            <>
                            <CaveConfigRolesPermission key={index} />
                            <hr />
                            </>
                        ))
                    }
                </div>
            </div>
            <motion.div
                variants={{
                    hidden: { bottom: '-100%' },
                    visible: { bottom: 0 }
                }}
                initial='hidden'
                animate={saveChangesAnimation}
                transition={{ duration: 0.3 }}
                className='absolute bg-white w-full rounded-lg p-3 flex justify-between items-center'>
                <span>You sure you want to update the information?</span>
                <div className='flex gap-4'>
                    <button className='text-primary-100 rounded-lg p-1'>Cancel</button>
                    <button className='bg-primary-100 text-secondary-100 rounded-lg p-1 hover:bg-secondary-300 transition ease-all '>Save Changes</button>
                </div>
            </motion.div>
        </div>
    )
}


export default CaveConfigRoles