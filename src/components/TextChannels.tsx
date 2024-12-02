import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditTextChannelPage from './EditTextChannelPage/EditTextChannelPage';
import TextChannelList from './TextChannelList';
import { ChannelOverviewDTO } from '../api/CaveServiceApi';
import { useCave } from './CaveProvider';
import permissionsService from './PermissionsService/PermissionsService';

function TextChannels(
    { channelsOverview, toggleCreateChannelMenuOpen }: { channelsOverview: ChannelOverviewDTO[] | undefined, toggleCreateChannelMenuOpen: () => void }
) {
    const [editTextChannelMenuOpen, setEditTextChannelMenuOpen] = useState<boolean>(false);
    const [selectedChannelToEdit, setSelectedChannelToEdit] = useState<ChannelOverviewDTO | null>(null);
    const [selectedChannelToMessage, setSelectedChannelToMessage] = useState<ChannelOverviewDTO | null>(null);

    const { setSelectedChannelId, selectedCaveBaseInfo } = useCave();

    useEffect(() => {
        if (selectedChannelToMessage) {
            setSelectedChannelId(selectedChannelToMessage.id)
        }
    }, [selectedChannelToMessage])

    const toggleEditTextChannelMenu = (channelOverview: ChannelOverviewDTO | null) => {
        if (selectedCaveBaseInfo && !permissionsService.canManageChannels(selectedCaveBaseInfo.userPermissionsCache.cavePermissions)) {
            return;
        }
        setSelectedChannelToEdit(channelOverview)
        setEditTextChannelMenuOpen(!editTextChannelMenuOpen)
    }

    return (
        <div>
            <div className='flex justify-between'>
                <div className='flex items-center gap-3 group hover:cursor-pointer'>
                    <ArrowForwardIosIcon style={{ fontSize: '1rem' }} className='rotate-90 group-hover:text-secondary-200' />
                    <h1 className='text-center group-hover:text-secondary-200'>Text Channel</h1>
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
                {
                    selectedCaveBaseInfo && (
                        <TextChannelList toggleEditTextChannelMenu={toggleEditTextChannelMenu}
                            channelsOverview={channelsOverview}
                            setSelectedChannelToMessage={setSelectedChannelToMessage}
                            userPermissionsCache={selectedCaveBaseInfo?.userPermissionsCache}
                        />
                    )
                }
            </div>
            {
                editTextChannelMenuOpen && (
                    <div className='absolute inset-0 h-screen w-screen grid place-items-center'>
                        <div className='h-[90vh] w-[55vw]'>
                            <EditTextChannelPage toogleEditTextChannel={toggleEditTextChannelMenu} selectedChannelToEdit={selectedChannelToEdit} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default TextChannels