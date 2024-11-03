import { useEffect, useState } from 'react';
import MainPanel from '../components/MainPanel';
import MessagePanel from '../components/MessagePanel';
import UserPanel from '../components/UserPanel';
import caveServiceApi from '../api/CaveServiceApi';
import { useCave } from '../components/CaveProvider';


function CavePage({ selectedCaveId }: { selectedCaveId: string }) {
    const {setSelectedCaveBaseInfo} = useCave();

    useEffect(() => {
        getCaveBootstrapInfo(selectedCaveId);
    }, [selectedCaveId])


    const getCaveBootstrapInfo = (selectedCave: string) => {
        caveServiceApi.getCaveBootStrapInformation(selectedCave).then((response) => {
            setSelectedCaveBaseInfo(response);
        }).catch((error) => {
            console.error(error);
        })
    }

    return (
        <div className='h-screen w-full grid grid-cols-[0.5fr,2fr,0.5fr]'>
            <MainPanel/>
            <MessagePanel />
            <UserPanel />
        </div>
    )
}

export default CavePage