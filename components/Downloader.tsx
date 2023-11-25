"use client";

import download from "@/app/Actions/download";
import { useState } from "react";
import { DownloadParams } from "@/typeing";
type Quality = DownloadParams["quality"];

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState<Quality>("highest");

  const downloadFunc = async () => {
    try {
      const { StreamBase64, title, container } = await download({ url, quality });
      const stream = Buffer.from(StreamBase64, "base64");
      const blob = new Blob([stream], { type: "video/mp4" });
      const blobUrl = URL.createObjectURL(blob);
      // create a link element
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${title}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mb-6 space-x-3">
      <input
        type="text"
        className="border-2 rounded-md"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <select value={quality} onChange={(e) => setQuality(e.target.value as Quality)}>
        <option value="highest">Video</option>
        <option value="highestaudio">Audio</option>
      </select>
      <button
        className="bg-black text-white rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={url === ""}
        onClick={downloadFunc}
      >
        Download
      </button>
    </div>
  );
}
