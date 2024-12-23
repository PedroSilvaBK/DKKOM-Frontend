import { useEffect, useRef } from 'react'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { UserPermissionCache } from '../api/CaveServiceApi';
import permissionsService from './PermissionsService/PermissionsService';

function CaveMenu({ toggleCreateInviteMenuOpen, toggleCreateChannelMenuOpen,  toggleCaveConfigMenuOpen, toggleCaveMenuOpen, userPermissions}: { toggleCreateInviteMenuOpen: () => void, toggleCreateChannelMenuOpen: () => void, toggleCaveConfigMenuOpen: () => void, toggleCaveMenuOpen: () => void, userPermissions: UserPermissionCache }) {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      toggleCaveMenuOpen();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className='h-full w-full glass-morphism p-1 gap-4'>
      <div className='bg-primary-200 rounded-xl p-1 flex flex-col gap-4'>
        {
          userPermissions && (permissionsService.canCreateInvite(userPermissions.cavePermissions) || permissionsService.isAdmin(userPermissions.cavePermissions)) && (
            <div className='flex items-center hover:bg-secondary-300 hover:cursor-pointer p-1 rounded-xl' onClick={toggleCreateInviteMenuOpen}>
              <h1 className='text-secondary-100 text-center text-lg w-full'>Invite users</h1>
              <GroupAddIcon />
            </div>
          )
        }
        {
          userPermissions && (permissionsService.canManageChannels(userPermissions.cavePermissions) || permissionsService.isAdmin(userPermissions.cavePermissions))  && (
            <div className='flex items-center hover:bg-secondary-300 hover:cursor-pointer p-1 rounded-xl' onClick={toggleCreateChannelMenuOpen}>
              <h1 className='text-secondary-100 text-center text-lg w-full'>Create channel</h1>
              <AddCircleIcon />
            </div>
          )
        }
        {
          userPermissions && permissionsService.isAdmin(userPermissions.cavePermissions) && (
            <div className='flex items-center hover:bg-secondary-300 hover:cursor-pointer p-1 rounded-xl' onClick={toggleCaveConfigMenuOpen}>
              <h1 className='text-secondary-100 text-center text-lg w-full'>Cave config</h1>
              <SettingsIcon />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default CaveMenu