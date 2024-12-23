import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Channels from './Channels';
import { useEffect, useState } from 'react';
import CaveMenu from './CaveMenu';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion'
import CaveInviteMenu from './CaveInviteMenu';
import CaveCreateChannelMenu from './CaveCreateChannelMenu';
import CaveConfig from './CaveConfig';
import { ChannelOverviewDTO, CreateCaveInviteRequest } from '../api/CaveServiceApi';
import ChannelServiceApi, { ChannelType, CreateChannelRequest, CreateChannelResponse } from '../api/ChannelService';
import { useCave } from './CaveProvider';
import caveServiceApi from '../api/CaveServiceApi';
import { useWebSocket } from './websockets/WebSockets';
import permissionsService from './PermissionsService/PermissionsService';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useWebRTC } from './webrtc/WebRTC';
import { IconButton } from '@mui/material';

function MainPanel() {
    const [caveMenuOpen, setCaveMenuOpen] = useState<boolean>(false);
    const [createInviteMenuOpen, setCreateInviteMenuOpen] = useState<boolean>(false);
    const [createChannelMenuOpen, setCreateChannelMenuOpen] = useState<boolean>(false);
    const [caveConfigMenuOpen, setCaveConfigMenuOpen] = useState<boolean>(false);

    const { selectedCaveBaseInfo, setSelectedCaveBaseInfo } = useCave();
    const { newChannel } = useWebSocket();

    const { isVoiceConnected, disconnectVoiceChannel } = useWebRTC();

    useEffect(() => {
        if (newChannel) {
            updateChannelListAfterCreate(newChannel);
        }
    }, [newChannel])


    const toggleCaveMenuOpen = () => {
        if (selectedCaveBaseInfo && !permissionsService.isAdmin(selectedCaveBaseInfo.userPermissionsCache.cavePermissions)
            && !permissionsService.canManageChannels(selectedCaveBaseInfo.userPermissionsCache.cavePermissions)
            && !permissionsService.canCreateInvite(selectedCaveBaseInfo.userPermissionsCache.cavePermissions)
        ) {
            return;
        }

        setCaveMenuOpen(!caveMenuOpen);
    }


    const toggleCreateInviteMenuOpen = () => {
        if (selectedCaveBaseInfo && !permissionsService.canCreateInvite(selectedCaveBaseInfo.userPermissionsCache.cavePermissions) && !permissionsService.isAdmin(selectedCaveBaseInfo.userPermissionsCache.cavePermissions)) {
            return;
        }
        setCreateInviteMenuOpen(!createInviteMenuOpen);
    }

    const toggleCreateChannelMenuOpen = () => {
        if (selectedCaveBaseInfo && !permissionsService.canManageChannels(selectedCaveBaseInfo?.userPermissionsCache.cavePermissions) && !permissionsService.isAdmin(selectedCaveBaseInfo?.userPermissionsCache.cavePermissions)) {
            return;
        }
        setCreateChannelMenuOpen(!createChannelMenuOpen);
    }

    const toggleCaveConfigMenuOpen = () => {
        if (selectedCaveBaseInfo && !permissionsService.isAdmin(selectedCaveBaseInfo.userPermissionsCache.cavePermissions)) {
            return;
        }
        setCaveConfigMenuOpen(!caveConfigMenuOpen);
    }

    const updateChannelListAfterCreate = (createChannelResponse: CreateChannelResponse) => {
        if (selectedCaveBaseInfo?.textChannelsOverview.find((channel) => channel.id === createChannelResponse.id) || selectedCaveBaseInfo?.voiceChannelsOverview.find((channel) => channel.id === createChannelResponse.id)) {
            return;
        }

        if (createChannelResponse.type === ChannelType.TEXT_CHANNEL) {
            const channelDto: ChannelOverviewDTO = {
                id: createChannelResponse.id,
                name: createChannelResponse.name,
            }

            if (selectedCaveBaseInfo?.textChannelsOverview.includes(channelDto)) {
                return;
            }

            if (selectedCaveBaseInfo) {
                setSelectedCaveBaseInfo({
                    ...selectedCaveBaseInfo,
                    textChannelsOverview: [...(selectedCaveBaseInfo.textChannelsOverview || []), channelDto].sort((a, b) => {
                        return a.name.localeCompare(b.name);
                    }),
                });
            }
        }
        else {
            const channelDto: ChannelOverviewDTO = {
                id: createChannelResponse.id,
                name: createChannelResponse.name,
            }

            if (selectedCaveBaseInfo?.voiceChannelsOverview.includes(channelDto)) {
                return;
            }

            if (selectedCaveBaseInfo) {
                setSelectedCaveBaseInfo({
                    ...selectedCaveBaseInfo,
                    voiceChannelsOverview: [...(selectedCaveBaseInfo.voiceChannelsOverview || []), channelDto].sort((a, b) => {
                        return a.name.localeCompare(b.name);
                    }),
                });
            }
        }
    }

    const createChannel = (createChannelRequest: CreateChannelRequest) => {
        createChannelRequest.caveId = selectedCaveBaseInfo?.caveId as string;
        ChannelServiceApi.createChannel(createChannelRequest).then((response) => {
            updateChannelListAfterCreate(response);
        }).catch((error) => {
            console.error(error);
        })
    }

    const createInvite = async (createInviteRequest: CreateCaveInviteRequest): Promise<string> => {
        createInviteRequest.caveId = selectedCaveBaseInfo?.caveId as string;
        try {
            const response = await caveServiceApi.createCaveInvite(createInviteRequest);
            console.log(response);
            return response.id;
        } catch (error) {
            console.error(error);
            return '';
        }
    };

    return (
        <div className='bg-primary-200 rounded-l-xl overflow-y-scroll scrollbar-hide text-secondary-100 flex flex-col justify-between'>
            <div>
                <div className='sticky top-0 z-30 bg-primary-200'>
                    <div
                        onClick={toggleCaveMenuOpen}
                        className='flex items-center justify-between p-3 hover:bg-secondary-300 transition ease-all hover:cursor-pointer'>
                        <h1 className='font-bold'>{selectedCaveBaseInfo?.caveName}</h1>
                        {
                            caveMenuOpen ? <CloseIcon style={{ fontSize: '1rem' }} /> : <ArrowForwardIosIcon style={{ fontSize: '1rem' }} className='rotate-90' />
                        }
                    </div>
                    <motion.div
                        variants={{
                            open: { scale: 1 },
                            closed: { scale: 0 }
                        }}
                        initial='closed'
                        animate={caveMenuOpen ? 'open' : 'closed'}
                        transition={{ duration: 0.1 }}
                        className='absolute w-full z-30 p-2'>
                        {
                            caveMenuOpen && <CaveMenu
                                userPermissions={selectedCaveBaseInfo!.userPermissionsCache}
                                toggleCaveMenuOpen={toggleCaveMenuOpen}
                                toggleCreateInviteMenuOpen={toggleCreateInviteMenuOpen}
                                toggleCreateChannelMenuOpen={toggleCreateChannelMenuOpen}
                                toggleCaveConfigMenuOpen={toggleCaveConfigMenuOpen}
                            />
                        }
                    </motion.div>
                    <hr className='mb-3' />
                </div>
                <Channels textChannelsOverview={selectedCaveBaseInfo?.textChannelsOverview} voiceChannelsOverview={selectedCaveBaseInfo?.voiceChannelsOverview} toggleCreateChannelMenuOpen={toggleCreateChannelMenuOpen} />
            </div>
            {
                isVoiceConnected && (
                    <div className='p-1'>
                        <div className='flex items-center justify-between p-3 bg-primary-100 rounded-xl'>
                            <div>
                                <h1 className='font-bold p-1'>Connected</h1>
                            </div>
                            <div>
                                <IconButton onClick={disconnectVoiceChannel}>
                                    <CallEndIcon className='text-white' />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                createInviteMenuOpen && (
                    <motion.div
                        variants={{
                            open: { opacity: 1, display: 'initial' },
                            closed: { opacity: 0, display: 'none' }
                        }}
                        initial='closed'
                        animate={createInviteMenuOpen ? 'open' : 'closed'}
                        transition={{ duration: 0.1 }}
                    >
                        <CaveInviteMenu toggleCreateInviteMenuOpen={toggleCreateInviteMenuOpen} createInvite={createInvite} />
                    </motion.div>
                )
            }
            {
                createChannelMenuOpen && (
                    <motion.div
                        variants={{
                            open: { opacity: 1, display: 'initial' },
                            closed: { opacity: 0, display: 'none' }
                        }}
                        initial='closed'
                        animate={createChannelMenuOpen ? 'open' : 'closed'}
                        transition={{ duration: 0.1 }}
                    >
                        <CaveCreateChannelMenu toggleCreateChannelMenuOpen={toggleCreateChannelMenuOpen} createChannel={createChannel} />
                    </motion.div>
                )
            }
            {
                caveConfigMenuOpen && (
                    <motion.div
                        variants={{
                            open: { opacity: 1, display: 'initial' },
                            closed: { opacity: 0, display: 'none' }
                        }}
                        initial='closed'
                        animate={caveConfigMenuOpen ? 'open' : 'closed'}
                        transition={{ duration: 0.1 }}
                    >
                        <CaveConfig toggleCaveConfigMenuOpen={toggleCaveConfigMenuOpen} />
                    </motion.div>
                )
            }
        </div>
    )
}

export default MainPanel