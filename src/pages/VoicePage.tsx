import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../components/websockets/WebSockets";
import { useAuth } from "../components/AuthProvider";

function VoicePage() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const [, setRemoteStreamsState] = useState<number>(0); // Dummy state to force re-render when remoteStreams changes

  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const oldStreamIdsRef = useRef<string[]>([]);

  const {socket, answer, offer} = useWebSocket();
  const {user} = useAuth();


  const [selectedRoom, setSelectedRoom] = useState<string>("room1");

  // Fetch available video input devices (webcams)
  useEffect(() => {
    const fetchVideoDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((device) => device.kind === "videoinput");
      setVideoDevices(videoInputs);

      if (videoInputs.length > 0) {
        setSelectedDeviceId(videoInputs[0].deviceId); // Default to the first device
      }
    };

    fetchVideoDevices();
  }, []);

  // Initialize video stream with the selected device
  useEffect(() => {
    const startVideoStream = async () => {
      if (selectedDeviceId) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: selectedDeviceId } },
            audio: false,
          });

          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.muted = true;
          }
        } catch (err) {
          console.error("Error accessing media devices:", err);
        }
      }
    };

    startVideoStream();

    return () => {
      // Cleanup: Stop previous video stream
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedDeviceId]);

  useEffect(() => {
    if (answer) {
        handleAnswer(answer);
    }
  }, [answer]);

  useEffect(() => {
    if (offer) {
        handleOffer(offer);
    }
  }, [offer]);

  const createPeerConnection = (): RTCPeerConnection => {
    const configuration: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peer = new RTCPeerConnection(configuration);

    pcRef.current = peer;

    // Add local tracks to the connection
    if (localStream) {
      localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));
    }

    // Handle ICE candidates
    peer.onicecandidate = (event) => {
      console.log("ICE candidate generated");
      if (event.candidate && socket) {
        console.log("Sending ICE candidate to server");
        socket.send(
          JSON.stringify({ type: "ice-candidate", 
            properties: {
              candidate: event.candidate,
              user_id: user?.id,
              room_id: selectedRoom
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

    const peer = pcRef.current || createPeerConnection();

    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    if (socket) {
      socket.send(JSON.stringify({ type: "voice-answer", properties: { offer: answer, user_id: user?.id, room_id: selectedRoom } }));
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    console.log("Received answer", answer);
    const peer = pcRef.current;
    if (peer) {
      await peer.setRemoteDescription(answer);
    }
  };

  // Connect to server and initiate call
  const joinServer = () => {
    startCall();
  };

  const startCall = async () => {
    const peer = createPeerConnection();
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);


    if (socket) {
        socket.send(JSON.stringify({
            type: "connect-voice",
            properties: {
                room_id: selectedRoom,
                user_id: user?.id,
                offer: offer
            }
        }));
    }
  };


  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(e.target.value);
  };

  const handleDisconnect = () => {
    if (socket && user) {
      socket.send(JSON.stringify({ type: "disconnect-voice", properties: { user_id: user?.id, room_id: selectedRoom } }));
      remoteStreamsRef.current = new Map();
      setRemoteStreamsState((prev) => prev + 1);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <h1>React (TypeScript) + SFU WebRTC Demo</h1>
      <div>
        <h3>Local Stream</h3>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{ width: "300px", border: "1px solid black", marginRight: "10px" }}
        ></video>
                <select id="cameraSelect" value={selectedDeviceId || ""} onChange={(handleDeviceChange)}>
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-4">
        <button className="bg-white p-1 rounded-xl" onClick={joinServer}>{"Connect to Server"}</button>
        <button className="bg-white p-1 rounded-xl" onClick={() => setSelectedRoom("room1")}>Select Room 1</button>
        <button className="bg-white p-1 rounded-xl" onClick={() => setSelectedRoom("room2")}>Select Room 2</button>
        <button className="bg-white p-1 rounded-xl" onClick={handleDisconnect}>Disconnect</button>
      </div>
      <div>
        <h3>Remote Streams</h3>
        {Array.from(remoteStreamsRef.current.entries()).map(([streamId, stream]) => (
          <video
            key={streamId}
            autoPlay
            playsInline
            style={{ width: "300px", border: "1px solid black", marginTop: "20px" }}
            ref={(video) => {
              if (video) {
                video.srcObject = stream;
              }
            }}
          ></video>
        ))}
      </div>
    </div>
  );
}

export default VoicePage;
