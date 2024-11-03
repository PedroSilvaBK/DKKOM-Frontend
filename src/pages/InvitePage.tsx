import { useNavigate, useParams } from 'react-router-dom'
import caveServiceApi from '../api/CaveServiceApi';
import { useEffect } from 'react';

function InvitePage() {
    const {invite_id} = useParams<string>();
    const navigate = useNavigate();

    const joinCave = () => {
        if (invite_id) {
            caveServiceApi.joinCave(invite_id).then((response) => {
                navigate(`/${response.caveId}`);
            }).catch((error) => {
                console.error(error);
            });
        } else {
            console.error("Invite ID is undefined");
        }
    }
    
    useEffect(() => {
        joinCave();
    }, [invite_id])

  return (
    <div className='h-screen w-screen grid place-items-center'>
        <div className='glass-morphism p-4'>
            Join Cave
        </div>
    </div>
  )
}

export default InvitePage