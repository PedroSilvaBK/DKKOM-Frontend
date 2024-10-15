import { IconButton } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function CaveCreateChannelMenu({ toggleCreateChannelMenuOpen }: { toggleCreateChannelMenuOpen: () => void }) {
    const [channelType, setChannelType] = React.useState<string>('');

    const handleChannelTypeChange = (type: string) => {
        setChannelType(type);
    }

    return (
        <div>
            <div
                className='absolute z-30 h-screen w-screen inset-0 grid place-items-center'>
                <div className='absolute bg-black opacity-30 h-full w-full' />
                <div className='z-40 glass-morphism p-3 w-[30rem]'>
                    <div className="p-3 bg-primary-200 rounded-lg flex flex-col gap-4">
                        <div className='flex items-center justify-between'>
                            <h1 className='text-secondary-100 font-semibold'>Create a channel</h1>
                            <IconButton onClick={toggleCreateChannelMenuOpen}>
                                <CloseIcon className='text-secondary-100' />
                            </IconButton>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <div>
                                <h2 className='text-secondary-200 font-semibold'>CHANNEL TYPE</h2>
                                <div className='flex flex-col gap-3'>
                                    <div>
                                        <input
                                            type="radio" id="text-channel" name="channel-type" className="hidden peer" />
                                        <label htmlFor="text-channel"
                                        onClick={() => handleChannelTypeChange('text-channel')} 
                                        className="flex justify-between p-3 items-center rounded-lg cursor-pointer bg-primary-100 peer-checked:bg-secondary-300 transition ease-all">
                                            <h1>Text-Channel</h1>
                                            {
                                                channelType === 'text-channel' ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />
                                            }
                                        </label>
                                    </div>

                                    <div>
                                        <input
                                            type="radio" id="voice-channel" name="channel-type" className="hidden peer" />
                                        <label htmlFor="voice-channel"
                                        onClick={() => handleChannelTypeChange('voice-channel')}
                                        className="flex justify-between p-3 items-center rounded-lg cursor-pointer bg-primary-100 peer-checked:bg-secondary-300 transition ease-all">
                                            <h1>Voice-Channel</h1>
                                            {
                                                channelType === 'voice-channel' ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />
                                            }
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className='text-secondary-100 font-semibold'>CHANNEL NAME</h2>
                                <input type="text" placeholder='Enter channel name' className='w-full p-2 bg-primary-300 rounded-lg' />
                            </div>
                            <div>
                                <button className='w-full bg-primary-100 hover:bg-secondary-300 transition ease-all text-secondary-100 p-2 rounded-lg'>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaveCreateChannelMenu