import TagIcon from '@mui/icons-material/Tag';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';
import { ChannelOverviewDTO, UserPermissionCache } from '../api/CaveServiceApi';
import { useCave } from './CaveProvider';
import permissionsService from './PermissionsService/PermissionsService';

function TextChannelListItem({ toggleEditTextChannelMenu, channelOverview, setSelectedChannelToMessage, userPermissionsCache }: { toggleEditTextChannelMenu: (channelOverview: ChannelOverviewDTO) => void, channelOverview: ChannelOverviewDTO | undefined, setSelectedChannelToMessage: (channelOverview: ChannelOverviewDTO) => void, userPermissionsCache: UserPermissionCache }) {
    const { selectedCaveTextChannelId } = useCave()

    const handleOnClickSettingsMenu = () => {
        if (channelOverview && permissionsService.canManageChannels(userPermissionsCache.cavePermissions)) {
            toggleEditTextChannelMenu(channelOverview)
        }
    }

    const handleOnClickChannel = () => {
        if (channelOverview) {
            setSelectedChannelToMessage(channelOverview)
        }
    }

    return (
        <div onClick={handleOnClickChannel} className={`${selectedCaveTextChannelId === channelOverview?.id ? "bg-secondary-300" : ""} group hover:cursor-pointer hover:bg-secondary-300 rounded-xl`}>
            <div className='p-2 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <TagIcon style={{ fontSize: '1.2rem' }} />
                    <h1>{channelOverview?.name}</h1>
                </div>
                {
                    permissionsService.canManageChannels(userPermissionsCache.cavePermissions) && (
                        <div className='group-hover:visible invisible'>
                            <IconButton onClick={handleOnClickSettingsMenu}>
                                <SettingsIcon style={{ fontSize: '1.2rem' }} className='text-secondary-100' />
                            </IconButton>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default TextChannelListItem