import CaveOverviewSideBar from '../components/CaveOverviewSideBar';
import CavePage from './CavePage';

function Index() {
    return (
        <div className='h-fit flex '>
            <CaveOverviewSideBar />
            <CavePage />
        </div>
    )
}

export default Index