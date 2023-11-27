import { fetchFile } from "@ffmpeg/util";
import loadFfmpeg from "./load-ffmpeg";

export default async function convert(
  streamBase64: string,
  type: string,
  container: string,
  execArgs: string[],
  outputExtension: string
) {
  try {
    const Ffmpeg = await loadFfmpeg();
    // generate file that fetchFile can read
    const buffer = Buffer.from(streamBase64, "base64");
    const originBlob = new Blob([buffer], { type: `${type}/${container}` });

    await Ffmpeg.writeFile(`input.${container}`, await fetchFile(originBlob));
    console.log("ffmpeg wirte file done");

    await Ffmpeg.exec(execArgs);
    console.log("ffmpeg exec done");

    const fileData = await Ffmpeg.readFile(`output.${outputExtension}`);
    console.log("ffmpeg read file done");

    return fileData;
  } catch (e) {
    console.log();
    console.log("Error in convert: ", e);
  }
}
