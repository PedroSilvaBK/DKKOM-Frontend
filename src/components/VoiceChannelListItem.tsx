import React from 'react'
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';

function VoiceChannelListItem({ toggleEditVoiceChannelMenu }: { toggleEditVoiceChannelMenu: () => void }) {
    return (
        <div className='hover:cursor-pointer hover:bg-secondary-300 rounded-xl'>
            <div className='p-2 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <SpatialAudioOffIcon style={{ fontSize: '1.2rem' }} />
                    <h1>Channel Name</h1>
                </div>
                <div>
                    <IconButton onClick={toggleEditVoiceChannelMenu}>
                        <SettingsIcon style={{ fontSize: '1.2rem' }} className='text-secondary-100' />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default VoiceChannelListItem