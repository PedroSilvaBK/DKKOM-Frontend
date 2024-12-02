import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import GeneralSettings from '../components/EditVoiceChannelPage/GeneralSettings';
import { useState } from 'react';
import Permissions from '../components/EditVoiceChannelPage/Permissions';
import { ChannelOverviewDTO } from '../api/CaveServiceApi';

function EditVoiceChannelPage({ toogleEditVoiceChannel, selectedChannel }: { toogleEditVoiceChannel: (channelOverview: ChannelOverviewDTO | null)  => void, selectedChannel: ChannelOverviewDTO | null }) {
  const [activeTab, setActiveTab] = useState<'general-settings' | 'permissions'>('general-settings');
  
  const changeTab = (tab: 'general-settings' | 'permissions') => {
    setActiveTab(tab);
  }

  const handleOnClickClose = () => {
    toogleEditVoiceChannel(null)
}

  return (
    <div className='h-full w-full glass-morphism p-3 flex flex-col gap-3'>
      <div className='flex items-center'>
        <IconButton onClick={handleOnClickClose}>
          <CloseIcon style={{ fontSize: '1.2rem', color: 'white' }} />
        </IconButton>
        <h1 className='text-secondary-100 font-bold text-center text-xl w-full'>Edit Voice Channel</h1>
      </div>
      <div className='flex gap-4 h-full'>
        <div className='bg-primary-200 rounded-xl w-[15rem] p-2 flex flex-col gap-2'>
          <div onClick={
            () => changeTab('general-settings')
          }>
            <h1 className='text-secondary-100 text-center font-semibold hover:bg-secondary-300 hover:cursor-pointer rounded-xl p-1'>General Settings</h1>
          </div>
          <div 
            onClick={
              () => changeTab('permissions')
            }          
          >
            <h1 className='text-secondary-100 text-center font-semibold hover:bg-secondary-300 hover:cursor-pointer rounded-xl p-1'>Permissions</h1>
          </div>
        </div>
        <div className='bg-primary-200 rounded-xl h-full w-full p-3'>
          {activeTab === 'general-settings' && <GeneralSettings />}
          {activeTab === 'permissions' && <Permissions selectedChannelToEdit={selectedChannel}/>}
        </div>
      </div>
    </div>
  )
}

export default EditVoiceChannelPage