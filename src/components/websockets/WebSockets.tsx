import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import wsAuthApi from "../../api/authWebSocketApi";
import { Message } from "../../api/MessageServiceApi";
import { CaveBootStrapInformation, CaveRoleOverview, UserPermissionCache, UserPresence } from "../../api/CaveServiceApi";
import { CreateChannelResponse } from "../../api/ChannelService";

type MessageType = "chat-message" | "update-user-permissions" |
    "update-user-presence" |
    "update-channel-list" |
    "cave-role-created" |
    "role-assigned-to-member" |
    "user-joined-cave" |
    "user-joined-voice-channel" |
    "user-disconnect-voice-channel" |
    "webrtc-offer" |
    "webrtc-answer";

type WebSocketContextType = {
    socket: WebSocket | null;
    sendMessage: (message: any) => void;
    chatMessages: any[];
    subscribe_channel: (channelId: string) => void;
    setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    selectCave: (caveInformation: CaveBootStrapInformation) => void;
    newPermissions: UserPermissionCache | null;
    newPresence: UserPresence | null;
    reconnecting: boolean;
    newChannel: CreateChannelResponse | null;
    newCaveRole: CaveRoleCreated | null;
    roleAssignedToMember: RoleAssignedToMember | null;
    userJoinedCave: UserJoinedCave | null;
    answer: RTCSessionDescriptionInit | null;
    offer: any | null;
    newUserJoinedVoiceChannel: UserJoinedVoiceChannel | null;
    userLeftVoiceChannel: UserJoinedVoiceChannel | null;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

type WebSocketProviderProps = {
    children: ReactNode;
};

type CaveRoleCreated = {
    id: string;
    caveId: string;
    name: string;
    position: number;
}

type RoleAssignedToMember = {
    caveId: string;
    userId: string;
    caveRoleOverviews: CaveRoleOverview[];
}

type UserJoinedCave = {
    userId: string;
    memberId: string;
    username: string;
}

type UserJoinedVoiceChannel = {
    userId: string;
    roomId: string;
    username: string;
}


export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    // const [notifications, setNotifications] = useState<any[]>([]);
    // const [typingStatus, setTypingStatus] = useState<{ [userId: string]: boolean }>({});

    const [newPermissions, setNewPermissions] = useState<UserPermissionCache | null>(null);
    const [newPresence, setNewPresence] = useState<UserPresence | null>(null);
    const [reconnecting, setReconnecting] = useState<boolean>(false);
    const [newChannel, setNewChannel] = useState<CreateChannelResponse | null>(null);
    const [newCaveRole, setCaveNewRole] = useState<CaveRoleCreated | null>(null);
    const [roleAssignedToMember, setRoleAssignedToMember] = useState<RoleAssignedToMember | null>(null);
    const [userJoinedCave, setUserJoinedCave] = useState<UserJoinedCave | null>(null);
    const [newUserJoinedVoiceChannel, setNewUserJoinedVoiceChannel] = useState<any | null>(null);
    const [userLeftVoiceChannel, setUserLeftVoiceChannel] = useState<UserJoinedVoiceChannel | null>(null);

    const [answer, setAnswer] = useState<RTCSessionDescriptionInit | null>(null);
    const [offer, setOffer] = useState<any | null>(null);

    const backendUrl = import.meta.env.VITE_BACKEND_WS_URL;

    useEffect(() => {
        let ws: WebSocket | null = null;
        let reconnectInterval: ReturnType<typeof setInterval> | null = null;

        const initializeWebSocket = async () => {
            try {
                const authToken = await wsAuthApi.getAuthToken();

                ws = new WebSocket(`${backendUrl}/ws/cave?token=${authToken}`);

                ws.onopen = () => {
                    console.log('Connected to WebSocket');
                    setReconnecting(false);

                    // Clear the reconnect interval if connected
                    if (reconnectInterval) {
                        clearInterval(reconnectInterval);
                        reconnectInterval = null;
                    }
                };

                ws.onmessage = (event: MessageEvent) => {
                    const data = JSON.parse(event.data);
                    handleIncomingMessage(data);
                };

                ws.onerror = (error: Event) => {
                    console.error('WebSocket error:', error);
                };

                ws.onclose = () => {
                    console.log('Disconnected from WebSocket. Reconnecting...');
                    setReconnecting(true);
                    if (!reconnectInterval) {
                        startReconnect();
                    }
                };

                setSocket(ws);
            } catch (error) {
                console.error('Error initializing WebSocket:', error);
                if (!reconnectInterval) {
                    startReconnect();
                }
            }
        };

        const startReconnect = () => {
            reconnectInterval = setInterval(() => {
                console.log('Attempting to reconnect to WebSocket...');
                initializeWebSocket();
            }, 5000);
        };

        const sendPing = () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                console.log('Sending ping to WebSocket');
                ws.send(JSON.stringify({ type: 'ping' }));
            }
        };

        // Initialize WebSocket connection
        initializeWebSocket();

        // Ping the WebSocket periodically
        const pingInterval = setInterval(sendPing, 50000);

        return () => {
            if (ws) {
                ws.close();
                console.log('WebSocket connection closed');
            }

            if (reconnectInterval) {
                clearInterval(reconnectInterval);
            }

            clearInterval(pingInterval);
        };
    }, []);


    const subscribe_channel = (channelId: string) => {
        sendMessage({ type: 'subscribe_channel', properties: { channelId: channelId } });
    }

    // Function to handle messages by type
    const handleIncomingMessage = (data: any) => {
        switch (data.type as MessageType) {
            case 'chat-message':
                console.log('Received chat message:', data.data);
                setChatMessages(prevMessages => [...prevMessages, data.data]);
                break;
            case 'update-user-permissions':
                console.log('Received updated permissions:', data.data);
                setNewPermissions(data.data);
                break;
            case 'update-user-presence':
                setNewPresence(data.data);
                break;
            case 'update-channel-list':
                setNewChannel(data.data);
                console.log('Received updated channel list:', data.data);
                break;
            case 'cave-role-created':
                setCaveNewRole(data.data);
                console.log('Cave role created:', data.data);
                break
            case 'role-assigned-to-member':
                setRoleAssignedToMember(data.data);
                console.log('Role assigned to member:', data.data);
                break;
            case 'user-joined-cave':
                setUserJoinedCave(data.data);
                console.log('User joined cave:', data.data);
                break;
            case 'user-joined-voice-channel':
                console.log('User joined voice channel:', data.data);
                setNewUserJoinedVoiceChannel(data.data);
                break;
            case 'user-disconnect-voice-channel':
                console.log('User disconnect voice channel:', data.data);
                setUserLeftVoiceChannel(data.data);
                break;
            case 'webrtc-answer':
                setAnswer(data.data);
                break;
            case 'webrtc-offer':
                setOffer(data.data);
                break;
            default:
                console.warn('Unknown message type:', data.type);
                console.warn('Unknown message:', data);
        }
    };

    const sendMessage = (message: any) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.log('WebSocket is not open');
        }
    };

    const selectCave = (caveInformation: CaveBootStrapInformation) => {
        if (socket) {
            console.log('Selecting cave:', caveInformation.caveId);
            socket.send(JSON.stringify({
                type: 'select_cave', properties: {
                    caveId: caveInformation.caveId,
                    userCaveRoleIds: caveInformation.userPermissionsCache.userRoles,
                    channelsWithOverriddenPermissions: Object.keys(caveInformation.userPermissionsCache.channelPermissionsCacheHashMap),
                }
            }));
        }
    }

    return (
        <WebSocketContext.Provider value={{
            socket, sendMessage, chatMessages,
            subscribe_channel, setChatMessages, selectCave,
            newPermissions, newPresence, reconnecting, newChannel,
            newCaveRole, roleAssignedToMember, userJoinedCave, 
            answer, offer, newUserJoinedVoiceChannel, userLeftVoiceChannel
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};