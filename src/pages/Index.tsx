import { useEffect } from 'react';
import CaveOverviewSideBar from '../components/CaveOverviewSideBar';
import CavePage from './CavePage';

function Index() {
    const token = localStorage.getItem('token');
    
    return (
        <div className='h-fit flex '>
            <CaveOverviewSideBar />
            <CavePage />
        </div>
    )
}

export default Index