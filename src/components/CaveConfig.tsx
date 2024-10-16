import { IconButton } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import CaveConfigGeneral from './CaveConfigGeneral';
import CaveConfigRoles from './CaveConfigRoles';

function CaveConfig({ toggleCaveConfigMenuOpen }: { toggleCaveConfigMenuOpen: () => void }) {
    const [selectedMenu, setSelectedMenu] = React.useState<string>('General')

    return (
        <div
            className='absolute z-30 h-screen w-screen inset-0 grid place-items-center'>
            <div className='absolute bg-black opacity-30 h-full w-full' />
            <div className='z-40 glass-morphism w-[80%] h-[80%]'>
                <div className="p-2 w-full h-full flex flex-col">
                    <div className='flex justify-between items-center'>
                        <h1 className='text-lg font-bold'>Cave Configuration</h1>
                        <IconButton onClick={toggleCaveConfigMenuOpen}>
                            <CloseIcon className='text-secondary-100' />
                        </IconButton>
                    </div>
                    <div className='flex gap-2 w-full h-full'>
                        <div className='flex flex-col gap-3 items-center h-full w-[10rem] bg-primary-200 rounded-lg p-3'>
                            <div className='hover:bg-secondary-300 transition ease-all w-full rounded-xl p-2 text-center hover:cursor-pointer'
                                onClick={() => setSelectedMenu('General')}                            
                            >
                                <h1>General</h1>
                            </div>
                            <div className='hover:bg-secondary-300 transition ease-all w-full rounded-xl p-2 text-center hover:cursor-pointer'
                                onClick={() => setSelectedMenu('Roles')}
                            >
                                <h1>Roles</h1>
                            </div>
                        </div>
                        <div className='w-full h-full bg-primary-200 rounded-lg p-3'>
                            {
                                selectedMenu === 'General' && <CaveConfigGeneral />
                            }
                            {
                                selectedMenu === 'Roles' && <CaveConfigRoles />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaveConfig