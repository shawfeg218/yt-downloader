"use client";

import { useState } from "react";
import VideoFrame from "./VideoFrame";

// Server Actions
import download from "@/app/Actions/download";

// FFmpeg
import { getArgs } from "@/utils/getExecArgs";
import convert from "@/utils/convert";

import { DownloadParams } from "@/types";
import ytdl from "ytdl-core";
type Type = DownloadParams["type"];

export default function Downloader() {
  const [url, setUrl] = useState<string>("");
  const [type, setType] = useState<Type>("video");
  const [downloading, setDownloading] = useState<boolean>(false);

  const downloadFunc = async () => {
    setDownloading(true);

    // check if url is valid
    if (!ytdl.validateURL(url)) {
      alert("Invalid URL");
      return;
    }
    try {
      const { streamBase64, title, container } = await download({ url, type });
      const outputExtension = type === "video" ? "mp4" : "mp3";

      // file conversion
      const execArgs = getArgs(type, container, outputExtension);
      const fileData = await convert(streamBase64, type, container, execArgs, outputExtension);

      // gernerate converted blob from fileData
      const data = new Uint8Array(fileData as ArrayBuffer);
      const convertedBlob = new Blob([data.buffer], { type: `${type}/${outputExtension}` });

      // download in browser
      const BlobUrl = URL.createObjectURL(convertedBlob);
      const a = document.createElement("a");
      a.href = BlobUrl;
      a.download = type === "video" ? `${title}.mp4` : `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(BlobUrl);
    } catch (err) {
      console.log(err);
      alert("Error in download");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex flex-col items-center">
        {/* download form */}
        <div className="w-full flex justify-center items-center space-x-3 mb-3">
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
            className="bg-black text-white rounded-md p-2 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!url || downloading}
            onClick={downloadFunc}
          >
            Download
          </button>
        </div>

        {/* suspend div */}
        <div className="h-8 flex justify-center items-center">
          {downloading && <p className="animate-pulse font-semibold">downloading ...</p>}
        </div>

        {/* video frame */}
        <div className="w-full max-w-2xl p-5">{url && <VideoFrame url={url} />}</div>
      </div>
    </div>
  );
}
