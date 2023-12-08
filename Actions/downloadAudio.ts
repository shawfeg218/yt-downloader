"use server";

import ytdl from "ytdl-core";
import { streamToBase64 } from "@/utils/streamConvert";

// download audio from youtube
export default async function downloadAudio(url: string) {
  try {
    if (!ytdl.validateURL(url)) {
      throw new Error("Invalid URL");
    }
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const options: ytdl.chooseFormatOptions = {
      filter: "audioonly",
      quality: "highestaudio",
    };

    const format = ytdl.chooseFormat(info.formats, options);
    console.log("Audio quality: ", format.audioQuality);
    const container = format.container;
    const stream = ytdl(url, options);
    console.log(`Downloading: ${title}.${container}`);
    // convert stream to base64
    const streamBase64 = await streamToBase64(stream);
    return { streamBase64, title, container };
  } catch (error) {
    console.log(error);
    throw new Error(`Error in download: ${error}`);
  }
}
