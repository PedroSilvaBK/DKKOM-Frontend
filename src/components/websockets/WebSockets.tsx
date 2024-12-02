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
 "user-joined-cave";

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

    const backendUrl = import.meta.env.VITE_BACKEND_WS_URL;

    useEffect(() => {
        let ws: WebSocket | null = null;

        const initializeWebSocket = async () => {
            try {
                const authToken = await wsAuthApi.getAuthToken();
                
                ws = new WebSocket(`${backendUrl}/ws/cave?token=${authToken}`);

                ws.onopen = () => {
                    console.log('Connected to WebSocket');
                };

                ws.onmessage = (event: MessageEvent) => {
                    const data = JSON.parse(event.data);
                    handleIncomingMessage(data);
                };

                ws.onerror = (error: Event) => {
                    console.error('WebSocket error:', error);
                };

                ws.onclose = () => {
                    console.log("Reconnecting to WebSocket in 5 seconds...");
                    setReconnecting(true);
                    reconnect();
                    console.log('Disconnected from WebSocket');
                };

                setSocket(ws);

                return () => {
                    if (ws) {
                        ws.close();
                    }
                };
            } catch (error) {
                console.error('Error initializing WebSocket:', error);
            }
        };

        initializeWebSocket();

        setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                console.log('Sending ping to WebSocket');
                ws.send(JSON.stringify({ type: 'ping' }));
            }
        }, 50000);

        const reconnect = () => {
            setTimeout(() => {
                initializeWebSocket();
                setReconnecting(false);
            }, 5000);
        }

        return () => {
            if (ws) {
                ws.close();
                console.log('WebSocket connection closed');
            }
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
        <WebSocketContext.Provider value={{ socket, sendMessage, chatMessages, 
        subscribe_channel, setChatMessages, selectCave,
         newPermissions, newPresence, reconnecting, newChannel,
          newCaveRole, roleAssignedToMember, userJoinedCave }}>
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