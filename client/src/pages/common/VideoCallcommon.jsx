import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

export default function VideoCallPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
    const init = async () => {
      socketRef.current = io("http://localhost:5000");

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      stream.getAudioTracks()[0].enabled = false;
      stream.getVideoTracks()[0].enabled = false;

      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      socketRef.current.emit("join-room", id);

      socketRef.current.on("other-user", (userId) => callUser(userId));
      socketRef.current.on("user-joined", (userId) => console.log("User joined:", userId));
      socketRef.current.on("offer", handleReceiveOffer);
      socketRef.current.on("answer", handleAnswer);
      socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
    };

    const callUser = (userId) => {
      peerRef.current = createPeer(userId);
      localStreamRef.current.getTracks().forEach(track =>
        peerRef.current.addTrack(track, localStreamRef.current)
      );
    };

    const createPeer = (userId) => {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peer.onicecandidate = (e) => {
        if (e.candidate) {
          socketRef.current.emit("ice-candidate", {
            target: userId,
            candidate: e.candidate,
          });
        }
      };

      peer.ontrack = (e) => {
        remoteVideoRef.current.srcObject = e.streams[0];
        setConnected(true);
      };

      peer.createOffer()
        .then(offer => peer.setLocalDescription(offer))
        .then(() => {
          socketRef.current.emit("offer", {
            target: userId,
            sdp: peer.localDescription,
          });
        });

      return peer;
    };

    const handleReceiveOffer = async ({ sdp, caller }) => {
      peerRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          socketRef.current.emit("ice-candidate", {
            target: caller,
            candidate: e.candidate,
          });
        }
      };

      peerRef.current.ontrack = (e) => {
        remoteVideoRef.current.srcObject = e.streams[0];
        setConnected(true);
      };

      localStreamRef.current.getTracks().forEach(track =>
        peerRef.current.addTrack(track, localStreamRef.current)
      );

      await peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      socketRef.current.emit("answer", {
        target: caller,
        sdp: peerRef.current.localDescription,
      });
    };

    const handleAnswer = (message) => {
      const desc = new RTCSessionDescription(message.sdp);
      peerRef.current.setRemoteDescription(desc);
    };

    const handleNewICECandidateMsg = (message) => {
      const candidate = new RTCIceCandidate(message.candidate);
      peerRef.current.addIceCandidate(candidate);
    };

    init();

    return () => {
      socketRef.current?.disconnect();
      localStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [id]);

  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  const hangUp = () => {
    peerRef.current?.close();
    socketRef.current?.disconnect();
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 flex flex-col items-center justify-center px-4 py-8">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">🧠 Therapy Session</h2>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Local Video */}
        <div className="flex flex-col items-center p-4 bg-white rounded-xl border-2 border-purple-300 shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="rounded-lg border border-purple-200 shadow-md w-full"
          />
          <span className="mt-2 text-sm font-semibold text-gray-700">You</span>
        </div>

        {/* Remote Video */}
        <div className="flex flex-col items-center p-4 bg-white rounded-xl border-2 border-purple-300 shadow-lg">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="rounded-lg border border-purple-200 shadow-md w-full"
          />
          <span className="mt-2 text-sm font-semibold text-gray-700">
            {connected ? "Therapist" : "Waiting..."}
          </span>
        </div>
      </div>

      {connected && <p className="mt-4 text-green-700 font-medium">✅ You are connected</p>}

      <div className="fixed bottom-6 flex gap-4 bg-white/90 p-4 rounded-full shadow-xl border border-purple-200">
        <button
          onClick={toggleMic}
          className={`p-3 rounded-full ${micOn ? "bg-green-500" : "bg-red-500"} text-white transition hover:scale-110`}
          title={micOn ? "Mute" : "Unmute"}
        >
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={toggleCamera}
          className={`p-3 rounded-full ${cameraOn ? "bg-green-500" : "bg-red-500"} text-white transition hover:scale-110`}
          title={cameraOn ? "Stop Video" : "Start Video"}
        >
          {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <button
          onClick={hangUp}
          className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition hover:scale-110"
          title="End Call"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
}
