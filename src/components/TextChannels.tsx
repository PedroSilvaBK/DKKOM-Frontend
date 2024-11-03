import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditTextChannelPage from './EditTextChannelPage/EditTextChannelPage';
import TextChannelList from './TextChannelList';
import { ChannelOverviewDTO } from '../api/CaveServiceApi';

function TextChannels(
    { channelsOverview, toggleCreateChannelMenuOpen }: { channelsOverview: ChannelOverviewDTO[] | undefined, toggleCreateChannelMenuOpen: () => void }
) {
    const [editTextChannelMenuOpen, setEditTextChannelMenuOpen] = useState<boolean>(false);
    const [selectedChannel, setSelectedChannel] = useState<ChannelOverviewDTO | null>(null);

    const toggleEditTextChannelMenu = (channelOverview: ChannelOverviewDTO | null) => {
        setSelectedChannel(channelOverview)
        setEditTextChannelMenuOpen(!selectedChannel)
    }

    return (
        <div>
            <div className='flex justify-between'>
                <div className='flex items-center gap-3 group hover:cursor-pointer'>
                    <ArrowForwardIosIcon style={{ fontSize: '1rem' }} className='rotate-90 group-hover:text-secondary-200' />
                    <h1 className='text-center group-hover:text-secondary-200'>Text Channel</h1>
                </div>
                <div onClick={toggleCreateChannelMenuOpen}>
                    <AddIcon style={{ fontSize: '1rem' }} className='hover:text-secondary-200 hover:cursor-pointer' />
                </div>
            </div>
            <div>
                <TextChannelList toggleEditTextChannelMenu={toggleEditTextChannelMenu}  channelsOverview={channelsOverview} />
            </div>
            {
                editTextChannelMenuOpen && (
                    <div className='absolute inset-0 h-screen w-screen grid place-items-center'>
                        <div className='h-[90vh] w-[55vw]'>
                            <EditTextChannelPage toogleEditTextChannel={toggleEditTextChannelMenu} selectedChannel={selectedChannel} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default TextChannels