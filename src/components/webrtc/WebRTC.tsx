import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '../AuthProvider';
import { useWebSocket } from '../websockets/WebSockets';

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined)

type WebRTCProviderProps = {
    children: ReactNode;
};

type WebRTCContextType = {
    connectVoiceChannel: (channelId: string) => void,
    disconnectVoiceChannel: () => void,
    audioDevices: MediaDeviceInfo[]
    videoDevices: MediaDeviceInfo[]
    setDefaultAudioDevice: React.Dispatch<React.SetStateAction<string>>;
    setDefaultVideoDevice: React.Dispatch<React.SetStateAction<string>>;
    defaultAudioDevice: string;
    defaultVideoDevice: string;
    remoteStreams: Map<string, MediaStream>
    isVoiceConnected: boolean
    currentChannelId: string
}

export const WebRTCProvider: React.FC<WebRTCProviderProps> = ({ children }) => {
    const { user } = useAuth()
    const { socket, answer, offer } = useWebSocket()
    const pcRef = useRef<RTCPeerConnection | null>(null);

    const [isVoiceConnected, setIsVoiceConnected] = useState<boolean>(false);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
    const [, setRemoteStreamsState] = useState<number>(0); // Dummy state to force re-render when remoteStreams changes

    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [defaultVideoDevice, setDefaultVideoDevice] = useState<string>("");

    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [defaultAudioDevice, setDefaultAudioDevice] = useState<string>("");

    const oldStreamIdsRef = useRef<string[]>([]);

    const [currentChannelId, setCurrentChannelId] = useState<string>("")

    useEffect(() => {
        if (answer) {
            console.log(answer)
            handleAnswer(answer);
        }
    }, [answer]);

    useEffect(() => {
        if (offer) {
            handleOffer(offer);
        }
    }, [offer]);

    const createPeerConnection = (stream: MediaStream, currentChannelId: string): RTCPeerConnection => {
        const configuration: RTCConfiguration = {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        };
        const peer = new RTCPeerConnection(configuration);

        pcRef.current = peer;

        // Add local tracks to the connection
        if (stream) {
            stream.getTracks().forEach((track) => peer.addTrack(track, stream));
        }

        // Handle ICE candidates
        peer.onicecandidate = (event) => {
            console.log("ICE candidate generated");
            if (event.candidate && socket) {
                console.log("Sending ICE candidate to server");
                socket.send(
                    JSON.stringify({
                        type: "ice-candidate",
                        properties: {
                            candidate: event.candidate,
                            user_id: user?.id,
                            room_id: currentChannelId
                        }
                    })
                );
            }
        };

        // Handle incoming remote tracks
        peer.ontrack = (event) => {
            const track = event.track;
            const streamId = event.streams[0]?.id || track.id;

            console.log("Received remote track:", track);

            const remoteStreams = remoteStreamsRef.current;
            const stream = remoteStreams.get(streamId) || new MediaStream();
            stream.addTrack(track);

            remoteStreams.set(streamId, stream);

            // Force React to re-render
            setRemoteStreamsState((prev) => prev + 1);
        };


        return peer;
    };

    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
        console.log("Received offer");
        console.log(offer);

        // find a=msid lines
        const msidMatch = offer.sdp ? offer.sdp.match(/a=msid:.*/g)?.map(item => item.split(" ")[0].substring(7)) : null;
        console.log(msidMatch);

        if (msidMatch === undefined && oldStreamIdsRef.current.length > 0) {
            // remove all streams if offer has no msid
            remoteStreamsRef.current = new Map();
            setRemoteStreamsState((prev) => prev + 1);
        }

        // remove old stream that is not in the new offer
        console.log("oldStreamIds", oldStreamIdsRef.current);
        if (msidMatch && oldStreamIdsRef.current.length > msidMatch.length) {
            const remoteStreams = remoteStreamsRef.current;
            oldStreamIdsRef.current.forEach(streamId => {
                if (!msidMatch?.includes(streamId)) {
                    console.log("Remove stream", streamId);
                    remoteStreams.delete(streamId);
                }
            });
            remoteStreamsRef.current = remoteStreams;
            setRemoteStreamsState((prev) => prev + 1);
        }

        console.log(remoteStreamsRef.current)

        oldStreamIdsRef.current = msidMatch || [];

        if (!localStream) {
            console.error("Local stream is null");
            return;
        }
        const peer = pcRef.current || createPeerConnection(localStream, currentChannelId);

        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        if (socket) {
            socket.send(JSON.stringify({ type: "voice-answer", properties: { offer: answer, user_id: user?.id, room_id: currentChannelId } }));
        }
    };

    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
        console.log("Received answer", answer);
        const peer = pcRef.current;
        if (peer) {
            await peer.setRemoteDescription(answer);
        }
    };

    const connectVoiceChannel = async (channelId: string) => {
        if (defaultAudioDevice) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                  video: false,
                  audio: { deviceId: { exact: defaultAudioDevice } },
                });

                setLocalStream(stream);

                const peer = createPeerConnection(stream, channelId);
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);
        
                setCurrentChannelId(channelId)
        
                if (socket) {
                    socket.send(JSON.stringify({
                        type: "connect-voice",
                        properties: {
                            room_id: channelId,
                            user_id: user?.id,
                            offer: offer
                        }
                    }));
                }

                setIsVoiceConnected(true);

                
              } catch (err) {
                console.error("Error accessing media devices:", err);
              }
        }
    }

    const disconnectVoiceChannel = () => {
        if (socket && user) {
            socket.send(JSON.stringify({ type: "disconnect-voice", properties: { user_id: user?.id, room_id: currentChannelId } }));
            remoteStreamsRef.current = new Map();
            setRemoteStreamsState((prev) => prev + 1);

            localStream?.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
            pcRef.current?.close();
            pcRef.current = null;

            setIsVoiceConnected(false);
        }
    }

    useEffect(() => {
        getInputDevices()
    },[])

    const getInputDevices = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        const audioDevices = devices.filter((device) => device.kind === "audioinput");

        setVideoDevices(videoDevices);
        setAudioDevices(audioDevices)

        if (videoDevices.length > 0) {
            setDefaultVideoDevice(videoDevices[0].deviceId); // Default to the first device
        }

        if (audioDevices.length > 0) {
            setDefaultAudioDevice(audioDevices[0].deviceId); // Default to the first device
        }
    }

    return (
        <WebRTCContext.Provider value={{ connectVoiceChannel, disconnectVoiceChannel, audioDevices, 
        videoDevices, setDefaultAudioDevice, setDefaultVideoDevice, defaultAudioDevice,
         defaultVideoDevice, remoteStreams: remoteStreamsRef.current, isVoiceConnected, currentChannelId }}>
            {children}
        </WebRTCContext.Provider>
    )
}

export const useWebRTC = () => {
    const context = useContext(WebRTCContext)
    if (context == undefined) {
        throw new Error('useWebRTC must be used within a WebSocketProvider');
    }

    return context;
}