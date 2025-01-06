import VoiceChannelListItem from './VoiceChannelListItem'
import { ChannelOverviewDTO, VoiceChannelOverviewDTO } from '../api/CaveServiceApi'
import { useCave } from './CaveProvider';
import permissionsService from './PermissionsService/PermissionsService';
import { CavePermissions } from './PermissionsService/CavePermissions';
import { ChannelPermissions } from './PermissionsService/ChannelPermissions';
import { useEffect, useState } from 'react';
import { useWebSocket } from './websockets/WebSockets';
import { useWebRTC } from './webrtc/WebRTC';
import { useAuth } from './AuthProvider';

type UserInChannel = {
  username: string;
  id: string;
}

function VoiceChannelList({ toggleEditVoiceChannelMenu, channelsOverview }: { toggleEditVoiceChannelMenu: (channelOverview: ChannelOverviewDTO) => void, channelsOverview: ChannelOverviewDTO[] | undefined }) {
  const { selectedCaveBaseInfo } = useCave();
  const {user} = useAuth();

  const { newUserJoinedVoiceChannel, userLeftVoiceChannel, isVoiceConnected } = useWebSocket();
  const {currentChannelId } = useWebRTC();

  const [usersPerChannel, setUsersPerChannel] = useState<Map<string, UserInChannel[]>>(new Map());

  useEffect(() => {
    // iniialize users per channel
    if (channelsOverview && channelsOverview.length > 0) {
      const initialUsersPerChannel = new Map<string, UserInChannel[]>();
      channelsOverview.forEach((channelOverview) => {
        if ((channelOverview as VoiceChannelOverviewDTO).connectedUsers) {
          initialUsersPerChannel.set(
            channelOverview.id,
            (channelOverview as VoiceChannelOverviewDTO).connectedUsers
          );
        } else {
          initialUsersPerChannel.set(channelOverview.id, []);
        }
      });
      console.log(initialUsersPerChannel);
      setUsersPerChannel(initialUsersPerChannel);
    }
  }, [channelsOverview]);
  
  useEffect(() => {
    if (newUserJoinedVoiceChannel) {
      setUsersPerChannel((prev) => {
        const newUsersInChannel = new Map(prev);
        const users = newUsersInChannel.get(newUserJoinedVoiceChannel.room_id) || [];
        users.push({
          username: newUserJoinedVoiceChannel.username,
          id: newUserJoinedVoiceChannel.user_id,
        });
        newUsersInChannel.set(newUserJoinedVoiceChannel.room_id, users);
        return newUsersInChannel;
      });
    }
  }, [newUserJoinedVoiceChannel]);


  useEffect(() => {
    if (userLeftVoiceChannel) {
      removeUserFromChannelView(userLeftVoiceChannel.room_id, userLeftVoiceChannel.user_id);
    }
  }, [userLeftVoiceChannel]);

  useEffect(() => {
    if (!isVoiceConnected && currentChannelId && user) {
      removeUserFromChannelView(currentChannelId, user.id);
    }
  }, [isVoiceConnected]);

  const removeUserFromChannelView = (channelId: string, userId: string) => {
    setUsersPerChannel((prev) => {
      const newUsersInChannel = new Map(prev);
      const users = newUsersInChannel.get(channelId) || [];
      const index = users.findIndex((user) => user.id === userId);
      if (index > -1) {
        users.splice(index, 1);
      }
      newUsersInChannel.set(channelId, users);
      return newUsersInChannel;
    });
  }

  const canSeeChannelCheck = (channelId: string): boolean => {
    const userPermissionsCache = selectedCaveBaseInfo?.userPermissionsCache;
    if (!userPermissionsCache || !userPermissionsCache.channelPermissionsCacheHashMap) return false;

    const channelPermission = userPermissionsCache.channelPermissionsCacheHashMap[channelId];

    if (channelPermission) {

      return permissionsService.processChannelPermissionCheck(
        userPermissionsCache.cavePermissions,
        channelPermission.allow,
        channelPermission.deny,
        CavePermissions.SEE_CHANNELS,
        ChannelPermissions.SEE_CHANNEL
      );
    } else {
      return permissionsService.checkCavePermission(userPermissionsCache.cavePermissions, CavePermissions.SEE_CHANNELS);
    }
  };

  return (
    <div>
      {
        channelsOverview && channelsOverview.map((channelOverview, index) => (
          canSeeChannelCheck(channelOverview.id) && selectedCaveBaseInfo && <VoiceChannelListItem key={index} toggleEditVoiceChannelMenu={toggleEditVoiceChannelMenu} channelOverview={channelOverview} userPermissionsCache={selectedCaveBaseInfo.userPermissionsCache} usersInChannel={usersPerChannel.get(channelOverview.id)} />
        ))
      }
    </div>
  )
}

export type { UserInChannel }

export default VoiceChannelList