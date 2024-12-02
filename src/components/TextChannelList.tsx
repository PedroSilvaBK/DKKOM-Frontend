import TextChannelListItem from './TextChannelListItem'
import { ChannelOverviewDTO, UserPermissionCache } from '../api/CaveServiceApi';
import permissionsService from './PermissionsService/PermissionsService';
import { CavePermissions } from './PermissionsService/CavePermissions';
import { ChannelPermissions } from './PermissionsService/ChannelPermissions';


function TextChannelList({toggleEditTextChannelMenu, channelsOverview, setSelectedChannelToMessage, userPermissionsCache}: {toggleEditTextChannelMenu: (channelOverview: ChannelOverviewDTO) => void, channelsOverview: ChannelOverviewDTO[] | undefined, setSelectedChannelToMessage: (channelOverview: ChannelOverviewDTO) => void, userPermissionsCache: UserPermissionCache}) {
  

  const canSeeChannelCheck = (channelId: string): boolean => {
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
          canSeeChannelCheck(channelOverview.id) &&
          <TextChannelListItem key={index} toggleEditTextChannelMenu={toggleEditTextChannelMenu}
           channelOverview={channelOverview} 
           setSelectedChannelToMessage={setSelectedChannelToMessage}
           userPermissionsCache={userPermissionsCache}
           />
        ))
      }
    </div>
  )
}

export default TextChannelList