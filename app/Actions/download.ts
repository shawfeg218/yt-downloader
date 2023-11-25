"use server";

import ytdl from "ytdl-core";
import { DownloadParams } from "@/typing";

// convert node stream to base64
function streamToBase64(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer.toString("base64"));
    });
    stream.on("error", (err) => {
      reject(err);
    });
  });
}

export default async function download(params: DownloadParams) {
  const { url, type } = params;

  if (!ytdl.validateURL(url)) {
    throw new Error("Invalid URL");
  }
  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;
  const options: ytdl.chooseFormatOptions =
    type === "video"
      ? {
          filter: "videoandaudio",
          quality: "highestvideo",
        }
      : {
          filter: "audioonly",
          quality: "highestaudio",
        };

  const format = ytdl.chooseFormat(info.formats, options);
  const container = format.container;
  const stream = ytdl(url, options);
  console.log(`Downloading: ${title}.${container}`);
  // convert stream to base64
  const streamBase64 = await streamToBase64(stream);
  return { streamBase64, title, container };
}
