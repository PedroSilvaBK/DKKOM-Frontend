import { useWebRTC } from "./webrtc/WebRTC"

function SettingsMenu_InputSettings() {
    const { audioDevices, videoDevices, setDefaultAudioDevice, setDefaultVideoDevice, defaultAudioDevice, defaultVideoDevice } = useWebRTC()

    const handleChangeAudio = (event: any) => {
        setDefaultAudioDevice(event.target.value)
    }

    const handleChangeVideo = (event: any) => {
        setDefaultVideoDevice(event.target.value)
    }

    return (
        <div className='h-full overflow-hidden relative p-3'>
            <div className="flex flex-col gap-4">
                <div>
                    <form>
                        <label htmlFor="audio-devices" className="block mb-2 text-sm font-medium text-secondary-100">Select a microphone</label>
                        <select id="audio-devices" onChange={handleChangeAudio} className="bg-primary-100 text-secondary-100 text-sm rounded-lg block w-full p-2.5">
                            {
                                audioDevices.map((device) => {
                                    if (device.deviceId === defaultAudioDevice) {
                                        return (
                                            <option selected>{device.label}</option>
                                        )
                                    }
                                    else {
                                        return (
                                            <option value={device.deviceId}>{device.label}</option>
                                        )
                                    }
                                })
                            }
                        </select>
                    </form>
                </div>
                <div>
                    <form>
                        <label htmlFor="audio-devices" className="block mb-2 text-sm font-medium text-secondary-100">Select a webcam</label>
                        <select id="audio-devices" onChange={handleChangeVideo} className="bg-primary-100 text-secondary-100 text-sm rounded-lg block w-full p-2.5">
                            {
                                videoDevices.map((device) => {
                                    if (device.deviceId === defaultVideoDevice) {
                                        return (
                                            <option selected>{device.label}</option>
                                        )
                                    }
                                    else {
                                        return (
                                            <option value={device.deviceId}>{device.label}</option>
                                        )
                                    }
                                })
                            }
                        </select>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SettingsMenu_InputSettings