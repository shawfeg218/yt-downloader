"use client";

import { useEffect, useState } from "react";

export default function VideoFrame({ url }: { url: string }) {
  const [embedUrl, setEmbedUrl] = useState<string>("");

  useEffect(() => {
    getEmbedUrl();
    // console.log(url);
  }, [url]);

  const getEmbedUrl = () => {
    try {
      const videoId = url.split("v=")[1];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      setEmbedUrl(embedUrl);
      // console.log(embedUrl);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
        maxWidth: "100%",
      }}
    >
      <iframe
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        src={embedUrl}
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );
}
