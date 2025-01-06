import { useState } from 'react';
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';
import { ChannelOverviewDTO, UserPermissionCache } from '../api/CaveServiceApi';
import permissionsService from './PermissionsService/PermissionsService';
import { useWebRTC } from './webrtc/WebRTC';
import { UserInChannel } from './VoiceChannelList';
import UserVoiceChatSettingsMenu from './UserVoiceChatSettingsMenu';
import { useAuth } from './AuthProvider';
import VoiceChannelConnectedUsersList from './VoiceChannelConnectedUsersList';
import { useWebSocket } from './websockets/WebSockets';

function VoiceChannelListItem({ toggleEditVoiceChannelMenu, channelOverview, userPermissionsCache, usersInChannel }: { toggleEditVoiceChannelMenu: (channelOverview: ChannelOverviewDTO) => void, channelOverview: ChannelOverviewDTO, userPermissionsCache: UserPermissionCache, usersInChannel: UserInChannel[] | undefined }) {
    const handleOnClick = () => {
        if (channelOverview && permissionsService.canManageChannels(userPermissionsCache.cavePermissions)) {
            toggleEditVoiceChannelMenu(channelOverview);
        }
    };

    const { connectVoiceChannel, remoteStreams } = useWebRTC();
    const {isVoiceConnected} = useWebSocket();
    const [volumeLevels, _] = useState<Map<string, number>>(new Map());
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const {user} = useAuth();

    const connect = () => {
        if (channelOverview.id && !isVoiceConnected) {
            connectVoiceChannel(channelOverview.id);
        }
    };

    const handleRightClickUser = (e: any, userId: string) => {
        e.preventDefault();
        const viewportWidth = window.innerWidth;

        let top = e.clientY;
        let left = e.clientX;

        const menuWidth = 160;

        if (left + menuWidth > viewportWidth) {
            left = left - menuWidth;
        }

        setSelectedUserId(userId);
        setMenuPosition({ top, left });
    }

    const closeUserVoiceChatSettingsMenu = () => {
        setMenuPosition({ top: 0, left: 0 });
    }

    return (
        <div>
            <div className='p-2 flex items-center justify-between group hover:cursor-pointer hover:bg-secondary-300 rounded-xl' onClick={connect}>
                <div className='flex items-center gap-2'>
                    <SpatialAudioOffIcon style={{ fontSize: '1.2rem' }} />
                    <h1>{channelOverview.name}</h1>
                </div>
                {permissionsService.canManageChannels(userPermissionsCache.cavePermissions) && (
                    <div className='group-hover:visible invisible z-10'>
                        <IconButton onClick={(e) => {
                            e.stopPropagation();
                            handleOnClick();
                        }}>
                            <SettingsIcon style={{ fontSize: '1.2rem' }} className='text-secondary-100' />
                        </IconButton>
                    </div>
                )}
            </div>
            <div className='ml-3'>
                <VoiceChannelConnectedUsersList usersInChannel={usersInChannel} handleRightClickUser={handleRightClickUser} />
            </div>
            <div className='absolute' style={{
                top: menuPosition.top,
                left: menuPosition.left,
                display: menuPosition.top === 0 && menuPosition.left === 0 ? 'none' : 'block'
            }}>
                {
                    selectedUserId && user && selectedUserId !== user.id && <UserVoiceChatSettingsMenu closeUserVoiceChatSettingsMenu={closeUserVoiceChatSettingsMenu} userId={selectedUserId} />
                }
            </div>
            <div>
                {Array.from(remoteStreams.entries()).map(([streamId, stream]) => (
                    <div key={streamId} style={{ marginBottom: '10px' }}>
                        <audio
                            autoPlay
                            playsInline
                            style={{ border: '1px solid black', marginTop: '10px', width: '100%' }}
                            ref={(audio) => {
                                if (audio) {
                                    audio.srcObject = stream;
                                    audio.volume = volumeLevels.get(streamId) || 1; // Set the volume (default: 1)
                                }
                            }}
                        ></audio>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VoiceChannelListItem;
