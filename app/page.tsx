import Downloader from "@/components/Downloader";

export default function Home() {
  return (
    <div className="py-8 w-full flex flex-col items-center px-2 h-screen">
      <h1 className="text-4xl font-bold mb-8">
        <span className="text-4xl font-bold text-red-600">YT</span>
        Downloader
      </h1>

      <Downloader />
    </div>
  );
}
