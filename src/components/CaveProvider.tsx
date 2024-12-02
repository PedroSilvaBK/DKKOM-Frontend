import { createContext, useContext, useEffect, useState } from "react";
import { CaveBootStrapInformation } from "../api/CaveServiceApi";
import { useWebSocket } from "./websockets/WebSockets";

interface CaveContextType {
    selectedCaveBaseInfo: CaveBootStrapInformation | null;
    setSelectedCaveBaseInfo: (cave: CaveBootStrapInformation) => void;
    selectedCaveTextChannelId: string | null;
    setSelectedChannelId: (channelId: string) => void;
}

interface CaveProviderProps {
    children: React.ReactNode;
}

const CaveContext = createContext<CaveContextType | undefined>(undefined);

export const useCave = (): CaveContextType => {
    const context = useContext(CaveContext);
    if (!context) {
        throw new Error('useCave must be used within a CaveProvider');
    }
    return context;
}

export const CaveProvider: React.FC<CaveProviderProps> = ({ children }) => {
    const [selectedCaveBaseInfo, setSelectedCaveBaseInfo] = useState<CaveBootStrapInformation | null>(null);
    const [selectedCaveTextChannelId, setSelectedCaveTextChannelId] = useState<string | null>(null);

    const {newPermissions} = useWebSocket();

    useEffect(() => {
        if (newPermissions) {
            setSelectedCaveBaseInfo((prevState) => {
                if (prevState) {
                    return {
                        ...prevState,
                        userPermissionsCache: newPermissions,
                    }
                }
                return null;
            })
        }
    }, [newPermissions]);

    const setSelectedChannelId = (channelId: string) => {
        if (selectedCaveTextChannelId !== channelId) {
            setSelectedCaveTextChannelId(channelId);
        }
    }

    return (
        <CaveContext.Provider value={{ selectedCaveBaseInfo, setSelectedCaveBaseInfo, selectedCaveTextChannelId, setSelectedChannelId }}>
            {children}
        </CaveContext.Provider>
    )
}