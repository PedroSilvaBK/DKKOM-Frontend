import { createContext, useContext, useState } from "react";
import { CaveBootStrapInformation } from "../api/CaveServiceApi";

interface CaveContextType {
    selectedCaveBaseInfo: CaveBootStrapInformation | null;
    setSelectedCaveBaseInfo: (cave: CaveBootStrapInformation) => void;
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

    return (
        <CaveContext.Provider value={{ selectedCaveBaseInfo, setSelectedCaveBaseInfo }}>
            {children}
        </CaveContext.Provider>
    )
}