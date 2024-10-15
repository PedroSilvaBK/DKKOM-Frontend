import { useState } from 'react'
import { motion } from 'framer-motion'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import InviteLinkConfig from './InviteLinkConfig';

function CaveInviteMenu({ toggleCreateInviteMenuOpen }: { toggleCreateInviteMenuOpen: () => void }) {
    const [inviteLinkConfigOpen, setInviteLinkConfigOpen] = useState<boolean>(false);

    const toggleInviteLinkConfigOpen = () => {
        setInviteLinkConfigOpen(!inviteLinkConfigOpen);
    }

    return (
        <div
            className='absolute z-30 h-screen w-screen inset-0 grid place-items-center'>
            <div className='absolute bg-black opacity-30 h-full w-full' />
            <div className='z-40 glass-morphism p-3 w-[30rem]'>
                <div className="p-3 bg-primary-200 rounded-lg">
                    <div className='flex flex-col gap-3'>
                        <div className='flex items-center justify-between'>
                            <h1 className='text-secondary-100 font-semibold'>Invite People to the cave</h1>
                            <IconButton onClick={toggleCreateInviteMenuOpen}>
                                <CloseIcon className='text-secondary-100' />
                            </IconButton>
                        </div>
                        <input type="text" placeholder='Enter friend name' className='w-full p-2 bg-primary-300 rounded-lg' />
                    </div>
                    <hr className='my-3' />
                    <div>

                    </div>
                    <div className='flex flex-col gap-1'>
                        <h3 className='font-semibold'>Or send a invitation link</h3>
                        <div className='flex gap-3'>
                            <input type="text" placeholder='https://discord.gg/invite' className='w-full p-2 bg-primary-300 rounded-lg' />
                            <button className='bg-primary-100 hover:bg-secondary-300 transition ease-all text-secondary-100 p-2 rounded-lg'>Copy</button>
                        </div>
                        <div>
                            <a onClick={toggleInviteLinkConfigOpen} className='text-sm font-thin hover:underline hover:cursor-pointer'>change invite settings</a>
                        </div>
                        <motion.div className='mt-3'
                            variants={{
                                open: { display: 'initial' },
                                closed: { display: 'none' }
                            }}
                            initial='closed'
                            animate={inviteLinkConfigOpen ? 'open' : 'closed'}
                        >
                            <InviteLinkConfig />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaveInviteMenu