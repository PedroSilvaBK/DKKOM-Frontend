import React from 'react'
import TagIcon from '@mui/icons-material/Tag';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';
import { ChannelOverviewDTO } from '../api/CaveServiceApi';

function TextChannelListItem({ toggleEditTextChannelMenu, channelOverview }: { toggleEditTextChannelMenu: (channelOverview: ChannelOverviewDTO) => void, channelOverview: ChannelOverviewDTO | undefined }) {
    const handleOnClick = () => {
        if (channelOverview){
            toggleEditTextChannelMenu(channelOverview)
        }
    }
    return (
        <div className='group hover:cursor-pointer hover:bg-secondary-300 rounded-xl'>
            <div className='p-2 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <TagIcon style={{ fontSize: '1.2rem' }} />
                    <h1>{channelOverview?.name}</h1>
                </div>
                <div className='group-hover:visible invisible'>
                    <IconButton onClick={handleOnClick}>
                        <SettingsIcon style={{ fontSize: '1.2rem' }} className='text-secondary-100' />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default TextChannelListItem