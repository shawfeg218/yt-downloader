import { fetchFile } from "@ffmpeg/util";
import loadFfmpeg from "./load-ffmpeg";

export async function convertVideo(
  videoStreamBase64: string,
  audioStreamBase64: string,
  videoContainer: string,
  audioContainer: string,
  execArgs: string[]
) {
  try {
    const Ffmpeg = await loadFfmpeg();

    // generate file that fetchFile can read
    const videoBuffer = Buffer.from(videoStreamBase64, "base64");
    const originVideoBlob = new Blob([videoBuffer], { type: `video/${videoContainer}` });

    await Ffmpeg.writeFile(`inputVideo.${videoContainer}`, await fetchFile(originVideoBlob));
    console.log("ffmpeg wirte video file done");

    const audioBuffer = Buffer.from(audioStreamBase64, "base64");
    const originAudioBlob = new Blob([audioBuffer], { type: `audio/${audioContainer}` });

    await Ffmpeg.writeFile(`inputAudio.${audioContainer}`, await fetchFile(originAudioBlob));
    console.log("ffmpeg wirte audio file done");

    await Ffmpeg.exec(execArgs);
    console.log("ffmpeg exec done");

    const fileData = await Ffmpeg.readFile(`output.mp4`);
    console.log("ffmpeg read file done");

    return fileData;
  } catch (error) {
    console.log(error);
  }
}
