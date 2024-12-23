import { UserInChannel } from './VoiceChannelList';
import {v4 as uuid} from 'uuid';

function VoiceChannelConnectedUsersList({usersInChannel, handleRightClickUser}: {usersInChannel: UserInChannel[] | undefined, handleRightClickUser: (e: any, userId: string) => void}) {
    return (
        <div className='flex flex-col gap-1'>
            {usersInChannel && usersInChannel.map((user) => {
                return <p onContextMenu={(e) => handleRightClickUser(e, user.id)} className='text-sm hover:bg-secondary-300 hover:cursor-pointer rounded-xl p-1' key={uuid()}>{user.username}</p>;
            })}
        </div>
    )
}

export default VoiceChannelConnectedUsersList