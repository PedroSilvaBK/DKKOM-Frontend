import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';
import { ChannelOverviewDTO, UserPermissionCache } from '../api/CaveServiceApi';
import permissionsService from './PermissionsService/PermissionsService';

function VoiceChannelListItem({ toggleEditVoiceChannelMenu, channelOverview, userPermissionsCache }: { toggleEditVoiceChannelMenu: (channelOverview: ChannelOverviewDTO) => void, channelOverview: ChannelOverviewDTO, userPermissionsCache: UserPermissionCache }) {
    const handleOnClick = () => {
        if (channelOverview && permissionsService.canManageChannels(userPermissionsCache.cavePermissions)) {
            toggleEditVoiceChannelMenu(channelOverview)
        }
    }
    
    return (
        <div className='group hover:cursor-pointer hover:bg-secondary-300 rounded-xl'>
            <div className='p-2 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <SpatialAudioOffIcon style={{ fontSize: '1.2rem' }} />
                    <h1>{channelOverview.name}</h1>
                </div>
                {
                    permissionsService.canManageChannels(userPermissionsCache.cavePermissions) && (
                        <div className='group-hover:visible invisible'>
                        <IconButton onClick={handleOnClick}>
                            <SettingsIcon style={{ fontSize: '1.2rem' }} className='text-secondary-100' />
                        </IconButton>
                    </div>)
                }
            </div>
        </div>
    )
}

export default VoiceChannelListItem