"use server";

import ytdl from "ytdl-core";
import { DownloadParams } from "@/types";
import { streamToBase64 } from "@/utils/nodeStreamConvert";

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
  // console.log(format);
  const container = format.container;
  const stream = ytdl(url, options);
  console.log(`Downloading: ${title}.${container}`);
  // convert stream to base64
  const streamBase64 = await streamToBase64(stream);
  return { streamBase64, title, container };
}
