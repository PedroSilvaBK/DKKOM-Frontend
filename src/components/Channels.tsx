import TextChannels from './TextChannels';
import VoiceChannels from './VoiceChannels';

function Channels() {
    return (
        <div className='p-2 flex flex-col gap-6'>
            <TextChannels />
            <VoiceChannels />
        </div>
    )
}

export default Channels