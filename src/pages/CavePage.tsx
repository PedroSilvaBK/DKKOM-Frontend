import { useEffect } from 'react';
import MainPanel from '../components/MainPanel';
import MessagePanel from '../components/MessagePanel';
import UserPanel from '../components/UserPanel';
import caveServiceApi, { CaveBootStrapInformation } from '../api/CaveServiceApi';
import { useCave } from '../components/CaveProvider';
import permissionsService from '../components/PermissionsService/PermissionsService';
import { CavePermissions } from '../components/PermissionsService/CavePermissions';
import { ChannelPermissions } from '../components/PermissionsService/ChannelPermissions';
import { useWebSocket } from '../components/websockets/WebSockets';


function CavePage({ selectedCaveId }: { selectedCaveId: string }) {
    const { setSelectedChannelId, setSelectedCaveBaseInfo, selectedCaveBaseInfo } = useCave();
    const { selectCave, reconnecting, socket } = useWebSocket();

    useEffect(() => {
        if (selectedCaveId && socket) {
            console.log("called useeffect in cavepage");
            const fetchCaveInfo = async () => {
                try {
                    const caveInfo = await getCaveBootstrapInfo(selectedCaveId);
                    selectCave(caveInfo);
                } catch (error) {
                    console.error("Error fetching cave info:", error);
                }
            };
        
            if (selectedCaveId) {
                console.log("Fetching cave info");
                fetchCaveInfo();
            }
        }
    }, [selectedCaveId, socket])

    useEffect(() => {
        const handleReconnection = async () => {
            try {
                if (reconnecting) {
                    if (selectedCaveBaseInfo) {
                        setFirstVisibleChannel(selectedCaveBaseInfo);
                    } else if (selectedCaveId) {
                        await getCaveBootstrapInfo(selectedCaveId);
                    }
                }
            } catch (error) {
                console.error("Error during reconnection:", error);
            }
        };
    
        handleReconnection();
    }, [selectedCaveBaseInfo, reconnecting, selectedCaveId]);


    const getCaveBootstrapInfo = async (selectedCave: string) => {
        console.log("getCaveBootstrapInfo");
        try {
            const response = await caveServiceApi.getCaveBootStrapInformation(selectedCave);
            setFirstVisibleChannel(response);
            setSelectedCaveBaseInfo(response);
            return response; // Return the response
        } catch (error) {
            console.error(error);
            throw error; // Re-throw the error to handle it elsewhere if needed
        }
    };
    

    const setFirstVisibleChannel = (caveBaseInfo: CaveBootStrapInformation) => {
        console.log(caveBaseInfo);
        caveBaseInfo.textChannelsOverview.forEach((channel) => {
            if (permissionsService.processChannelPermissionCheck(
                caveBaseInfo.userPermissionsCache.cavePermissions,
                caveBaseInfo.userPermissionsCache?.channelPermissionsCacheHashMap === null ? 0 : caveBaseInfo.userPermissionsCache?.channelPermissionsCacheHashMap[channel.id]?.allow,
                caveBaseInfo.userPermissionsCache?.channelPermissionsCacheHashMap === null ? 0 : caveBaseInfo.userPermissionsCache?.channelPermissionsCacheHashMap[channel.id]?.deny,
                CavePermissions.SEE_CHANNELS,
                ChannelPermissions.SEE_CHANNEL
            )
            ) {
                setSelectedChannelId(channel.id);
                return;
            }
        })
    }

    return (
        <div className='h-screen w-full grid grid-cols-[0.5fr,2fr,0.5fr]'>
            {
                selectedCaveBaseInfo && (
                    <>
                        <MainPanel />
                        <MessagePanel />
                        <UserPanel />
                    </>
                )
            }
        </div>
    )
}

export default CavePage