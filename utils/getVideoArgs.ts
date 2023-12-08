export default function getVideoArgs(videoContainer: string, audioContainer: string): string[] {
  let videoCodec = videoContainer === "mp4" ? "copy" : "libx264";

  return [
    "-i",
    `inputVideo.${videoContainer}`,
    "-i",
    `inputAudio.${audioContainer}`,
    "-c:v",
    videoCodec,
    "-c:a",
    "aac",
    "-b:v",
    "2M",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    "-crf",
    "18",
    "output.mp4",
  ];
}
