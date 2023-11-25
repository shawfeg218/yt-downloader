import Downloader from "@/components/Downloader";
import VideoFrame from "@/components/VideoFrame";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center px-6 h-screen">
      <h1 className="text-4xl font-bold mb-8">YT Downloader</h1>

      {/* downloader */}
      <Downloader />

      {/* video frame */}
      <VideoFrame />
    </div>
  );
}
