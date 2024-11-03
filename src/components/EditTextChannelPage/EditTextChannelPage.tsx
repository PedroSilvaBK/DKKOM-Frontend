import React from 'react'
import { useState } from 'react'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import GeneralSettings from '../EditVoiceChannelPage/GeneralSettings'
import Permissions from '../EditVoiceChannelPage/Permissions'
import { ChannelOverviewDTO } from '../../api/CaveServiceApi'

function EditTextChannelPage({ toogleEditTextChannel, selectedChannel }: { toogleEditTextChannel: (channelOverview: ChannelOverviewDTO | null) => void, selectedChannel: ChannelOverviewDTO | null }) {
    const [activeTab, setActiveTab] = useState<'general-settings' | 'permissions'>('general-settings');
  
    const changeTab = (tab: 'general-settings' | 'permissions') => {
      setActiveTab(tab);
    }

    const handleOnClickClose = () => {
        toogleEditTextChannel(null)
    }

    return (
        <div className='h-full w-full glass-morphism p-3 flex flex-col gap-3'>
            <div className='flex items-center'>
                <IconButton onClick={handleOnClickClose}>
                    <CloseIcon style={{ fontSize: '1.2rem', color: 'white' }} />
                </IconButton>
                <h1 className='text-secondary-100 font-bold text-center text-xl w-full'>Edit Text Channel</h1>
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
                    {activeTab === 'permissions' && <Permissions selectedChannel={selectedChannel} />}
                </div>
            </div>
        </div>
    )
}

export default EditTextChannelPage