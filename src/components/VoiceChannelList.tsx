import VoiceChannelListItem from './VoiceChannelListItem'
import { ChannelOverviewDTO } from '../api/CaveServiceApi'
import { useCave } from './CaveProvider';
import permissionsService from './PermissionsService/PermissionsService';
import { CavePermissions } from './PermissionsService/CavePermissions';
import { ChannelPermissions } from './PermissionsService/ChannelPermissions';

function VoiceChannelList({ toggleEditVoiceChannelMenu, channelsOverview }: { toggleEditVoiceChannelMenu: (channelOverview: ChannelOverviewDTO) => void, channelsOverview: ChannelOverviewDTO[] | undefined }) {
  const { selectedCaveBaseInfo } = useCave();

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
          canSeeChannelCheck(channelOverview.id) && selectedCaveBaseInfo && <VoiceChannelListItem key={index} toggleEditVoiceChannelMenu={toggleEditVoiceChannelMenu} channelOverview={channelOverview} userPermissionsCache={selectedCaveBaseInfo.userPermissionsCache} />
        ))
      }
    </div>
  )
}

export default VoiceChannelList