"use client";

import { useEffect, useRef, useState } from "react";
import VideoFrame from "./VideoFrame";

// Server Actions
import download from "@/app/Actions/download";

// FFmpeg
import { getArgs } from "@/utils/getExecArgs";

import { DownloadParams } from "@/types";
import convert from "@/utils/convert";
type Type = DownloadParams["type"];

export default function Downloader() {
  const [url, setUrl] = useState<string>("");
  const [type, setType] = useState<Type>("video");

  const downloadFunc = async () => {
    try {
      const { streamBase64, title, container } = await download({ url, type });
      const outputExtension = type === "video" ? "mp4" : "mp3";
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
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-center">
          <div className="mb-6 space-x-3">
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
              disabled={url === ""}
              onClick={downloadFunc}
            >
              Download
            </button>
          </div>
        </div>
        {/* video frame */}
        <div className="w-full max-w-2xl p-5">{url && <VideoFrame url={url} />}</div>
      </div>
    </div>
  );
}
