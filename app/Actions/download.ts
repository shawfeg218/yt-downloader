"use server";

import ytdl from "ytdl-core";
import { DownloadParams } from "@/typeing";

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
  const { url, quality } = params;

  if (!ytdl.validateURL(url)) {
    throw new Error("Invalid URL");
  }
  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;
  console.log(`Downloading: ${title} with quality: ${quality}`);
  const format = ytdl.chooseFormat(info.formats, { quality: quality });
  const container = format.container;
  const stream = ytdl(url, { format: format });
  // convert stream to base64
  const StreamBase64 = await streamToBase64(stream);

  return { StreamBase64, title, container };
}
