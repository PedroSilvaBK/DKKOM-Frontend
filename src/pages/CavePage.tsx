import { useEffect } from 'react';
import MainPanel from '../components/MainPanel';
import MessagePanel from '../components/MessagePanel';
import UserPanel from '../components/UserPanel';


function CavePage() {

    

    return (
        <div className='h-screen w-full grid grid-cols-[0.5fr,2fr,0.5fr]'>
            <MainPanel />
            <MessagePanel />
            <UserPanel />
        </div>
    )
}

export default CavePage