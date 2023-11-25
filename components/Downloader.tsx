"use client";

import download from "@/app/Actions/download";
import { useState } from "react";
import { DownloadParams } from "@/typing";
type Type = DownloadParams["type"];

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [type, setType] = useState<Type>("video");
  // const [blobUrl, setBlobUrl] = useState("");

  const downloadFunc = async () => {
    try {
      const { streamBase64, title, container } = await download({ url, type });
      const buffer = Buffer.from(streamBase64, "base64");
      // create blob by stream
      const blob = new Blob([buffer], { type: `${type}/${container}` });
      if (type === "audio") {
        // convert blob to mp3 using ffmpeg.wasm
      }
      const BlobUrl = URL.createObjectURL(blob);
      // setBlobUrl(BlobUrl);

      const a = document.createElement("a");
      a.href = BlobUrl;
      a.download = `${title}.${container}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(BlobUrl);
    } catch (e) {
      console.log("error");
      console.log(e);
    }
  };

  return (
    <div className="mb-6 space-x-3">
      {/* {blobUrl !== "" && <video autoPlay controls src={blobUrl} />} */}
      <input
        type="text"
        className="border-2 rounded-md"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value as Type)}>
        <option value="video">Video</option>
        <option value="audio">Audio</option>
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
