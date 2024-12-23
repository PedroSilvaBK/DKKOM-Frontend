import { IconButton } from '@mui/material';
import { motion } from 'framer-motion'
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsMenu_UserInfoTab from './SettingsMenu_UserInfoTab';
import { useAuth } from './AuthProvider';
import SettingsMenu_InputSettings from './SettingsMenu_InputSettings';

function SettingsMenu() {
    const [settingsMenu, setSettingsMenu] = useState<boolean>(false);
    const [activeMenu, setActiveMenu] = useState<string>('user-info');

    const { logout } = useAuth();

    type MenuOption = {
        id: string;
        name: string
    }

    const menuOptions: MenuOption[] = [{
        id: 'user-info',
        name: 'User Info',
    },
    {
        id: "input-settings",
        name: "Input Settings"
    }
    ];

    const menuVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
    };

    return (
        <>
            <div className='w-full'>
                <div className='bg-primary-200 w-full rounded-xl text-center p-2 hover:cursor-pointer group hover:bg-secondary-200 transition-all ease-all'>
                    <IconButton onClick={() => setSettingsMenu(!settingsMenu)}>
                        <SettingsIcon style={{ fontSize: '1.6rem' }} className='text-secondary-100 transition-all ease-all group-hover:text-primary-200' />
                    </IconButton>
                </div>
            </div>
            {settingsMenu && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={menuVariants}
                    className="absolute w-screen h-screen inset-0 grid place-items-center z-[100]"
                >
                    <div className="absolute bg-black opacity-30 h-full w-full z-[101]" />
                    <div className="z-[102] glass-morphism-login p-3 flex flex-col items-center gap-3 overflow h-[45rem] w-[60rem]">
                        <div className="w-full h-full">

                            <div className='flex text-secondary-100 gap-2 h-full'>
                                <div className='flex justify-between flex-col gap-3 items-center h-full w-[10rem] bg-primary-200 rounded-lg p-3'>
                                    <div>
                                        {
                                            menuOptions.map((menuOption) => (
                                                <div
                                                    key={menuOption.id}
                                                    className={`hover:bg-secondary-300 transition ease-all w-full rounded-xl p-2 text-center hover:cursor-pointer ${activeMenu === menuOption.id ? 'bg-secondary-300' : ''}`}
                                                    onClick={() => setActiveMenu(menuOption.id)}
                                                >
                                                    <h1>{menuOption.name}</h1>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div
                                        onClick={logout}
                                        className={`hover:bg-secondary-300 transition ease-all w-full rounded-xl p-2 text-center hover:cursor-pointer text-red-500 `}
                                    >
                                        <h1>Log Out</h1>
                                    </div>
                                </div>
                                <div className="w-full bg-primary-200 p-3 rounded-xl flex ">
                                    <div className='w-full'>
                                        {activeMenu === 'user-info' && (
                                            <SettingsMenu_UserInfoTab />
                                        )}
                                        {activeMenu === 'input-settings' && (
                                            <SettingsMenu_InputSettings />
                                        )}
                                    </div>
                                    <div>
                                        <IconButton onClick={() => setSettingsMenu(false)}>
                                            <CloseIcon style={{ fontSize: "1.5rem", color: "white" }} />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

        </>
    )
}

export default SettingsMenu