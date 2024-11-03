import { useEffect, useState } from 'react';
import CaveOverviewSideBar from '../components/CaveOverviewSideBar';
import CavePage from './CavePage';
import caveServiceApi, { CaveOverview } from '../api/CaveServiceApi';
import { useAuth } from '../components/AuthProvider';
import { CaveProvider } from '../components/CaveProvider';
import { useParams } from 'react-router-dom';

function Index() {
    const [selectedCaveId, setSelectedCaveId] = useState<string | null>(null);
    const [userCavesOverview, setUserCavesOverview] = useState<CaveOverview[]>([]);

    const {cave_id} = useParams<string>();

    const {user} = useAuth();

    useEffect(() => {
        if (cave_id){
            console.log(cave_id);
            setSelectedCaveId(cave_id);
        }
    }, [cave_id])

    useEffect(() => {
        if (user){
            getCavesOverviewByUserId(user?.id);
        }
    }, [])
    
    const getCavesOverviewByUserId = (userId: string) => {
        caveServiceApi.getCavesOverviewByUserId(userId).then((response) => {
            setUserCavesOverview(response.caveOverviews);
        }).catch((error) => {
            console.error(error);
        })
    }

    return (
        <div className='h-fit flex '>
            <CaveOverviewSideBar setSelectedCave={setSelectedCaveId} userCavesOverview={userCavesOverview} />
            {
                selectedCaveId
                    ? (
                        <CaveProvider>
                            <CavePage selectedCaveId={selectedCaveId} />
                        </CaveProvider>
                    )
                    : <div className='flex-1 flex items-center justify-center'>
                        <p className='text-2xl text-gray-500'>Select a cave to view details</p>
                    </div>
            }
        </div>
    )
}

export default Index