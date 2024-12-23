import { useEffect, useRef, useState } from 'react'

function UserVoiceChatSettingsMenu({ closeUserVoiceChatSettingsMenu, userId }: { closeUserVoiceChatSettingsMenu: () => void, userId: string }) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [selectedUserVolume, setSelectedUserVolume] = useState<number>(1);

    useEffect(() => {
        const storedVolumeLevels = localStorage.getItem('volumeLevels');
        if (storedVolumeLevels) {
            const volumeLevels = new Map(JSON.parse(storedVolumeLevels));
            const userVolume = volumeLevels.get(userId);
            if (userVolume) {
                setSelectedUserVolume(userVolume as number);
            }
        }
    }, [userId]);

    const handleClickOutside = (event: any) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            closeUserVoiceChatSettingsMenu();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleVolumeChange = (volume: number) => {
        setSelectedUserVolume(volume);
        const storedVolumeLevels = localStorage.getItem('volumeLevels');
        if (storedVolumeLevels) {
            const volumeLevels = new Map(JSON.parse(storedVolumeLevels));
            volumeLevels.set(userId, volume);
            localStorage.setItem('volumeLevels', JSON.stringify(Array.from(volumeLevels.entries())));
        }
        else {
            localStorage.setItem('volumeLevels', JSON.stringify([[userId, volume]]));
        }   
    };

    return (
        <div className='bg-primary-100 rounded-xl p-2' ref={menuRef}>
            <p>Volume</p>
            <input type='range' min='0' max='1' step='0.01' value={selectedUserVolume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} />
        </div>
    )
}

export default UserVoiceChatSettingsMenu