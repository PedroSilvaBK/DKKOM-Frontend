import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditTextChannelPage from './EditTextChannelPage/EditTextChannelPage';
import TextChannelList from './TextChannelList';

function TextChannels() {
    const [editTextChannelMenuOpen, setEditTextChannelMenuOpen] = useState<boolean>(false);
    const toggleEditTextChannelMenu = () => {
        setEditTextChannelMenuOpen(!editTextChannelMenuOpen);
    }

    return (
        <div>
            <div className='flex justify-between'>
                <div className='flex items-center gap-3 group hover:cursor-pointer'>
                    <ArrowForwardIosIcon style={{ fontSize: '1rem' }} className='rotate-90 group-hover:text-secondary-200' />
                    <h1 className='text-center group-hover:text-secondary-200'>Text Channel</h1>
                </div>
                <div>
                    <AddIcon style={{ fontSize: '1rem' }} className='hover:text-secondary-200 hover:cursor-pointer' />
                </div>
            </div>
            <div>
                <TextChannelList toggleEditTextChannelMenu={toggleEditTextChannelMenu} />
            </div>
            {
                editTextChannelMenuOpen && (
                    <div className='absolute inset-0 h-screen w-screen grid place-items-center'>
                        <div className='h-[90vh] w-[55vw]'>
                            <EditTextChannelPage toogleEditTextChannel={toggleEditTextChannelMenu} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default TextChannels