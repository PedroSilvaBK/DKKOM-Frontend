import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Channels from './Channels';

function MainPanel() {


    return (
        <div className='bg-primary-200 rounded-l-xl overflow-hidden text-secondary-100'>
            <div className='flex items-center justify-between p-3 hover:bg-secondary-300 transition ease-all hover:cursor-pointer'>
                <h1 className='font-bold'>Server Name</h1>
                <ArrowForwardIosIcon style={{ fontSize: '1rem' }} className='rotate-90' />
            </div>
            <hr className='mb-3' />
            <Channels />
        </div>
    )
}

export default MainPanel