"use client";

import { useEffect, useRef, useState } from "react";

// Server Actions
import download from "@/app/Actions/download";

// FFmpeg
import loadFfmpeg from "@/utils/load-ffmpeg";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { getArgs } from "@/utils/getExecArgs";

import { DownloadParams } from "@/types";
type Type = DownloadParams["type"];

export default function Downloader() {
  const [url, setUrl] = useState<string>("");
  const [type, setType] = useState<Type>("video");

  const ffmpegRef = useRef(new FFmpeg());

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const ffmpeg_response = await loadFfmpeg();
      ffmpegRef.current = ffmpeg_response;
      console.log("ffmpeg loaded");
    } catch (e) {
      console.log("error loading ffmpeg");
      console.log(e);
    }
  };

  const downloadFunc = async () => {
    try {
      const { streamBase64, title, container } = await download({ url, type });
      const buffer = Buffer.from(streamBase64, "base64");
      const originBlob = new Blob([buffer], { type: `${type}/${container}` });

      const outputExtension = type === "video" ? "mp4" : "mp3";
      const execArgs = getArgs(type, container, outputExtension);

      // conversion
      const ffmpeg = ffmpegRef.current;

      await ffmpeg.writeFile(`input.${container}`, await fetchFile(originBlob));
      console.log("ffmpeg wirte file done");

      await ffmpeg.exec(execArgs);
      console.log("ffmpeg exec done");

      const fileData = await ffmpeg.readFile(`output.${outputExtension}`);
      console.log("ffmpeg read file done");

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
    } catch (e) {
      console.log("error");
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
