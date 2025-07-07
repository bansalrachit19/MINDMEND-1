import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PauseCircle, PlayCircle, Volume2, VolumeX } from "lucide-react";
import breathingSound from "../../assets/sounds/breathing.mp3";

export default function BreathingExercise() {
  const [phase, setPhase] = useState("Inhale");
  const [running, setRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let timeout;
    if (running) {
      if (phase === "Inhale") timeout = setTimeout(() => setPhase("Hold"), 4000);
      if (phase === "Hold") timeout = setTimeout(() => setPhase("Exhale"), 7000);
      if (phase === "Exhale") timeout = setTimeout(() => setPhase("Inhale"), 8000);
    }
    return () => clearTimeout(timeout);
  }, [phase, running]);

  useEffect(() => {
    if (audioRef.current) {
      if (running && !muted) {
        audioRef.current.loop = true;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [running, muted]);

  const phaseColor = {
    Inhale: "bg-gradient-to-br from-green-200 to-green-300",
    Hold: "bg-gradient-to-br from-yellow-200 to-yellow-300",
    Exhale: "bg-gradient-to-br from-blue-200 to-blue-300",
  }[phase];

  const phaseText = {
    Inhale: "Breathe in deeply through your nose",
    Hold: "Hold your breath",
    Exhale: "Slowly exhale through your mouth",
  }[phase];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 p-8 flex flex-col items-center justify-center text-center font-sans">
      <audio ref={audioRef} src={breathingSound} />

      <h1 className="text-5xl font-extrabold text-purple-900 mb-8 tracking-tight drop-shadow-lg">
        🧘‍♂️ MindMend Breathing
      </h1>

      <motion.div
        key={phase}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className={`w-80 h-80 ${phaseColor} rounded-full shadow-2xl backdrop-blur-md bg-opacity-40 border border-white/30 flex items-center justify-center text-3xl font-semibold text-purple-900`}
        style={{
          boxShadow: "0 8px 30px rgba(128, 90, 213, 0.3)",
        }}
      >
        {phase}
      </motion.div>

      <p className="text-xl mt-6 text-purple-800 max-w-md animate-fade-in font-medium">
        {phaseText}
      </p>

      <div className="flex gap-6 mt-10 items-center">
        <button
          onClick={() => setRunning(!running)}
          className="bg-purple-700 hover:bg-purple-800 transition text-white px-8 py-3 rounded-full shadow-lg flex items-center gap-2 text-lg font-semibold"
        >
          {running ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
          {running ? "Pause" : "Start"}
        </button>

        <button
          onClick={() => setMuted(!muted)}
          className="bg-white/70 border border-purple-300 text-purple-700 hover:bg-white/90 transition px-6 py-3 rounded-full shadow-md backdrop-blur-sm"
        >
          {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>

      <p className="text-sm text-purple-600 mt-8 italic tracking-wide">
        4-7-8 Breathing Technique • Calm your mind, one breath at a time
      </p>
    </div>
  );
}
