import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Channels from './Channels';
import { useState } from 'react';
import CaveMenu from './CaveMenu';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion'
import CaveInviteMenu from './CaveInviteMenu';
import CaveCreateChannelMenu from './CaveCreateChannelMenu';
import CaveConfig from './CaveConfig';

function MainPanel() {
    const [caveMenuOpen, setCaveMenuOpen] = useState<boolean>(false);
    const [createInviteMenuOpen, setCreateInviteMenuOpen] = useState<boolean>(false);
    const [createChannelMenuOpen, setCreateChannelMenuOpen] = useState<boolean>(false);
    const [caveConfigMenuOpen, setCaveConfigMenuOpen] = useState<boolean>(false);

    const toggleCaveMenuOpen = () => {
        setCaveMenuOpen(!caveMenuOpen);
    }


    const toggleCreateInviteMenuOpen = () => {
        setCreateInviteMenuOpen(!createInviteMenuOpen);
    }

    const toggleCreateChannelMenuOpen = () => {
        setCreateChannelMenuOpen(!createChannelMenuOpen);
    }

    const toggleCaveConfigMenuOpen = () => {
        setCaveConfigMenuOpen(!caveConfigMenuOpen);
    }

    return (
        <div className='bg-primary-200 rounded-l-xl overflow-hidden text-secondary-100'>
            <div className='relative'>
                <div
                    onClick={toggleCaveMenuOpen}
                    className='flex items-center justify-between p-3 hover:bg-secondary-300 transition ease-all hover:cursor-pointer'>
                    <h1 className='font-bold'>Server Name</h1>
                    {
                        caveMenuOpen ? <CloseIcon style={{ fontSize: '1rem' }} /> : <ArrowForwardIosIcon style={{ fontSize: '1rem' }} className='rotate-90' />
                    }
                </div>
                <motion.div
                    variants={{
                        open: { scale: 1 },
                        closed: { scale: 0 }
                    }}
                    initial='closed'
                    animate={caveMenuOpen ? 'open' : 'closed'}
                    transition={{ duration: 0.1 }}
                    className='absolute w-full z-30 p-2'>
                    {
                        caveMenuOpen && <CaveMenu 
                        toggleCreateInviteMenuOpen={toggleCreateInviteMenuOpen} 
                        toggleCreateChannelMenuOpen={toggleCreateChannelMenuOpen} 
                        toggleCaveConfigMenuOpen={toggleCaveConfigMenuOpen}
                        />
                    }
                </motion.div>
            </div>
            <hr className='mb-3' />
            <Channels />
            {
                createInviteMenuOpen && (
                    <motion.div
                        variants={{
                            open: { opacity: 1, display: 'initial' },
                            closed: { opacity: 0, display: 'none' }
                        }}
                        initial='closed'
                        animate={createInviteMenuOpen ? 'open' : 'closed'}
                        transition={{ duration: 0.1 }}
                    >
                        <CaveInviteMenu toggleCreateInviteMenuOpen={toggleCreateInviteMenuOpen} />
                    </motion.div>
                )
            }
            {
                createChannelMenuOpen && (
                    <motion.div
                        variants={{
                            open: { opacity: 1, display: 'initial' },
                            closed: { opacity: 0, display: 'none' }
                        }}
                        initial='closed'
                        animate={createChannelMenuOpen ? 'open' : 'closed'}
                        transition={{ duration: 0.1 }}
                    >
                        <CaveCreateChannelMenu toggleCreateChannelMenuOpen={toggleCreateChannelMenuOpen} />
                    </motion.div>
                )
            }
            {
                caveConfigMenuOpen && (
                    <motion.div
                        variants={{
                            open: { opacity: 1, display: 'initial' },
                            closed: { opacity: 0, display: 'none' }
                        }}
                        initial='closed'
                        animate={caveConfigMenuOpen ? 'open' : 'closed'}
                        transition={{ duration: 0.1 }}
                    >
                        <CaveConfig toggleCaveConfigMenuOpen={toggleCaveConfigMenuOpen} />
                    </motion.div>
                )
            }
        </div>
    )
}

export default MainPanel