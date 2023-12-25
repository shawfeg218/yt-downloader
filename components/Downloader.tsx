"use client";

import { useState } from "react";
import VideoFrame from "./VideoFrame";

// Server Actions
import downloadAudio from "@/Actions/downloadAudio";
import downloadVideo from "@/Actions/downloadVideo";

// FFmpeg
import convertAudio from "@/lib/convertAudio";
import convertVideo from "@/lib/convertVideo";
import getVideoArgs from "@/lib/getVideoArgs";
import getAudioArgs from "@/lib/getAudioArgs";

import ytdl from "ytdl-core";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
type Type = "video" | "audio";

export default function Downloader() {
  const [url, setUrl] = useState<string>("");
  const [type, setType] = useState<Type>("video");
  const [downloading, setDownloading] = useState<boolean>(false);

  const downloadhandler = () => {
    if (type === "video") {
      downloadV();
    } else {
      downloadA();
    }
  };

  const downloadV = async () => {
    setDownloading(true);

    // check if url is valid
    if (!ytdl.validateURL(url)) {
      alert("Invalid URL");
      return;
    }

    try {
      const { audioStreamBase64, audioContainer, title, videoStreamBase64, videoContainer } =
        await downloadVideo(url);

      // file conversion
      const execArgs = getVideoArgs(videoContainer, audioContainer);
      const fileData = await convertVideo(
        videoStreamBase64,
        audioStreamBase64,
        videoContainer,
        audioContainer,
        execArgs
      );

      // gernerate converted blob from fileData
      const data = new Uint8Array(fileData as ArrayBuffer);
      const convertedBlob = new Blob([data.buffer], { type: "video/mp4" });

      // download in browser
      const BlobUrl = URL.createObjectURL(convertedBlob);
      const a = document.createElement("a");
      a.href = BlobUrl;
      a.download = `${title}.mp4`;
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

  const downloadA = async () => {
    setDownloading(true);
    // check if url is valid
    if (!ytdl.validateURL(url)) {
      alert("Invalid URL");
      return;
    }
    try {
      const { streamBase64, title, container } = await downloadAudio(url);
      const outputExtension = "mp3";
      // file conversion
      const execArgs = getAudioArgs(container, outputExtension);
      const fileData = await convertAudio(streamBase64, container, execArgs, outputExtension);

      // gernerate converted blob from fileData
      const data = new Uint8Array(fileData as ArrayBuffer);
      const convertedBlob = new Blob([data.buffer], { type: `audio/${outputExtension}` });

      // download in browser
      const BlobUrl = URL.createObjectURL(convertedBlob);
      const a = document.createElement("a");
      a.href = BlobUrl;
      a.download = `${title}.mp3`;
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
        <div className="w-full max-w-xl flex justify-center items-center space-x-3 mb-3">
          <Input placeholder="Video Url" value={url} onChange={(e) => setUrl(e.target.value)} />
          <select
            className="p-2 rounded-md"
            value={type}
            onChange={(e) => setType(e.target.value as Type)}
          >
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
          <Button disabled={!url || downloading} onClick={downloadhandler}>
            Download
          </Button>
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
