import { ChannelOverviewDTO } from '../api/CaveServiceApi';
import TextChannels from './TextChannels';
import VoiceChannels from './VoiceChannels';

function Channels(
    { textChannelsOverview, voiceChannelsOverview, toggleCreateChannelMenuOpen }: { textChannelsOverview: ChannelOverviewDTO[] | undefined, voiceChannelsOverview: ChannelOverviewDTO[] | undefined, toggleCreateChannelMenuOpen: () => void }
) {
    return (
        <div className='p-2 flex flex-col gap-6'>
            <TextChannels channelsOverview={textChannelsOverview} toggleCreateChannelMenuOpen={toggleCreateChannelMenuOpen} />
            <VoiceChannels channelsOverview={voiceChannelsOverview} toggleCreateChannelMenuOpen={toggleCreateChannelMenuOpen} />
        </div>
    )
}

export default Channels