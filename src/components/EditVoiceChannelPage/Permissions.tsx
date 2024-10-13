import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import { motion, useAnimation } from 'framer-motion'
import { IconButton } from '@mui/material';
import PermissionList from './PermissionList';

function Permissions() {

    const saveChangesAnimation = useAnimation()

    const [searchRoleMenuOpen, setSearchRoleMenuOpen] = React.useState<boolean>(false)
    const toggleSearchRoleMenu = () => {
        setSearchRoleMenuOpen(!searchRoleMenuOpen)
    }

    return (
        <div className='flex flex-col gap-4 w-full h-full relative overflow-hidden'>
            <h1 className='text-secondary-100 font-semibold'>Permissions</h1>
            <div className='flex gap-4'>
                <div className='flex flex-col gap-3 w-[15rem] relative'>
                    <div className='flex items-center'>
                        <h2 className='text-secondary-100 text-sm font-semibold'>Roles / Members</h2>
                        <IconButton onClick={toggleSearchRoleMenu}>
                            <AddIcon className='text-secondary-100' />
                        </IconButton>
                    </div>
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
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, display: 'none' },
                            visible: { opacity: 1, display: 'block' }
                        }}
                        initial='hidden'
                        animate={searchRoleMenuOpen ? 'visible' : 'hidden'}
                        className='absolute bg-primary-100 top-8 p-1 rounded-xl flex flex-col gap-2'>
                        <input type="text" className='bg-primary-200 text-secondary-100 rounded-lg p-1' placeholder='Search Roles / Members' />
                        <div className='flex flex-col items-center gap-2 max-h-[13rem] overflow-y-scroll'>
                            <span className='text-secondary-100 hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>Role 1</span>
                            <span className='text-secondary-100 hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>Role 1</span>
                            <span className='text-secondary-100 hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>Role 1</span>
                            <span className='text-secondary-100 hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>Role 1</span>
                            <span className='text-secondary-100 hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>Role 1</span>
                            <span className='text-secondary-100 hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>Role 1</span>
                            <span className='text-secondary-100 hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>Role 1</span>
                            <span className='text-secondary-100 hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center'>Role 1</span>
                        </div>
                    </motion.div>
                </div>
                <div className='flex flex-col gap-3'>
                    <h2 className='text-secondary-100 text-sm font-semibold'>Channel Permissions</h2>
                    <PermissionList />
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

export default Permissions