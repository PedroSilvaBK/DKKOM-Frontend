import React from 'react'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function CaveMenu({ toggleCreateInviteMenuOpen, toggleCreateChannelMenuOpen,  toggleCaveConfigMenuOpen}: { toggleCreateInviteMenuOpen: () => void, toggleCreateChannelMenuOpen: () => void, toggleCaveConfigMenuOpen: () => void }) {
  return (
    <div className='h-full w-full glass-morphism p-1 gap-4'>
      <div className='bg-primary-200 rounded-xl p-1 flex flex-col gap-4'>
        <div className='flex items-center hover:bg-secondary-300 hover:cursor-pointer p-1 rounded-xl' onClick={toggleCreateInviteMenuOpen}>
          <h1 className='text-secondary-100 text-center text-lg w-full'>Invite People</h1>
          <GroupAddIcon />
        </div>
        <div className='flex items-center hover:bg-secondary-300 hover:cursor-pointer p-1 rounded-xl' onClick={toggleCaveConfigMenuOpen}>
          <h1 className='text-secondary-100 text-center text-lg w-full'>Cave config</h1>
          <SettingsIcon />
        </div>
        <div className='flex items-center hover:bg-secondary-300 hover:cursor-pointer p-1 rounded-xl' onClick={toggleCreateChannelMenuOpen}>
          <h1 className='text-secondary-100 text-center text-lg w-full'>Create channel</h1>
          <AddCircleIcon />
        </div>
      </div>
    </div>
  )
}

export default CaveMenu