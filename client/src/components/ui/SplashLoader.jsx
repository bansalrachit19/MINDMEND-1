import Lottie from "lottie-react";
import loaderAnim from "../../assets/loader.json";

export default function SplashLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      <div className="w-48 h-48">
        <Lottie animationData={loaderAnim} loop autoplay />
      </div>
      <p className="mt-4 text-purple-600 font-semibold">Loading MindMend...</p>
    </div>
  );
}
