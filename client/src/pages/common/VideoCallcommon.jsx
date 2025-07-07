import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

export default function VideoCallPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const localStreamRef = useRef();

  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const now = new Date();
      const startTime = new Date(data.startTime);

      if (data.completed) {
        alert("❌ This session has already been completed.");
        navigate(-1);
      } else if (now < startTime) {
        alert("⏳ You can only video call at the scheduled time.");
        navigate(-1);
      }
    };

    const init = async () => {
      try {
        socketRef.current = io("http://localhost:5000");

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getAudioTracks()[0].enabled = false;
        stream.getVideoTracks()[0].enabled = false;

        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        socketRef.current.emit("join-room", id);

        socketRef.current.on("other-user", callUser);
        socketRef.current.on("offer", handleReceiveOffer);
        socketRef.current.on("answer", handleAnswer);
        socketRef.current.on("ice-candidate", handleNewICECandidate);
      } catch (err) {
        console.error("Init error:", err);
      }
    };

    const callUser = (userId) => {
      peerRef.current = createPeer(userId);
      localStreamRef.current.getTracks().forEach((track) =>
        peerRef.current.addTrack(track, localStreamRef.current)
      );
    };

    const createPeer = (userId) => {
      const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

      peer.onicecandidate = (e) => {
        if (e.candidate) {
          socketRef.current.emit("ice-candidate", { target: userId, candidate: e.candidate });
        }
      };

      peer.ontrack = (e) => {
        remoteVideoRef.current.srcObject = e.streams[0];
        setConnected(true);
      };

      peer.createOffer()
        .then((offer) => peer.setLocalDescription(offer))
        .then(() => {
          socketRef.current.emit("offer", { target: userId, sdp: peer.localDescription });
        });

      return peer;
    };

    const handleReceiveOffer = async ({ sdp, caller }) => {
      peerRef.current = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

      peerRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          socketRef.current.emit("ice-candidate", { target: caller, candidate: e.candidate });
        }
      };

      peerRef.current.ontrack = (e) => {
        remoteVideoRef.current.srcObject = e.streams[0];
        setConnected(true);
      };

      localStreamRef.current.getTracks().forEach(track => peerRef.current.addTrack(track, localStreamRef.current));
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      socketRef.current.emit("answer", { target: caller, sdp: peerRef.current.localDescription });
    };

    const handleAnswer = (msg) => {
      peerRef.current.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    };

    const handleNewICECandidate = (msg) => {
      peerRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
    };

    checkAccess();  // ✅ Protect from early/late access
    init();

    return () => {
      socketRef.current?.disconnect();
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      peerRef.current?.close();
    };
  }, [id]);

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  };

  const toggleCamera = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCameraOn(track.enabled);
    }
  };

  const endCall = async () => {
    try {
      peerRef.current?.close();
      socketRef.current?.disconnect();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());

      const token = localStorage.getItem("token");
      await fetch(`/api/bookings/mark-completed/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Appointment marked as completed");
    } catch (err) {
      console.error("❌ Failed to mark completed:", err);
    }

    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">🧠 Therapy Session</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="border rounded-lg overflow-hidden">
          <video ref={localVideoRef} autoPlay muted className="w-full h-full bg-black" />
          <p className="text-center mt-1">You</p>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <video ref={remoteVideoRef} autoPlay className="w-full h-full bg-black" />
          <p className="text-center mt-1">{connected ? "Therapist" : "Waiting..."}</p>
        </div>
      </div>

      <div className="fixed bottom-6 flex gap-4 p-4 bg-white rounded-full shadow-lg">
        <button onClick={toggleMic} className={`p-3 rounded-full text-white ${micOn ? "bg-green-600" : "bg-red-600"}`}>
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button onClick={toggleCamera} className={`p-3 rounded-full text-white ${cameraOn ? "bg-green-600" : "bg-red-600"}`}>
          {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <button onClick={endCall} className="p-3 bg-black text-white rounded-full">
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
}
