import { ChannelOverviewDTO } from '../api/CaveServiceApi';
import { useCave } from './CaveProvider';
import { CavePermissions } from './PermissionsService/CavePermissions';
import permissionsService from './PermissionsService/PermissionsService';
import TextChannels from './TextChannels';
import VoiceChannels from './VoiceChannels';

function Channels(
    { textChannelsOverview, voiceChannelsOverview, toggleCreateChannelMenuOpen }: { textChannelsOverview: ChannelOverviewDTO[] | undefined, voiceChannelsOverview: ChannelOverviewDTO[] | undefined, toggleCreateChannelMenuOpen: () => void }
) {

    const { selectedCaveBaseInfo } = useCave();


    return (
        <div className='p-2 flex flex-col gap-6'>
            {
                selectedCaveBaseInfo?.userPermissionsCache.cavePermissions && permissionsService.checkCavePermission(selectedCaveBaseInfo?.userPermissionsCache.cavePermissions, CavePermissions.SEE_CHANNELS) && (
                    <>
                        <TextChannels channelsOverview={textChannelsOverview} toggleCreateChannelMenuOpen={toggleCreateChannelMenuOpen} />
                        <VoiceChannels channelsOverview={voiceChannelsOverview} toggleCreateChannelMenuOpen={toggleCreateChannelMenuOpen} />
                    </>
                )
            }
        </div>
    )
}

export default Channels