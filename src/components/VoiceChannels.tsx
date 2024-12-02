import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditVoiceChannelPage from '../pages/EditVoiceChannelPage';
import VoiceChannelList from './VoiceChannelList';
import { ChannelOverviewDTO } from '../api/CaveServiceApi';
import { useCave } from './CaveProvider';
import permissionsService from './PermissionsService/PermissionsService';

function VoiceChannels(
    { channelsOverview, toggleCreateChannelMenuOpen }: { channelsOverview: ChannelOverviewDTO[] | undefined, toggleCreateChannelMenuOpen: () => void }
) {
    const [editVoiceChannelMenuOpen, setEditVoiceChannelMenuOpen] = useState<boolean>(false);
    const [selectedChannel, setSelectedChannel] = useState<ChannelOverviewDTO | null>(null);

    const { selectedCaveBaseInfo } = useCave();


    const toggleEditVoiceChannelMenu = (channelOverview: ChannelOverviewDTO | null) => {
        if (selectedCaveBaseInfo && !permissionsService.canManageChannels(selectedCaveBaseInfo.userPermissionsCache.cavePermissions)) {
            return
        }
        setSelectedChannel(channelOverview)
        setEditVoiceChannelMenuOpen(!selectedChannel)
    }

    return (
        <div>
            <div className='flex justify-between'>
                <div className='flex items-center gap-3 group hover:cursor-pointer'>
                    <ArrowForwardIosIcon style={{ fontSize: '1rem' }} className='rotate-90 group-hover:text-secondary-200' />
                    <h1 className='text-center group-hover:text-secondary-200'>Voice Channel</h1>
                </div>
                {
                    selectedCaveBaseInfo && permissionsService.canManageChannels(selectedCaveBaseInfo.userPermissionsCache.cavePermissions) && (
                        <div onClick={toggleCreateChannelMenuOpen}>
                            <AddIcon style={{ fontSize: '1rem' }} className='hover:text-secondary-200 hover:cursor-pointer' />
                        </div>
                    )
                }
            </div>
            <div>
                <VoiceChannelList toggleEditVoiceChannelMenu={toggleEditVoiceChannelMenu} channelsOverview={channelsOverview} />
            </div>
            {
                editVoiceChannelMenuOpen && (
                    <div className='absolute inset-0 h-screen w-screen grid place-items-center'>
                        <div className='h-[90vh] w-[55vw]'>
                            <EditVoiceChannelPage toogleEditVoiceChannel={toggleEditVoiceChannelMenu} selectedChannel={selectedChannel} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default VoiceChannels