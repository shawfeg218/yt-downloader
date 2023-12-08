"use server";

import ytdl from "ytdl-core";
import { DownloadParams } from "@/types";
import { streamToBase64 } from "@/utils/streamConvert";

// download video or audio from youtube
export async function downloadVideo(params: DownloadParams) {
  try {
    const { url, type } = params;

    if (!ytdl.validateURL(url)) {
      throw new Error("Invalid URL");
    }
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    const audioOptions: ytdl.chooseFormatOptions = {
      filter: "audioonly",
      quality: "highestaudio",
    };
    const audioFormat = ytdl.chooseFormat(info.formats, audioOptions);
    console.log("Audio quality: ", audioFormat.audioQuality);
    const audioContainer = audioFormat.container;

    const videoOptions: ytdl.chooseFormatOptions = {
      filter: "videoonly",
      quality: "highestvideo",
    };
    const videoFormat = ytdl.chooseFormat(info.formats, videoOptions);
    console.log("Video quality: ", videoFormat.qualityLabel);
    const videoContainer = videoFormat.container;

    const audioStream = ytdl(url, audioOptions);
    console.log(`Audio downloading: ${title}.${audioContainer}`);

    const videoStream = ytdl(url, videoOptions);
    console.log(`Video downloading: ${title}.${videoContainer}`);

    // convert stream to base64
    const audioStreamBase64 = await streamToBase64(audioStream);
    console.log("Audio stream converted to base64");
    const videoStreamBase64 = await streamToBase64(videoStream);
    console.log("Video stream converted to base64");

    return { audioStreamBase64, audioContainer, title, videoStreamBase64, videoContainer };
  } catch (error) {
    console.log(error);
    throw new Error(`Error in download: ${error}`);
  }
}
