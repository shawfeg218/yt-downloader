"use server";

import ytdl from "ytdl-core";
import { streamToBase64 } from "@/lib/streamConvert";

// download video from youtube
export default async function downloadVideo(url: string) {
  try {
    if (!ytdl.validateURL(url)) {
      throw new Error("Invalid URL");
    }
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    // choose audio format
    const audioOptions: ytdl.chooseFormatOptions = {
      filter: "audioonly",
      quality: "highestaudio",
    };
    const audioFormat = ytdl.chooseFormat(info.formats, audioOptions);
    console.log("Audio quality: ", audioFormat.audioQuality);
    console.log("Audio bitrate: ", audioFormat.audioBitrate);
    const audioContainer = audioFormat.container;

    // choose video format
    const videoOptions: ytdl.chooseFormatOptions = {
      filter: (format) => {
        return !format.hasAudio && format.qualityLabel
          ? parseInt(format.qualityLabel.split("p")[0]) <= 1080
          : false;
      },
      quality: "highestvideo",
    };
    const videoFormat = ytdl.chooseFormat(info.formats, videoOptions);
    console.log("Video quality: ", videoFormat.qualityLabel);
    console.log("Has audio: ", videoFormat.hasAudio);
    const videoContainer = videoFormat.container;

    // download audio and video
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
